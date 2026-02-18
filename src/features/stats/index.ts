/**
 * Stats feature – public API.
 * Views: overview, games-overview, players-overview, by-game, by-player.
 */

export { getStatsUseCase } from "./views/overview/useCases/getStatsUseCase";
export { getGameListUseCase } from "./views/games-overview/useCases/getGameListUseCase";
export { getGameStatsUseCase } from "./views/by-game/useCases/getGameStatsUseCase";
export { getPlayerListUseCase } from "./views/players-overview/useCases/getPlayerListUseCase";
export { getPlayerStatsUseCase } from "./views/by-player/useCases/getPlayerStatsUseCase";

export { StatsPage } from "./views/overview/ui/StatsPage";
export { GameListPage } from "./views/games-overview/ui/GameListPage";
export { GameStatsPage } from "./views/by-game/ui/GameStatsPage";
export { PlayerListPage } from "./views/players-overview/ui/PlayerListPage";
export { PlayerStatsPage } from "./views/by-player/ui/PlayerStatsPage";

export { gameToSlug } from "./shared/domain/slug";

export type { GamePlayCount } from "./shared/domain/types";
export type { Stats, PlayerStats } from "./views/overview/domain/types";
export type { GameStats, WinsPerPlayer } from "./views/by-game/domain/types";
export type { PlayerDetailStats } from "./views/by-player/domain/types";
