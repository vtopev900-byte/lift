# Project OS LIFT Cockpit

Human-facing observability cockpit for `Project_OS_LIFT`.

Pages URL:

```text
https://vtopev900-byte.github.io/lift/
```

## Purpose

This repository is not the source of truth for the system.

It is a public, sanitized cockpit layer that helps the user return to the project after a context gap:

1. Where am I now?
2. What changed since last entry?
3. What requires attention?
4. What can I do with one command?
5. Which snapshot can I generate?

## Source model

```text
Drive tables/docs = source / fixation layer
GitHub Pages = human-facing cockpit
data/cockpit.json = sanitized projection for UI
```

Do not place PII, access tokens, phone numbers, private Drive links, or private operational details into public repo data.

## Main files

- `index.html` — cockpit shell.
- `styles.css` — dashboard visual layer.
- `app.js` — renderer for `data/cockpit.json`.
- `data/cockpit.json` — current sanitized cockpit state.
- `docs/*.md` — human-readable operating notes.

## Current route

```text
REBUILD_PROJECT_COCKPIT
```

Current design driver:

```text
User loses orientation after gap.
Cockpit must return user to action.
Snapshots remain on-demand outputs inside cockpit.
```

## Current status

- Runtime Contract v01.1 is draft/candidate.
- Lower contour event fixation is being stabilized.
- Master Snapshot is paused.
- Next proof: a new chat must create runtime_state, session_boot and checkpoint without waiting for "занеси".
