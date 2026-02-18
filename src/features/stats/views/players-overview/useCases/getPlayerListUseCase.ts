/**
 * Use case: list of players with basic stats (for players-overview page).
 * Stub: reuses overview stats for now; can be replaced with dedicated compute later.
 */

import { getStatsUseCase } from "@/features/stats/views/overview/useCases/getStatsUseCase";
import type { PlayerStats } from "@/features/stats/views/overview/domain/types";

export async function getPlayerListUseCase(): Promise<PlayerStats[]> {
	const stats = await getStatsUseCase();
	return stats.players;
}
