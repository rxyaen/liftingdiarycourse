# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

This is a fresh `create-next-app` scaffold (Next.js 16.3.5, React 19.2.8) with no custom application code yet — only the default `src/app/{layout,page}.tsx` and `globals.css`. A git repository is initialized on `main` but has no commits yet.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

There is no test runner configured yet.

## Architecture

- App Router (`src/app`), TypeScript, Tailwind CSS v4 (via `@tailwindcss/postcss`, no `tailwind.config` file — v4 uses CSS-based config in `globals.css`).
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- **Before writing any code**, read the relevant guide under `node_modules/next/dist/docs/` — this project pins a Next.js version with breaking changes relative to older/training-data Next.js conventions (see `AGENTS.md`). Check for deprecation notices before using patterns you already know. The docs are split into `01-app` (App Router — the one this project uses), `02-pages`, `03-architecture`, and `04-community`; start in `01-app`.
- `.env.local` exists locally for environment variables; don't commit or echo its contents.
