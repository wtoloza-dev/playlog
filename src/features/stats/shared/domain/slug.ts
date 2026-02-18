/**
 * Slug utilities for game URLs.
 * "Camel Up" → "camel-up" (lowercase, spaces to hyphens).
 */

export function gameToSlug(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-");
}
