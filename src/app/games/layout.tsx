import { UserInfo } from "@/features/auth";

export default function GamesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
			<header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex max-w-2xl items-center justify-between px-8 py-4">
					<nav className="flex items-center gap-6">
						<a
							href="/plays"
							className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
						>
							Plays
						</a>
						<a
							href="/games"
							className="font-semibold text-zinc-900 dark:text-zinc-50"
						>
							My Games
						</a>
					</nav>
					<UserInfo />
				</div>
			</header>
			{children}
		</div>
	);
}
