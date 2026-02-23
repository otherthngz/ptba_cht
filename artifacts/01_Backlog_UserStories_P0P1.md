# Backlog — User Stories P0 / P1 (PTBA CHT Web Portal POC)

> Source of truth: `/docs/01_PRD_Web_Portal.md`, `/docs/02_Metrics_Definitions.md`, `/docs/04_Master_Data_Template.md`, `/docs/05_Integration_Mapping_PTBA.md`, `/docs/06_UAT_Test_Scenarios.md`, `/docs/09_Scope_Guardrails.md`

**Legend**
- **P0** — must-have for POC acceptance.
- **P1** — nice-to-have; can be deferred without blocking POC sign-off.

---

## P0 Stories

---

### Module A — Live Fleet Board

#### US-P0-001 · View Active Fleet
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want to see all active units in a single board showing unit ID, type, ownership, last activity, last update, and current assignment, so that I can monitor fleet status at a glance.

**Acceptance Criteria**
- Board lists every unit where `is_active = true` (source: `mt_unit`).
- Each row displays: `unit_id`, `unit_type`, `ownership` (OWN / RENTAL), last activity label, last update timestamp, current assignment destination (or "—" if none).
- Board loads within 5 s and auto-refreshes on a configurable interval (default 10–30 s).

**Data Dependencies**
- `mt_unit` master data (unit_id, unit_type, ownership, is_active).
- Latest activity event per unit (event with timestamp, activity label).
- Current active assignment record (assignment entity linked to unit).

**Audit & DQ Notes**
- No direct audit action on this screen; stale data feeds into Data Quality (see US-P0-003).

---

#### US-P0-002 · Filter & Search Fleet Board
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want to filter the fleet board by unit type, ownership, assignment destination, and connectivity status, and search by unit ID, so that I can quickly find units of interest.

**Acceptance Criteria**
- Filter controls for: unit type (multi-select), ownership (OWN / RENTAL), destination (from `mt_location` where `location_role = DUMPING`), data status (OK / STALE / NO DATA).
- Free-text search on `unit_id` / `unit_name`.
- Filters apply client-side or via API; results update without full page reload.

**Data Dependencies**
- `mt_unit`, `mt_location`, latest event timestamp, assignment records.

---

#### US-P0-003 · Stale Unit Indicator
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want units with no updates beyond a configurable threshold to be visually marked as STALE, so that I know which units may have connectivity or reporting issues.

**Acceptance Criteria**
- If `now − last_update_ts > STALE_THRESHOLD_MIN` → badge = `STALE`.
- If unit has never reported → badge = `NO DATA`.
- Otherwise → badge = `OK`.
- `STALE_THRESHOLD_MIN` is configurable (default: 15 min — Assumption (POC)).
- Each stale unit automatically generates a `STALE_UPDATE` anomaly visible on the Data Quality page.

**Data Dependencies**
- Last event timestamp per unit.
- `STALE_THRESHOLD_MIN` config parameter.

**Audit & DQ Notes**
- Anomaly rule: `STALE_UPDATE` created/updated automatically. No manual audit action here.

---

#### US-P0-004 · Unit Drill-Down (Shift Timeline)
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want to click a unit row and see a timeline of events for the current shift, so that I can understand what the unit has been doing.

**Acceptance Criteria**
- Opens in a slideover / modal panel (no page navigation).
- Shows chronological list of events within the current shift for that unit (activity label, timestamp, location if available).
- If no events exist, display an empty-state message.

**Data Dependencies**
- Events for `unit_id` within current shift window (`mt_shift` start/end).

---

### Module B — Dispatch (Simple Assignment Tracking)

#### US-P0-005 · Create Assignment
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want to assign a unit to a dumping destination (and optionally a loading location), so that the fleet knows where to go next.

**Acceptance Criteria**
- Form fields: unit (select from active units), destination/dumping location (required, from `mt_location` with `location_role = DUMPING`), loading location (optional, `location_role = LOADING`), notes (free text).
- On save: assignment record created with status = `ASSIGNED`.
- Fleet Board row for that unit immediately reflects the new assignment.
- Audit log entry created: action = `ASSIGNMENT_CREATED`, actor, timestamp, assignment details.

**Data Dependencies**
- `mt_unit` (active), `mt_location` (active, role).
- Assignment entity (id, unit_id, loading_location_id, dumping_location_id, status, notes, created_by, created_at).

**Audit & DQ Notes**
- Audit trail mandatory: who created, when, full assignment payload.

---

#### US-P0-006 · Update Assignment Status & Notes
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want to update an assignment's status (ASSIGNED → IN_PROGRESS → COMPLETED) and edit notes, so that the board reflects real-time progress.

**Acceptance Criteria**
- Status transitions allowed: `ASSIGNED → IN_PROGRESS → COMPLETED`. No backward transitions in POC (Assumption (POC)).
- Notes editable at any status.
- Each change produces an audit log entry with before/after values.
- Auto-transition from event data is supported if applicable (e.g., dump event → `COMPLETED`).

**Data Dependencies**
- Assignment entity, incoming activity events (optional auto-transition).

**Audit & DQ Notes**
- Every status change and notes edit logged: actor, timestamp, before/after, reason (reason optional for status; required for notes edit — Assumption (POC)).

---

#### US-P0-007 · No Optimization Guard
**Persona:** (System constraint)
**Story:** The system must NOT suggest optimized destinations, auto-reorder units, or provide queue/route recommendations.

**Acceptance Criteria**
- No "recommended destination" or "suggested unit" UI element exists.
- No algorithmic balancing or shortest-path logic.
- Verified by UAT scenario B3 non-goal check.

---

### Module C — Production Dashboard

#### US-P0-008 · View Production KPIs (Ritase + Tonnage Buckets)
**Persona:** Supervisor, Dispatcher / CCR
**Story:** As a Supervisor, I want to see total ritase (trip count) and total tonnage broken down by CONFIRMED, PENDING, and MANUAL on the production dashboard, so that I can assess daily/shift output honestly.

**Acceptance Criteria**
- KPI cards display: total ritase, tonnage CONFIRMED, tonnage PENDING (count of trips + note that value may be null), tonnage MANUAL.
- Overall total tonnage = CONFIRMED + MANUAL (PENDING excluded from total since value is null/unknown).
- Tonnage Coverage metric displayed: `X of Y trips have tonnage` (ref: `02_Metrics_Definitions.md` §1.3).
- Filters: date range, shift (from `mt_shift`), loading location, dumping location.
- Trips flagged as duplicates (`TRIP_DUPLICATE_SUSPECTED`) excluded from aggregate counts until resolved (ref: `02_Metrics_Definitions.md` §1.1).

**Data Dependencies**
- Trip records with: `unit_id`, `loading_location_id`, `dumping_location_id`, timestamps, `tonnage_status`, `tonnage_value`, `tonnage_source_system`.
- `mt_shift`, `mt_location`.

**Audit & DQ Notes**
- No direct edit on this view, but links to trip detail for audit history.

---

#### US-P0-009 · Trip List with Tonnage State
**Persona:** Supervisor, Dispatcher / CCR
**Story:** As a Supervisor, I want to see a trip list table where each row shows the trip's tonnage status (CONFIRMED / PENDING / MANUAL) and source, so that I can identify which trips still need confirmation.

**Acceptance Criteria**
- Table columns: trip ID, unit, loading location, dumping location, timestamp(s), tonnage value, `tonnage_status` badge, `tonnage_source_system` (for CONFIRMED), entered_by (for MANUAL).
- Sortable by timestamp, filterable by `tonnage_status`.
- Row click opens trip detail with tonnage history and audit trail.

**Data Dependencies**
- Trip entity, tonnage records, audit log entries.

---

#### US-P0-010 · Manual Tonnage Entry (Fallback)
**Persona:** Checker
**Story:** As a Checker, I want to enter manual tonnage for a trip when the weighbridge is down, providing a mandatory reason, so that production data is not blocked by equipment failure.

**Acceptance Criteria**
- Checker can select a PENDING trip and enter: `manual_tonnage` (number, required), `manual_reason` (text, required), optional `attachment_ref`.
- On save: trip `tonnage_status` becomes `MANUAL`.
- Manual tonnage appears in Production Dashboard under the MANUAL bucket.
- Audit log entry created: action = `MANUAL_TONNAGE_ENTERED`, actor = checker, before (PENDING / null), after (MANUAL / value), reason.

**Data Dependencies**
- Trip entity, manual tonnage payload (ref: `05_Integration_Mapping_PTBA.md` §2.2).

**Audit & DQ Notes**
- Audit trail mandatory: who, when, tonnage value, reason, before/after state.

---

#### US-P0-011 · Confirmed Tonnage Ingestion
**Persona:** (System / Integration)
**Story:** As the system, I want to ingest confirmed tonnage from PTBA sources (weighbridge / RFID / production app) and match it to existing trips, so that tonnage status transitions from PENDING → CONFIRMED.

**Acceptance Criteria**
- Inbound payload accepted with fields per `05_Integration_Mapping_PTBA.md` §2.1 (`external_ticket_id`, `unit_id`, `ts`, `net_tonnage`, `source_system`).
- Matching strategy applied in priority order: (1) direct ticket match, (2) unit + time window (±60 min configurable), (3) unit + shift + location.
- On match: `tonnage_status = CONFIRMED`, `tonnage_value = net_tonnage`, `tonnage_source_system` stored.
- Raw inbound payload stored for audit.
- Idempotency on `external_ticket_id` (duplicate ingestion does not create duplicate records).

**Data Dependencies**
- Confirmed tonnage payload, trip entity, matching config (time window).

**Audit & DQ Notes**
- Raw payload stored for traceability.
- If no match found → anomaly `TONNAGE_MULTI_MATCH` or trip stays unmatched (logged).

---

#### US-P0-012 · Reconciliation (MANUAL → CONFIRMED)
**Persona:** (System / Integration)
**Story:** As the system, when confirmed tonnage arrives for a trip that already has MANUAL tonnage, I want to switch the reporting value to CONFIRMED while preserving the MANUAL record in audit history, so that data integrity is maintained and the manual fallback is never lost.

**Acceptance Criteria**
- Trip `tonnage_status` becomes `CONFIRMED`; `tonnage_value` = confirmed value.
- Previous MANUAL entry remains in audit/history (not deleted, not overwritten).
- Production Dashboard aggregation moves the trip from MANUAL bucket to CONFIRMED bucket.
- Optional DQ flag: `MANUAL_OVERRIDDEN_BY_CONFIRMED` (informational).

**Data Dependencies**
- Trip entity, tonnage history records.

**Audit & DQ Notes**
- Audit log: `TONNAGE_RECONCILED`, before (MANUAL / value), after (CONFIRMED / value), source_system.

---

#### US-P0-013 · Production Breakdown by Dimension
**Persona:** Supervisor
**Story:** As a Supervisor, I want to break down ritase and tonnage by loading location, dumping location, unit type, and ownership, so that I can see production distribution.

**Acceptance Criteria**
- Aggregation table/cards with selectable breakdown dimension.
- Each cell shows trip count + tonnage (split by CONFIRMED / MANUAL; PENDING count only).
- Filters: date range, shift.

**Data Dependencies**
- Trip records, `mt_unit` (type, ownership), `mt_location`.

---

### Module D — Availability / PA–UA

#### US-P0-014 · Availability Roll-Up per Unit per Shift
**Persona:** Supervisor
**Story:** As a Supervisor, I want to see a table of PA and UA per unit per shift, with underlying time buckets (running, standby, delay, breakdown), so that I can assess equipment performance.

**Acceptance Criteria**
- Table: one row per unit per shift. Columns: unit, running time, standby, delay, breakdown, PA (%), UA (%), completeness badge.
- PA formula: `(scheduled_time − breakdown_time) / scheduled_time` (ref: `02_Metrics_Definitions.md` §2.3).
- UA formula: `productive_time / (scheduled_time − breakdown_time)` (ref: §2.4).
- Filters: date, shift, unit type.

**Data Dependencies**
- Time-bucket records per unit per shift (derived from events or manual input).
- `mt_shift` (scheduled_time = `shift_end − shift_start`).

**Audit & DQ Notes**
- Manual time-bucket adjustments should produce audit trail entries (who, when, before/after, reason).

---

#### US-P0-015 · Data Completeness Indicator (Availability)
**Persona:** Supervisor
**Story:** As a Supervisor, I want a completeness indicator per unit per shift showing what proportion of scheduled time is covered by event data, so that I know the confidence level of PA/UA numbers.

**Acceptance Criteria**
- `availability_completeness = time_covered_by_events / scheduled_time` (ref: §2.5).
- Display as badge: ≥ 90% = high (green), 60–89% = medium (yellow), < 60% = low (red).
- Low completeness triggers anomaly `AVAILABILITY_LOW_COMPLETENESS` on the Data Quality page.

**Data Dependencies**
- Event timeline per unit per shift, `mt_shift`.

**Audit & DQ Notes**
- Anomaly auto-created; no manual action required.

---

### Module E — Data Quality & Audit

#### US-P0-016 · Anomaly List Page
**Persona:** Dispatcher / CCR, Supervisor
**Story:** As a Dispatcher, I want to see a list of data issues/anomalies detected by the system, filterable by type, severity, date, and unit, so that I can investigate and resolve them.

**Acceptance Criteria**
- Table columns: issue type, severity, unit, trip (if applicable), created time, status badge.
- Supported issue types (minimum): `STALE_UPDATE`, `TONNAGE_PENDING_TOO_LONG`, `TONNAGE_OUTLIER`, `TRIP_DUPLICATE_SUSPECTED`, `TONNAGE_MULTI_MATCH`, `TONNAGE_DUPLICATE_TICKET`, `AVAILABILITY_LOW_COMPLETENESS`.
- Status workflow: `OPEN → IN_REVIEW → RESOLVED`.
- Filters: type (multi-select), severity, date range, unit.
- Row click opens issue detail: rule that triggered, threshold, related entities, actions taken.

**Data Dependencies**
- Anomaly/issue records with: type, severity, unit_id, trip_id, created_at, status, detail context.

**Audit & DQ Notes**
- Status changes on issues are themselves audited (actor, timestamp, before/after status).

---

#### US-P0-017 · Anomaly Rules (Auto-Detection)
**Persona:** (System)
**Story:** As the system, I want to automatically detect and flag data anomalies based on predefined rules, so that data quality issues surface without manual scanning.

**Acceptance Criteria**
- Rules implemented (minimum set):

| Rule ID | Trigger | Severity (default) |
|---|---|---|
| `STALE_UPDATE` | `now − last_update_ts > STALE_THRESHOLD_MIN` | Medium |
| `TONNAGE_PENDING_TOO_LONG` | trip PENDING > configurable hours (default 4 h — Assumption (POC)) | High |
| `TONNAGE_OUTLIER` | tonnage outside expected range by `capacity_ton` (e.g., < 10% or > 120% — Assumption (POC)) | High |
| `TRIP_DUPLICATE_SUSPECTED` | two trips for same unit overlap or share timestamps within window | High |
| `TONNAGE_MULTI_MATCH` | one confirmed ticket matches multiple trips | High |
| `TONNAGE_DUPLICATE_TICKET` | same `external_ticket_id` ingested twice | Medium |
| `AVAILABILITY_LOW_COMPLETENESS` | completeness < 60% | Medium |

- Each anomaly record stores: rule ID, threshold used, entity references, raw context.

**Data Dependencies**
- Trip records, tonnage records, event timestamps, `mt_unit.capacity_ton`, config thresholds.

---

#### US-P0-018 · Audit Log Page
**Persona:** Supervisor, Admin
**Story:** As a Supervisor, I want to view a complete audit log of all manual edits and corrections (manual tonnage, assignment changes, trip corrections, issue resolutions), so that I can trace who changed what, when, and why.

**Acceptance Criteria**
- Table columns: action type, entity (trip / assignment / issue / master data), actor, timestamp, summary (before → after).
- Drill-down row shows full: before/after values, reason.
- Filterable by: action type, actor, date range, entity type.
- Covers at minimum: `MANUAL_TONNAGE_ENTERED`, `TONNAGE_RECONCILED`, `ASSIGNMENT_CREATED`, `ASSIGNMENT_UPDATED`, `ISSUE_STATUS_CHANGED`, `TRIP_CORRECTED`.

**Data Dependencies**
- Audit log records: action, entity_type, entity_id, actor, timestamp, before_value, after_value, reason.

---

#### US-P0-019 · Resolve Anomaly
**Persona:** Dispatcher / CCR, Supervisor
**Story:** As a Dispatcher, I want to change an anomaly's status (OPEN → IN_REVIEW → RESOLVED) with a note, so that the team can track issue resolution.

**Acceptance Criteria**
- Status transition buttons / dropdown on issue detail.
- Mandatory note/reason when resolving.
- Audit log entry for each status change.

**Data Dependencies**
- Anomaly/issue entity, audit log.

**Audit & DQ Notes**
- Every resolution recorded: actor, timestamp, previous status, new status, note.

---

### Module F — Master Data

#### US-P0-020 · Manage Units
**Persona:** Admin
**Story:** As an Admin, I want to create, edit, and deactivate units (with type, ownership, capacity, vendor), so that the fleet board and all downstream modules reflect the correct fleet.

**Acceptance Criteria**
- CRUD form with fields per `04_Master_Data_Template.md` §1: `unit_id`, `unit_name`, `unit_type`, `ownership`, `vendor_name`, `capacity_ton`, `is_active`, `notes`.
- `unit_type` enum: `DUMP_TRUCK`, `LOADER`, `SUPPORT` (extendable).
- `ownership` enum: `OWN`, `RENTAL`.
- Deactivation (set `is_active = false`) removes unit from Fleet Board but retains historical data.

**Data Dependencies**
- `mt_unit` table.

**Audit & DQ Notes**
- Master data changes logged in audit trail (recommended — see US-P1-005).

---

#### US-P0-021 · Manage Locations
**Persona:** Admin
**Story:** As an Admin, I want to manage loading and dumping locations, so that dispatch and production use consistent, up-to-date location references.

**Acceptance Criteria**
- CRUD form with fields per `04_Master_Data_Template.md` §2: `location_id`, `location_name`, `location_role` (LOADING / DUMPING / OTHER), `is_active`, `sort_order`, `notes`.
- Deactivated locations excluded from assignment dropdowns but retained in historical records.

**Data Dependencies**
- `mt_location` table.

---

#### US-P0-022 · Manage Shifts
**Persona:** Admin
**Story:** As an Admin, I want to define shifts (start time, end time, timezone), so that all time-windowed aggregations (production, availability) use consistent boundaries.

**Acceptance Criteria**
- CRUD form per `04_Master_Data_Template.md` §3: `shift_id`, `shift_name`, `start_time`, `end_time`, `timezone`, `is_active`.
- Active shifts used as filter options across Production and Availability pages.

**Data Dependencies**
- `mt_shift` table.

---

#### US-P0-023 · Manage Users & Roles
**Persona:** Admin
**Story:** As an Admin, I want to create and deactivate portal users and assign roles (ADMIN, DISPATCHER, CHECKER, SUPERVISOR), so that access control is enforced.

**Acceptance Criteria**
- Form: `user_id`, `full_name`, `role` (enum), `is_active`.
- Role determines visible menus and allowed actions per RBAC definition in PRD §3.2.
- Deactivated users cannot log in.

**Data Dependencies**
- `mt_user`, `mt_role` tables.

---

### Module G — Export

#### US-P0-024 · Export Trips CSV
**Persona:** Supervisor, Admin
**Story:** As a Supervisor, I want to export trip-level data for a selected date range as CSV, including `tonnage_status` and `tonnage_source_system`, so that I can share production data externally.

**Acceptance Criteria**
- CSV contains at minimum: trip ID, unit, loading location, dumping location, timestamp(s), tonnage value, `tonnage_status`, `tonnage_source_system`, `entered_by` (for MANUAL).
- Date range and shift filters applied before export.
- File downloads immediately or is queued with notification.

**Data Dependencies**
- Trip records with tonnage data.

---

#### US-P0-025 · Export Production Aggregate CSV
**Persona:** Supervisor, Admin
**Story:** As a Supervisor, I want to export daily/shift production aggregates (ritase + tonnage by bucket) as CSV, so that management has summary reports.

**Acceptance Criteria**
- CSV columns: date, shift, total ritase, tonnage CONFIRMED, tonnage MANUAL, tonnage PENDING count, tonnage coverage %.
- Filterable by date range.

**Data Dependencies**
- Aggregated production data.

---

#### US-P0-026 · Export Availability CSV
**Persona:** Supervisor, Admin
**Story:** As a Supervisor, I want to export availability data (unit × shift with PA, UA, completeness) as CSV.

**Acceptance Criteria**
- CSV columns: date, shift, unit, running, standby, delay, breakdown, PA %, UA %, completeness %.
- Filterable by date range, unit.

**Data Dependencies**
- Availability time-bucket records.

---

#### US-P0-027 · Export Anomalies & Audit Log CSV
**Persona:** Supervisor, Admin
**Story:** As a Supervisor, I want to export the anomaly list and audit log as CSV, so that data quality reviews can be conducted offline.

**Acceptance Criteria**
- **Anomalies CSV**: issue type, severity, unit, trip, status, created_at, resolved_at.
- **Audit CSV**: action, entity_type, entity_id, actor, timestamp, before_value, after_value, reason.
- Date range filter.

**Data Dependencies**
- Anomaly records, audit log records.

**Audit & DQ Notes**
- Export itself does not need to be audited in POC (Assumption (POC)).

---

## P1 Stories (Nice-to-Have — POC Optional)

---

#### US-P1-001 · Bulk Tags / Notes for Units
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want to bulk-tag or add notes to multiple units at once (e.g., "prioritas jetty"), so that I can group fleet attention quickly.

**Acceptance Criteria**
- Multi-select units on Fleet Board → apply tag / note.
- Tags visible on Fleet Board as secondary badges.

---

#### US-P1-002 · Filter State Persistence (URL)
**Persona:** Dispatcher / CCR
**Story:** As a Dispatcher, I want filters and search state to persist in the URL, so that I can bookmark or share a filtered view.

**Acceptance Criteria**
- Query params reflect active filters.
- Page reload with query params restores filter state.

---

#### US-P1-003 · XLSX Export Option
**Persona:** Supervisor, Admin
**Story:** As a Supervisor, I want to export data as XLSX in addition to CSV, so that data is ready for Excel-based workflows.

**Acceptance Criteria**
- XLSX option available on all export screens alongside CSV.

---

#### US-P1-004 · Manage Delay & Breakdown Categories
**Persona:** Admin
**Story:** As an Admin, I want to manage delay and breakdown categories (e.g., "Queue at loading", "Tire issue"), so that availability data uses standardized labels.

**Acceptance Criteria**
- CRUD per `04_Master_Data_Template.md` §5: `mt_delay_category`, `mt_breakdown_category`.
- Categories selectable when manual time-bucket entries are made.

---

#### US-P1-005 · Master Data Change Audit
**Persona:** Admin, Supervisor
**Story:** As a Supervisor, I want master data changes (unit deactivation, location edits, etc.) to appear in the audit log, so that configuration drift is traceable.

**Acceptance Criteria**
- Audit log entry for every master data create / update / deactivate.
- Includes actor, timestamp, entity, before/after.

---

#### US-P1-006 · Supervisor Approval for Corrections
**Persona:** Supervisor
**Story:** As a Supervisor, I want to optionally approve certain trip corrections before they take effect, so that high-impact edits have a review gate.

**Acceptance Criteria**
- Correction submitted by Checker/Dispatcher → status `PENDING_APPROVAL`.
- Supervisor can approve or reject with note.
- Audit trail records submit + approval/rejection.

> Assumption (POC): this is optional because the PRD states workflow is simple; full governance is out of scope.

---

#### US-P1-007 · MANUAL_OVERRIDDEN_BY_CONFIRMED Anomaly Flag
**Persona:** Supervisor
**Story:** As a Supervisor, I want an informational anomaly flag whenever a MANUAL tonnage entry is overridden by a late CONFIRMED value, so that I can review reconciliation events.

**Acceptance Criteria**
- Anomaly type `MANUAL_OVERRIDDEN_BY_CONFIRMED` created automatically on reconciliation.
- Severity: Low / Informational.
- Links to trip detail and audit history.

---

## Backlog Summary

| Module | P0 Stories | P1 Stories | Total |
|---|---:|---:|---:|
| A — Live Fleet Board | 4 | 2 | 6 |
| B — Dispatch (Simple Assignment) | 3 | 0 | 3 |
| C — Production Dashboard | 6 | 1 | 7 |
| D — Availability / PA–UA | 2 | 1 | 3 |
| E — Data Quality & Audit | 4 | 1 | 5 |
| F — Master Data | 4 | 1 | 5 |
| G — Export | 4 | 1 | 5 |
| **Total** | **27** | **7** | **34** |

---

*Document generated: 2026-02-19 · Aligned with `/docs` v1 · No mandatory map tracking · No dispatch optimization*
