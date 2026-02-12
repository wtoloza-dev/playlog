import type { PlayerEntry } from "./types";

export interface BggSearchItem {
	id: number;
	name: string;
	year?: number;
}

export interface CreatePlayFormProps {
	game: string;
	date: string;
	players: PlayerEntry[];
	games: readonly string[];
	/** BGG search results for autocomplete */
	bggResults: BggSearchItem[];
	bggSearching: boolean;
	/** When user selected a BGG game: id and cover URL */
	selectedBggId?: number;
	bggImageUrl?: string;
	isSubmitting: boolean;
	isValid: boolean;
	error: string | null;
	onGameChange: (value: string) => void;
	onDateChange: (value: string) => void;
	onSelectBggGame: (item: BggSearchItem) => void;
	onClearBggSelection: () => void;
	onPlayerNameChange: (id: string, value: string) => void;
	onPlayerScoreChange: (id: string, value: string) => void;
	onAddPlayer: () => void;
	onRemovePlayer: (id: string) => void;
	onSubmit: (e: React.FormEvent) => void;
}

/**
 * Presentation component for the create play form.
 * Receives all data and callbacks via props, contains no logic.
 */
export function CreatePlayForm({
	game,
	date,
	players,
	games,
	bggResults,
	bggSearching,
	selectedBggId,
	bggImageUrl,
	isSubmitting,
	isValid,
	error,
	onGameChange,
	onDateChange,
	onSelectBggGame,
	onClearBggSelection,
	onPlayerNameChange,
	onPlayerScoreChange,
	onAddPlayer,
	onRemovePlayer,
	onSubmit,
}: CreatePlayFormProps) {
	return (
		<div className="flex flex-col items-center p-8">
			<main className="w-full max-w-md">
				<h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
					Register Play
				</h1>

				<form onSubmit={onSubmit} className="flex flex-col gap-6">
					{/* Game: BGG search + optional cover */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="game"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							Game
						</label>
						{selectedBggId && bggImageUrl ? (
							<div className="flex items-center gap-3 rounded-lg border border-zinc-300 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
								{/* biome-ignore lint/performance/noImgElement: BGG external image URL */}
								<img
									src={bggImageUrl}
									alt=""
									className="h-14 w-14 shrink-0 rounded object-cover"
								/>
								<div className="min-w-0 flex-1">
									<p className="font-medium text-zinc-900 dark:text-zinc-50">
										{game}
									</p>
									<p className="text-xs text-zinc-500 dark:text-zinc-400">
										From BoardGameGeek
									</p>
								</div>
								<button
									type="button"
									onClick={onClearBggSelection}
									className="rounded p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
								>
									Change
								</button>
							</div>
						) : (
							<div className="relative">
								<input
									id="game"
									type="text"
									list="games-list"
									value={game}
									onChange={(e) => onGameChange(e.target.value)}
									placeholder="Search BGG or type name (e.g. Catan)"
									className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600"
								/>
								<datalist id="games-list">
									{games.map((g) => (
										<option key={g} value={g} />
									))}
								</datalist>
								{bggSearching && (
									<p className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
										Searching…
									</p>
								)}
								{bggResults.length > 0 && !bggSearching && (
									<div
										className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
										role="listbox"
										aria-label="BGG game suggestions"
									>
										{bggResults.slice(0, 8).map((item) => (
											<div key={item.id}>
												<button
													type="button"
													role="option"
													className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-700"
													onClick={() => onSelectBggGame(item)}
												>
													<span className="font-medium">{item.name}</span>
													{item.year != null && (
														<span className="text-zinc-500">({item.year})</span>
													)}
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Date */}
					<div className="flex flex-col gap-2">
						<label
							htmlFor="date"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							Date
						</label>
						<input
							id="date"
							type="date"
							value={date}
							onChange={(e) => onDateChange(e.target.value)}
							className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
						/>
					</div>

					{/* Players */}
					<fieldset className="flex flex-col gap-2">
						<legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
							Players (in order of finish)
						</legend>
						<div className="flex flex-col gap-3">
							{players.map((player, index) => (
								<div key={player.id} className="flex items-center gap-2">
									<span className="w-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
										{index + 1}.
									</span>
									<input
										type="text"
										value={player.name}
										onChange={(e) =>
											onPlayerNameChange(player.id, e.target.value)
										}
										placeholder={index === 0 ? "Winner" : `Player ${index + 1}`}
										className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600"
									/>
									<input
										type="number"
										value={player.score ?? ""}
										onChange={(e) =>
											onPlayerScoreChange(player.id, e.target.value)
										}
										placeholder="Score"
										className="w-20 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600"
									/>
									{players.length > 2 && (
										<button
											type="button"
											onClick={() => onRemovePlayer(player.id)}
											className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
										>
											✕
										</button>
									)}
								</div>
							))}
						</div>
						<button
							type="button"
							onClick={onAddPlayer}
							className="mt-2 self-start rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
						>
							+ Add player
						</button>
					</fieldset>

					{/* Error */}
					{error && (
						<p className="text-sm text-red-500 dark:text-red-400">{error}</p>
					)}

					{/* Submit */}
					<button
						type="submit"
						disabled={!isValid || isSubmitting}
						className="mt-4 rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
					>
						{isSubmitting ? "Saving..." : "Save Play"}
					</button>
				</form>
			</main>
		</div>
	);
}
