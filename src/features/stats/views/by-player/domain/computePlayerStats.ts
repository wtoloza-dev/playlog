/**
 * Computes stats for a single player by name.
 */

import type { Play } from "@/features/plays/shared/domain/types";
import type { PlayerDetailStats } from "./types";

export function computePlayerStats(
	plays: Play[],
	playerName: string,
): PlayerDetailStats | null {
	const normalized = playerName.trim();
	if (!normalized) return null;

	let totalPlays = 0;
	let wins = 0;
	let podiums = 0;
	let positionSum = 0;

	for (const play of plays) {
		for (const p of play.players) {
			if ((p.name || "").trim() !== normalized) continue;
			totalPlays += 1;
			if (p.position === 1) wins += 1;
			if (p.position <= 3) podiums += 1;
			positionSum += p.position;
		}
	}

	if (totalPlays === 0) return null;

	const winRate = totalPlays > 0 ? wins / totalPlays : undefined;
	const averagePosition =
		totalPlays > 0
			? Math.round((positionSum / totalPlays) * 10) / 10
			: undefined;

	return {
		name: normalized,
		totalPlays,
		wins,
		winRate,
		podiums,
		averagePosition,
	};
}
