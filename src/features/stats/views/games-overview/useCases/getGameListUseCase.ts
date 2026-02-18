/**
 * Use case: list of games with play count (for games-overview page).
 */

import { getPlaysUseCase } from "@/features/plays";
import { computePlayCountByGame } from "@/features/stats/shared/domain/computePlayCountByGame";
import type { GamePlayCount } from "@/features/stats/shared/domain/types";

export async function getGameListUseCase(): Promise<GamePlayCount[]> {
	const plays = await getPlaysUseCase();
	return computePlayCountByGame(plays);
}
