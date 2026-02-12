/**
 * Types for listPlays feature.
 */

/**
 * Player result in a play.
 */
export interface PlayerResult {
	position: number;
	name: string;
	score?: number;
}

/**
 * Play data for display.
 */
export interface Play {
	id: string;
	date: string;
	game: string;
	players: PlayerResult[];
}
