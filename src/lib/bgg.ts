/**
 * BoardGameGeek XML API2 client.
 * Uses server-side fetch; no CORS from browser.
 * Rate limit: avoid calling too frequently (BGG may return 503).
 */

const BGG_BASE = "https://boardgamegeek.com/xmlapi2";
const BOARDGAME = "boardgame";

/** Headers for BGG requests. Requires BGG_API_TOKEN (register at boardgamegeek.com/applications). */
function getBggHeaders(): HeadersInit {
	const headers: HeadersInit = {
		"User-Agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		Accept: "application/xml, text/xml, */*",
		"Accept-Language": "en-US,en;q=0.9",
	};
	const token = process.env.BGG_API_TOKEN?.trim();
	if (token) {
		(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
	}
	return headers;
}

export interface BggSearchItem {
	id: number;
	name: string;
	year?: number;
}

export interface BggGame {
	id: number;
	name: string;
	year?: number;
	/** Full-size box image URL. */
	imageUrl?: string;
	/** Thumbnail URL. */
	thumbnailUrl?: string;
}

import { XMLParser } from "fast-xml-parser";

/**
 * Parse search response: items with id, primary name, year.
 */
function parseSearchXml(xml: string): BggSearchItem[] {
	const parser = new XMLParser({ ignoreAttributes: false });
	const doc = parser.parse(xml);
	const items = doc?.items?.item;
	if (!items) return [];
	const list = Array.isArray(items) ? items : [items];

	return list
		.filter((item: Record<string, unknown>) => item["@_type"] === BOARDGAME)
		.map((item: Record<string, unknown>) => {
			const names = item.name;
			const nameObj = Array.isArray(names)
				? names.find((n: Record<string, unknown>) => n["@_type"] === "primary")
				: names;
			const nameVal =
				nameObj &&
				typeof nameObj === "object" &&
				nameObj !== null &&
				"@_value" in nameObj
					? (nameObj as { "@_value"?: string })["@_value"]
					: undefined;
			const name =
				typeof nameVal === "string" ? nameVal : String(item["@_value"] ?? "");
			const yp = item.yearpublished as { "@_value"?: number } | undefined;
			const year = yp?.["@_value"] != null ? Number(yp["@_value"]) : undefined;
			return {
				id: Number(item["@_id"]),
				name: name || "Unknown",
				year,
			};
		});
}

/**
 * Parse thing response: single item with image, thumbnail, name, year.
 */
function parseThingXml(xml: string): BggGame | null {
	const parser = new XMLParser({ ignoreAttributes: false });
	const doc = parser.parse(xml);
	const item = doc?.items?.item;
	if (!item) return null;

	const id = Number(item["@_id"]);
	const names = item.name;
	const nameObj = Array.isArray(names)
		? names.find((n: Record<string, unknown>) => n["@_type"] === "primary")
		: names;
	const name =
		nameObj && typeof nameObj["@_value"] === "string"
			? nameObj["@_value"]
			: typeof item.name === "string"
				? item.name
				: "Unknown";
	const year =
		item.yearpublished?.["@_value"] != null
			? Number(item.yearpublished["@_value"])
			: undefined;
	const imageUrl = getTextContent(item.image);
	const thumbnailUrl = getTextContent(item.thumbnail);

	return { id, name, year, imageUrl, thumbnailUrl };
}

function getTextContent(value: unknown): string | undefined {
	if (typeof value === "string") return value;
	if (
		value &&
		typeof value === "object" &&
		"#text" in value &&
		typeof (value as { "#text": string })["#text"] === "string"
	) {
		return (value as { "#text": string })["#text"];
	}
	return undefined;
}

/**
 * Search board games by query string.
 */
export async function searchBgg(query: string): Promise<BggSearchItem[]> {
	const q = query.trim().replace(/\s+/g, "+");
	if (!q) return [];
	const url = `${BGG_BASE}/search?query=${encodeURIComponent(q)}&type=${BOARDGAME}`;
	const res = await fetch(url, { headers: getBggHeaders() });
	if (!res.ok) throw new Error(`BGG search failed: ${res.status}`);
	const xml = await res.text();
	return parseSearchXml(xml);
}

/**
 * Get one board game by BGG id (name, image, thumbnail, year).
 */
export async function getBggGame(id: number): Promise<BggGame | null> {
	const url = `${BGG_BASE}/thing?id=${id}`;
	const res = await fetch(url, { headers: getBggHeaders() });
	if (!res.ok) throw new Error(`BGG thing failed: ${res.status}`);
	const xml = await res.text();
	return parseThingXml(xml);
}
