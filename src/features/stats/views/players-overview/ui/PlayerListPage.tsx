"use client";

import Link from "next/link";
import { API_STATS_PLAYERS } from "@/constants";
import useSWR from "swr";
import type { PlayerStats } from "@/features/stats/views/overview/domain/types";

async function fetcher(url: string): Promise<{ players: PlayerStats[] }> {
	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch players");
	return response.json();
}

export function PlayerListPage() {
	const { data, error, isLoading } = useSWR<{ players: PlayerStats[] }>(API_STATS_PLAYERS, fetcher);

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

	const { players } = data;

	return (
		<div className="flex flex-col items-center p-8">
			<main className="w-full max-w-2xl space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						Por jugador
					</h1>
					<a
						href="/plays/stats"
						className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						← Estadísticas
					</a>
				</div>

				{players.length === 0 ? (
					<p className="text-zinc-500 dark:text-zinc-400">
						No hay jugadores registrados.
					</p>
				) : (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{players.map((p) => (
							<Link
								key={p.name}
								href={`/plays/stats/players/${encodeURIComponent(p.name)}`}
								className="flex min-h-28 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-[transform,box-shadow] duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900"
							>
								<div className="flex flex-1 flex-col items-center justify-center px-3 py-4 text-center">
									<p className="font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
										{p.name}
									</p>
								</div>
								<div className="rounded-b-[7px] border-t border-zinc-100 bg-zinc-50 py-2 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-400">
									{p.totalPlays} partidas · {p.wins} victorias
								</div>
							</Link>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
