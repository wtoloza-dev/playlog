import { PlayDetailPage } from "@/features/plays";

export default async function PlayDetailRoute({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <PlayDetailPage playId={id} />;
}
