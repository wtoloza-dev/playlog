/**
 * Use case: aggregated stats for the overview page.
 */

import { getPlaysUseCase } from "@/features/plays";
import { computeStats } from "../domain/computeStats";
import type { Stats } from "../domain/types";

export async function getStatsUseCase(): Promise<Stats> {
	const plays = await getPlaysUseCase();
	return computeStats(plays);
}
