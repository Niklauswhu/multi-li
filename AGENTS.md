# AGENTS.md

## Cursor Cloud specific instructions

Multi-Li is a TypeScript **npm-workspaces monorepo** (Node `>=22`, npm) with three workspaces:

- `apps/api` (`@multi-li/api`): Express + TypeScript API on port `4000`.
- `apps/web` (`@multi-li/web`): React + Vite learner UI on port `5173`.
- `packages/shared` (`@multi-li/shared`): shared Zod schemas, types, and seed lesson/learner data.

Standard commands are in the root `package.json` (`dev`, `build`, `test`, `typecheck`, `lint`) and `README.md`. Run them from the repo root so they fan out to all workspaces.

Non-obvious notes:

- **No database or external services.** API progress is stored in an in-memory array (`progressLog` in `apps/api/src/app.ts`); it resets on every API restart. There is nothing to provision.
- **`lint` is an alias for `tsc --noEmit`** in every workspace — there is no ESLint/Prettier. `lint` and `typecheck` do the same thing.
- **Run both services together with `npm run dev`** (uses `concurrently`). The Vite dev server proxies `/api` and `/health` to `http://localhost:4000`, so the API must be running for the web UI to load data. Vite binds to `0.0.0.0`.
- **Env is optional in dev** — all vars have in-code defaults (API port `4000`, CORS origin `http://localhost:5173`). Copy `.env.example` → `.env` only to override.
- Tests (`npm run test`) use Vitest (API: supertest; web: Testing Library + jsdom) and run in-process with **no running services required**.
