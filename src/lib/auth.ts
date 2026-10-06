import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getPrisma } from "./db";
import { env } from "./env";
import { loginSchema } from "./validations";
import { rateLimit } from "./rate-limit";

/**
 * Autenticacion del panel.
 *
 * - Credenciales con bcrypt (coste 12) y sesion JWT en cookie httpOnly.
 * - Limite de intentos por correo+IP para frenar la fuerza bruta.
 * - Si NO hay AUTH_SECRET o base de datos, el panel queda deshabilitado en
 *   lugar de aceptar cualquier acceso.
 */

/** Indica si el panel puede usarse en este entorno. */
export function isAdminEnabled(): boolean {
  return Boolean(env.authSecret && env.hasDatabase);
}

export const authConfig: NextAuthConfig = {
  secret: env.authSecret,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 horas
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Freno de fuerza bruta: 8 intentos por correo cada 15 minutos.
        const attempt = await rateLimit(
          `login:${email}`,
          8,
          15 * 60 * 1000,
        );
        if (!attempt.success) return null;

        const prisma = getPrisma();
        if (!prisma) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
          // Comparamos igualmente para no revelar si el correo existe.
          await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.user
          .update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })
          .catch(() => undefined);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "EDITOR";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as string) ?? "EDITOR";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/** Sesion del usuario actual, o null. */
export async function getSession() {
  if (!isAdminEnabled()) return null;
  return auth();
}

/**
 * Exige una sesion valida. Se usa al inicio de cada accion del panel,
 * porque el middleware no protege las Server Actions.
 */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("No autorizado. Inicia sesión de nuevo.");
  }
  return session.user as { id: string; name?: string | null; email?: string | null; role: string };
}

/** Exige rol ADMIN para las operaciones sensibles (usuarios, ajustes). */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Esta acción requiere permisos de administrador.");
  }
  return user;
}
