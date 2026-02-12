"use client";

import useSWR from "swr";
import { API_BGG_GAME } from "@/constants";
import type { Play } from "./types";

interface PlayCardProps {
	play: Play;
}

async function bggGameFetcher(url: string) {
	const res = await fetch(url);
	if (!res.ok) return null;
	const data = await res.json();
	return data?.imageUrl ?? data?.thumbnailUrl ?? null;
}

/**
 * Card displaying a single play result.
 * Shows BGG cover when play has bggId.
 */
export function PlayCard({ play }: PlayCardProps) {
	const bggKey = play.bggId ? `${API_BGG_GAME}?id=${play.bggId}` : null;
	const { data: bggImageUrl } = useSWR<string | null>(bggKey, bggGameFetcher);

	return (
		<div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
			<div className="mb-2 flex items-center justify-between gap-3">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					{bggImageUrl && (
						// biome-ignore lint/performance/noImgElement: BGG external image URL
						<img
							src={bggImageUrl}
							alt=""
							className="h-12 w-12 shrink-0 rounded object-cover"
						/>
					)}
					<h2 className="min-w-0 truncate font-semibold text-zinc-900 dark:text-zinc-50">
						{play.game}
					</h2>
				</div>
				<span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
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
