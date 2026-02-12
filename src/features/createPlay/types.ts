/**
 * Types for createPlay feature.
 */

/**
 * Player entry in the form with unique ID for React keys.
 */
export interface PlayerEntry {
	id: string;
	name: string;
	score?: number;
}

/**
 * Form data for creating a new play.
 */
export interface CreatePlayFormData {
	game: string;
	date: string;
	players: PlayerEntry[];
}

/**
 * Input for createPlay use case.
 */
export interface CreatePlayInput {
	date: string;
	game: string;
	/** BGG game ID (from BoardGameGeek API). Optional for backward compatibility. */
	bggId?: number;
	createdBy: string;
	players: { name: string; score?: number }[];
}
