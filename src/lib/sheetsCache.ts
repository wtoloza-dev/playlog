/**
 * In-memory TTL cache for Google Sheets read results.
 * Reduces API calls when the same data is requested repeatedly (e.g. plays list + stats, or games in multiple places).
 * Writes (createPlay, addMyGame, syncMyGames) invalidate the relevant key so the next read is fresh.
 */

const TTL_MS = 60 * 60 * 1000; // 60 minutes

interface Entry<T> {
	value: T;
	expiresAt: number;
}

const store = new Map<string, Entry<unknown>>();

function isExpired(entry: Entry<unknown>): boolean {
	return Date.now() >= entry.expiresAt;
}

/**
 * Get cached value if present and not expired.
 */
export function get<T>(key: string): T | null {
	const entry = store.get(key) as Entry<T> | undefined;
	if (!entry || isExpired(entry)) {
		if (entry) store.delete(key);
		return null;
	}
	return entry.value;
}

/**
 * Store value with TTL from now.
 */
export function set<T>(key: string, value: T): void {
	store.set(key, {
		value,
		expiresAt: Date.now() + TTL_MS,
	});
}

/**
 * Remove cached value so the next read will hit the API.
 */
export function invalidate(key: string): void {
	store.delete(key);
}

export const CACHE_KEYS = {
	plays: "sheets:plays",
	games: "sheets:games",
} as const;
