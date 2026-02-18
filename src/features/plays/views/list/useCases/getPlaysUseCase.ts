/**
 * Use case: get all plays (for list view and downstream consumers).
 * Enriches plays with game cover from games cache (no BGG API).
 */

import { getGamesCacheMap } from "@/features/my-games/repository";
import { getPlays } from "@/features/plays/shared/repository";
import type { Play } from "@/features/plays/shared/domain/types";

export async function getPlaysUseCase(): Promise<Play[]> {
	const [playsData, cacheMap] = await Promise.all([
		getPlays(),
		getGamesCacheMap(),
	]);
	return playsData.map((data) => {
		const cached = data.bggId ? cacheMap.get(data.bggId) : undefined;
		return {
			id: data.playId,
			date: data.date,
			game: data.game,
			bggId: data.bggId,
			gameThumbnailUrl: cached?.imageUrl ?? cached?.thumbnailUrl,
			players: data.players.map((p) => ({
				position: p.position,
				name: p.playerName,
				score: p.score,
			})),
		};
	});
}
