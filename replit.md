# Admin Portal

Standalone admin portal for managing the local mock municipal dashboard experience.

## Run & Operate

- `pnpm dev` — run the admin portal locally
- `pnpm typecheck` — typecheck the app
- `pnpm build` — create a production build
- `pnpm serve` — preview the production build
- Optional env: `PORT` and `BASE_PATH`

## Stack

- Vite, React 19, TypeScript 5.9, Tailwind CSS 4
- Mock data only, no backend dependency

## Where things live

- `src/App.tsx` and `src/main.tsx` are the app entry points
- `src/pages/` contains the feature screens
- `src/components/` contains shared UI and layout primitives

## Architecture decisions

- The app is intentionally self-contained and uses local mock data.

## Product

- Login, dashboard, staff, departments, roles, news, events, citizens, routing, feedback, and appointments management screens

## User preferences

- Keep this repo single-app only; do not reintroduce workspace packages unless asked.

## Gotchas

- `BASE_PATH` must match the deployed subpath when hosting under a nested route.

## Pointers

- See `README.md` for local run, build, and deployment notes
