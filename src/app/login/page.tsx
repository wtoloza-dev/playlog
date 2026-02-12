import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/features/auth";

export default async function LoginPage() {
	const session = await auth();

	// Redirect if already logged in
	if (session?.user) {
		redirect("/plays");
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
			<main className="flex flex-col items-center gap-8 text-center">
				<div>
					<h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
						Board Games Tracker
					</h1>
					<p className="mt-2 text-zinc-600 dark:text-zinc-400">
						Track your board game results with friends
					</p>
				</div>
				<SignInButton />
			</main>
		</div>
	);
}
