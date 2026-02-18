import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Proxy to protect routes.
 * Redirects unauthenticated users to login page.
 */
export const proxy = auth((req) => {
	const isLoggedIn = !!req.auth;
	const isProtected =
		req.nextUrl.pathname.startsWith("/plays") ||
		req.nextUrl.pathname.startsWith("/games");

	if (isProtected && !isLoggedIn) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/plays/:path*", "/games/:path*"],
};
