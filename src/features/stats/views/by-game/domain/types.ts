/**
 * By-game (single game) stats types.
 */

export interface WinsPerPlayer {
	name: string;
	wins: number;
}

export interface GameStats {
	game: string;
	plays: number;
	winsPerPlayer: WinsPerPlayer[];
}
