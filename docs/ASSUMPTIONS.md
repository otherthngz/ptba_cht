# Assumptions — PTBA CHT Hauling Web Portal

> Items here are NOT defined in the source docs but are necessary for the prototype.

## 1. Anomaly Rule Thresholds

| Rule | Threshold | Notes |
|---|---|---|
| PENDING_TOO_LONG | >120 min since `dump_done_ts` | Configurable in `anomalyEngine.ts` |
| STALE_UPDATE | >30 min since `last_update_ts` | Configurable in `anomalyEngine.ts` |
| TONNAGE_OUTLIER | ±20% of `unit.capacity_ton` | Ref: /docs/02_Metrics_Definitions.md |
| DUPLICATE_TRIP | Same unit+location within 10 min window | Flagged via `is_duplicate_flagged` |
| MISSING_TIMESTAMP | `depart_load_ts` or `dump_done_ts` is null | Required field check |

## 2. Shift Definitions

| Shift | Time | Timezone |
|---|---|---|
| Shift A (Day) | 07:00 – 19:00 | Asia/Jakarta |
| Shift B (Night) | 19:00 – 07:00 | Asia/Jakarta |

## 3. Tonnage Reconciliation

- CONFIRMED overrides MANUAL in primary views (KPIs, reports)
- MANUAL records are preserved in audit trail with actor + reason
- Simulated only — no actual external feed integration

## 4. Prototype Limitations

- In-memory data store — resets on server restart
- No authentication / role-based access control
- No map tracking or GPS coordinates (excluded per /docs/09_Scope_Guardrails.md)
- No dispatch optimization (excluded per /docs/09_Scope_Guardrails.md)
- CSV export is client-side blob download (no async job queue)

## 5. Mock Data Volume

- 12 units (8 dump trucks, 2 loaders, 1 support, 1 sporadically reporting)
- 7 locations (3 loading, 4 dumping)
- 16 trips per shift (mixed CONFIRMED/PENDING/MANUAL + 1 duplicate + 1 outlier)
- Anomaly engine runs on server init and re-evaluates on each API call
