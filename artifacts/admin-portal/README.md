# Admin Portal

Admin Portal is a Vite + React + TypeScript front-end application in this workspace. It uses mock data for the UI, so it can run locally without any backend service.

## Requirements

- Node.js 18 or newer
- `pnpm` 9.x

This repository is configured for `pnpm` through the root `package.json`.

## Install

From the repository root:

```bash
pnpm install
```

If you only want to install dependencies for the admin portal package, you can still run the same command at the repo root because this is a pnpm workspace.

## Run Locally

Start the admin portal in development mode:

```bash
pnpm --filter @workspace/admin-portal dev
```

The app runs on:

- `http://localhost:5173` by default
- `0.0.0.0` is used for host binding, so it is reachable on your local network if needed

## Build

Create a production build:

```bash
pnpm --filter @workspace/admin-portal build
```

The generated files are written to:

```text
artifacts/admin-portal/dist/public
```

## Preview the Production Build

Preview the built app locally:

```bash
pnpm --filter @workspace/admin-portal serve
```

## Workspace Checks

From the repo root, you can also run workspace-wide checks:

```bash
pnpm typecheck
pnpm build
```

## Configuration

The app reads these environment variables from the Vite config:

- `PORT`: dev and preview port, defaults to `5173`
- `BASE_PATH`: deployment base path, defaults to `/`

Example:

```bash
PORT=3000 BASE_PATH=/admin/ pnpm --filter @workspace/admin-portal dev
```

Use `BASE_PATH` when hosting the portal under a subpath, such as `/admin/`.

## App Notes

- The login page is mocked and routes directly into the portal.
- The dashboard and management screens use local mock data in `src/data/mock.ts`.
- Main routes include:
  - `/dashboard`
  - `/staff`
  - `/departments`
  - `/roles`
  - `/news`
  - `/events`
  - `/citizens`
  - `/routing`
  - `/feedback`
  - `/appointments`

## Troubleshooting

- If the dev server fails to start, make sure nothing else is already using the configured port.
- If you deploy under a subpath and see broken links or blank pages, set `BASE_PATH` to match the hosted path.
- If dependencies are missing, rerun `pnpm install` from the repository root.
