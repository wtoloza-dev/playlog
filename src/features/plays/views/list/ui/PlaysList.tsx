import { PlayCard } from "./PlayCard";
import type { Play } from "@/features/plays/shared/domain/types";

export interface PlaysListProps {
	plays: Play[];
	isLoading: boolean;
}

export function PlaysList({ plays, isLoading }: PlaysListProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center p-8">
				<main className="w-full max-w-2xl">
					<p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
				</main>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center p-8">
			<main className="w-full max-w-2xl lg:max-w-4xl">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						Plays
					</h1>
					<div className="flex items-center gap-3">
						<a
							href="/plays/stats"
							className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
						>
							Estadísticas
						</a>
						<a
							href="/plays/new"
							className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
						>
							+ New Play
						</a>
					</div>
				</div>

				{plays.length === 0 ? (
					<p className="text-zinc-500 dark:text-zinc-400">
						No plays recorded yet. Start by adding your first game!
					</p>
				) : (
					<div className="mx-auto grid w-full max-w-[280px] grid-cols-1 gap-4 lg:max-w-[580px] lg:grid-cols-2">
						{plays.map((play) => (
							<PlayCard key={play.id} play={play} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}
