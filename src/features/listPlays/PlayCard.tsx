import type { Play } from "./types";

interface PlayCardProps {
	play: Play;
}

/**
 * Card displaying a single play result.
 */
export function PlayCard({ play }: PlayCardProps) {
	return (
		<div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
			<div className="mb-2 flex items-center justify-between">
				<h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
					{play.game}
				</h2>
				<span className="text-sm text-zinc-500 dark:text-zinc-400">
					{play.date}
				</span>
			</div>
			<div className="flex flex-col gap-1">
				{play.players.map((player, index) => (
					<div
						key={`${play.id}-${player.position}`}
						className="flex items-center gap-2 text-sm"
					>
						<span
							className={`w-5 font-medium ${index === 0 ? "text-amber-500" : "text-zinc-400 dark:text-zinc-500"}`}
						>
							{player.position}.
						</span>
						<span
							className={
								index === 0
									? "font-medium text-zinc-900 dark:text-zinc-50"
									: "text-zinc-600 dark:text-zinc-400"
							}
						>
							{player.name}
						</span>
						{player.score !== undefined && (
							<span className="text-zinc-400 dark:text-zinc-500">
								({player.score} pts)
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
