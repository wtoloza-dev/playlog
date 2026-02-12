# Architecture

## Overview

PlayLog uses a **vertical slicing** architecture where each feature is self-contained with its own types, data access, business logic, and UI components.

## Folder Structure

```
src/
├── auth.ts                    # Auth.js (NextAuth v5) configuration
├── proxy.ts                   # Route protection middleware (Next.js convention)
│
├── lib/
│   └── sheetsClient.ts        # Google Sheets client (shared infrastructure)
│
├── constants/
│   └── games.ts               # Game list for autocomplete
│
├── features/
│   ├── createPlay/            # Feature: register a game play
│   │   ├── types.ts           # Feature-specific types
│   │   ├── repository.ts      # Data access (createPlay only)
│   │   ├── createPlayUseCase.ts # Business logic + validation
│   │   ├── CreatePlayForm.tsx # Presentation component
│   │   ├── CreatePlayPage.tsx # Container component
│   │   └── index.ts           # Public exports
│   │
│   ├── listPlays/             # Feature: view game plays
│   │   ├── types.ts
│   │   ├── repository.ts      # Data access (getPlays only)
│   │   ├── getPlaysUseCase.ts
│   │   ├── PlayCard.tsx       # Presentation
│   │   ├── PlaysList.tsx      # Presentation
│   │   ├── ListPlaysPage.tsx  # Container
│   │   └── index.ts
│   │
│   ├── auth/                  # Auth UI components
│   │   └── components/
│   │
│   └── home/                  # Landing page
│       └── components/
│
├── app/                       # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/ # Auth.js route handlers
│   │   └── plays/route.ts      # BFF endpoint (GET/POST)
│   │
│   ├── login/page.tsx
│   ├── plays/
│   │   ├── layout.tsx         # Shared layout (header + user info)
│   │   ├── page.tsx           # Renders ListPlaysPage
│   │   └── new/page.tsx       # Renders CreatePlayPage
│   └── page.tsx               # Renders HomePage
```

## Design Patterns

### Vertical Slicing

Each feature (`createPlay`, `listPlays`) is autonomous and contains everything it needs:

- **types.ts** - TypeScript interfaces specific to the feature
- **repository.ts** - Data access layer (only exposes what the feature needs)
- **useCase.ts** - Business logic and validation
- **Components** - Container (state/logic) and Presentation (pure UI)

### Container/Presentation

- **Container** (`*Page.tsx`): Manages state, handles events, fetches data
- **Presentation** (`*Form.tsx`, `*List.tsx`): Pure UI, receives props, no side effects

### Repository Pattern

Each feature's repository only exposes the methods it needs:

```typescript
// createPlay/repository.ts
export async function createPlay(data: CreatePlayInput): Promise<string>

// listPlays/repository.ts  
export async function getPlays(): Promise<PlayData[]>
```

### Use Cases

Business logic lives in use cases, separated from data access:

```typescript
// createPlayUseCase.ts
export async function createPlayUseCase(input: CreatePlayInput): Promise<string> {
  // Validation
  if (input.players.length < 2) throw new Error("...");
  // Delegate to repository
  return createPlay(input);
}
```

### BFF (Backend for Frontend)

API routes in `app/api/` act as a thin orchestration layer:

```typescript
// app/api/plays/route.ts
export async function POST(request: Request) {
  const session = await auth();
  // ... auth check
  return createPlayUseCase(data);
}
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  Container Component (CreatePlayPage / ListPlaysPage)           │
│  - Manages state                                                 │
│  - Calls fetch("/api/plays")                                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  BFF (app/api/plays/route.ts)                                   │
│  - Auth check                                                    │
│  - Calls use case                                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  Use Case (createPlayUseCase / getPlaysUseCase)                 │
│  - Business validation                                           │
│  - Calls repository                                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  Repository (createPlay / getPlays)                             │
│  - Data access                                                   │
│  - Uses sheetsClient                                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  Google Sheets API                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

1. User clicks "Sign in with Google"
2. Auth.js handles OAuth flow with Google
3. Session stored in cookie
4. `proxy.ts` protects `/plays/*` routes
5. API routes check session before processing

## Google Sheets Data Model

Single denormalized sheet (`plays`) with one row per player per game:

| Column | Description |
|--------|-------------|
| play_id | ULID (unique per game session) |
| date | Game date (YYYY-MM-DD) |
| game | Game name |
| bgg_id | BoardGameGeek game ID (optional, for BGG integration) |
| created_by | User email |
| created_at | ISO timestamp |
| position | Player finish position (1, 2, 3...) |
| player_name | Player name |
| score | Optional score |

This allows easy analysis in Google Sheets while the app aggregates rows by `play_id` for display.

**Existing sheets:** Insert a new column after `game` (column D), name the header `bgg_id`. Shift existing columns right so the order matches the table above (range A:I).
