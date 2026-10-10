# Feature: Authentication and roles

## Summary

Email/password sign-in and registration via Firebase Auth, with role stored on a Firestore `users/{uid}` document. UI navigation and dashboard actions depend on `admin` vs `user`.

## Behaviour

- **Register** creates an Auth user and a Firestore profile with `role: "user"` (no role picker)
- **Login** loads the Firestore profile after the Auth session is ready
- A missing profile is created for a signed-in user when possible (`ensureUserProfile`)
- **Admin** is assigned only by updating Firestore `role` to `"admin"`
- Client route guards: unauthenticated users go to `/login`; a non-admin opening `/users` goes to `/`
- `VITE_USE_FIREBASE_EMULATORS=true` connects the client to the local Auth and Firestore emulators

## Key files

| Path | Role |
| --- | --- |
| `libs/office-portal/data-access/src/lib/firebase.ts` | Firebase init from `VITE_FIREBASE_*` and optional emulator connection |
| `libs/office-portal/data-access/src/lib/auth-provider.tsx` | Session, register/login/logout, profile ensure |
| `libs/office-portal/data-access/src/lib/use-auth.ts` | Auth context hook |
| `libs/office-portal/feature-auth/src/lib/login-page.tsx` | Login UI |
| `libs/office-portal/feature-auth/src/lib/register-page.tsx` | Register UI |
| `libs/office-portal/feature-shell/src/lib/protected-route.tsx` | Auth gate |
| `libs/office-portal/feature-shell/src/lib/role-route.tsx` | Role gate |
| `apps/office-portal/firestore.rules` | Own-doc read/create; client cannot change `role` |

## Data model

`users/{uid}`: `displayName`, `email`, `role`, `createdAt`

## Setup notes

Publish `apps/office-portal/firestore.rules` before register or login can write profiles. See [PROJECT_SPEC.md](../PROJECT_SPEC.md) for the full Firebase setup.

## Tests

Colocated Vitest specs cover Firebase configuration, login, register, logout, a missing profile, and both route guards. `npm run e2e:auth` covers the same signed-in flows in the browser against the emulators.
