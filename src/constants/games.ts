/**
 * List of board games for autocomplete suggestions.
 * Add new games here as you play them.
 */
export const GAMES = [
	"Carcassonne",
	"Catan",
	"Faraway",
	"Fire Tower",
	"Root",
	"Spots",
	"Survive the island",
] as const;

export type Game = (typeof GAMES)[number];
