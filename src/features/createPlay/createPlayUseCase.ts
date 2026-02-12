import { createPlay } from "./repository";
import type { CreatePlayInput } from "./types";

/**
 * Use case for creating a new play.
 * Contains business logic and validation.
 */
export async function createPlayUseCase(
	input: CreatePlayInput,
): Promise<string> {
	// Validate minimum players
	if (input.players.length < 2) {
		throw new Error("At least 2 players are required");
	}

	// Validate all players have names
	const validPlayers = input.players.filter((p) => p.name.trim() !== "");
	if (validPlayers.length < 2) {
		throw new Error("At least 2 players with names are required");
	}

	// Validate game name
	if (!input.game.trim()) {
		throw new Error("Game name is required");
	}

	// Validate date
	if (!input.date) {
		throw new Error("Date is required");
	}

	// Create play with valid players only
	return createPlay({
		...input,
		players: validPlayers,
	});
}
