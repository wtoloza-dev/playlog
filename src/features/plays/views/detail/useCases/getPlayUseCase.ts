/**
 * Use case: get a single play by ID (for detail view).
 * Enriches with game cover from games cache. Returns null if not found.
 */

import { getGamesCacheMap } from "@/features/my-games/repository";
import { getPlayById } from "@/features/plays/shared/repository";
import type { Play } from "@/features/plays/shared/domain/types";

export async function getPlayUseCase(playId: string): Promise<Play | null> {
	const [playData, cacheMap] = await Promise.all([
		getPlayById(playId),
		getGamesCacheMap(),
	]);

	if (!playData) return null;

	const cached = playData.bggId ? cacheMap.get(playData.bggId) : undefined;
	return {
		id: playData.playId,
		date: playData.date,
		game: playData.game,
		bggId: playData.bggId,
		gameThumbnailUrl: cached?.imageUrl ?? cached?.thumbnailUrl,
		players: playData.players.map((p) => ({
			position: p.position,
			name: p.playerName,
			score: p.score,
		})),
	};
}
