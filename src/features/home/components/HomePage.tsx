import Link from "next/link";

/**
 * Home page component.
 * Landing page for the Board Games Tracker app.
 */
export function HomePage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
			<main className="flex flex-col items-center gap-8 text-center">
				<h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
					Board Games Tracker
				</h1>
				<p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
					Track your board game results with friends. Record who won each game
					night.
				</p>
				<Link
					href="/login"
					className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
				>
					Get Started
				</Link>
			</main>
		</div>
	);
}
