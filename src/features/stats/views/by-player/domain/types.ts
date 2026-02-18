/**
 * By-player (single player) stats types.
 */

export interface PlayerDetailStats {
	name: string;
	totalPlays: number;
	wins: number;
	winRate: number | undefined;
	podiums: number;
	averagePosition: number | undefined;
}
