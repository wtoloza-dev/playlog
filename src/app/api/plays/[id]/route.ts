import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPlayUseCase } from "@/features/plays";

/**
 * GET /api/plays/[id] - Get a single play by ID.
 */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const play = await getPlayUseCase(id);

		if (!play) {
			return NextResponse.json({ error: "Play not found" }, { status: 404 });
		}

		return NextResponse.json(play);
	} catch (error) {
		console.error("Error fetching play:", error);
		return NextResponse.json(
			{ error: "Failed to fetch play" },
			{ status: 500 },
		);
	}
}
