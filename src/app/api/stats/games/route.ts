import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGameListUseCase } from "@/features/stats";

/**
 * GET /api/stats/games - List games with play counts (REST: collection = plural).
 */
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const games = await getGameListUseCase();
		return NextResponse.json({ games });
	} catch (error) {
		console.error("Error fetching game stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch game stats" },
			{ status: 500 },
		);
	}
}
