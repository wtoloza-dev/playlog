/**
 * Computes stats for a single game. Uses shared gameToSlug for slug resolution.
 */

import type { Play } from "@/features/plays/shared/domain/types";
import { gameToSlug } from "@/features/stats/shared/domain/slug";
import type { GameStats, WinsPerPlayer } from "./types";

export function computeGameStats(
	plays: Play[],
	slug: string,
): GameStats | null {
	const gameName = findGameNameBySlug(plays, slug);
	if (!gameName) return null;

	const gamePlays = plays.filter((p) => p.game === gameName);
	const winsMap = new Map<string, number>();

	for (const play of gamePlays) {
		for (const p of play.players) {
			if (p.position !== 1) continue;
			const name = p.name.trim() || "?";
			winsMap.set(name, (winsMap.get(name) ?? 0) + 1);
		}
	}

	const winsPerPlayer: WinsPerPlayer[] = Array.from(winsMap.entries())
		.map(([name, wins]) => ({ name, wins }))
		.sort((a, b) => b.wins - a.wins);

	return {
		game: gameName,
		plays: gamePlays.length,
		winsPerPlayer,
	};
}

export function findGameNameBySlug(plays: Play[], slug: string): string | null {
	const slugLower = slug.toLowerCase().trim();
	const seen = new Set<string>();
	for (const play of plays) {
		if (play.game && !seen.has(play.game)) {
			seen.add(play.game);
			if (gameToSlug(play.game) === slugLower) return play.game;
		}
	}
	return null;
}
