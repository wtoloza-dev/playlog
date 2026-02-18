/**
 * Play repository – read (getPlays) and write (createPlay).
 * Reads are cached in memory (1 min TTL) to reduce Google Sheets API calls.
 */

import { ulid } from "ulid";
import { get, set, invalidate, CACHE_KEYS } from "@/lib/sheetsCache";
import { getSheetsClient, SHEET_ID, SHEET_NAME } from "@/lib";
import type { CreatePlayInput } from "./domain/types";

/** Raw row from the sheet. */
interface PlayRow {
	playId: string;
	date: string;
	game: string;
	bggId?: number;
	createdBy: string;
	createdAt: string;
	position: number;
	playerName: string;
	score?: number;
}

/** Aggregated play from persistence. */
export interface PlayData {
	playId: string;
	date: string;
	game: string;
	bggId?: number;
	createdBy: string;
	createdAt: string;
	players: {
		position: number;
		playerName: string;
		score?: number;
	}[];
}

export async function getPlays(): Promise<PlayData[]> {
	const cached = get<PlayData[]>(CACHE_KEYS.plays);
	if (cached) return cached;

	const sheets = getSheetsClient();
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: `${SHEET_NAME}!A:I`,
	});
	const rows = response.data.values || [];
	const dataRows: PlayRow[] = rows.slice(1).map((row) => ({
		playId: row[0],
		date: row[1],
		game: row[2],
		bggId: row[3] ? Number(row[3]) : undefined,
		createdBy: row[4],
		createdAt: row[5],
		position: Number(row[6]),
		playerName: row[7],
		score: row[8] ? Number(row[8]) : undefined,
	}));

	const playsMap = new Map<string, PlayData>();
	for (const row of dataRows) {
		if (!playsMap.has(row.playId)) {
			playsMap.set(row.playId, {
				playId: row.playId,
				date: row.date,
				game: row.game,
				bggId: row.bggId,
				createdBy: row.createdBy,
				createdAt: row.createdAt,
				players: [],
			});
		}
		playsMap.get(row.playId)?.players.push({
			position: row.position,
			playerName: row.playerName,
			score: row.score,
		});
	}

	const result = Array.from(playsMap.values())
		.map((play) => ({
			...play,
			players: play.players.sort((a, b) => a.position - b.position),
		}))
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	set(CACHE_KEYS.plays, result);
	return result;
}

export async function createPlay(data: CreatePlayInput): Promise<string> {
	const sheets = getSheetsClient();
	const playId = ulid();
	const createdAt = new Date().toISOString();
	const rows = data.players.map((player, index) => [
		playId,
		data.date,
		data.game,
		data.bggId ?? "",
		data.createdBy,
		createdAt,
		index + 1,
		player.name,
		player.score ?? "",
	]);

	await sheets.spreadsheets.values.append({
		spreadsheetId: SHEET_ID,
		range: `${SHEET_NAME}!A:I`,
		valueInputOption: "USER_ENTERED",
		requestBody: { values: rows },
	});

	invalidate(CACHE_KEYS.plays);
	return playId;
}
