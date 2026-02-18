/**
 * Use case: stats for a single player by name.
 */

import { getPlaysUseCase } from "@/features/plays";
import { computePlayerStats } from "../domain/computePlayerStats";
import type { PlayerDetailStats } from "../domain/types";

export async function getPlayerStatsUseCase(
	playerName: string,
): Promise<PlayerDetailStats | null> {
	const plays = await getPlaysUseCase();
	return computePlayerStats(plays, playerName);
}
