# UAT Plan (Refined) — PTBA CHT Web Portal POC

> Base: `/docs/06_UAT_Test_Scenarios.md`
> Terminology aligned with: `/docs/02_Metrics_Definitions.md`, `/docs/05_Integration_Mapping_PTBA.md`, `/artifacts/02_DataModel_Schema.md`

**Conventions**
- **TC** = Test Case. IDs prefixed by module letter.
- **AC** = Acceptance Criteria (pass/fail).
- Audit expectations describe what `audit_log` entries must exist after the test.
- DQ expectations describe what `anomaly_issue` records should (or should not) exist.
- All tests assume a seeded environment with master data pre-loaded (see §9 Test Data Setup).
- No test involves mandatory map tracking or dispatch optimization.

---

## Module A — Live Fleet Board

### TC-A01 · View Active Fleet

**Objective:** Verify the fleet board shows all active units with correct columns and real-time-ish data.

**Preconditions**
- `mt_unit`: at least 5 units with `is_active = true`, mixed `unit_type` (DUMP_TRUCK, LOADER) and `ownership` (OWN, RENTAL).
- At least 2 units have recent activity events (within last 5 min).
- At least 1 unit has an active assignment.

**Steps**
1. Login as **Dispatcher**.
2. Navigate to `/fleet`.

**Expected Results**
- All active units displayed in table.
- Each row shows: unit ID, unit name, type, ownership, last activity label, last update timestamp, current assignment destination (or "—").
- Unit with assignment shows destination badge.

**Audit:** None (read-only).
**DQ:** None directly; stale detection covered in TC-A02.

---

### TC-A02 · Stale Unit Detection

**Objective:** Verify units with no updates beyond threshold are flagged STALE.

**Preconditions**
- Unit `DT-099` has `last_update_ts` older than `STALE_THRESHOLD_MIN` (e.g., 20 min ago with threshold at 15 min).
- Unit `DT-100` has never sent any event.

**Steps**
1. Open Fleet Board.
2. Observe unit rows for DT-099 and DT-100.

**Expected Results**
- DT-099: data status badge = `STALE`, last update timestamp visible.
- DT-100: data status badge = `NO_DATA`.
- Normal units: badge = `OK`.

**Audit:** None.
**DQ:** `STALE_UPDATE` anomaly exists for DT-099 in the Data Quality issues list.

---

### TC-A03 · Filter & Search

**Objective:** Verify fleet board filters work correctly.

**Steps**
1. Filter by `unit_type = DUMP_TRUCK`.
2. Verify only dump trucks shown.
3. Add filter `ownership = RENTAL`.
4. Verify only rental dump trucks shown.
5. Clear filters. Search `DT-043`.
6. Verify search narrows results.

**Expected Results**
- Filters apply cumulatively; table updates without full page reload.
- Search matches on `unit_id` or `unit_name`.

**Audit:** None.
**DQ:** None.

---

### TC-A04 · Unit Drill-Down Timeline

**Objective:** Verify clicking a unit row opens a shift timeline.

**Preconditions**
- Unit `DT-043` has at least 3 activity events in current shift (e.g., LOADING → HAULING → DUMPING).

**Steps**
1. Click row for DT-043 on Fleet Board.

**Expected Results**
- Slideover opens showing chronological events: event type, start/end timestamps, location (if available), source.
- Events are for the current shift only.

**Audit:** None.
**DQ:** None.

---

## Module B — Dispatch (Simple Assignment Tracking)

### TC-B01 · Create Assignment

**Objective:** Verify a Dispatcher can assign a unit to a destination and the audit trail is created.

**Preconditions**
- Unit `DT-001` is active and has no current active assignment.
- Location `DUMP-JTY-01` ("Jetty Stockpile 1") is active with role = DUMPING.

**Steps**
1. Login as **Dispatcher**.
2. Navigate to `/dispatch`.
3. Select unit `DT-001`.
4. Select destination `DUMP-JTY-01`.
5. Enter notes: "Shift A priority".
6. Click "Create Assignment".

**Expected Results**
- Assignment created with status = `ASSIGNED`.
- Assignment appears in the active assignments table.
- Fleet Board row for DT-001 shows destination "Jetty Stockpile 1".
- Success toast displayed.

**Audit:** Log entry: `action = ASSIGNMENT_CREATED`, actor = Dispatcher user, `after_value` contains unit, destination, notes.
**DQ:** None.

---

### TC-B02 · Update Assignment Status & Notes

**Objective:** Verify status transitions are logged with before/after.

**Preconditions**
- Assignment from TC-B01 exists with status = `ASSIGNED`.

**Steps**
1. On the assignments table, click row action → "Mark In Progress".
2. Confirm status changes to `IN_PROGRESS`.
3. Click row action → "Edit Notes".
4. Change notes to "Delayed — queue at loading".
5. Save.

**Expected Results**
- Status updates to `IN_PROGRESS`.
- Notes updated.

**Audit:**
- Entry 1: `ASSIGNMENT_UPDATED`, before `{status: "ASSIGNED"}`, after `{status: "IN_PROGRESS"}`.
- Entry 2: `ASSIGNMENT_UPDATED`, before `{notes: "Shift A priority"}`, after `{notes: "Delayed — queue at loading"}`.

**DQ:** None.

---

### TC-B03 · Complete Assignment

**Steps**
1. Click row action → "Mark Completed".

**Expected Results**
- Status = `COMPLETED`.
- Assignment moves to completed section or is visually de-emphasized.

**Audit:** Entry: `ASSIGNMENT_UPDATED`, before `{status: "IN_PROGRESS"}`, after `{status: "COMPLETED"}`.
**DQ:** None.

**Non-goal check:** At no point did the system suggest an optimized destination, reorder units, or show queue recommendations.

---

### TC-B04 · Duplicate Active Assignment Prevention

**Objective:** Verify the system prevents creating a second active assignment for the same unit.

**Preconditions**
- Unit `DT-001` already has an active (non-COMPLETED) assignment.

**Steps**
1. Attempt to create a new assignment for `DT-001`.

**Expected Results**
- Error: "This unit already has an active assignment." (or equivalent).
- No new assignment created.

**Audit:** None (action rejected).
**DQ:** None.

---

## Module C — Production (Ritase + Tonnage)

### TC-C01 · Trip Appears as PENDING

**Objective:** Verify a trip without confirmed tonnage shows as PENDING.

**Preconditions**
- Trip `TRP-001` exists for unit `DT-043`, shift A, dumping at `DUMP-JTY-01`.
- No confirmed tonnage has been ingested for this trip.
- No manual tonnage entered.

**Steps**
1. Login as **Supervisor**.
2. Navigate to `/production`.
3. Check trip list.

**Expected Results**
- Trip `TRP-001` row: `tonnage_status` badge = `PENDING` (gray outline), tonnage value = "—".
- KPI cards: ritase count includes this trip; pending count = at least 1.
- Tonnage total does NOT include a value for this trip.

**Audit:** None (trip creation is system-generated).
**DQ:** If trip has been PENDING > `PENDING_THRESHOLD_HOURS` (4 h), anomaly `TONNAGE_PENDING_TOO_LONG` should exist.

---

### TC-C02 · Confirmed Tonnage Ingested (PENDING → CONFIRMED) ⭐

**Objective:** Verify confirmed tonnage from PTBA matches a pending trip and transitions it.

**Preconditions**
- Trip `TRP-001` is PENDING (from TC-C01).
- Confirmed tonnage payload ready: `external_ticket_id = "WB-2026-88421"`, `unit_id = "DT-043"`, `ts` within matching window, `net_tonnage = 32.5`, `source_system = "PTBA_WB"`.

**Steps**
1. Ingest confirmed tonnage payload (via integration endpoint or simulated import).
2. Refresh Production dashboard.

**Expected Results**
- Trip `TRP-001` row: `tonnage_status` = `CONFIRMED` (green solid), `tonnage_value` = 32.5, `tonnage_source_system` = `PTBA_WB`.
- KPI cards: confirmed tonnage increases by 32.5; pending count decreases by 1.
- Trip detail slideover shows `tonnage_record` with `record_type = CONFIRMED`, `is_active = true`.

**Audit:** Raw inbound payload stored in `tonnage_record.raw_payload`. Audit entry: `action = TONNAGE_CONFIRMED` (system), entity = trip.
**DQ:** If previously flagged `TONNAGE_PENDING_TOO_LONG`, anomaly should remain (manual resolution still needed or auto-resolve — Assumption (POC): manual).

---

### TC-C03 · Weighbridge Breakdown — Manual Tonnage Entry ⭐

**Objective:** Verify a Checker can enter manual tonnage with a mandatory reason.

**Preconditions**
- Trip `TRP-002` for unit `DT-010` is PENDING.
- User logged in as **Checker**.

**Steps**
1. Navigate to `/production`.
2. Click trip `TRP-002` to open detail slideover.
3. Click "Enter Manual Tonnage" (visible because trip is PENDING and user is Checker).
4. Enter `manual_tonnage = 31.0`.
5. Leave `manual_reason` blank → attempt submit.
6. Observe validation error.
7. Enter `manual_reason = "Weighbridge down since 06:45"`.
8. Submit.

**Expected Results**
- Step 5–6: Validation error "Reason is required."
- Step 8: Trip status becomes `MANUAL` (amber warning badge).
- Dashboard: manual tonnage bucket increases by 31.0. Ritase unchanged.
- Trip detail shows `tonnage_record`: type = MANUAL, value = 31.0, entered_by = Checker, is_active = true.

**Audit:** Entry: `action = MANUAL_TONNAGE_ENTERED`, actor = Checker, before `{tonnage_status: "PENDING", tonnage_value: null}`, after `{tonnage_status: "MANUAL", tonnage_value: 31.0}`, reason = "Weighbridge down since 06:45".
**DQ:** If 31.0 is outside `capacity_ton × [0.10, 1.20]` band for DT-010, anomaly `TONNAGE_OUTLIER` should be created.

---

### TC-C04 · Reconciliation — Confirmed Overrides Manual ⭐

**Objective:** Verify that late confirmed tonnage supersedes manual but manual remains in audit history.

**Preconditions**
- Trip `TRP-002` is currently `MANUAL` with value 31.0 (from TC-C03).
- Confirmed tonnage arrives: `external_ticket_id = "WB-2026-88430"`, `unit_id = "DT-010"`, `net_tonnage = 32.8`, `source_system = "PTBA_WB"`.

**Steps**
1. Ingest confirmed tonnage payload.
2. Refresh Production dashboard.
3. Open trip `TRP-002` detail.

**Expected Results**
- Trip status = `CONFIRMED`, tonnage_value = 32.8.
- Dashboard: trip moves from MANUAL bucket to CONFIRMED bucket.
- Trip detail — tonnage history shows **both** records:
  - CONFIRMED: 32.8, is_active = true (current).
  - MANUAL: 31.0, is_active = false (superseded, visually dimmed but present).
- Manual record is **NOT deleted**.

**Audit:**
- Entry: `action = TONNAGE_RECONCILED`, before `{tonnage_status: "MANUAL", tonnage_value: 31.0}`, after `{tonnage_status: "CONFIRMED", tonnage_value: 32.8}`.
**DQ:** Optional flag `MANUAL_OVERRIDDEN_BY_CONFIRMED` (severity LOW) may exist. Not blocking.

---

### TC-C05 · Tonnage Outlier Detection ⭐

**Objective:** Verify tonnage outside the expected range triggers an anomaly.

**Preconditions**
- Unit `DT-043` has `capacity_ton = 35`.
- Outlier band: 10%–120% → valid range [3.5, 42.0].
- A confirmed tonnage of `55.0` is ingested for a trip of DT-043.

**Steps**
1. Ingest confirmed tonnage with `net_tonnage = 55.0`.
2. Navigate to `/data-quality`.

**Expected Results**
- Anomaly created: type = `TONNAGE_OUTLIER`, severity = HIGH, status = OPEN.
- Detail shows: unit = DT-043, tonnage = 55.0, expected band = [3.5, 42.0].
- Trip is still marked CONFIRMED (outlier flag does not block confirmation).

**Audit:** Tonnage ingestion audit entry exists.
**DQ:** `TONNAGE_OUTLIER` issue present, linked to trip and unit.

---

### TC-C06 · Duplicate Trip Detection

**Objective:** Verify overlapping trips for the same unit are flagged.

**Preconditions**
- Two trips for `DT-043` within the same shift have overlapping timestamp windows (e.g., both `dump_done_ts` within 10 min).

**Steps**
1. Navigate to `/production`.
2. Observe trip list.
3. Navigate to `/data-quality`.

**Expected Results**
- Anomaly: `TRIP_DUPLICATE_SUSPECTED`, severity = HIGH, status = OPEN.
- Both trips referenced in issue detail.
- Duplicate-flagged trip(s) dimmed in production table; excluded from aggregate counts.

**Audit:** None (system-generated).
**DQ:** `TRIP_DUPLICATE_SUSPECTED` issue exists.

---

### TC-C07 · Multi-Match Tonnage

**Objective:** Verify that one confirmed ticket matching multiple trips is flagged.

**Preconditions**
- Two PENDING trips exist for `DT-043` within the matching time window.
- One confirmed tonnage ticket arrives that could match either.

**Steps**
1. Ingest confirmed tonnage.
2. Navigate to `/data-quality`.

**Expected Results**
- Anomaly: `TONNAGE_MULTI_MATCH`, severity = HIGH.
- Best match is used for confirmation; the non-matched trip remains PENDING.
- Issue detail shows both candidate trips.

**Audit:** Tonnage matched to one trip with audit entry.
**DQ:** `TONNAGE_MULTI_MATCH` issue for review.

---

### TC-C08 · Duplicate Ticket Idempotency

**Objective:** Verify ingesting the same `external_ticket_id` twice does not create duplicate records.

**Preconditions**
- Ticket `WB-2026-88421` already matched to trip `TRP-001` from TC-C02.

**Steps**
1. Ingest same payload with `external_ticket_id = "WB-2026-88421"` again.

**Expected Results**
- No new `tonnage_record` created.
- Trip remains unchanged.
- Response status: `DUPLICATE_IGNORED`.

**Audit:** No new audit entry.
**DQ:** Anomaly `TONNAGE_DUPLICATE_TICKET` may be raised (severity MEDIUM) if configured to flag all duplicates.

---

### TC-C09 · Production Breakdown by Dimension

**Objective:** Verify aggregation can be grouped by location, unit type, ownership.

**Steps**
1. On Production dashboard, switch to "Breakdown" tab.
2. Select group by "Dumping Location".

**Expected Results**
- Aggregation table shows: one row per dumping location with trip count, confirmed tonnage, manual tonnage, pending count.
- Totals match KPI cards.

**Audit:** None.
**DQ:** None.

---

## Module D — Availability (PA/UA)

### TC-D01 · Availability Roll-Up per Shift

**Objective:** Verify PA/UA are calculated and completeness is displayed.

**Preconditions**
- Unit `DT-043`, Shift A, date 2026-02-19.
- Event data: running = 480 min, standby = 60, delay = 30, breakdown = 40. Scheduled = 720 min.

**Steps**
1. Login as **Supervisor**.
2. Navigate to `/availability`.
3. Select date and shift.

**Expected Results**
- Row for DT-043 shows: running 480, standby 60, delay 30, breakdown 40.
- PA = (720 − 40) / 720 = **94.4%**.
- UA = 480 / (720 − 40) = **70.6%**.
- Completeness = (480 + 60 + 30 + 40) / 720 = **84.7%** → badge = `MEDIUM` (yellow).

**Audit:** None (computed values).
**DQ:** Completeness is MEDIUM (above 60%), so no `AVAILABILITY_LOW_COMPLETENESS` anomaly.

---

### TC-D02 · Low Completeness Highlight

**Preconditions**
- Unit `DT-050` has event data covering only 300 min of a 720 min shift.

**Steps**
1. View Availability page.

**Expected Results**
- Completeness = 300 / 720 = **41.7%** → badge = `LOW` (red), row highlighted.
- PA/UA values shown but with low-confidence context.

**Audit:** None.
**DQ:** Anomaly `AVAILABILITY_LOW_COMPLETENESS` exists for DT-050 in Data Quality.

---

### TC-D03 · Manual Bucket Adjustment

**Objective:** Verify Supervisor can adjust time buckets with reason and audit.

**Preconditions**
- Availability record for DT-043 from TC-D01 exists.

**Steps**
1. Click row action → "Adjust".
2. Change `running_min` from 480 to 500, `standby_min` from 60 to 40.
3. Enter reason: "Corrected based on checker log".
4. Save.

**Expected Results**
- Record updated: running = 500, standby = 40.
- PA and UA recalculated.
- `is_manual_adjusted` indicator visible on row.

**Audit:** Entry: `action = AVAILABILITY_ADJUSTED`, before `{running_min: 480, standby_min: 60}`, after `{running_min: 500, standby_min: 40}`, reason.
**DQ:** None (manual adjustment is audited, not flagged as anomaly).

---

## Module E — Data Quality & Audit

### TC-E01 · View Anomaly List

**Objective:** Verify the anomaly list displays correctly with filters.

**Preconditions**
- At least one of each type exists: `STALE_UPDATE` (MEDIUM), `TONNAGE_OUTLIER` (HIGH), `TONNAGE_PENDING_TOO_LONG` (HIGH), `TRIP_DUPLICATE_SUSPECTED` (HIGH).

**Steps**
1. Navigate to `/data-quality` → Anomalies tab.
2. Verify all issues appear.
3. Filter by severity = HIGH.
4. Verify only HIGH issues shown.
5. Filter by type = `TONNAGE_OUTLIER`.
6. Verify only outlier issues shown.

**Expected Results**
- Table displays: type, severity badge, unit, trip, created time, status badge.
- Filters apply correctly.
- Status badges: OPEN (red), IN_REVIEW (amber), RESOLVED (green).

---

### TC-E02 · Acknowledge and Resolve Issue

**Objective:** Verify the issue resolution workflow with mandatory note.

**Preconditions**
- Issue `ISS-034` (`TONNAGE_OUTLIER`) exists with status = OPEN.

**Steps**
1. Click issue row → open detail slideover.
2. Verify detail shows: rule + threshold, unit, trip, tonnage value, expected band.
3. Click "Mark In Review".
4. Verify status changes to `IN_REVIEW`.
5. Click "Resolve".
6. Attempt to resolve without note → validation error.
7. Enter note: "Verified with checker — load was double-stacked."
8. Submit.

**Expected Results**
- Status progresses: OPEN → IN_REVIEW → RESOLVED.
- Resolution note saved.

**Audit:**
- Entry 1: `ISSUE_STATUS_CHANGED`, before `{status: "OPEN"}`, after `{status: "IN_REVIEW"}`.
- Entry 2: `ISSUE_STATUS_CHANGED`, before `{status: "IN_REVIEW"}`, after `{status: "RESOLVED"}`, reason = "Verified with checker — load was double-stacked."

---

### TC-E03 · Audit Log Completeness

**Objective:** Verify the audit log aggregates all tracked actions.

**Preconditions**
- All previous test cases have been executed.

**Steps**
1. Navigate to `/data-quality` → Audit Log tab.
2. Filter by date = today.
3. Review entries.

**Expected Results**
- Contains entries for: `ASSIGNMENT_CREATED`, `ASSIGNMENT_UPDATED`, `MANUAL_TONNAGE_ENTERED`, `TONNAGE_RECONCILED`, `ISSUE_STATUS_CHANGED`, `AVAILABILITY_ADJUSTED`.
- Each entry shows: action, entity, actor, timestamp, before→after summary, reason (where applicable).
- Entries are read-only (no edit/delete actions available).

---

### TC-E04 · Audit Log Filter by Actor

**Steps**
1. Filter audit log by actor = Checker user.

**Expected Results**
- Only entries by that actor shown (e.g., manual tonnage entries).

---

## Module F — Master Data

### TC-F01 · Create Unit

**Steps**
1. Login as **Admin**.
2. Navigate to `/master-data/units`.
3. Click "+ Create".
4. Enter: unit_id = `DT-NEW`, unit_name = `DT New`, unit_type = `DUMP_TRUCK`, ownership = `RENTAL`, vendor_name = `XYZ Mining`, capacity_ton = 40.
5. Save.

**Expected Results**
- Unit appears in table with `is_active = true`.
- Unit available in Fleet Board and Dispatch dropdowns.

**Audit:** (P1 recommended) `MASTER_DATA_CHANGED`, entity = MT_UNIT, after = full unit record.
**DQ:** None.

---

### TC-F02 · Deactivate Unit

**Steps**
1. Click row action for `DT-NEW` → "Deactivate".
2. Confirm in modal.

**Expected Results**
- `is_active = false`.
- Unit no longer appears in Fleet Board.
- Unit no longer selectable in Dispatch form.
- Historical trips for this unit remain visible in Production.

**Audit:** (P1) `MASTER_DATA_CHANGED`, before `{is_active: true}`, after `{is_active: false}`.
**DQ:** None.

---

### TC-F03 · Create & Edit Location

**Steps**
1. Create location: `DUMP-NEW-01`, name = "Transit Stockpile 3", role = DUMPING.
2. Edit: change name to "Transit Stockpile 3A".

**Expected Results**
- Location available in Dispatch destination dropdown after create.
- Name updated after edit.

**Audit:** (P1) Create and update entries.
**DQ:** None.

---

### TC-F04 · Manage Shifts

**Steps**
1. Create shift: SHIFT-C, 23:00–07:00, Asia/Jakarta.
2. Verify it appears in shift filter dropdowns.

**Expected Results**
- Shift available across Production and Availability filters.

---

### TC-F05 · Manage Users & Roles

**Steps**
1. Create user: `u-new`, full_name = "Test Checker", role = CHECKER.
2. Deactivate user.
3. Attempt login as deactivated user.

**Expected Results**
- Created user can log in with CHECKER permissions.
- Deactivated user is rejected at login.

---

## Module G — Export

### TC-G01 · Export Trips CSV ⭐

**Objective:** Verify trip export includes tonnage status and is accurate.

**Preconditions**
- Production data exists with all three tonnage statuses (CONFIRMED, PENDING, MANUAL).

**Steps**
1. Login as **Supervisor**.
2. Navigate to `/production` → trip list.
3. Click "Export CSV".
4. Select date range covering test data.
5. Download file when ready.

**Expected Results**
- CSV file downloads successfully.
- Columns include: trip_id, unit_id, unit_name, shift, loading_location, dumping_location, timestamps, tonnage_value, **tonnage_status**, **tonnage_source_system**, entered_by.
- Rows with `PENDING` show blank/null tonnage_value and `tonnage_status = PENDING`.
- Rows with `MANUAL` show tonnage_value and `tonnage_status = MANUAL`.
- Rows with `CONFIRMED` show value and source_system.

**Audit:** None (export action itself not audited — Assumption (POC)).
**DQ:** None.

---

### TC-G02 · Export Production Aggregate CSV

**Steps**
1. Navigate to `/production` → Breakdown tab.
2. Click "Export Summary".

**Expected Results**
- CSV columns: date, shift, total_ritase, tonnage_confirmed, tonnage_manual, tonnage_pending_trips, tonnage_coverage_pct.
- Values match dashboard KPIs.

---

### TC-G03 · Export Availability CSV

**Steps**
1. Navigate to `/availability`.
2. Click "Export CSV".

**Expected Results**
- CSV columns: date, shift, unit_id, unit_name, running_min, standby_min, delay_min, breakdown_min, pa_pct, ua_pct, completeness_pct.
- Manually adjusted records reflected with correct values.

---

### TC-G04 · Export Anomalies & Audit Log ⭐

**Steps**
1. Navigate to `/data-quality` → Anomalies tab → "Export CSV".
2. Navigate to Audit Log tab → "Export CSV".

**Expected Results**
- **Anomalies CSV**: issue_id, issue_type, severity, status, unit_id, trip_id, created_at, resolved_at, resolution_note.
- **Audit CSV**: log_id, action, entity_type, entity_id, actor, timestamp, before_value, after_value, reason.
- Audit CSV reason column is populated for manual tonnage entries and issue resolutions.

---

## Module H — Integration / Reconciliation

### TC-H01 · End-to-End Integration Flow ⭐

**Objective:** Full lifecycle: trip created → PENDING → manual fallback → late confirmed arrives → reconciled.

**Preconditions**
- Unit `DT-025` active, capacity_ton = 30.
- Shift A active.

**Steps**
1. Trip `TRP-E2E` created for DT-025 (event-driven or manual). Target: DUMP-JTY-01.
2. Verify trip is `PENDING` on Production dashboard.
3. **Checker** enters manual tonnage = 28.5, reason = "WB offline".
4. Verify trip is `MANUAL` on dashboard. Audit entry exists.
5. Wait / simulate: confirmed tonnage arrives: ticket `WB-E2E-001`, net_tonnage = 29.2, source = PTBA_WB.
6. Refresh dashboard.

**Expected Results**
- Step 2: PENDING badge, no tonnage value.
- Step 3–4: MANUAL badge, value = 28.5, audit shows manual entry with reason.
- Step 6: CONFIRMED badge, value = 29.2.
  - Trip detail: tonnage history has 2 records — CONFIRMED (active) + MANUAL (inactive, dimmed).
  - Audit trail: `MANUAL_TONNAGE_ENTERED` + `TONNAGE_RECONCILED`.
  - Dashboard: trip appears under CONFIRMED bucket (removed from MANUAL bucket).

**Audit:**
- `MANUAL_TONNAGE_ENTERED`: actor = Checker, reason = "WB offline".
- `TONNAGE_RECONCILED`: system, before MANUAL/28.5, after CONFIRMED/29.2.

**DQ:** Optional `MANUAL_OVERRIDDEN_BY_CONFIRMED` (LOW) may appear.

---

### TC-H02 · Batch Import (File Drop)

**Objective:** Verify bulk confirmed tonnage import via batch endpoint.

**Preconditions**
- 5 trips in PENDING state for various units.

**Steps**
1. Submit batch of 6 records (5 matching pending trips + 1 with unknown `unit_id`).

**Expected Results**
- 5 trips matched → CONFIRMED.
- 1 record fails validation (unknown unit) → appears in error details.
- Response summary: `matched: 5, errors: 1`.

**Audit:** 5 individual audit entries for confirmation.
**DQ:** Any outlier tonnage triggers `TONNAGE_OUTLIER` per usual rules.

---

### TC-H03 · Pending Too Long Anomaly

**Objective:** Verify trips pending beyond threshold are flagged.

**Preconditions**
- Trip `TRP-OLD` has been PENDING for 6 hours. Threshold = 4 hours.

**Steps**
1. Navigate to `/data-quality`.

**Expected Results**
- Anomaly: `TONNAGE_PENDING_TOO_LONG`, severity = HIGH, linked to `TRP-OLD`.

---

## 9 · Test Data Setup

### Master data (seed before any test)

| Entity | Test records |
|---|---|
| `mt_unit` | DT-001, DT-010, DT-025, DT-043, DT-050, DT-099, DT-100, LOADER-001 — mixed types & ownership; DT-043 capacity=35, DT-010 capacity=30, DT-025 capacity=30 |
| `mt_location` | LOAD-SP-01 (LOADING), LOAD-SP-02 (LOADING), DUMP-JTY-01 (DUMPING), DUMP-SP-03 (DUMPING) |
| `mt_shift` | SHIFT-A (07:00–19:00), SHIFT-B (19:00–07:00) — timezone Asia/Jakarta |
| `mt_user` | u-admin (ADMIN), u-disp (DISPATCHER), u-check (CHECKER), u-super (SUPERVISOR) |

### Activity events (seed for Fleet & Availability tests)
- DT-043: 3+ events in current shift (LOADING, HAULING, DUMPING).
- DT-050: sparse events covering only ~300 min of shift.
- DT-099: last event >20 min ago (stale).
- DT-100: no events (no data).

### Trips (seed for Production tests)
- TRP-001: DT-043, PENDING, current shift.
- TRP-002: DT-010, PENDING, current shift.
- TRP-OLD: any unit, PENDING for 6+ hours.
- Additional trips with CONFIRMED tonnage for aggregate testing.

---

## 10 · Test Execution Summary Template

| TC ID | Module | Objective | Pass/Fail | Notes |
|---|---|---|---|---|
| TC-A01 | Fleet Board | View active fleet | | |
| TC-A02 | Fleet Board | Stale detection | | |
| TC-A03 | Fleet Board | Filter & search | | |
| TC-A04 | Fleet Board | Unit timeline | | |
| TC-B01 | Dispatch | Create assignment | | |
| TC-B02 | Dispatch | Update status & notes | | |
| TC-B03 | Dispatch | Complete assignment | | |
| TC-B04 | Dispatch | Duplicate prevention | | |
| TC-C01 | Production | Trip PENDING | | |
| TC-C02 | Production | Confirmed ingestion ⭐ | | |
| TC-C03 | Production | Manual tonnage ⭐ | | |
| TC-C04 | Production | Reconciliation ⭐ | | |
| TC-C05 | Production | Tonnage outlier ⭐ | | |
| TC-C06 | Production | Duplicate trip | | |
| TC-C07 | Production | Multi-match | | |
| TC-C08 | Production | Duplicate ticket | | |
| TC-C09 | Production | Breakdown | | |
| TC-D01 | Availability | PA/UA roll-up | | |
| TC-D02 | Availability | Low completeness | | |
| TC-D03 | Availability | Manual adjustment | | |
| TC-E01 | Data Quality | Anomaly list | | |
| TC-E02 | Data Quality | Resolve issue | | |
| TC-E03 | Data Quality | Audit completeness | | |
| TC-E04 | Data Quality | Audit filter | | |
| TC-F01 | Master Data | Create unit | | |
| TC-F02 | Master Data | Deactivate unit | | |
| TC-F03 | Master Data | Location CRUD | | |
| TC-F04 | Master Data | Shifts | | |
| TC-F05 | Master Data | Users & roles | | |
| TC-G01 | Export | Trips CSV ⭐ | | |
| TC-G02 | Export | Production aggregate | | |
| TC-G03 | Export | Availability | | |
| TC-G04 | Export | Anomalies & audit ⭐ | | |
| TC-H01 | Integration | E2E lifecycle ⭐ | | |
| TC-H02 | Integration | Batch import | | |
| TC-H03 | Integration | Pending too long | | |

**Total: 36 test cases** (⭐ = critical path for POC acceptance — 8 cases)

---

*Document generated: 2026-02-19 · Based on `/docs/06_UAT_Test_Scenarios.md` · No map tracking tests · No dispatch optimization tests*
