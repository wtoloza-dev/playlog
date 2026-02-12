import Image from "next/image";
import { auth } from "@/auth";
import { SignOutButton } from "./SignOutButton";

/**
 * Displays current user info with sign out option.
 */
export async function UserInfo() {
	const session = await auth();

	if (!session?.user) {
		return null;
	}

	return (
		<div className="flex items-center gap-3">
			{session.user.image && (
				<Image
					src={session.user.image}
					alt={session.user.name ?? "User"}
					width={96}
					height={96}
					className="h-8 w-8 rounded-full"
				/>
			)}
			<span className="text-sm text-zinc-600 dark:text-zinc-400">
				{session.user.name}
			</span>
			<SignOutButton />
		</div>
	);
}
