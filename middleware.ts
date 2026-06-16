import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";

type AuthenticatedRequest = NextRequest & {
    auth: any
}

export async function middleware(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    })
    const user = session?.user;
    const { pathname } = req.nextUrl;

    //Not Logged in -- Send to login
    if (!user && (
        pathname.startsWith("/freelancer") ||
        pathname.startsWith("/client") ||
        pathname.startsWith("/dashboard")
    )) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    //Role check
    if (pathname.startsWith("/freelancer") && user?.role !== "FREELANCER") {
        return NextResponse.redirect(
            new URL("/unauthorized", req.url)
        )
    }
    if (pathname.startsWith("/client") && user?.role !== "CLIENT") {
        return NextResponse.redirect(
            new URL("/unauthorized", req.url)
        )
    }

    return NextResponse.next();
};

export const config = {
    matcher: ["/dashboard/:path*", "/freelancer/:path*", "/client/:path*"]
}