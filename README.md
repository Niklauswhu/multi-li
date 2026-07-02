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

## Features

- **Levelled reading library (Levels 1-5)**: original decodable readers inspired by graded reading schemes such as the Oxford Reading Tree. Each level adds longer sentences, richer stories, and new phonics focuses, and every book ends with a comprehension quiz.
- **Study plan management**: per-learner plans with a current reading level, weekly book goal, and a daily review reminder hour, plus a weekly progress bar and reading log.
- **Ebbinghaus timed reviews**: finishing a book automatically schedules five spaced reviews on days 1, 2, 4, 7, and 15 (the forgetting-curve intervals). The Reviews page splits tasks into due-now, upcoming, and completed buckets, and the navigation shows a due-review badge.

## Product direction

The starter product models:

- age-aware learner profiles for early elementary children;
- localized home-language context for non-English regions;
- short story-based English lessons with vocabulary, sentence frames, and encouragement prompts;
- API-first progress capture for future personalization and teacher dashboards.