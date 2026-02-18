/**
 * Computes overview stats from plays. Uses shared computePlayCountByGame for mostPlayedGames.
 */

import type { Play } from "@/features/plays/shared/domain/types";
import { computePlayCountByGame } from "@/features/stats/shared/domain/computePlayCountByGame";
import type { PlayerStats, Stats } from "./types";

export function computeStats(plays: Play[]): Stats {
	const totalPlays = plays.length;
	const mostPlayedGames = computePlayCountByGame(plays);

	const playerMap = new Map<
		string,
		{ totalPlays: number; wins: number; podiums: number; positionSum: number }
	>();

	for (const play of plays) {
		for (const p of play.players) {
			const name = p.name.trim() || "?";
			let row = playerMap.get(name);
			if (!row) {
				row = { totalPlays: 0, wins: 0, podiums: 0, positionSum: 0 };
				playerMap.set(name, row);
			}
			row.totalPlays += 1;
			if (p.position === 1) row.wins += 1;
			if (p.position <= 3) row.podiums += 1;
			row.positionSum += p.position;
		}
	}

	const players: PlayerStats[] = Array.from(playerMap.entries())
		.map(([name, row]) => {
			const winRate =
				row.totalPlays > 0 ? row.wins / row.totalPlays : undefined;
			const podiumRate =
				row.totalPlays > 0 ? row.podiums / row.totalPlays : undefined;
			const averagePosition =
				row.totalPlays > 0
					? Math.round((row.positionSum / row.totalPlays) * 10) / 10
					: undefined;
			return {
				name,
				totalPlays: row.totalPlays,
				wins: row.wins,
				winRate,
				podiums: row.podiums,
				podiumRate,
				averagePosition,
			};
		})
		.sort((a, b) => b.totalPlays - a.totalPlays);

	return {
		totalPlays,
		players,
		mostPlayedGames,
	};
}
