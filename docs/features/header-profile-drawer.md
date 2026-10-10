# Feature: Header page title and profile drawer

## Summary

A persistent top header shows the current page name. A profile avatar sits at the top right. Clicking it opens a temporary right-side profile drawer with sign out, role, and contact info.

## Behaviour

- The header is visible on all breakpoints
- The page title comes from the active route via `getPageTitle(pathname)` and matches the sidebar labels
- The avatar shows initials from `displayName`
- The profile panel is drawer-only, not a permanent right column
- Mobile also keeps the hamburger that opens the left nav

## Key files

| Path | Role |
| --- | --- |
| `libs/office-portal/feature-shell/src/lib/app-shell.tsx` | App bar, page title, avatar trigger |
| `libs/office-portal/feature-shell/src/lib/profile-panel.tsx` | Temporary right drawer |
| `libs/office-portal/util/src/lib/navigation.ts` | `getPageTitle` helper |

## UX flow

1. The user navigates and the header title updates.
2. The user clicks the avatar and the profile drawer opens.
3. The user signs out from the drawer, the Auth session clears, and the app returns to login.

## Tests

`app-shell.spec.tsx` checks the page title, initials, and nested page. `profile-panel.spec.tsx` checks the profile details and sign-out action.
