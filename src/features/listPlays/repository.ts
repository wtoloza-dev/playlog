import { getSheetsClient, SHEET_ID, SHEET_NAME } from "@/lib";

/**
 * Raw row from the sheet.
 */
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

/**
 * Aggregated play from repository.
 */
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

/**
 * Repository for listing plays.
 * Only exposes getPlays - single responsibility.
 */
export async function getPlays(): Promise<PlayData[]> {
	const sheets = getSheetsClient();

	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: `${SHEET_NAME}!A:I`,
	});

	const rows = response.data.values || [];

	// Skip header row
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

	// Group by playId
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

	// Convert to array and sort by date (most recent first)
	return Array.from(playsMap.values())
		.map((play) => ({
			...play,
			players: play.players.sort((a, b) => a.position - b.position),
		}))
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
