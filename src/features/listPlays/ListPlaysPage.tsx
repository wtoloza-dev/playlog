"use client";

import { API_PLAYS } from "@/constants";
import useSWR from "swr";
import { PlaysList } from "./PlaysList";
import type { Play } from "./types";

async function fetcher(url: string): Promise<Play[]> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch plays");
	}
	return response.json();
}

/**
 * Container component for the plays list page.
 * Uses SWR for data fetching, cache and revalidation.
 */
export function ListPlaysPage() {
	const { data: plays = [], error, isLoading } = useSWR<Play[]>(API_PLAYS, fetcher);

	if (error) {
		return (
			<div className="flex flex-col items-center p-8">
				<p className="text-red-500">{error.message}</p>
			</div>
		);
	}

	return <PlaysList plays={plays} isLoading={isLoading} />;
}
