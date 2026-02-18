import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMyGames, addMyGame } from "@/features/my-games/repository";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 10;

/**
 * GET /api/my-games?page=1&limit=5
 * List user's games (paginated).
 */
export async function GET(request: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const page = Math.max(1, Number(searchParams.get("page")) || 1);
		const limit = Math.min(
			MAX_LIMIT,
			Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT),
		);

		const result = await getMyGames(page, limit);
		return NextResponse.json(result);
	} catch (error) {
		console.error("My games list error:", error);
		return NextResponse.json(
			{ error: "Failed to load games" },
			{ status: 502 },
		);
	}
}

/**
 * POST /api/my-games
 * Add a game to my collection. Body: { bggId: number }.
 */
export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const bggId = body?.bggId != null ? Number(body.bggId) : NaN;
		if (!Number.isInteger(bggId) || bggId < 1) {
			return NextResponse.json({ error: "Invalid bggId" }, { status: 400 });
		}

		await addMyGame(bggId);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Add my game error:", error);
		return NextResponse.json(
			{ error: "Failed to add game" },
			{ status: 502 },
		);
	}
}
