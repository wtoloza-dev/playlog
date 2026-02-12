import { UserInfo } from "@/features/auth";

export default function PlaysLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
			<header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex max-w-2xl items-center justify-between px-8 py-4">
					<a
						href="/plays"
						className="font-semibold text-zinc-900 dark:text-zinc-50"
					>
						Board Games
					</a>
					<UserInfo />
				</div>
			</header>
			{children}
		</div>
	);
}
