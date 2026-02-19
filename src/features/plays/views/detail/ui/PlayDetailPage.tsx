"use client";

import Link from "next/link";
import useSWR from "swr";
import type { Play } from "@/features/plays/shared/domain/types";
import { PlayDetail } from "./PlayDetail";

async function fetcher(url: string): Promise<Play> {
	const response = await fetch(url);
	if (!response.ok) {
		if (response.status === 404) throw new Error("Partida no encontrada");
		throw new Error("Error al cargar la partida");
	}
	return response.json();
}

export interface PlayDetailPageProps {
	playId: string;
}

export function PlayDetailPage({ playId }: PlayDetailPageProps) {
	const { data, error, isLoading } = useSWR<Play>(
		`/api/plays/${encodeURIComponent(playId)}`,
		fetcher,
	);

	if (error) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-red-500">{error.message}</p>
				<Link
					href="/plays"
					className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400"
				>
					← Volver a Plays
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
			<main className="w-full max-w-2xl">
				<div className="mb-6">
					<Link
						href="/plays"
						className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						← Volver a Plays
					</Link>
				</div>
				<PlayDetail play={data} />
			</main>
		</div>
	);
}
