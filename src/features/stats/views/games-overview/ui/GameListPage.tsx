"use client";

import Link from "next/link";
import { API_STATS_GAMES } from "@/constants";
import useSWR from "swr";
import { gameToSlug } from "@/features/stats/shared/domain/slug";
import type { GamePlayCount } from "@/features/stats/shared/domain/types";

interface GamesResponse {
	games: GamePlayCount[];
}

async function fetcher(url: string): Promise<GamesResponse> {
	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch games");
	return response.json();
}

export function GameListPage() {
	const { data, error, isLoading } = useSWR<GamesResponse>(
		API_STATS_GAMES,
		fetcher,
	);

	if (error) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-red-500">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !data) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-zinc-500 dark:text-zinc-400">Cargando...</p>
			</div>
		);
	}

	const { games } = data;

	return (
		<div className="flex flex-col items-center p-8">
			<main className="w-full max-w-2xl space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						Por juego
					</h1>
					<a
						href="/plays/stats"
						className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						← Estadísticas
					</a>
				</div>

				{games.length === 0 ? (
					<p className="text-zinc-500 dark:text-zinc-400">
						No hay partidas registradas.
					</p>
				) : (
					<div className="grid w-full max-w-[280px] grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-2 lg:max-w-[580px] lg:grid-cols-2">
						{games.map(({ game, plays, thumbnailUrl }) => (
							<Link
								key={game}
								href={`/plays/stats/games/${gameToSlug(game)}`}
								className="flex aspect-[2/1] w-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
								style={{ minHeight: 0 }}
							>
								{/* Left: cover (same proportion as PlayCard) */}
								<div className="relative w-1/2 shrink-0 overflow-hidden bg-zinc-200 dark:bg-zinc-700">
									{thumbnailUrl ? (
										<>
											<img
												src={thumbnailUrl}
												alt=""
												className="absolute inset-0 h-full w-full scale-110 object-cover blur"
												aria-hidden
											/>
											{/* biome-ignore lint/performance/noImgElement: URL from games cache */}
											<img
												src={thumbnailUrl}
												alt=""
												className="absolute inset-0 h-full w-full object-contain"
											/>
										</>
									) : (
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-4xl text-zinc-400 dark:text-zinc-600" aria-hidden>🎲</span>
										</div>
									)}
								</div>
								{/* Right: name + partidas */}
								<div className="flex w-1/2 shrink-0 flex-col">
									<div className="flex min-h-0 flex-[0.75] items-center justify-center px-3 py-2">
										<p className="line-clamp-2 text-center text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
											{game}
										</p>
									</div>
									<div className="flex min-h-0 flex-[0.25] items-center justify-end border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
										<p className="text-right text-lg font-semibold text-zinc-700 dark:text-zinc-300">
											{plays} {plays === 1 ? "partida" : "partidas"}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
