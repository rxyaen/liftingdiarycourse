# Lifting Diary — course notes

Course: Udemy "Claude Code Beginner to Pro: Agentic Coding & Development" (Tom Phillips) — https://www.udemy.com/course/learn-claude-code/
Project folder: `C:\Users\user\liftingdiarycourse` (Windows, VS Code)
App: a workout logging app — log workouts, exercises, sets, reps and weight.

Last updated: 15 Oct 2026 (merged with the Claude-in-VS-Code SESSION_NOTES.txt from 8 Oct)

> Tip: in VS Code, open this file and press **Ctrl+Shift+V** to see it nicely formatted.

---

## 1. What everything is (plain-English glossary)

Think of the app like a restaurant: the **frontend** is the dining room customers see, the **backend** is the kitchen, the **database** is the pantry, and **auth** is the doorman checking who's allowed in.

### The tools you work with
| Name | What it is | Analogy |
|---|---|---|
| **VS Code** | The code editor where you see and edit files. | Your workshop. |
| **Claude Code** | The AI coding assistant running in the VS Code terminal ("Claude" tab). It reads your project, writes code, runs commands — asking permission first in manual mode. | A helper working in your workshop. |
| **Terminal / PowerShell** | Where you type commands. You have tabs: **Claude**, **npm run dev**, and extra ones for installs. | The control panel. |
| **Node.js** | Lets JavaScript run on your computer (not just in a browser). Everything below needs it. | The engine. |
| **npm** | *Node Package Manager.* Installs packages (ready-made code) into `node_modules` and lists them in `package.json`. Also runs scripts: `npm run dev`. | An app store for code. |
| **npx** | Downloads and runs a tool once without installing it into your project (e.g. `npx shadcn@latest init`, `npx drizzle-kit push`). | Borrowing a tool instead of buying it. |
| **Git** | Saves snapshots ("commits") of your project so you can go back. | Save points in a game. |
| **GitHub** | Website that stores your Git project online (used later for GitHub Actions). | Cloud backup for your save points. |

### The app's building blocks
| Name | What it is | Analogy |
|---|---|---|
| **React** | JavaScript library for building user interfaces out of components (buttons, cards, forms). | LEGO bricks for screens. |
| **Next.js** (v16.3.5) | Framework on top of React: pages/routing (`src/app`), server code, building and running the site. `npm run dev` starts it at http://localhost:3000. | The building's frame and plumbing. |
| **TypeScript** | JavaScript with types — catches mistakes before running (`npx tsc --noEmit` checks it). `.ts` / `.tsx` files. | Spell-check for code. |
| **Tailwind CSS** (v4) | Styling with short class names like `p-4 text-lg`. | Paint and decoration kit. |
| **shadcn/ui** | Ready-made, nicely styled components (Button, Card, Dialog) copied into your project. You chose **Radix UI** + **Nova** preset. | Pre-built furniture. |
| **Radix UI** | The engine under shadcn that handles behavior (dialogs opening, keyboard, accessibility). | The hinges inside the furniture. |
| **Clerk** | Ready-made login/sign-up service. Gives you `<SignInButton>`, `<UserButton>`, and the user's ID (`userId`) on the server. Keys live in `.env`. | The doorman. |
| **PostgreSQL ("Postgres")** | The database type — stores data in tables (rows and columns). | A set of spreadsheets that code can query. |
| **Neon** | A company that hosts your Postgres database in the cloud, so you don't run one on your laptop. Free tier. You view tables in the Neon dashboard. | Renting pantry space. |
| **Drizzle ORM** (1.0 RC) | Lets you describe tables and query the database in TypeScript instead of raw SQL. Schema in `src/db/schema.ts`. | A translator between your code and the database. |
| **drizzle-kit** | Drizzle's command-line tool: `push` (apply schema straight to DB), `generate` (create migration SQL files), `migrate` (run them), `studio` (browse data). | The pantry's stock manager. |
| **`@neondatabase/serverless`** | The driver that lets Drizzle talk to Neon over the internet. | The phone line to the pantry. |
| **dotenv / `.env` file** | Holds secret settings (Clerk keys, `DATABASE_URL`). Ignored by Git. Never commit, print or share it. | The safe. |
| **MCP** (Model Context Protocol) | A standard way to plug extra tools into an AI like Claude. An "MCP server" for Neon, GitHub, etc. lets Claude act on those services for you (e.g. look at or seed your database). | USB ports for Claude. |
| **Vercel** | Hosting service to put the finished Next.js site online (end of course). | Opening the restaurant to the public. |
| **GitHub Actions** | Automations that run on GitHub when you push code (later in course). | A robot that checks your work. |

### How they connect
```
Browser (you)
   │  visits http://localhost:3000
   ▼
Next.js + React pages  ── styled with Tailwind + shadcn/ui
   │  "who is this?"          │  "get/save workouts"
   ▼                          ▼
 Clerk (login)           Drizzle ORM ──► Neon (Postgres database in the cloud)
```

---

## 2. Progress

### Done
1. **Setup lectures:** `/terminal-setup`, `/theme`, `/config`, `/model`, Alt+T (thinking), `/init` → `CLAUDE.md` (imports `@AGENTS.md`).
2. **Clerk auth (2 Oct):** Clerk CLI 3.4.0; `clerk init` linked to app `simple-escargot-3754`; `@clerk/nextjs` installed; `<ClerkProvider>` in `src/app/layout.tsx`; `src/proxy.ts` with `/__clerk/:path*` matcher; header with Sign in / Sign up / UserButton; `/sign-in` and `/sign-up` pages. `clerk doctor` passes.
3. **Git (8 Oct):** identity set globally (user.name `rxyaen`). Initial commit `ce58293` on `main` — "Initial commit: Next.js scaffold with Clerk auth".
4. **Packages:** `drizzle-orm@rc`, `@neondatabase/serverless`, `dotenv`. npm audit warnings ignored on purpose (never run `npm audit fix --force`).
5. **shadcn/ui:** `npx shadcn@latest init` → Radix UI + Nova preset (Lucide icons, Geist font). Created `components.json`.
6. **Database schema (8 Oct, Drizzle, normalized):**
   - `exercises` — id, user_id (Clerk ID), name, created_at, updated_at; unique (user_id, name)
   - `workouts` — id, user_id, name (optional), started_at, completed_at, created_at, updated_at; index (user_id, started_at)
   - `workout_exercises` — id, workout_id → workouts (CASCADE), exercise_id → exercises (RESTRICT), "order", created_at; unique (workout_id, "order"); index on exercise_id
   - `sets` — id, workout_exercise_id → workout_exercises (CASCADE), set_number, reps, weight numeric(6,2) (kg, null = bodyweight), created_at; unique (workout_exercise_id, set_number); checks reps > 0, weight ≥ 0
   - Shape: workout → many workout_exercises → many sets; each workout_exercise points at one exercise from the catalog.
7. **Files created/changed:** `src/db/schema.ts` (tables + types), `src/db/relations.ts` (defineRelations), `src/db/index.ts` (Neon http client using `DATABASE_URL`), `drizzle.config.ts`, `package.json` scripts (`db:generate`, `db:migrate`, `db:studio`), `drizzle/20261008093210_wise_dreaming_celestial/migration.sql`. `tsc --noEmit` and `npm run lint` pass.
8. **Tables created in Neon (15 Oct):** `npx drizzle-kit push` → "Changes applied".
9. **`/dashboard` page (15 Oct, branch `dashboard`):** date picker (defaults to today) + list of that day's logged workouts.
   - `src/app/dashboard/page.tsx` — server page; checks Clerk `auth()` (redirects to `/sign-in`), reads `?date=YYYY-MM-DD` from `searchParams` (falls back to today if missing/invalid), shows workouts → exercises → sets (reps × kg, or "bodyweight").
   - `src/app/dashboard/date-picker.tsx` — client component (shadcn Calendar in a Popover); picking a day pushes `/dashboard?date=...`.
   - `src/data/workouts.ts` — `getWorkoutsForDate(userId, date)`; relational query filtered by the signed-in user only.
   - `src/db/index.ts` — now passes `relations` to `drizzle(...)` (needed for nested queries).
   - Added shadcn `calendar` + `popover` (`npx shadcn@latest add calendar popover`; installs `react-day-picker`).
   - `tsc --noEmit` and `npm run lint` pass. **Not yet tested in the browser / with real data.**
   - Known limitation: days are calculated in **UTC**, so late-evening workouts may show on the wrong date depending on your timezone. Fix later by storing the user's timezone (e.g. cookie).

### Differences from the instructor (expected, not errors)
- IDs are **integers** (1, 2, 3); instructor uses **uuid**. When his code reads an ID from the URL, yours needs `Number(workoutId)`. Keep integers now that tables exist.
- Timestamps use `withTimezone: true`; extra `name` column on workouts; helper functions `createdAt()` / `updatedAt()`; extra indexes; separate exercises catalog table.
- Clerk set up with `clerk init` (newer flow) → extra env vars and `/sign-in`, `/sign-up` pages.
- shadcn asks for "component library" + "preset" instead of the old "style / base color".

### Next steps / to-dos
1. **Commit the schema work** — uncommitted: `src/db/*`, `drizzle.config.ts`, `package.json`, `drizzle/`, `components.json`, these notes. Ask Claude: "please commit the database schema, drizzle setup and notes".
2. **push vs migrate:** tables were created with `drizzle-kit push`, while a migration file also exists in `drizzle/`. Running `npm run db:migrate` now may fail with "table already exists". Follow whichever the instructor uses next; if it errors, ask Claude to fix.
3. **Test the database:** insert a workout with 2 exercises × 3 sets, read it back with a relational query, confirm deleting the workout cascades to its sets.
4. **Clerk keys:** make sure only the `simple-escargot-3754` key pair is in `.env` (remove the old `proven-turkey-4314` pair if it's still there) and rotate the Clerk secret key in the Clerk dashboard (it was pasted in a chat).
5. **Test `/dashboard`:** run `npm run dev`, sign in, insert a sample workout (see item 3) and check it appears on the right date.
6. **Commit the dashboard work** (on branch `dashboard`): `src/app/dashboard/`, `src/data/`, `src/db/index.ts`, `src/components/ui/{calendar,popover}.tsx`, `package.json`, `package-lock.json`, notes.
7. Then build more app features (log workout UI, history, etc.).

---

## 3. Reminders & tips
- **Terminal tabs:** *npm run dev* tab = only the dev server. *Claude* tab = talk to Claude. New tab (+) = installs and interactive tools like `shadcn init`.
- `!` at the start of a line in the Claude box runs it as a terminal command.
- Restart the dev server (Ctrl+C, `npm run dev`) after changing `.env` or installing packages.
- "Yes, and don't ask again" saves rules to `.claude/settings.local.json`.
- Shift+Tab cycles modes: manual (default) → accept edits → plan/auto.
- Before writing Next.js code, Claude should read `node_modules/next/dist/docs/` (this version has breaking changes — see `AGENTS.md`).
- Never commit, print or paste `.env` contents.
- Don't upgrade npm to a new major version mid-course.
- Commit after each finished lecture.
- Claude's plan file: `C:\Users\user\.claude\plans\this-is-a-workout-sharded-finch.md`
