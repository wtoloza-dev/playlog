import { GameStatsPage } from "@/features/stats";

export default async function GameStatsRoute({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return <GameStatsPage slug={slug} />;
}
