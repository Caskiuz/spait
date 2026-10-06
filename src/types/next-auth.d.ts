import type { DefaultSession } from "next-auth";

/**
 * Ampliacion de los tipos de Auth.js para incluir el id y el rol del usuario
 * en la sesion, tal como los expone el callback `session` de src/lib/auth.ts.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EDITOR" | string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "EDITOR" | string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
