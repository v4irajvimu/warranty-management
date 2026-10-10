# Role-Based Admin Portal — Project Spec

## Purpose

A simple, professional admin portal with Firebase email/password authentication and role-based UI. Signed-in users see a dashboard shell whose left navigation and dashboard actions change based on role (`admin` or `user`).

The application lives in an Nx monorepo. `apps/office-portal` is the composition root. Feature code, Firebase access, and shared UI live in libraries under `libs/office-portal`.

## Stack

| Layer | Choice |
| --- | --- |
| Workspace | Nx 23, npm workspaces |
| Build tool | Vite |
| UI library | React 19 + TypeScript |
| Unit tests | Vitest + Testing Library |
| End-to-end tests | Playwright |
| Design system | MUI (Material UI) 9 |
| Routing | React Router 7 |
| Auth | Firebase Authentication (Email/Password) |
| User profile / roles | Cloud Firestore |

## Roles

| Role | Description |
| --- | --- |
| `admin` | Full portal access, including Users management |
| `user` | Standard access; no Users page |

- Registration always creates a document with `role: "user"`.
- There is no role picker on the register form.
- Promote a user to admin by setting `role` to `"admin"` on their Firestore document (`users/{uid}`), then have them sign out and sign in again.

## Screens

| Route | Access | Description |
| --- | --- | --- |
| `/login` | Public | Email/password sign-in |
| `/register` | Public | Create account (always `user` role) |
| `/` (Dashboard) | Authenticated | Landing page with dummy stats and role-based action buttons |
| `/users` | Admin only | Users management (dummy content) |
| `/reports` | Authenticated | Reports (dummy content) |
| `/settings` | Authenticated | Settings (dummy content) |

Unauthenticated visitors are redirected to `/login`. Authenticated users who open `/users` without the admin role are redirected to the dashboard.

## Role-based UI

### Sidebar

| Role | Items (count) |
| --- | --- |
| Admin | Dashboard, Users, Reports, Settings (**4**) |
| User | Dashboard, Reports, Settings (**3**) |

### Dashboard action buttons

Buttons navigate to the matching page.

| Role | Buttons (count) |
| --- | --- |
| Admin | Manage Users, View Reports, Open Settings (**3**) |
| User | View Reports, Open Settings (**2**) |

## Layout

Industry-style admin shell:

- **Left** — App name and role-filtered navigation; active route highlighted.
- **Center** — Sticky header with the current page title, then page content. Dashboard shows dummy stat cards (active users, open reports, tasks) plus role-specific action buttons.
- **Right** — A temporary profile drawer opened from the header avatar: display name, email, role chip, and sign out.

On narrow viewports, a hamburger opens the left navigation. The profile drawer stays avatar-triggered on every breakpoint.

### Theme (dark navy)

| Token | Value |
| --- | --- |
| Sidebar | `#0B1F3A` |
| Page background | `#0E1726` |
| Cards / surfaces | `#152238` |
| Accent | `#3B82F6` |
| Text | Light / high contrast on dark surfaces |

### Auth pages

Login and register use a split layout: illustration on one side and a form card on the other, over a navy gradient background. Illustrations live in `libs/office-portal/feature-auth/src/lib/`.

## Authentication flow

1. App loads and listens to Firebase `onAuthStateChanged`.
2. If no session → show login/register.
3. If signed in → load `users/{uid}` from Firestore, then render the app shell.
4. Register creates the Auth user and a Firestore profile with `role: "user"`.
5. Route rendering waits until the profile is loaded so the sidebar does not flash the wrong items.

Client route guards improve UX. Firestore security rules enforce that a user can only read/create their own profile document and cannot change `role` from the client.

When `VITE_USE_FIREBASE_EMULATORS=true`, the client connects Auth to `127.0.0.1:9099` and Firestore to `127.0.0.1:8080`.

## Data model

### Collection: `users`

Document ID = Firebase Auth `uid`.

| Field | Type | Notes |
| --- | --- | --- |
| `displayName` | string | From registration |
| `email` | string | From registration |
| `role` | `"admin"` \| `"user"` | Defaults to `"user"` on register |
| `createdAt` | timestamp | Set on register |

## Workspace structure

```text
apps/office-portal/                         # Providers, router, index.html
apps/office-portal-e2e/                     # Playwright specs
libs/office-portal/util/                    # Role, UserProfile, route helpers
libs/office-portal/data-access/             # Firebase, AuthProvider, useAuth
libs/office-portal/ui/                      # Theme, LoadingScreen, PageHeader, StatCard, AuthLayout
libs/office-portal/feature-auth/            # LoginPage, RegisterPage
libs/office-portal/feature-shell/           # AppShell, Sidebar, ProfilePanel, guards
libs/office-portal/feature-portal/          # Dashboard, Users, Reports, Settings
```

Dependency direction:

```text
app → feature → ui, data-access, util
data-access → util
ui → util
```

Features do not import other features. ESLint `@nx/enforce-module-boundaries` enforces these tags.

## Environment variables

Copy `apps/office-portal/.env.example` to `apps/office-portal/.env`. Vite loads that file because `apps/office-portal` is the Vite project root.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_FIREBASE_EMULATORS=
```

If the required web keys are missing, the login page shows a setup message instead of crashing.

## Firebase setup (console)

1. Create a Firebase project and add a **Web** app; copy the config into `apps/office-portal/.env`.
2. **Authentication → Sign-in method** — enable **Email/Password**.
3. **Firestore Database** — create a database (production mode recommended).
4. Apply the rules in `apps/office-portal/firestore.rules` (`npm run deploy:rules`).
5. Register in the app, then set that user’s `role` to `"admin"` in Firestore to test the admin UI.
6. Hosting config lives in `apps/office-portal/firebase.json` and `apps/office-portal/.firebaserc`. Deploy with `npm run deploy:hosting` after `firebase login`. Confirm Hosting URLs are in Auth authorized domains.

## Local development

```bash
npm install
npm run dev
```

The dev server uses port `4200`. `npm run preview` serves the production build on port `4300`.

## Testing

- Unit specs sit next to the component or helper they cover and run with `npm test`.
- Guest Playwright tests cover redirects, the unconfigured-Firebase warning, and login/register navigation. They expect no Firebase env and run with `npm run e2e`.
- Authenticated Playwright tests sign in as a seeded user and admin, check the Users guard, sign out, and register a new user. They require Java and run with `npm run e2e:auth`.

## Feature development docs

Per-feature notes live under [docs/features/](features/README.md).
