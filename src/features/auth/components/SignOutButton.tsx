import { signOut } from "@/auth";

/**
 * Sign out button.
 */
export function SignOutButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signOut({ redirectTo: "/" });
			}}
		>
			<button
				type="submit"
				className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
			>
				Sign out
			</button>
		</form>
	);
}
