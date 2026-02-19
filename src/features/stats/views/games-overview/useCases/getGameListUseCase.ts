/**
 * Use case: list of games with play count and optional thumbnail (for games-overview page).
 */

import { getPlaysUseCase } from "@/features/plays";
import { computePlayCountByGame } from "@/features/stats/shared/domain/computePlayCountByGame";
import type { GamePlayCount } from "@/features/stats/shared/domain/types";

export async function getGameListUseCase(): Promise<GamePlayCount[]> {
	const plays = await getPlaysUseCase();
	const list = computePlayCountByGame(plays);
	// Attach thumbnail from first play that has one per game name
	const thumbnailByGame = new Map<string, string>();
	for (const play of plays) {
		if (play.gameThumbnailUrl && !thumbnailByGame.has(play.game)) {
			thumbnailByGame.set(play.game, play.gameThumbnailUrl);
		}
	}
	return list.map((item) => ({
		...item,
		thumbnailUrl: thumbnailByGame.get(item.game),
	}));
}
