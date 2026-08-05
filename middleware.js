import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "maya_token";

// Cheap cookie-presence check only. The backend still authorises every request,
// so a forged cookie buys nothing beyond rendering an empty shell.
export function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME);

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account", "/orders", "/orders/:path*", "/farmer/:path*"],
};
