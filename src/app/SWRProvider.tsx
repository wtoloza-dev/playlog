"use client";

import { SWRConfig } from "swr";

/**
 * Global SWR configuration.
 * Revalidates data when the user returns to the tab.
 */
export function SWRProvider({ children }: { children: React.ReactNode }) {
	return (
		<SWRConfig value={{ revalidateOnFocus: true }}>
			{children}
		</SWRConfig>
	);
}
