# Feature development docs

Feature-level notes for this portal live under `docs/features/`. Use this folder for new feature specs, behaviour notes, and implementation details. Keep the root [README](../../README.md) short and point to [PROJECT_SPEC.md](../PROJECT_SPEC.md) plus these feature docs.

| Feature | Doc |
| --- | --- |
| Authentication and roles | [auth-and-roles.md](auth-and-roles.md) |
| Admin portal shell and pages | [admin-portal-shell.md](admin-portal-shell.md) |
| Header page title and profile drawer | [header-profile-drawer.md](header-profile-drawer.md) |

## Convention

- One markdown file per feature (or tightly related feature set)
- Name files with kebab-case: `feature-name.md`
- Link new docs from this README table when you add them
- Put new UI in an `office-portal` library that matches its Nx type (`feature`, `ui`, `data-access`, or `util`)
- Do not put feature specs only in Cursor plan files; copy or author the lasting version here
