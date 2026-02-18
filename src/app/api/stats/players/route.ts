import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPlayerListUseCase } from "@/features/stats";

/**
 * GET /api/stats/players - List players with basic stats.
 */
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const players = await getPlayerListUseCase();
		return NextResponse.json({ players });
	} catch (error) {
		console.error("Error fetching player list:", error);
		return NextResponse.json(
			{ error: "Failed to fetch players" },
			{ status: 500 },
		);
	}
}
