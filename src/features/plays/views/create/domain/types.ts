/**
 * Create-play view – form and UI types.
 */

export interface PlayerEntry {
	id: string;
	name: string;
	score?: number;
}

export interface CreatePlayFormData {
	game: string;
	date: string;
	players: PlayerEntry[];
}

export interface BggSearchItem {
	id: number;
	name: string;
	year?: number;
}
