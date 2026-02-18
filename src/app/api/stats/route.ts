import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStatsUseCase } from "@/features/stats";

/**
 * GET /api/stats - Get play statistics (derived from plays).
 */
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const stats = await getStatsUseCase();
		return NextResponse.json(stats);
	} catch (error) {
		console.error("Error fetching stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch stats" },
			{ status: 500 },
		);
	}
}
