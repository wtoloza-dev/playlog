/**
 * Play aggregate – shared domain types (read and write).
 */

/**
 * Player result in a play (read model).
 */
export interface PlayerResult {
	position: number;
	name: string;
	score?: number;
}

/**
 * Play for display and downstream use (list, stats).
 */
export interface Play {
	id: string;
	date: string;
	game: string;
	bggId?: number;
	/** From games cache (sheet); avoids BGG API call. */
	gameThumbnailUrl?: string;
	players: PlayerResult[];
}

/**
 * Input for creating a new play (write).
 */
export interface CreatePlayInput {
	date: string;
	game: string;
	bggId?: number;
	createdBy: string;
	players: { name: string; score?: number }[];
}
