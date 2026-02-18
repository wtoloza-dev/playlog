"use client";

import Link from "next/link";
import useSWR from "swr";
import type { PlayerDetailStats } from "../domain/types";

async function fetcher(url: string): Promise<PlayerDetailStats> {
	const response = await fetch(url);
	if (!response.ok) {
		if (response.status === 404) throw new Error("Jugador no encontrado");
		throw new Error("Error al cargar estadísticas");
	}
	return response.json();
}

function formatPercent(value: number | undefined): string {
	if (value == null) return "—";
	return `${Math.round(value * 100)}%`;
}

export function PlayerStatsPage({ playerName }: { playerName: string }) {
	const { data, error, isLoading } = useSWR<PlayerDetailStats>(
		`/api/stats/players/${encodeURIComponent(playerName)}`,
		fetcher,
	);

	if (error) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-red-500">{error.message}</p>
				<Link
					href="/plays/stats/players"
					className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400"
				>
					← Volver a jugadores
				</Link>
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

	return (
		<div className="flex flex-col items-center p-8">
			<main className="w-full max-w-2xl space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
						{data.name}
					</h1>
					<Link
						href="/plays/stats/players"
						className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						← Por jugador
					</Link>
				</div>

				<section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
					<dl className="grid gap-2 text-sm">
						<div className="flex justify-between">
							<dt className="text-zinc-500 dark:text-zinc-400">Partidas</dt>
							<dd className="font-medium text-zinc-900 dark:text-zinc-50">
								{data.totalPlays}
							</dd>
						</div>
						<div className="flex justify-between">
							<dt className="text-zinc-500 dark:text-zinc-400">Victorias</dt>
							<dd className="font-medium text-zinc-900 dark:text-zinc-50">
								{data.wins} ({formatPercent(data.winRate)})
							</dd>
						</div>
						<div className="flex justify-between">
							<dt className="text-zinc-500 dark:text-zinc-400">Podios</dt>
							<dd className="font-medium text-zinc-900 dark:text-zinc-50">
								{data.podiums}
							</dd>
						</div>
						<div className="flex justify-between">
							<dt className="text-zinc-500 dark:text-zinc-400">
								Posición media
							</dt>
							<dd className="font-medium text-zinc-900 dark:text-zinc-50">
								{data.averagePosition ?? "—"}
							</dd>
						</div>
					</dl>
				</section>
			</main>
		</div>
	);
}
