import { ulid } from "ulid";
import { getSheetsClient, SHEET_ID, SHEET_NAME } from "@/lib";
import type { CreatePlayInput } from "./types";

/**
 * Repository for creating plays.
 * Only exposes createPlay - single responsibility.
 */
export async function createPlay(data: CreatePlayInput): Promise<string> {
	const sheets = getSheetsClient();
	const playId = ulid();
	const createdAt = new Date().toISOString();

	const rows = data.players.map((player, index) => [
		playId,
		data.date,
		data.game,
		data.createdBy,
		createdAt,
		index + 1,
		player.name,
		player.score ?? "",
	]);

	await sheets.spreadsheets.values.append({
		spreadsheetId: SHEET_ID,
		range: `${SHEET_NAME}!A:H`,
		valueInputOption: "USER_ENTERED",
		requestBody: {
			values: rows,
		},
	});

	return playId;
}
