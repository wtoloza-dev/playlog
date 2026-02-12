import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPlayUseCase } from "@/features/createPlay";
import { getPlaysUseCase } from "@/features/listPlays";

/**
 * GET /api/plays - Get all plays
 */
export async function GET() {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const plays = await getPlaysUseCase();
		return NextResponse.json(plays);
	} catch (error) {
		console.error("Error fetching plays:", error);
		return NextResponse.json(
			{ error: "Failed to fetch plays" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/plays - Create a new play
 */
export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { date, game, players } = body;

		const playId = await createPlayUseCase({
			date,
			game,
			createdBy: session.user.email,
			players,
		});

		return NextResponse.json({ playId }, { status: 201 });
	} catch (error) {
		console.error("Error creating play:", error);
		const message =
			error instanceof Error ? error.message : "Failed to create play";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
