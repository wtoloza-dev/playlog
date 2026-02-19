"use client";

import Link from "next/link";
import type { Play } from "@/features/plays/shared/domain/types";

interface PlayCardProps {
	play: Play;
}

export function PlayCard({ play }: PlayCardProps) {
	const winner = play.players[0];

	return (
		<Link
			href={`/plays/${play.id}`}
			className="flex aspect-2/1 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
			style={{ minHeight: 0 }}
		>
			{/* Left half: cover to the edge, clipped by card rounded corners */}
			<div className="relative w-1/2 shrink-0 overflow-hidden bg-zinc-200 dark:bg-zinc-700">
				{play.gameThumbnailUrl ? (
					<>
						{/* Blurred background fills letterboxing */}
						{/* biome-ignore lint/performance/noImgElement: same image as background */}
						<img
							src={play.gameThumbnailUrl}
							alt=""
							className="absolute inset-0 h-full w-full scale-110 object-cover blur"
							aria-hidden
						/>
						{/* Sharp image, full visible, no crop */}
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
			{/* Right half: 75% winner (name + score below if available), 25% date */}
			<div className="flex w-1/2 shrink-0 flex-col">
				<div className="flex min-h-0 flex-[0.75] flex-col items-center justify-center gap-0.5 px-2 py-1 text-center">
					{winner ? (
						<>
							<p className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
								{winner.name}
							</p>
							{winner.score !== undefined && (
								<p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
									{winner.score} pts
								</p>
							)}
						</>
					) : null}
				</div>
				<div className="flex min-h-0 flex-[0.25] items-center justify-end border-t border-zinc-100 px-2 py-1 dark:border-zinc-800">
					<p className="text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">
						{play.date}
					</p>
				</div>
			</div>
		</Link>
	);
}
