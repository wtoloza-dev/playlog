# PlayLog

A web app to track board game results with friends. Records player rankings (1st, 2nd, 3rd, etc.) and optional scores for each game session.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router)
- **Auth**: Auth.js v5 (Google OAuth)
- **Database**: Google Sheets (via Service Account)
- **Styling**: Tailwind CSS v4
- **Linting**: Biome

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Google Cloud project with:
  - OAuth 2.0 credentials (Client ID & Secret)
  - Service Account with Sheets API access
  - A Google Sheet shared with the Service Account

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Auth.js
AUTH_SECRET=your-secret-key
AUTH_GOOGLE_ID=your-oauth-client-id
AUTH_GOOGLE_SECRET=your-oauth-client-secret

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id
```

### Run Locally

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Check code with Biome |
| `bun run lint:fix` | Auto-fix lint issues |
| `bun run format` | Format code with Biome |

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details on:

- Vertical slicing structure
- Container/Presentation pattern
- Repository and Use Case patterns
- Data flow diagrams
- Google Sheets data model

## Access Control

- App uses Google OAuth (test mode: add users in Google Cloud Console)
- Google Sheet is private, accessed via Service Account
- Only authenticated users can view/create plays

## Publishing & Deploy (Vercel)

### 1. Publicar el repo

Crea un repositorio en GitHub (o GitLab/Bitbucket), luego:

```bash
git add .
git commit -m "Initial commit"   # si aún no has hecho commit
git remote add origin https://github.com/TU_USUARIO/playlog.git
git branch -M main
git push -u origin main
```

Sustituye `TU_USUARIO/playlog` por tu usuario y nombre del repo.

### 2. Desplegar en Vercel (gratis)

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub).
2. **Add New** → **Project** → importa el repo `playlog`.
3. **Environment Variables**: añade las mismas que en `.env.local`:
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (pega la clave completa; en Vercel no hace falta escapar `\n`)
   - `GOOGLE_SHEET_ID`
   - `AUTH_TRUST_HOST` = `true` (recomendado para Auth.js en Vercel)
4. **Deploy**. Vercel detecta Next.js y usa `bun run build` si hace falta.

Tras el deploy, en Google Cloud Console añade la **URL de producción** de Vercel (ej. `https://playlog-xxx.vercel.app`) a los **Authorized redirect URIs** de tu OAuth client.
