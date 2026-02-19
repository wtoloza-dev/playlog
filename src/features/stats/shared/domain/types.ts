/**
 * Shared stats types used by multiple views.
 */

export interface GamePlayCount {
	game: string;
	plays: number;
	/** Optional cover/thumbnail from games cache (first play with bggId). */
	thumbnailUrl?: string;
}
