/**
 * Plays feature – public API (DDD-style: create and list as views).
 */

export { createPlayUseCase } from "./views/create/useCases/createPlayUseCase";
export { getPlaysUseCase } from "./views/list/useCases/getPlaysUseCase";

export { CreatePlayPage } from "./views/create/ui/CreatePlayPage";
export { CreatePlayForm } from "./views/create/ui/CreatePlayForm";
export { ListPlaysPage } from "./views/list/ui/ListPlaysPage";
export { PlaysList } from "./views/list/ui/PlaysList";
export { PlayCard } from "./views/list/ui/PlayCard";

export type { Play, PlayerResult, CreatePlayInput } from "./shared/domain/types";
export type { PlayerEntry, CreatePlayFormData, BggSearchItem } from "./views/create/domain/types";
