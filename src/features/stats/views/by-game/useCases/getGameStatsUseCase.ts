/**
 * Use case: stats for a single game by slug.
 */

import { getPlaysUseCase } from "@/features/plays";
import { computeGameStats } from "../domain/computeGameStats";
import type { GameStats } from "../domain/types";

export async function getGameStatsUseCase(
	slug: string,
): Promise<GameStats | null> {
	const plays = await getPlaysUseCase();
	return computeGameStats(plays, slug);
}
