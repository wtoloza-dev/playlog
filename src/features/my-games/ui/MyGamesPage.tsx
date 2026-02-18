"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { API_BGG_SEARCH, API_MY_GAMES } from "@/constants";
import type { MyGameItem, MyGamesPageResult } from "../domain/types";

const PAGE_SIZE = 5;

function fetcher<T>(url: string): Promise<T> {
	return fetch(url).then((r) => {
		if (!r.ok) throw new Error("Fetch failed");
		return r.json();
	});
}

interface BggSearchItem {
	id: number;
	name: string;
	year?: number;
}

export function MyGamesPage() {
	const [page, setPage] = useState(1);
	const [showAdd, setShowAdd] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [bggResults, setBggResults] = useState<BggSearchItem[]>([]);
	const [bggSearching, setBggSearching] = useState(false);
	const [adding, setAdding] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [addError, setAddError] = useState<string | null>(null);
	const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const listKey = `${API_MY_GAMES}?page=${page}&limit=${PAGE_SIZE}`;
	const { data, mutate } = useSWR<MyGamesPageResult>(listKey, fetcher, {
		keepPreviousData: true,
	});

	const handleSearch = useCallback((value: string) => {
		setSearchQuery(value);
		if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
		if (!value.trim()) {
			setBggResults([]);
			return;
		}
		setBggSearching(true);
		searchTimeoutRef.current = setTimeout(async () => {
			try {
				const res = await fetch(
					`${API_BGG_SEARCH}?q=${encodeURIComponent(value.trim())}`,
				);
				const json = await res.json();
				setBggResults(Array.isArray(json) ? json : []);
			} catch {
				setBggResults([]);
			} finally {
				setBggSearching(false);
			}
		}, 400);
	}, []);

	useEffect(
		() => () => {
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
		},
		[],
	);

	const handleSelectGame = useCallback(
		async (item: BggSearchItem) => {
			setAddError(null);
			setAdding(true);
			try {
				const res = await fetch(API_MY_GAMES, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ bggId: item.id }),
				});
				if (!res.ok) {
					const err = await res.json();
					throw new Error(err.error || "Failed to add");
				}
				setShowAdd(false);
				setSearchQuery("");
				setBggResults([]);
				await mutate();
			} catch (e) {
				setAddError(e instanceof Error ? e.message : "Failed to add game");
			} finally {
				setAdding(false);
			}
		},
		[mutate],
	);

	const handleSync = useCallback(async () => {
		setSyncing(true);
		try {
			const res = await fetch(`${API_MY_GAMES}/sync`, { method: "POST" });
			if (!res.ok) throw new Error("Sync failed");
			await mutate();
		} catch {
			// could set error state
		} finally {
			setSyncing(false);
		}
	}, [mutate]);

	const totalPages = data?.totalPages ?? 1;

	return (
		<div className="mx-auto max-w-2xl px-8 py-8">
			<h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
				My Games
			</h1>

			<div className="mb-6 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={() => setShowAdd((v) => !v)}
					className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
				>
					[+]
				</button>
				<button
					type="button"
					onClick={handleSync}
					disabled={syncing}
					className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
				>
					{syncing ? "Syncing…" : "Sync"}
				</button>
			</div>

			{showAdd && (
				<div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
					<label
						htmlFor="my-games-search"
						className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
					>
						Search game (BGG)
					</label>
					<div className="relative">
						<input
							id="my-games-search"
							type="text"
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="e.g. Catan"
							className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
						/>
						{bggSearching && (
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
								Searching…
							</span>
						)}
					</div>
					{bggResults.length > 0 && !bggSearching && (
						<ul className="mt-2 max-h-48 overflow-auto rounded border border-zinc-200 dark:border-zinc-600">
							{bggResults.slice(0, 10).map((item) => (
								<li key={item.id}>
									<button
										type="button"
										onClick={() => handleSelectGame(item)}
										disabled={adding}
										className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-100 dark:hover:bg-zinc-700"
									>
										{item.name}
										{item.year != null && (
											<span className="text-zinc-400">({item.year})</span>
										)}
									</button>
								</li>
							))}
						</ul>
					)}
					{addError && (
						<p className="mt-2 text-sm text-red-600 dark:text-red-400">
							{addError}
						</p>
					)}
				</div>
			)}

			<div className="space-y-3">
				{data?.items.length ? (
					data.items.map((game) => (
						<GameRow key={game.bggId} game={game} />
					))
				) : data ? (
					<p className="text-zinc-500 dark:text-zinc-400">
						No games yet. Use [+] to add one.
					</p>
				) : null}
			</div>

			{data && data.total > PAGE_SIZE && (
				<div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
					<span className="text-sm text-zinc-500 dark:text-zinc-400">
						Page {data.page} of {data.totalPages} ({data.total} games)
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page <= 1}
							className="rounded border border-zinc-300 bg-white px-3 py-1 text-sm disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800"
						>
							Prev
						</button>
						<button
							type="button"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages}
							className="rounded border border-zinc-300 bg-white px-3 py-1 text-sm disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

function GameRow({ game }: { game: MyGameItem }) {
	const imageUrl = game.thumbnailUrl ?? game.imageUrl;
	return (
		<div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
			{imageUrl ? (
				// biome-ignore lint/performance/noImgElement: external BGG/cache URL
				<img
					src={imageUrl}
					alt=""
					className="h-12 w-12 shrink-0 rounded object-cover"
				/>
			) : (
				<div className="h-12 w-12 shrink-0 rounded bg-zinc-200 dark:bg-zinc-700" />
			)}
			<div className="min-w-0 flex-1">
				<p className="font-medium text-zinc-900 dark:text-zinc-50">
					{game.name}
				</p>
				{game.year != null && (
					<p className="text-xs text-zinc-500 dark:text-zinc-400">
						{game.year}
					</p>
				)}
			</div>
		</div>
	);
}
