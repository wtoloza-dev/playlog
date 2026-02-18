import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { syncMyGames } from "@/features/my-games/repository";

/**
 * POST /api/my-games/sync
 * Sync BGG data for all games in my collection into the games sheet.
 */
export async function POST() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const result = await syncMyGames();
		return NextResponse.json(result);
	} catch (error) {
		console.error("My games sync error:", error);
		return NextResponse.json(
			{ error: "Failed to sync games" },
			{ status: 502 },
		);
	}
}
