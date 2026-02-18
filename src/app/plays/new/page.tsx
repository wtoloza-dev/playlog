import { CreatePlayPage } from "@/features/plays";
import { getAllMyGames } from "@/features/my-games/repository";

export default async function Page() {
	let myGames: { bggId: number; name: string; year?: number; thumbnailUrl?: string; imageUrl?: string }[] = [];
	try {
		myGames = await getAllMyGames();
	} catch {
		// Sheet missing or error: use empty list, form falls back to BGG search
	}
	return <CreatePlayPage myGames={myGames} />;
}
