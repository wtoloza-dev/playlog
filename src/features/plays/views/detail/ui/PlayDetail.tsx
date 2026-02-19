"use client";

import type { Play, PlayerResult } from "@/features/plays/shared/domain/types";

export interface PlayDetailProps {
	play: Play;
}

/** Podium order: 2nd left, 1st center, 3rd right. */
const PODIUM_POSITIONS = [2, 1, 3] as const;

function getPodiumPlayers(players: PlayerResult[]): (PlayerResult | null)[] {
	const byPosition = new Map(players.map((p) => [p.position, p]));
	return PODIUM_POSITIONS.map((pos) => byPosition.get(pos) ?? null);
}

function PlayerRow({
	player,
}: {
	player: PlayerResult;
}) {
	return (
		<li className="flex items-center justify-between px-4 py-3">
			<span className="font-medium text-zinc-900 dark:text-zinc-50">
				#{player.position} {player.name}
			</span>
			{player.score !== undefined && (
				<span className="text-zinc-600 dark:text-zinc-400">
					{player.score} pts
				</span>
			)}
		</li>
	);
}

/**
 * Presentational component: shows a single play (game, date, thumbnail).
 * Top 3 shown as a podium; rest in a list.
 */
export function PlayDetail({ play }: PlayDetailProps) {
	const [second, first, third] = getPodiumPlayers(play.players);
	const rest = play.players.filter((p) => p.position > 3);

	return (
		<div className="space-y-6">
			{/* Header: thumbnail + game name + date */}
			<div className="flex overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="relative h-40 w-40 shrink-0 overflow-hidden bg-zinc-200 dark:bg-zinc-700">
					{play.gameThumbnailUrl ? (
						<>
							{/* biome-ignore lint/performance/noImgElement: same image as background */}
							<img
								src={play.gameThumbnailUrl}
								alt=""
								className="absolute inset-0 h-full w-full scale-110 object-cover blur"
								aria-hidden
							/>
							{/* biome-ignore lint/performance/noImgElement: URL from games cache */}
							<img
								src={play.gameThumbnailUrl}
								alt=""
								className="absolute inset-0 h-full w-full object-contain"
							/>
						</>
					) : (
						<div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700" />
					)}
				</div>
				<div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
					<h1 className="truncate text-xl font-bold text-zinc-900 dark:text-zinc-50">
						{play.game}
					</h1>
					<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
						{play.date}
					</p>
				</div>
			</div>

			{/* Podium: 2nd · 1st · 3rd */}
			<section>
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
					Podio
				</h2>
				<div className="flex items-end justify-center gap-2 sm:gap-4">
					{/* 2nd place - left */}
					<div className="flex flex-1 flex-col items-center rounded-t-lg border border-zinc-200 bg-zinc-100/80 pt-4 pb-3 dark:border-zinc-700 dark:bg-zinc-800/80">
						<span className="mb-1 text-2xl font-bold text-zinc-400 dark:text-zinc-500" aria-hidden>2º</span>
						{second ? (
							<>
								<span className="text-center font-semibold text-zinc-900 dark:text-zinc-50">
									{second.name}
								</span>
								{second.score !== undefined && (
									<span className="text-sm text-zinc-600 dark:text-zinc-400">
										{second.score} pts
									</span>
								)}
							</>
						) : (
							<span className="text-zinc-400 dark:text-zinc-500">—</span>
						)}
					</div>
					{/* 1st place - center (tallest) */}
					<div className="flex flex-1 flex-col items-center rounded-t-lg border-2 border-amber-400/60 bg-amber-50/90 pt-6 pb-3 dark:border-amber-500/50 dark:bg-amber-950/40">
						<span className="mb-1 text-3xl font-bold text-amber-600 dark:text-amber-400" aria-hidden>1º</span>
						{first ? (
							<>
								<span className="text-center font-bold text-zinc-900 dark:text-zinc-50">
									{first.name}
								</span>
								{first.score !== undefined && (
									<span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										{first.score} pts
									</span>
								)}
							</>
						) : (
							<span className="text-zinc-400 dark:text-zinc-500">—</span>
						)}
					</div>
					{/* 3rd place - right */}
					<div className="flex flex-1 flex-col items-center rounded-t-lg border border-zinc-200 bg-zinc-100/80 pt-2 pb-3 dark:border-zinc-700 dark:bg-zinc-800/80">
						<span className="mb-1 text-xl font-bold text-zinc-500 dark:text-zinc-600" aria-hidden>3º</span>
						{third ? (
							<>
								<span className="text-center font-semibold text-zinc-900 dark:text-zinc-50">
									{third.name}
								</span>
								{third.score !== undefined && (
									<span className="text-sm text-zinc-600 dark:text-zinc-400">
										{third.score} pts
									</span>
								)}
							</>
						) : (
							<span className="text-zinc-400 dark:text-zinc-500">—</span>
						)}
					</div>
				</div>
			</section>

			{/* Rest of players (4th onwards) */}
			{rest.length > 0 && (
				<section>
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
						Resto
					</h2>
					<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
						<ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
							{rest.map((player) => (
								<PlayerRow key={`${player.position}-${player.name}`} player={player} />
							))}
						</ul>
					</div>
				</section>
			)}
		</div>
	);
}
