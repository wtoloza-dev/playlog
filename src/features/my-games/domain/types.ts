/**
 * My Games feature domain types.
 */

export interface MyGameItem {
	bggId: number;
	name: string;
	year?: number;
	thumbnailUrl?: string;
	imageUrl?: string;
}

export interface MyGamesPageResult {
	items: MyGameItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
