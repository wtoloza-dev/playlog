import { PlayerStatsPage } from "@/features/stats";

export default async function StatsPlayerRoute({
	params,
}: {
	params: Promise<{ name: string }>;
}) {
	const { name } = await params;
	return <PlayerStatsPage playerName={decodeURIComponent(name)} />;
}
