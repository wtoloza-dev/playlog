/**
 * My Games repository – read/write the "games" sheet only.
 * One sheet = my collection. Columns: bgg_id, name, year, image_url, thumbnail_url.
 * Reads are cached in memory (1 min TTL) to reduce Google Sheets API calls.
 */

import { GAMES_SHEET, getSheetsClient, SHEET_ID } from "@/lib";
import { getBggGame } from "@/lib/bgg";
import { CACHE_KEYS, get, invalidate, set } from "@/lib/sheetsCache";
import type { MyGameItem, MyGamesPageResult } from "./domain/types";

const GAMES_RANGE = `${GAMES_SHEET}!A:E`;

/** Parse games sheet rows (header row 0, data from row 1). */
function parseGamesRows(rows: unknown[][]): MyGameItem[] {
	const list: MyGameItem[] = [];
	if (!rows.length) return list;
	for (let i = 1; i < rows.length; i++) {
		const row = rows[i];
		const bggId = row[0] ? Number(row[0]) : NaN;
		if (!Number.isInteger(bggId) || bggId < 1) continue;
		list.push({
			bggId,
			name: String(row[1] ?? "").trim() || `Game ${bggId}`,
			year: row[2] ? Number(row[2]) : undefined,
			imageUrl: row[3] ? String(row[3]).trim() : undefined,
			thumbnailUrl: row[4] ? String(row[4]).trim() : undefined,
		});
	}
	return list;
}

/**
 * Return a map bggId -> { thumbnailUrl, imageUrl } for use in plays list (no BGG API calls).
 */
export async function getGamesCacheMap(): Promise<
	Map<number, { thumbnailUrl?: string; imageUrl?: string }>
> {
	const list = await getAllMyGames();
	const map = new Map<number, { thumbnailUrl?: string; imageUrl?: string }>();
	for (const g of list) {
		if (g.thumbnailUrl || g.imageUrl) {
			map.set(g.bggId, {
				thumbnailUrl: g.thumbnailUrl,
				imageUrl: g.imageUrl,
			});
		}
	}
	return map;
}

/**
 * List all my games (no pagination). For SSR e.g. create-play game options.
 * Uses in-memory cache when valid to avoid repeated Google API calls.
 */
export async function getAllMyGames(): Promise<MyGameItem[]> {
	const cached = get<MyGameItem[]>(CACHE_KEYS.games);
	if (cached) return cached;

	const sheets = getSheetsClient();
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: GAMES_RANGE,
	});
	const rows = res.data.values ?? [];
	const list = parseGamesRows(rows);
	set(CACHE_KEYS.games, list);
	return list;
}

/**
 * List my games with pagination. Uses cached full list from getAllMyGames when possible.
 */
export async function getMyGames(
	page: number,
	limit: number,
): Promise<MyGamesPageResult> {
	const all = await getAllMyGames();
	const total = all.length;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const safePage = Math.max(1, Math.min(page, totalPages));
	const start = (safePage - 1) * limit;
	const items = all.slice(start, start + limit);

	return {
		items,
		total,
		page: safePage,
		limit,
		totalPages,
	};
}

/**
 * Add a game to my collection. Appends one row to the "games" sheet (bgg_id only; sync fills the rest).
 */
export async function addMyGame(bggId: number): Promise<void> {
	const sheets = getSheetsClient();
	await sheets.spreadsheets.values.append({
		spreadsheetId: SHEET_ID,
		range: `${GAMES_SHEET}!A:E`,
		valueInputOption: "USER_ENTERED",
		requestBody: { values: [[bggId, "", "", "", ""]] },
	});
	invalidate(CACHE_KEYS.games);
}

/**
 * Sync BGG data for all games in the "games" sheet. Fetches name/year/images and overwrites the sheet.
 */
export async function syncMyGames(): Promise<{
	synced: number;
	errors: number;
}> {
	const sheets = getSheetsClient();
	const all = await getAllMyGames();
	const bggIds = all.map((g) => g.bggId);

	const header = [["bgg_id", "name", "year", "image_url", "thumbnail_url"]];
	const newRows: (string | number)[][] = [];
	let synced = 0;
	let errors = 0;

	for (const id of bggIds) {
		try {
			const game = await getBggGame(id);
			if (game) {
				newRows.push([
					game.id,
					game.name,
					game.year ?? "",
					game.imageUrl ?? "",
					game.thumbnailUrl ?? "",
				]);
				synced++;
			} else {
				newRows.push([id, "", "", "", ""]);
			}
			await new Promise((r) => setTimeout(r, 400));
		} catch {
			newRows.push([id, "", "", "", ""]);
			errors++;
		}
	}

	await sheets.spreadsheets.values.update({
		spreadsheetId: SHEET_ID,
		range: GAMES_RANGE,
		valueInputOption: "USER_ENTERED",
		requestBody: { values: [...header, ...newRows] },
	});

	invalidate(CACHE_KEYS.games);
	return { synced, errors };
}
