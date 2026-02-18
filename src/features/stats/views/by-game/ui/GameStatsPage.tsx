"use client";

import Link from "next/link";
import useSWR from "swr";
import type { GameStats } from "../domain/types";

async function fetcher(url: string): Promise<GameStats> {
	const response = await fetch(url);
	if (!response.ok) {
		if (response.status === 404) throw new Error("Juego no encontrado");
		throw new Error("Error al cargar estadísticas");
	}
	return response.json();
}

export function GameStatsPage({ slug }: { slug: string }) {
	const { data, error, isLoading } = useSWR<GameStats>(
		`/api/stats/games/${encodeURIComponent(slug)}`,
		fetcher,
	);

	if (error) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-red-500">{error.message}</p>
				<Link
					href="/plays/stats/games"
					className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400"
				>
					← Volver a juegos
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
						{data.game}
					</h1>
					<Link
						href="/plays/stats/games"
						className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						← Por juego
					</Link>
				</div>

				<section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
					<p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
						{data.plays} {data.plays === 1 ? "partida" : "partidas"}
					</p>
				</section>

				{data.winsPerPlayer.length > 0 ? (
					<section>
						<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							Victorias por jugador
						</h2>
						<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
							<ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
								{data.winsPerPlayer.map(({ name, wins }) => (
									<li
										key={name}
										className="flex items-center justify-between px-4 py-3"
									>
										<span className="font-medium text-zinc-900 dark:text-zinc-50">
											{name}
										</span>
										<span className="text-zinc-600 dark:text-zinc-400">
											{wins} {wins === 1 ? "victoria" : "victorias"}
										</span>
									</li>
								))}
							</ul>
						</div>
					</section>
				) : (
					<p className="text-zinc-500 dark:text-zinc-400">
						Sin datos de victorias para este juego.
					</p>
				)}
			</main>
		</div>
	);
}
