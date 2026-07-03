# P-000 / Agent Runtime Boot

## Status

Working note for cockpit. Not source of truth.

## What this operation does

Agent Runtime Boot connects a new chat to Project_OS_LIFT as an execution environment, not as a normal assistant chat.

The agent must not only read routing documents. It must create runtime-state and leave a technical trace in the lower contour.

## Minimum boot result

```yaml
boot_result:
  runtime_state_created: true
  write_mode: hybrid_auto_log
  event_buffer_opened: true
  session_boot_written: true
  checkpoint_written: true
  fallback_created_if_write_unavailable: true
```

## Expected lower-contour writes

```yaml
targets:
  chat_event:
    document: ЖУРНАЛ_СОБЫТИЙ_ЧАТА__Project_OS_LIFT__v01__2026-06-30
    tab: 01_СОБЫТИЯ_ЧАТА
  checkpoint:
    document: ЖУРНАЛ_СОБЫТИЙ_ЧАТА__Project_OS_LIFT__v01__2026-06-30
    tab: 07_КОНТРОЛЬ_ЧЕКПОИНТОВ
  failure:
    document: ЖУРНАЛ_СОБЫТИЙ_ЧАТА__Project_OS_LIFT__v01__2026-06-30
    tab: 05_ОШИБКИ_АНТИПРИМЕРЫ
  daily_if_promoted:
    document: P001_Daily_Event_Log__Project_OS_LIFT__v01__2026-06-02
    tabs:
      - 01_EVENT_LOG
      - 04_DAILY_OUTPUT_QUEUE
```

## Approval boundary

Auto-log applies only to technical lower-contour events.

Source of truth changes, architecture changes, active process changes and accepted decisions still require explicit user approval.

## Test

A new chat passes the boot test only if it creates:

1. runtime_state;
2. session_boot event;
3. checkpoint row;
4. write status or fallback;
5. no hidden drift into normal assistant mode.
