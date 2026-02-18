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
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{games.map(({ game, plays }) => (
							<Link
								key={game}
								href={`/plays/stats/games/${gameToSlug(game)}`}
								className="flex min-h-28 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-[transform,box-shadow] duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900"
							>
								<div className="flex flex-1 flex-col items-center justify-center px-3 py-4 text-center">
									<p className="font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
										{game}
									</p>
								</div>
								<div className="rounded-b-[7px] border-t border-zinc-100 bg-zinc-50 py-2 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-400">
									{plays} {plays === 1 ? "partida" : "partidas"}
								</div>
							</Link>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
