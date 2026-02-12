import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js configuration.
 * Exports auth handlers and utilities.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],
	pages: {
		signIn: "/login",
	},
});
