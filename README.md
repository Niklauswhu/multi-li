# Multi-Li

Multi-Li is a child-focused English learning platform for learners in non-English-speaking regions. The repository is initialized as a modern frontend/backend separated monorepo so product, API, and shared domain contracts can evolve independently.

## Architecture

- `apps/web`: React + Vite learner experience for lesson discovery and progress feedback.
- `apps/api`: Express + TypeScript API for learner profiles, lessons, health checks, and progress submission.
- `packages/shared`: Shared TypeScript contracts, validation schemas, and starter lesson data used by both apps.

## Getting started

```bash
npm install
npm run dev
```

The web app runs on `http://localhost:5173` and proxies API requests to `http://localhost:4000`.

## Useful scripts

- `npm run dev`: start the web and API development servers together.
- `npm run build`: build all workspaces.
- `npm run test`: run automated workspace tests.
- `npm run typecheck`: run TypeScript checks across workspaces.
- `npm run lint`: run the repository's static checks.

## Product direction

The starter product models:

- age-aware learner profiles for early elementary children;
- localized home-language context for non-English regions;
- short story-based English lessons with vocabulary, sentence frames, and encouragement prompts;
- API-first progress capture for future personalization and teacher dashboards.