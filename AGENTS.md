# AGENTS.md

## Cursor Cloud specific instructions

Multi-Li is an npm-workspaces monorepo (Node >= 22, TypeScript/ESM):

- `apps/api` — Express + TypeScript API (dev via `tsx watch`), listens on port `4000`.
- `apps/web` — React + Vite web app, listens on port `5173`.
- `packages/shared` — TypeScript contracts/schemas/starter data consumed by both apps (build-time only, not a running service).

Standard commands are documented in `README.md` and the root `package.json` scripts. Use `npm run dev`, `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`. Dependencies install once at the repo root with `npm install` (workspaces link `@multi-li/shared` via a `file:` dependency).

Non-obvious notes:

- `npm run dev` starts both API and web together via `concurrently`. Run it from the repo root, not inside a workspace.
- The API has no database — progress is stored in an in-memory array in `apps/api/src/app.ts`, so all data resets whenever the API process restarts (including on `tsx watch` reloads).
- `npm run lint` is just `tsc --noEmit` in each workspace (there is no ESLint); it is equivalent to `npm run typecheck`.
- The web dev server proxies `/api` and `/health` to the API at `http://localhost:4000` (see `apps/web/vite.config.ts`). For full end-to-end functionality (learners, featured lesson, saving progress) the API must be running alongside the web app. Leave `VITE_API_BASE_URL` empty so the web app uses the Vite proxy.
- Health check: `GET http://localhost:4000/health`.
