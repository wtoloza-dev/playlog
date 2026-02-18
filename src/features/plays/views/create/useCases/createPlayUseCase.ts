/**
 * Use case: create a new play.
 */

import { createPlay } from "@/features/plays/shared/repository";
import type { CreatePlayInput } from "@/features/plays/shared/domain/types";

export async function createPlayUseCase(
	input: CreatePlayInput,
): Promise<string> {
	if (input.players.length < 2) {
		throw new Error("At least 2 players are required");
	}
	const validPlayers = input.players.filter((p) => p.name.trim() !== "");
	if (validPlayers.length < 2) {
		throw new Error("At least 2 players with names are required");
	}
	if (!input.game.trim()) {
		throw new Error("Game name is required");
	}
	if (!input.date) {
		throw new Error("Date is required");
	}
	return createPlay({ ...input, players: validPlayers });
}
