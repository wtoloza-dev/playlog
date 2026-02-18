import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGameStatsUseCase } from "@/features/stats";

/**
 * GET /api/stats/games/[slug] - Stats for a single game (slug = lowercase, hyphens).
 */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { slug } = await params;
		const gameStats = await getGameStatsUseCase(slug);

		if (!gameStats) {
			return NextResponse.json({ error: "Game not found" }, { status: 404 });
		}

		return NextResponse.json(gameStats);
	} catch (error) {
		console.error("Error fetching game stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch game stats" },
			{ status: 500 },
		);
	}
}
