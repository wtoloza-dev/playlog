/**
 * Overview (summary) stats types.
 */

import type { GamePlayCount } from "@/features/stats/shared/domain/types";

export interface PlayerStats {
	name: string;
	totalPlays: number;
	wins: number;
	winRate: number | undefined;
	podiums: number;
	podiumRate: number | undefined;
	averagePosition: number | undefined;
}

export interface Stats {
	totalPlays: number;
	players: PlayerStats[];
	mostPlayedGames: GamePlayCount[];
}
