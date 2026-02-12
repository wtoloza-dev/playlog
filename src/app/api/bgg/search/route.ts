import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchBgg } from "@/lib/bgg";

/**
 * GET /api/bgg/search?q=catan
 * Search BGG for board games. Returns id, name, year.
 */
export async function GET(request: Request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const q = searchParams.get("q")?.trim();
		if (!q) {
			return NextResponse.json([]);
		}

		const items = await searchBgg(q);
		return NextResponse.json(items);
	} catch (error) {
		console.error("BGG search error:", error);
		return NextResponse.json({ error: "Search failed" }, { status: 502 });
	}
}
