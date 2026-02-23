# UI Specification Per Page — PTBA CHT Web Portal POC (Nuxt 3 + Nuxt UI)

> Source of truth: `/docs/08_FE_Guidance_Nuxt_UI.md`, `/docs/01_PRD_Web_Portal.md`, `/artifacts/02_DataModel_Schema.md`, `/artifacts/03_API_Spec_REST.md`

**Global conventions**
- Component naming follows **Nuxt UI** (`UTable`, `UBadge`, `UCard`, `USlideover`, `UModal`, `USelectMenu`, `UInput`, `UDropdown`, `UButton`, `UTabs`, `UPagination`).
- All pages share a sidebar navigation with links: Fleet · Dispatch · Production · Availability · Data Quality · Master Data · Export.
- Date range picker + shift selector are global filter controls (top bar or page-level).
- Polling intervals per `/docs/08_FE_Guidance_Nuxt_UI.md` §4.2: Fleet 10–30 s, Production 1–3 min, DQ 1–5 min.
- No mandatory map widgets. No dispatch optimization UI.

---

## Status Badge Reference (used across pages)

| Domain | Values | Badge style |
|---|---|---|
| Tonnage status | `CONFIRMED` | Solid / green |
| | `PENDING` | Outline / gray |
| | `MANUAL` | Warning / amber |
| Data status | `OK` | Solid / green |
| | `STALE` | Warning / amber |
| | `NO_DATA` | Outline / gray |
| Assignment status | `ASSIGNED` | Info / blue |
| | `IN_PROGRESS` | Solid / green |
| | `COMPLETED` | Subtle / gray |
| Issue status | `OPEN` | Error / red |
| | `IN_REVIEW` | Warning / amber |
| | `RESOLVED` | Subtle / green |
| Completeness | `HIGH (≥90%)` | Green |
| | `MEDIUM (60–89%)` | Yellow |
| | `LOW (<60%)` | Red |

---

## Page 1 · `/fleet` — Live Fleet Board

### Purpose
Single screen to know "what is happening now" — all active units, their last activity, connectivity, and current assignment.

### Primary users
Dispatcher / CCR, Supervisor

### Layout

```
┌──────────────────────────────────────────────┐
│ Header: "Fleet Board"          [Auto-refresh] │
├──────────────────────────────────────────────┤
│ Filter Bar                                    │
│ [Unit Type ▾] [Ownership ▾] [Status ▾]       │
│ [Destination ▾] [Search unit… 🔍]            │
├──────────────────────────────────────────────┤
│ Fleet Table (UTable)                          │
│ ┌────┬──────┬─────┬────────┬───────┬───────┐ │
│ │Unit│Type/ │Assmt│Last    │Last   │Data   │ │
│ │    │Owner │     │Activity│Update │Status │ │
│ └────┴──────┴─────┴────────┴───────┴───────┘ │
│ … rows …                                     │
│ [Pagination]                                  │
└──────────────────────────────────────────────┘
```

### Core components

| Component | Nuxt UI | Purpose |
|---|---|---|
| Filter chips | `USelectMenu` (multi) × 4 | Unit type, ownership, data status, destination |
| Search | `UInput` with icon | Free-text on unit ID / name |
| Fleet table | `UTable` inside `UCard` | Main data grid |
| Status badges | `UBadge` | Data status (OK / STALE / NO_DATA) |
| Assignment badge | `UBadge` | Destination label or "—" |
| Row drill-down | `USlideover` | Unit timeline (click row → open panel) |
| Auto-refresh | `UToggle` + interval label | Enable / disable polling; show countdown |

### Data displayed (per row)

| Column | Source field | Notes |
|---|---|---|
| Unit | `unit_id`, `unit_name` | — |
| Type / Ownership | `unit_type`, `ownership` | e.g., "DT · Rental" |
| Current Assignment | `assignment.dumping_location_name` | Badge with destination; "—" if none |
| Last Activity | `last_activity` label | e.g., "HAULING" |
| Last Update | `last_update_ts` | Relative time ("3 min ago") + absolute on hover |
| Data Status | derived `data_status` | `UBadge`: OK / STALE / NO_DATA |

### User actions

| Action | Trigger | Constraint |
|---|---|---|
| View timeline | Click row | Opens `USlideover` with shift events |
| Filter | Select filter values | Client-side or re-fetch; table updates live |
| Search | Type in search box | Debounced (300 ms — Assumption (POC)) |

### Drill-down: Unit Timeline Slideover

**Contents:**
- Header: unit name + type + ownership
- Current assignment card (if any)
- Chronological event list for current shift: `event_type` badge, `start_ts – end_ts`, location (if avail), source label
- Empty state: "No events recorded for this shift."

### States & empty/error handling

| State | Display |
|---|---|
| No active units | Empty state: "No active units found. Check master data." |
| All filters return 0 | "No units match current filters." with clear-filters link |
| API error | Error banner: "Unable to load fleet data. Retrying…" |
| STALE unit | Row highlighted (amber tint); badge `STALE` |

### DQ & Audit visibility
- STALE badge links to Data Quality page filtered by `STALE_UPDATE` (Assumption (POC): via query param navigation).
- No direct editing on this page → no audit actions.

### Export
- No dedicated export on Fleet Board (fleet status is transient). Unit master data exportable from Master Data page.

### Accessibility / usability
- Table sortable by Last Update and Unit columns.
- Keyboard-navigable rows; Enter to open slideover.
- Relative timestamps include absolute time in `title` attribute for accessibility.

---

## Page 2 · `/dispatch` — Simple Dispatch (Assignment Tracking)

### Purpose
CCR assigns units to destinations and tracks assignment progress. **No optimization, no auto-assign.**

### Primary users
Dispatcher / CCR

### Layout

```
┌─────────────────────────┬────────────────────────────┐
│ Assignment Form (left)  │ Active Assignments (right)  │
│                         │                             │
│ [Unit ▾]                │ UTable                      │
│ [Destination ▾]         │ ┌────┬─────┬──────┬──────┐  │
│ [Loading loc ▾] (opt.)  │ │Unit│Dest │Status│Action│  │
│ [Notes ________]        │ └────┴─────┴──────┴──────┘  │
│ [Create Assignment]     │ … rows …                    │
│                         │ [Pagination]                │
└─────────────────────────┴────────────────────────────┘
```

### Core components

| Component | Nuxt UI | Purpose |
|---|---|---|
| Unit selector | `USelectMenu` (searchable) | Active units only |
| Destination selector | `USelectMenu` | Active locations, role = DUMPING |
| Loading selector | `USelectMenu` | Optional; role = LOADING |
| Notes input | `UTextarea` | Free text |
| Create button | `UButton` (primary) | Submit assignment |
| Assignments table | `UTable` inside `UCard` | List active + recent assignments |
| Status badge | `UBadge` | ASSIGNED / IN_PROGRESS / COMPLETED |
| Row actions | `UDropdown` | "Mark In Progress", "Mark Completed", "Edit Notes" |
| Edit notes modal | `UModal` | Edit notes with save |

### Data displayed (assignments table)

| Column | Source field |
|---|---|
| Unit | `unit_id`, `unit_name` |
| Destination | `dumping_location_name` |
| Loading | `loading_location_name` (or "—") |
| Status | `status` badge |
| Notes | Truncated; full on hover |
| Created | `created_at` relative |
| Actions | Dropdown |

### User actions

| Action | Trigger | Constraint |
|---|---|---|
| Create assignment | Form submit | Unit must be active; destination required; creates audit entry |
| Update status | Dropdown → "Mark In Progress" / "Mark Completed" | Only forward transitions: ASSIGNED→IN_PROGRESS→COMPLETED |
| Edit notes | Dropdown → "Edit Notes" → modal | Audit log: before/after |
| View audit | Dropdown → "View Changes" | Opens `USlideover` or navigates to Data Quality audit filtered by this assignment |

### Explicitly absent
- No "Recommended Destination" widget
- No "Auto-Assign" button
- No queue/priority scoring

### States & empty/error handling

| State | Display |
|---|---|
| No active assignments | "No active assignments. Create one to get started." |
| Unit already assigned | Form validation: "This unit already has an active assignment." (409) |
| API error on create | Inline error: "Failed to create assignment. Please try again." |

### DQ & Audit visibility
- "View Changes" action per assignment row → slideover showing audit log entries for that `assignment_id`.
- Every create/update action triggers audit entry (visible on Data Quality → Audit tab).

### Export
- Not a primary export page. Assignment data can be found in trip exports.

### Accessibility / usability
- Tab order: form fields → create button → table.
- Status dropdown closes on selection; confirmation toast displayed.

---

## Page 3 · `/production` — Production Dashboard

### Purpose
Show production KPIs (ritase + tonnage by status bucket) and trip list with full tonnage transparency.

### Primary users
Supervisor, Dispatcher / CCR, Checker (trip list only)

### Layout

```
┌──────────────────────────────────────────────┐
│ Global Filters                                │
│ [Date range] [Shift ▾] [Loading loc ▾]       │
│ [Dumping loc ▾]                              │
├──────────────────────────────────────────────┤
│ KPI Cards Row                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ Ritase   │ │Confirmed │ │ Manual   │       │
│ │   186    │ │ 4,820 t  │ │  620 t   │       │
│ └──────────┘ └──────────┘ └──────────┘       │
│ ┌──────────┐ ┌────────────────────────┐       │
│ │ Pending  │ │ Coverage: 172/186 (92%)│       │
│ │  14 trips│ │ ██████████░░           │       │
│ └──────────┘ └────────────────────────┘       │
├──────────────────────────────────────────────┤
│ UTabs: [Trip List] [Breakdown]               │
├──────────────────────────────────────────────┤
│ Trip List Tab (default)                       │
│ ┌──────────────────────────────────────────┐ │
│ │ [Tonnage status ▾] [Search unit…]        │ │
│ │ UTable                                    │ │
│ │ ┌────┬────┬─────┬─────┬──────┬────────┐  │ │
│ │ │Trip│Unit│Load │Dump │Tonnes│Status  │  │ │
│ │ │    │    │     │     │      │badge   │  │ │
│ │ └────┴────┴─────┴─────┴──────┴────────┘  │ │
│ │ [Pagination]                              │ │
│ └──────────────────────────────────────────┘ │
├──────────────────────────────────────────────┤
│ Breakdown Tab                                 │
│ Aggregation table grouped by selected dim     │
└──────────────────────────────────────────────┘
```

### Core components

| Component | Nuxt UI | Purpose |
|---|---|---|
| Date range picker | `UPopover` + calendar | Date range for all queries |
| Shift selector | `USelectMenu` | From `mt_shift` |
| Location filters | `USelectMenu` × 2 | Loading, dumping |
| KPI cards | `UCard` × 5 | Ritase, Confirmed, Manual, Pending, Coverage |
| Coverage bar | Progress bar inside `UCard` | Visual coverage indicator |
| Tabs | `UTabs` | "Trip List" / "Breakdown" |
| Tonnage status filter | `USelectMenu` | CONFIRMED / PENDING / MANUAL |
| Trip table | `UTable` | Main data grid |
| Tonnage badge | `UBadge` | **CONFIRMED** (green solid), **PENDING** (gray outline), **MANUAL** (amber warning) |
| Row drill-down | `USlideover` | Trip detail: tonnage history + audit |
| Export button | `UButton` | "Export CSV" on table header |

### Data displayed — KPI cards

| Card | Value | Notes |
|---|---|---|
| Ritase | `total_trips` | Count (excludes duplicate-flagged) |
| Confirmed Tonnage | `tonnage_confirmed_total` | Sum in tonnes |
| Manual Tonnage | `tonnage_manual_total` | Sum in tonnes; amber accent |
| Pending | `tonnage_pending_trips` | Count only (no value) |
| Coverage | `tonnage_coverage_pct` | "X of Y trips have tonnage" + progress bar |

### Data displayed — Trip list table

| Column | Source field | Notes |
|---|---|---|
| Trip ID | `trip_id` | Link to detail |
| Unit | `unit_id`, `unit_name` | — |
| Loading | `loading_location_name` | "—" if unknown |
| Dumping | `dumping_location_name` | — |
| Time | `dump_done_ts` or `depart_load_ts` | Relative + absolute |
| Tonnes | `tonnage_value` | Null for PENDING → "—" |
| Status | `tonnage_status` | **UBadge** (see badge reference) |
| Source | `tonnage_source_system` | For CONFIRMED; `entered_by` for MANUAL |

### Data displayed — Breakdown tab

- Aggregation table: user selects dimension (`unit_type`, `ownership`, `loading_location`, `dumping_location`).
- Columns: dimension value, trip count, Confirmed tonnes, Manual tonnes, Pending count.

### User actions

| Action | Trigger | Constraint |
|---|---|---|
| View trip detail | Click row | Slideover: tonnage history + audit trail |
| Enter manual tonnage | Button in trip detail (Checker only) | Only for PENDING trips; requires `manual_reason` |
| Export trips | "Export CSV" button | Triggers export job; include `tonnage_status` column |
| Filter by tonnage status | Status filter | Table re-fetches |

### Trip Detail Slideover

**Sections:**
1. **Trip summary** — unit, locations, timestamps, shift
2. **Tonnage status** — large badge: CONFIRMED / PENDING / MANUAL
3. **Tonnage history** — `UTable` listing all `tonnage_record` entries (including superseded MANUAL with `is_active = false`, visually dimmed/strikethrough). Shows: type badge, value, source/entered_by, timestamp, is_active.
4. **Manual tonnage form** (Checker only, only when trip is PENDING):
   - `manual_tonnage` (number input, required)
   - `manual_reason` (text area, required)
   - `attachment_ref` (file upload, optional)
   - Submit button
5. **Audit trail** — chronological list of audit log entries for this trip (who, action, before→after, reason, timestamp).

### States & empty/error handling

| State | Display |
|---|---|
| No trips for date/shift | Empty state: "No trips recorded for this period." |
| All PENDING | Coverage card turns red; info banner: "No confirmed tonnage received yet." |
| Duplicate-flagged trip | Row dimmed + strikethrough; tooltip: "Flagged as duplicate — excluded from totals" |
| Manual tonnage submit error | Inline form error: "Reason is required." / "Invalid tonnage value." |
| Reconciliation occurred | Trip detail shows both MANUAL (dimmed, `is_active=false`) and CONFIRMED (active). Info note: "Manual entry superseded by confirmed tonnage." |

### DQ & Audit visibility
- Tonnage badge is **always visible** per trip row.
- Trip detail slideover includes full audit trail section.
- Manual tonnage form creates audit entry on submit (visible immediately in trail section).
- Duplicate-flagged trips link to Data Quality issue (`TRIP_DUPLICATE_SUSPECTED`).

### Export
- "Export CSV" button on trip list → calls `POST /export` with `export_type=TRIPS`.
- "Export Summary" button on breakdown tab → `export_type=PRODUCTION_AGGREGATE`.

### Accessibility / usability
- KPI cards use large numbers; color is supplemented with text labels (not color-only).
- Tonnage badges have text + color (accessible to color-blind users).
- Table sortable by time, unit, tonnage.

---

## Page 4 · `/availability` — Availability (PA/UA) Dashboard

### Purpose
Show PA and UA per unit per shift with completeness confidence indicators.

### Primary users
Supervisor

### Layout

```
┌──────────────────────────────────────────────┐
│ Filters                                       │
│ [Date range] [Shift ▾] [Unit type ▾]         │
├──────────────────────────────────────────────┤
│ Summary Cards (optional)                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ Avg PA   │ │ Avg UA   │ │Units LOW │       │
│ │  93.2%   │ │  68.5%   │ │completn: 3│      │
│ └──────────┘ └──────────┘ └──────────┘       │
├──────────────────────────────────────────────┤
│ Availability Table (UTable)                   │
│ ┌────┬────┬──────┬────┬─────┬────┬────┬────┐ │
│ │Unit│Shft│Run   │Stby│Delay│Brkd│PA% │UA% │ │
│ │    │    │min   │min │min  │min │    │    │ │
│ │    │    │      │    │     │    │    │    │ │
│ │    │    │      │    │     │    │ cmp│    │ │
│ └────┴────┴──────┴────┴─────┴────┴────┴────┘ │
│ [Pagination]                      [Export CSV]│
└──────────────────────────────────────────────┘
```

### Core components

| Component | Nuxt UI | Purpose |
|---|---|---|
| Date range | `UPopover` + calendar | — |
| Shift filter | `USelectMenu` | — |
| Unit type filter | `USelectMenu` | DUMP_TRUCK / LOADER / SUPPORT |
| Summary cards | `UCard` × 3 | Avg PA, Avg UA, count of LOW completeness |
| Availability table | `UTable` inside `UCard` | Main grid |
| Completeness badge | `UBadge` | HIGH (green) / MEDIUM (yellow) / LOW (red) |
| Manual adjust | `UModal` | Edit time buckets (Supervisor / Admin) |
| Export button | `UButton` | "Export CSV" |

### Data displayed (table)

| Column | Source field | Notes |
|---|---|---|
| Unit | `unit_id`, `unit_name` | — |
| Shift | `shift_name` | — |
| Date | `date` | — |
| Running | `running_min` | Minutes |
| Standby | `standby_min` | — |
| Delay | `delay_min` | — |
| Breakdown | `breakdown_min` | — |
| PA % | `pa_pct` | Formatted to 1 decimal |
| UA % | `ua_pct` | — |
| Completeness | `completeness_pct` + label | `UBadge` (HIGH/MEDIUM/LOW) |
| Adj. | `is_manual_adjusted` | Icon indicator if manually adjusted |

### User actions

| Action | Trigger | Constraint |
|---|---|---|
| Adjust time buckets | Row action → "Adjust" → modal | Supervisor / Admin only; reason required; creates audit entry |
| View adjustment history | Row action → "View History" | Slideover with audit entries for this `avail_id` |
| Export | "Export CSV" button | `export_type=AVAILABILITY` |

### Manual Adjustment Modal

**Fields:**
- Read-only: unit, shift, date, scheduled_min
- Editable: running_min, standby_min, delay_min, breakdown_min
- Validation: sum of all buckets ≤ scheduled_min
- Reason (text, required)
- On save: PA/UA/completeness recalculated; `is_manual_adjusted = true`; audit log entry created.

### States & empty/error handling

| State | Display |
|---|---|
| No records for period | "No availability data for this period." |
| LOW completeness row | Row highlighted; badge RED; links to DQ issue |
| Already adjusted | Small icon/indicator on row; "View History" shows adjustments |
| Bucket sum > scheduled | Modal validation error: "Total exceeds scheduled time." |

### DQ & Audit visibility
- LOW completeness badge visible per row.
- LOW completeness rows auto-link to `AVAILABILITY_LOW_COMPLETENESS` anomaly on Data Quality page.
- Manual adjustments recorded in audit trail; icon visible on table row.

### Export
- "Export CSV" → columns: date, shift, unit, running, standby, delay, breakdown, PA%, UA%, completeness%.

### Accessibility / usability
- Table sortable by PA%, UA%, completeness.
- Completeness uses text label + color (not color-only).
- Minutes displayed as integers for readability.

---

## Page 5 · `/data-quality` — Data Quality & Audit

### Purpose
Central hub for anomaly investigation, resolution, and audit trail review.

### Primary users
Dispatcher / CCR, Supervisor, Admin (audit read)

### Layout

```
┌──────────────────────────────────────────────┐
│ UTabs: [Anomalies] [Audit Log]               │
├──────────────────────────────────────────────┤
│ (Tab content below)                           │
└──────────────────────────────────────────────┘
```

### Tab A — Anomalies

```
┌──────────────────────────────────────────────┐
│ Filters                                       │
│ [Issue type ▾] [Severity ▾] [Status ▾]       │
│ [Unit ▾] [Date range]                        │
├──────────────────────────────────────────────┤
│ Anomalies Table (UTable)                      │
│ ┌─────┬────────┬────┬────┬──────┬─────┬────┐ │
│ │Type │Severity│Unit│Trip│Created│Stat │Act │ │
│ └─────┴────────┴────┴────┴──────┴─────┴────┘ │
│ [Pagination]                      [Export CSV]│
└──────────────────────────────────────────────┘
```

**Components:**

| Component | Nuxt UI | Purpose |
|---|---|---|
| Issue type filter | `USelectMenu` (multi) | All 8 issue types |
| Severity filter | `USelectMenu` | LOW / MEDIUM / HIGH |
| Status filter | `USelectMenu` | OPEN / IN_REVIEW / RESOLVED |
| Unit filter | `USelectMenu` (searchable) | — |
| Date range | `UPopover` + calendar | `created_at` range |
| Anomalies table | `UTable` | Main grid |
| Severity badge | `UBadge` | HIGH=red, MEDIUM=amber, LOW=gray |
| Status badge | `UBadge` | OPEN=red, IN_REVIEW=amber, RESOLVED=green |
| Row detail | `USlideover` | Issue detail + actions |
| Export | `UButton` | "Export CSV" |

**Table columns:**

| Column | Source | Notes |
|---|---|---|
| Type | `issue_type` | Human-readable label (e.g., "Tonnage Outlier") |
| Severity | `severity` | `UBadge` |
| Unit | `unit_name` | — |
| Trip | `trip_id` | Link (if applicable) |
| Created | `created_at` | Relative |
| Status | `status` | `UBadge` |
| Actions | — | Dropdown: "View Detail", "Mark In Review", "Resolve" |

**Issue Detail Slideover:**
1. **Header** — issue type (human name) + severity badge + status badge
2. **Why it triggered** — rule description + threshold (e.g., "Tonnage 55.0t exceeds capacity band [3.5, 42.0] for unit DT-043")
3. **Related entities** — linked unit card, linked trip card with tonnage status badge (clickable → Production trip detail)
4. **Actions:**
   - "Mark In Review" button (if OPEN)
   - "Resolve" button → requires `resolution_note` (text area)
5. **Actions taken** — audit log entries specific to this issue

### Tab B — Audit Log

```
┌──────────────────────────────────────────────┐
│ Filters                                       │
│ [Action type ▾] [Entity type ▾] [Actor ▾]    │
│ [Date range]                                 │
├──────────────────────────────────────────────┤
│ Audit Table (UTable)                          │
│ ┌──────┬──────┬──────┬─────┬────────┬──────┐ │
│ │Action│Entity│Actor │Time │Summary │Reason│ │
│ └──────┴──────┴──────┴─────┴────────┴──────┘ │
│ [Pagination]                      [Export CSV]│
└──────────────────────────────────────────────┘
```

**Table columns:**

| Column | Source | Notes |
|---|---|---|
| Action | `action` | Human label (e.g., "Manual Tonnage Entered") |
| Entity | `entity_type` + `entity_id` | Clickable link to entity |
| Actor | `actor_name` | — |
| Time | `timestamp` | Relative + absolute |
| Summary | `before_value → after_value` | Compact diff: "PENDING → MANUAL (31.0t)" |
| Reason | `reason` | Truncated; full on expand |

**Row expand / click:** Full detail row or slideover with complete before/after JSON-like display and full reason text.

### States & empty/error handling

| State | Display |
|---|---|
| No anomalies | "No data quality issues found. All clear." ✅ |
| No audit entries | "No audit records for this period." |
| Resolve without note | Validation error: "Resolution note is required." |

### Export
- Anomalies tab: "Export CSV" → `export_type=ANOMALIES`
- Audit tab: "Export CSV" → `export_type=AUDIT_LOG`

### Accessibility / usability
- Audit log table is read-only; no mutation possible.
- Issue status badges use text + color.
- Slideover has focus trap and Escape to close.

---

## Page 6 · `/master-data` — Master Data Management

### Purpose
Manage reference data: units, locations, shifts, users/roles. Admin-only write access.

### Primary users
Admin (full CRUD), Supervisor / Dispatcher (read-only)

### Layout

Overview page with navigation to sub-pages:

```
┌──────────────────────────────────────────────┐
│ UTabs: [Units] [Locations] [Shifts] [Users]  │
├──────────────────────────────────────────────┤
│ (Tab content)                                 │
└──────────────────────────────────────────────┘
```

Each tab follows the same pattern:

```
┌──────────────────────────────────────────────┐
│ [Search… 🔍] [Filter ▾]  [+ Create] [Export] │
├──────────────────────────────────────────────┤
│ UTable                                        │
│ ┌──────┬─────────┬────────┬───────┬────────┐ │
│ │ ID   │ Name    │ Type   │Active │Actions │ │
│ └──────┴─────────┴────────┴───────┴────────┘ │
│ [Pagination]                                  │
└──────────────────────────────────────────────┘
```

### Sub-page: Units (`/master-data/units`)

**Table columns:** unit_id, unit_name, unit_type badge, ownership badge, vendor_name, capacity_ton, is_active toggle, actions.

**Actions dropdown:** "Edit", "Deactivate/Activate"

**Create / Edit form** (`UModal`):
- Fields: unit_id (create only, immutable), unit_name, unit_type (`USelectMenu`), ownership (`USelectMenu`), vendor_name (shown if RENTAL), capacity_ton, is_active, notes.

**Filter:** unit_type, ownership, is_active.

### Sub-page: Locations (`/master-data/locations`)

**Table columns:** location_id, location_name, location_role badge (LOADING/DUMPING/OTHER), is_active, sort_order, actions.

**Create / Edit form:** location_id (create only), location_name, location_role, is_active, sort_order, notes. `latitude`/`longitude` fields **present but labeled "Optional — not required for POC"**.

**Filter:** location_role, is_active.

### Sub-page: Shifts (`/master-data/shifts`)

**Table columns:** shift_id, shift_name, start_time, end_time, timezone, is_active, actions.

**Create / Edit form:** shift_id (create only), shift_name, start_time (time picker), end_time, timezone (`USelectMenu` of IANA), is_active.

### Sub-page: Users (`/master-data/users`)

**Table columns:** user_id, full_name, role badge (ADMIN/DISPATCHER/CHECKER/SUPERVISOR), is_active, actions.

**Create / Edit form:** user_id (create only), full_name, role (`USelectMenu`), is_active.

### States & empty/error handling

| State | Display |
|---|---|
| No records | "No [entities] found. Create one to get started." |
| Deactivate confirmation | `UModal`: "Deactivate [name]? This unit will be removed from active operations but historical data is retained." |
| Duplicate ID on create | Form error: "This ID already exists." |

### DQ & Audit visibility
- Master data changes are recommended to produce audit entries (P1 — US-P1-005).
- If audit is active: "View History" action per row → slideover with audit entries for that entity.

### Export
- Per sub-page: "Export CSV" button.
- CSV headers per `04_Master_Data_Template.md` §6.

### Accessibility / usability
- Admin sees all actions; non-admin roles see read-only tables (action column hidden).
- `is_active` shown as `UToggle` for admin, text badge for readers.
- Forms validate required fields before submit.

---

## Page 7 · Export Center

### Approach
Export is provided **per-page** (integrated into each relevant page) rather than a separate export center. Each page with export has a consistent "Export CSV" button that triggers the async export job.

### Per-page export mapping

| Source page | Export button location | `export_type` | Key columns included |
|---|---|---|---|
| `/production` (trip list) | Table header | `TRIPS` | trip_id, unit, locations, timestamps, tonnage_value, **tonnage_status**, tonnage_source, entered_by |
| `/production` (breakdown) | Breakdown tab header | `PRODUCTION_AGGREGATE` | date, shift, ritase, confirmed, manual, pending count, coverage |
| `/availability` | Table header | `AVAILABILITY` | date, shift, unit, time buckets, PA%, UA%, completeness% |
| `/data-quality` (anomalies) | Table header | `ANOMALIES` | issue_id, type, severity, status, unit, trip, created, resolved, note |
| `/data-quality` (audit) | Table header | `AUDIT_LOG` | log_id, action, entity, actor, timestamp, before/after, reason |
| `/master-data/*` | Table header per sub-page | (direct download) | Per master data template |

### Export flow (consistent pattern)

1. User clicks "Export CSV" → button shows spinner.
2. `POST /export` called → returns `job_id`.
3. Poll `GET /export/{job_id}` until `status = COMPLETED`.
4. Auto-download via `GET /export/{job_id}/download` or show download link in toast notification.
5. Error state: toast with "Export failed. Please try again."

### Export format notes
- CSV is P0 (mandatory).
- XLSX is P1 (nice-to-have); if supported, show format toggle: `[CSV] [XLSX]` before export.
- All exports include `tonnage_status` where tonnage data is present.
- Audit exports include `before_value`, `after_value`, `reason`.

---

## Cross-Cutting Interaction Notes

### Polling & refresh
| Page | Interval | Mechanism |
|---|---|---|
| Fleet Board | 10–30 s (configurable) | Auto-poll with toggle; visual countdown |
| Production | 1–3 min | Auto-poll or manual refresh button |
| Data Quality | 1–5 min | Auto-poll or manual refresh button |
| Others | Manual refresh | Reload on navigation or refresh button |

### Navigation patterns
- Sidebar: persistent across all pages.
- Cross-page links:
  - Fleet Board STALE badge → `/data-quality?issue_type=STALE_UPDATE&unit_id=X`
  - Production trip row → opens slideover (same page).
  - DQ issue detail → linked trip opens Production trip detail.
  - Availability LOW completeness → `/data-quality?issue_type=AVAILABILITY_LOW_COMPLETENESS&unit_id=X`

### Defensive UI rules (ref: `08_FE_Guidance_Nuxt_UI.md` §4.3)
- Always show labels on badges (not color-only).
- Never compute false-precision KPIs when data is incomplete — show completeness warnings.
- PENDING tonnage shows "—" for value, not "0".
- Late confirmed tonnage arriving after MANUAL → show informational note in trip detail, not a jarring overwrite.

---

*Document generated: 2026-02-19 · Aligned with `/docs/08_FE_Guidance_Nuxt_UI.md` and `/artifacts/02_DataModel_Schema.md` · No mandatory map widgets · No dispatch optimization UI*
