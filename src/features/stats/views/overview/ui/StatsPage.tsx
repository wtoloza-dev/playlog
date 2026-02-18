"use client";

import { API_STATS } from "@/constants";
import useSWR from "swr";
import type { Stats } from "../domain/types";

async function fetcher(url: string): Promise<Stats> {
	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch stats");
	return response.json();
}

function formatPercent(value: number | undefined): string {
	if (value == null) return "—";
	return `${Math.round(value * 100)}%`;
}

function formatNum(value: number | undefined): string {
	if (value == null) return "—";
	return String(value);
}

export function StatsPage() {
	const { data: stats, error, isLoading } = useSWR<Stats>(API_STATS, fetcher);

	if (error) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-red-500">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !stats) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-zinc-500 dark:text-zinc-400">Cargando...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center p-8">
			<main className="w-full max-w-2xl space-y-8">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						Estadísticas
					</h1>
					<a
						href="/plays"
						className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						← Partidas
					</a>
				</div>

				<section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
					<h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
						Resumen
					</h2>
					<p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						{stats.totalPlays}{" "}
						<span className="font-normal text-zinc-600 dark:text-zinc-400">
							partidas
						</span>
					</p>
				</section>

				<section>
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							Por jugador
						</h2>
						<a
							href="/plays/stats/players"
							className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
						>
							Ver por jugador →
						</a>
					</div>
					<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead>
									<tr className="border-b border-zinc-200 dark:border-zinc-700">
										<th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
											Jugador
										</th>
										<th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
											Partidas
										</th>
										<th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
											Victorias
										</th>
										<th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
											% victorias
										</th>
										<th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
											Podios
										</th>
										<th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
											Pos. media
										</th>
									</tr>
								</thead>
								<tbody>
									{stats.players.map((p) => (
										<tr
											key={p.name}
											className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
										>
											<td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
												{p.name}
											</td>
											<td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
												{p.totalPlays}
											</td>
											<td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
												{p.wins}
											</td>
											<td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
												{formatPercent(p.winRate)}
											</td>
											<td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
												{p.podiums}
											</td>
											<td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
												{formatNum(p.averagePosition)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>

				<section>
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							Juegos más jugados
						</h2>
						<a
							href="/plays/stats/games"
							className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
						>
							Ver por juego →
						</a>
					</div>
					<div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
						<ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
							{stats.mostPlayedGames.map(({ game, plays }) => (
								<li
									key={game}
									className="flex items-center justify-between px-4 py-3"
								>
									<span className="font-medium text-zinc-900 dark:text-zinc-50">
										{game}
									</span>
									<span className="text-zinc-600 dark:text-zinc-400">
										{plays} {plays === 1 ? "partida" : "partidas"}
									</span>
								</li>
							))}
						</ul>
					</div>
				</section>
			</main>
		</div>
	);
}
