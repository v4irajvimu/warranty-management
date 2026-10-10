# Role-Based Admin Portal

A React admin portal with Firebase email/password authentication and role-based UI, organized as an Nx monorepo. Navigation, routes, and dashboard actions change for `admin` vs `user`.

## Features

- Email/password authentication (Firebase Auth)
- Role-based access stored in Firestore (`admin` | `user`)
- Dark navy MUI shell with sidebar, header page title, and profile avatar drawer
- Dashboard with dummy metrics and role-filtered quick actions
- Protected routes (`/users` is admin-only)
- Vitest unit tests and Playwright end-to-end tests
- Firebase Hosting and Firestore rules deploy scripts

## Tech stack

| Layer | Technology |
| --- | --- |
| Workspace | Nx 23, npm workspaces |
| Framework | React 19, TypeScript |
| Build | Vite |
| Unit tests | Vitest, Testing Library |
| End-to-end tests | Playwright |
| UI | MUI 9 |
| Routing | React Router 7 |
| Backend services | Firebase Auth, Cloud Firestore |
| Hosting | Firebase Hosting |

## Prerequisites

- Node.js 20+
- npm 10+
- A Firebase project with Email/Password auth and Firestore enabled
- Java, only for the authenticated emulator end-to-end tests

## Getting started

```bash
npm install
cp apps/office-portal/.env.example apps/office-portal/.env
```

Fill `apps/office-portal/.env` with your Firebase web app config:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_FIREBASE_EMULATORS=
```

```bash
npm run dev
```

The app runs at `http://localhost:4200`.

## Project structure

```text
apps/
  office-portal/           # App shell: providers, routes, Vite config
  office-portal-e2e/       # Playwright guest and authenticated flows
libs/office-portal/
  util/                    # Roles, routes, and navigation helpers
  data-access/             # Firebase init, AuthProvider, useAuth
  ui/                      # Theme and presentational components
  feature-auth/            # Login and register pages
  feature-shell/           # App shell, sidebar, profile, route guards
  feature-portal/          # Dashboard, users, reports, settings
docs/
  PROJECT_SPEC.md          # Product and engineering spec
  features/                # Per-feature development notes
```

Libraries are non-buildable. The office-portal Vite app compiles them. Import them by package name, for example `@warranty-management/office-portal-data-access`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the office-portal dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build on port 4300 |
| `npm test` | Run all unit tests |
| `npm run test:coverage` | Run unit tests with coverage |
| `npm run lint` | Lint every project |
| `npm run typecheck` | Typecheck every project |
| `npm run e2e` | Guest Playwright tests |
| `npm run e2e:auth` | Signed-in Playwright tests against Firebase emulators |
| `npm run format` | Format the workspace with Prettier |
| `npm run graph` | Open the Nx project graph |
| `npm run deploy:hosting` | Build and deploy Firebase Hosting |
| `npm run deploy:rules` | Deploy Firestore security rules |
| `npm run deploy` | Build and deploy Hosting and Firestore rules |

## Roles

| Role | Access |
| --- | --- |
| `user` | Dashboard, Reports, Settings (default on register) |
| `admin` | All of the above, plus Users |

Promote an admin by setting `users/{uid}.role` to `"admin"` in Firestore, then sign out and sign in again.

## Firebase setup

1. Create a Firebase project and register a **Web** app.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Firestore** database.
4. Publish rules from [`apps/office-portal/firestore.rules`](apps/office-portal/firestore.rules) (`npm run deploy:rules`).
5. Copy the web config into `apps/office-portal/.env`.
6. Register in the app, then optionally promote that user to `admin`.

Set `VITE_USE_FIREBASE_EMULATORS=true` only when the Auth and Firestore emulators are running.

## Deployment

```bash
npx firebase login
npm run deploy:hosting
```

Firebase project files live in `apps/office-portal/`. After the first Hosting deploy, add the Hosting domains under **Authentication → Settings → Authorized domains** if they are missing.

## Documentation

| Document | Purpose |
| --- | --- |
| [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md) | Product spec, data model, workspace layout, and tests |
| [docs/features/](docs/features/README.md) | Feature development notes |

## License

Private project. All rights reserved.
