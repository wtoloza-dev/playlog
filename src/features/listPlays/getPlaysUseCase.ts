import { getPlays } from "./repository";
import type { Play } from "./types";

/**
 * Use case for getting all plays.
 * Maps repository data to domain types.
 */
export async function getPlaysUseCase(): Promise<Play[]> {
	const playsData = await getPlays();

	return playsData.map((data) => ({
		id: data.playId,
		date: data.date,
		game: data.game,
		bggId: data.bggId,
		players: data.players.map((p) => ({
			position: p.position,
			name: p.playerName,
			score: p.score,
		})),
	}));
}
