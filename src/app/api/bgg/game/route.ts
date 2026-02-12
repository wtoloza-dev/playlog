import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBggGame } from "@/lib/bgg";

/**
 * GET /api/bgg/game?id=13
 * Get one BGG game by id (name, imageUrl, thumbnailUrl, year).
 */
export async function GET(request: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const idParam = searchParams.get("id");
		const id = idParam ? Number(idParam) : NaN;
		if (!Number.isInteger(id) || id < 1) {
			return NextResponse.json({ error: "Invalid id" }, { status: 400 });
		}

		const game = await getBggGame(id);
		if (!game) {
			return NextResponse.json({ error: "Game not found" }, { status: 404 });
		}
		return NextResponse.json(game);
	} catch (error) {
		console.error("BGG game error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch game" },
			{ status: 502 },
		);
	}
}
