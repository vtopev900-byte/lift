# Project OS LIFT / Human Navigation

## 3 слоя

1. Навигация: где что искать и какой маршрут запускать.
2. Фиксация: что произошло и куда это записано.
3. Продукты: daily, weekly, master snapshot и другие выходы.

## Навигация

- PROTOCOL-000: верхний guardrail.
- RV-001: точка входа агента.
- Live Context: текущий режим и активный фокус.
- Source Map: карта источников.
- Process Map: реестр процессов.
- Route Map: карта маршрутов.

## Фиксация

- Chat Event Log: первый входящий лог событий чата.
- P001 Daily Event Log: буфер перед daily.
- Daily Output Queue: готовые блоки для daily.
- System Error Audit: ошибки, failed checkpoint, route break.
- Trace Register: следы и доказательства.
- Decision Log: решения и кандидаты решений.
- Learning Register: системные выводы.

## Текущий фокус

Стабилизировать Chat Event Log и вход нового чата. Master Snapshot не делать до стабилизации нижнего контура.
