import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPlayerStatsUseCase } from "@/features/stats";

/**
 * GET /api/stats/players/[name] - Stats for a single player (name = decoded from URL).
 */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ name: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { name } = await params;
		const playerStats = await getPlayerStatsUseCase(decodeURIComponent(name));

		if (!playerStats) {
			return NextResponse.json(
				{ error: "Player not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(playerStats);
	} catch (error) {
		console.error("Error fetching player stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch player stats" },
			{ status: 500 },
		);
	}
}
