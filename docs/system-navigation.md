# Project OS LIFT / Human Navigation

## Status

Working note for cockpit. Not source of truth.

## Three layers

```text
1. Source / fixation layer
   Drive docs, sheets, logs, queues, route/process/source maps.

2. Execution layer
   Runtime Contract, event routing, checkpoint rules, write permission.

3. Human cockpit layer
   GitHub Pages interface for returning to action after a context gap.
```

## Cockpit job

Cockpit is not a replacement for Drive and not a replacement for snapshots.

It answers:

1. Where am I now?
2. What changed?
3. What requires attention?
4. What is the next route?
5. What can I generate as output?

## Snapshot correction

Snapshots remain on-demand outputs inside cockpit.

Available snapshot commands should include:

- daily;
- weekly;
- master;
- route snapshot;
- source snapshot;
- error snapshot;
- process snapshot.

## Language guard

Do not use handoff/daily words that accidentally become source rules:

```text
avoid:
- главное
- критическое
- стоп-условие
- правило
- вывод дня

prefer:
- state_change
- evidence
- impact
- next_entry
- scope
- expiry
- approval_status
```

## Current design driver

```text
User loses orientation after gap.
Cockpit must return user to action.
```
