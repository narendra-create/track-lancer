import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  const { pathname } = req.nextUrl;
  const user = session?.user;

  // Unauthenticated — redirect to login
  if (
    !user &&
    (pathname.startsWith("/freelancer") ||
      pathname.startsWith("/client") ||
      pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role guards
  if (pathname.startsWith("/freelancer") && user?.role !== "FREELANCER") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/client") && user?.role !== "CLIENT") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  //if already logged in and trying to login again
  if (pathname.startsWith("/login") || pathname.startsWith("/register") && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/freelancer/:path*", "/client/:path*", "/login", "/register"],
};