# Project OS LIFT Admin Console

Human-facing admin console for `Project_OS_LIFT`.

Pages URL:

```text
https://vtopev900-byte.github.io/lift/
```

## Purpose

This repository is not the source of truth for the system.

It is a public sanitized interface layer for returning the user to action after a context gap and preparing safe system commands.

The console answers:

1. Where am I now?
2. What changed since last entry?
3. What requires attention?
4. Which command payload can be copied?
5. Which snapshot can be generated?
6. What needs approval before any system change?

## Source model

```text
Drive tables/docs = source / fixation layer
GitHub Pages = human-facing admin console
data/admin-console.json = main sanitized state projection
data/cockpit.json = legacy cockpit state kept until migration
```

Do not place private operational details into public repo data.

## Main files

- `index.html` — admin console shell.
- `styles.css` — visual layer.
- `app.js` — renderer for `data/admin-console.json`.
- `data/admin-console.json` — current console state, command payloads and public projection.
- `data/cockpit.json` — legacy cockpit projection.
- `docs/*.md` — human-readable operating notes.

## Current route

```text
ADMIN_CONSOLE_IMPLEMENTATION
```

Current design driver:

```text
User loses orientation after gap.
Admin Console must return the user to action and make safe commands visible.
Snapshots remain on-demand outputs inside the console.
```

## Current status

- Admin Console v0.2 is static.
- Command buttons copy payloads; they do not execute Drive writes.
- Runtime Contract v01.1 is still draft/candidate.
- Next proof: connect or choose an execution layer and test Agent Session Boot.

## Known candidate fixes

- `DOC_CARD_PREFLIGHT`: every system artifact must have a document token and approval boundary.
- `AGENT_SESSION_REGISTRY`: parallel agents need agent run identity and accepted contract tracking.
- `PRIORITY_LABEL_NOISE`: normalize P0 / P1 / P00 labels across layers.
