# Feature: Admin portal shell and pages

## Summary

Dark navy MUI shell with left navigation filtered by role, a main content area, and a role-aware dashboard landing page with dummy data.

## Behaviour

### Sidebar

| Role | Items |
| --- | --- |
| Admin | Dashboard, Users, Reports, Settings (4) |
| User | Dashboard, Reports, Settings (3) |

### Dashboard quick actions

| Role | Buttons |
| --- | --- |
| Admin | Manage Users, View Reports, Open Settings (3) |
| User | View Reports, Open Settings (2) |

### Pages

- **Dashboard** — dummy stats and role-filtered action buttons
- **Users** — admin-only dummy table
- **Reports** — dummy report list
- **Settings** — read-only profile fields and a placeholder toggle

## Key files

| Path | Role |
| --- | --- |
| `libs/office-portal/feature-shell/src/lib/app-shell.tsx` | Shell layout and header |
| `libs/office-portal/feature-shell/src/lib/sidebar.tsx` | Role-filtered nav |
| `libs/office-portal/util/src/lib/navigation.ts` | Routes, dashboard actions, page titles |
| `libs/office-portal/feature-shell/src/lib/navigation.ts` | MUI icons for those routes |
| `libs/office-portal/feature-portal/src/lib/dashboard-page.tsx` | Landing dashboard |
| `libs/office-portal/feature-portal/src/lib/users-page.tsx` | Admin users page |
| `libs/office-portal/feature-portal/src/lib/reports-page.tsx` | Reports page |
| `libs/office-portal/feature-portal/src/lib/settings-page.tsx` | Settings page |
| `apps/office-portal/src/app/app-router.tsx` | Route map |

## Theme

Sidebar `#0B1F3A`, page `#0E1726`, cards `#152238`, accent `#3B82F6`. Tokens live in `libs/office-portal/ui/src/lib/theme.ts`.

## Tests

Each page and shell component has a colocated Vitest spec. Admin and user navigation differences are covered in the sidebar, dashboard, and app-router specs.
