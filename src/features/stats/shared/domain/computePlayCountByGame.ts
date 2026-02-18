/**
 * Pure function: play count per game. Used by overview and games-overview.
 */

import type { Play } from "@/features/plays/shared/domain/types";
import type { GamePlayCount } from "./types";

export function computePlayCountByGame(plays: Play[]): GamePlayCount[] {
	const gameCounts = new Map<string, number>();
	for (const play of plays) {
		gameCounts.set(play.game, (gameCounts.get(play.game) ?? 0) + 1);
	}
	return Array.from(gameCounts.entries())
		.map(([game, plays]) => ({ game, plays }))
		.sort((a, b) => b.plays - a.plays);
}
