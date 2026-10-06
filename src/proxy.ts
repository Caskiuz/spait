import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege el panel de administracion.
 *
 * En Next 16 este archivo se llama `proxy` (antes `middleware`).
 *
 * Solo comprueba la presencia de la cookie de sesion: la validacion real del
 * token la hace Auth.js en el layout de /admin/(panel) y en cada Server Action.
 * Aqui ademas se evita que un usuario ya autenticado vea el formulario de
 * acceso y se anaden cabeceras de seguridad a las respuestas del panel.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasSession =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token");

  // Usuario autenticado que abre el login: lo mandamos al panel.
  if (pathname === "/admin/login" && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Sin sesion, cualquier otra ruta de /admin pasa por el login.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/admin")) {
    // El panel no debe indexarse ni cachearse.
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store, must-revalidate");
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
