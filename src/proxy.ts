import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Proxy to protect routes.
 * Redirects unauthenticated users to login page.
 */
export const proxy = auth((req) => {
	const isLoggedIn = !!req.auth;
	const isOnPlays = req.nextUrl.pathname.startsWith("/plays");

	if (isOnPlays && !isLoggedIn) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/plays/:path*"],
};
