# FE Guidance — Nuxt 3 + Nuxt UI (PTBA Web Portal POC)

Tech constraints:
- **Nuxt 3**
- **Nuxt UI** components (https://ui.nuxt.com/docs/getting-started)

POC constraints:
- No mandatory map tracking
- No dispatch optimization
- Must support tonnage states: `CONFIRMED | PENDING | MANUAL`
- Must include anomaly rules visibility + audit trail UI

---

## 1) Suggested Route Map

- `/fleet` — Live Fleet Board
- `/dispatch` — Simple Dispatch (assignments)
- `/production` — Production Dashboard
- `/availability` — Availability (PA/UA)
- `/data-quality` — Anomalies + Audit
- `/master-data/units`
- `/master-data/locations`
- `/master-data/shifts`
- `/admin/users` (optional POC)

---

## 2) UI Patterns (Nuxt UI friendly)

### 2.1 Table-first dashboards
Use **UCard** + **UTable** + filters:
- `UTable` for fleet/trips/anomalies/audit
- `UInput` search
- `USelectMenu` for filters (shift, location, status)
- `UBadge` for statuses

Recommended status badges:
- Tonnage: `CONFIRMED` (solid), `PENDING` (outline), `MANUAL` (warning)
- Fleet update: `OK`, `STALE`, `NO DATA`
- Issue workflow: `OPEN`, `IN_REVIEW`, `RESOLVED`

### 2.2 Drill-down without navigation bloat
Use **USlideover** or **UModal** for:
- Unit detail timeline
- Trip detail (tonnage history + audit)
- Issue detail (why flagged + related records)

### 2.3 Action patterns
- Row actions as `UDropdown` in table row
- Keep only 1–3 primary actions visible

---

## 3) Module UI Notes

### 3.1 Fleet Board
**Core table columns**
- Unit
- Type / Ownership
- Current Assignment
- Last Activity
- Last Update
- Data Status badge

**Interactions**
- Click row → slideover shows event timeline (shift)
- Quick filter chips: Type, Ownership, Status

### 3.2 Dispatch (simple)
Layout:
- Left: assignment form (unit + destination + optional loading)
- Right: active assignments table

No “recommendations”, no optimization.

### 3.3 Production
Top KPIs (cards):
- Trips (Ritase)
- Tonnage Confirmed
- Tonnage Pending (count + coverage)
- Tonnage Manual

Main table: trips list
- Must show `tonnage_status` + `tonnage_source`
- Row detail shows tonnage history and audit

### 3.4 Availability
Table: unit x shift with:
- running, breakdown, standby, delay
- PA, UA
- completeness badge

### 3.5 Data Quality & Audit
Split into tabs:
- **Anomalies** tab
- **Audit Log** tab

Anomalies table columns:
- Type
- Severity
- Unit
- Trip (optional)
- Created time
- Status
- Action: view detail / mark in review / resolve

Audit table columns:
- Action
- Entity
- Actor
- Time
- Summary (before→after)

---

## 4) State & Data Fetching

### 4.1 Suggested stores
Use Pinia for:
- session/auth
- filters (date range, shift, location)
- cached master data

### 4.2 Polling strategy (POC)
- Fleet board: poll every 10–30s (configurable)
- Production: poll every 1–3 min
- Data quality: poll every 1–5 min or manual refresh

### 4.3 Defensive UI
Assume:
- out-of-order events
- late confirmed tonnage
- partial timestamps

UI should always:
- show labels (PENDING/MANUAL)
- avoid “fake precision” (e.g., don’t compute overly complex cycle KPIs if data incomplete)

---

## 5) Audit Trail UI Requirements (mandatory)
- Wherever manual edits exist, show:
  - last edited by + time
  - reason
  - view history button

Places:
- manual tonnage entry
- assignment changes
- trip corrections
- master data changes (recommended)

---

## 6) Anomaly Rules UI Requirements (mandatory)
At minimum, FE must support displaying these issue types:
- `STALE_UPDATE`
- `TONNAGE_PENDING_TOO_LONG`
- `TONNAGE_OUTLIER`
- `TRIP_DUPLICATE_SUSPECTED`
- `TONNAGE_MULTI_MATCH`
- `TONNAGE_DUPLICATE_TICKET`
- `AVAILABILITY_LOW_COMPLETENESS`

Each issue detail should show:
- why it triggered (rule + threshold)
- related entities (unit/trip/ticket)
- actions taken (audit)

