# UAT Test Scenarios — PTBA CHT Web Portal POC

This UAT pack is designed for **web portal POC** validation with realistic operational constraints.

Conventions:
- **AC** = Acceptance Criteria
- **Expected** includes UI results + data results

---

## A) Live Fleet Board

### A1 — View Active Fleet
**Steps**
1. Login as Dispatcher
2. Open Fleet Board

**AC / Expected**
- Shows all `is_active=true` units
- Each row contains: unit id, type, ownership, last activity, last update, current assignment

### A2 — Stale Unit Highlight
**Precondition**: Unit has no updates beyond threshold

**Steps**
1. Open Fleet Board
2. Observe unit row

**Expected**
- Unit marked `STALE`
- Visible last update timestamp
- Unit appears in Data Quality page under `STALE_UPDATE`

### A3 — Filter & Search
**Steps**
1. Filter by unit type and ownership
2. Search unit id

**Expected**
- Table updates correctly
- URL/query state persists on refresh (nice-to-have)

---

## B) Dispatch (Simple Assignment Tracking)

### B1 — Create Assignment
**Steps**
1. Login as Dispatcher
2. Open Dispatch
3. Select Unit `DT-001`
4. Select destination `DUMP-JTY-01`
5. Save

**Expected**
- Assignment status becomes `ASSIGNED`
- Fleet Board displays assignment in unit row
- Audit log records `ASSIGNMENT_CREATED` (who/when/what)

### B2 — Update Assignment Notes
**Steps**
1. Edit assignment notes
2. Save

**Expected**
- Notes updated
- Audit log records `ASSIGNMENT_UPDATED` with before/after

### B3 — Complete Assignment
**Steps**
1. Mark assignment completed

**Expected**
- Status `COMPLETED`
- Audit log entry exists

**Non-goal check**
- System does NOT suggest optimized destination or reorder units.

---

## C) Production Dashboard (Trips, Ritase, Tonnage States)

### C1 — Trip appears without tonnage (PENDING)
**Precondition**: Trip events exist but no confirmed tonnage yet

**Steps**
1. Open Production dashboard
2. Check trip list

**Expected**
- Trip exists with `tonnage_status=PENDING`
- Aggregation shows:
  - Ritase incremented
  - Pending count incremented

### C2 — Confirmed tonnage ingested → state becomes CONFIRMED
**Precondition**: inbound confirmed tonnage arrives matching the pending trip

**Steps**
1. Ingest confirmed tonnage event (`external_ticket_id`, `unit_id`, `ts`, `net_tonnage`)
2. Refresh Production

**Expected**
- Trip `tonnage_status=CONFIRMED`
- `tonnage_source_system` shown
- KPI Confirmed tonnage increases
- Audit log stores raw inbound reference (at least `source_ref`)

### C3 — Weighbridge breakdown fallback (MANUAL)
**Steps**
1. Login as Checker
2. Open trip list → choose pending trip
3. Enter manual tonnage + mandatory reason
4. Save

**Expected**
- Trip becomes `tonnage_status=MANUAL`
- Dashboard shows manual tonnage bucket increases
- Audit log contains manual entry with before/after and reason

### C4 — Manual exists then Confirmed arrives later (reconcile)
**Precondition**: trip is MANUAL

**Steps**
1. Ingest confirmed tonnage that matches the trip

**Expected**
- Trip reporting switches to `CONFIRMED`
- Manual record still visible in audit history (not deleted)
- Data Quality flag (optional): `MANUAL_OVERRIDDEN_BY_CONFIRMED`

---

## D) Availability / PA–UA

### D1 — Availability roll-up per shift
**Steps**
1. Open Availability page
2. Select shift

**Expected**
- Table shows per unit durations: running, standby, delay, breakdown
- PA/UA values computed per definitions
- Completeness indicator displayed

### D2 — Low completeness highlight
**Precondition**: unit has large event gaps

**Expected**
- Completeness < threshold highlighted
- Data Quality issue `AVAILABILITY_LOW_COMPLETENESS` created

---

## E) Data Quality (Anomaly Rules) — Mandatory

### E1 — Duplicate Trip Detection
**Precondition**: two trips for same unit overlap or share same end timestamp window

**Expected**
- Issue created: `TRIP_DUPLICATE_SUSPECTED`
- Marked `OPEN` and visible in Data Quality page

### E2 — Tonnage Outlier
**Precondition**: confirmed/manual tonnage outside expected range

**Expected**
- Issue: `TONNAGE_OUTLIER`
- Contains context: unit, trip, tonnage value, expected band

### E3 — Pending Too Long
**Precondition**: trip pending longer than threshold

**Expected**
- Issue: `TONNAGE_PENDING_TOO_LONG`

### E4 — Stale Updates
**Precondition**: last update older than `STALE_THRESHOLD`

**Expected**
- Issue: `STALE_UPDATE`

---

## F) Audit Trail — Mandatory

### F1 — Manual Tonnage Audit
**Steps**
1. Enter manual tonnage
2. Open Audit Log

**Expected**
- Shows who/when
- Shows before/after values
- Shows reason

### F2 — Assignment Change Audit
**Steps**
1. Create assignment
2. Update destination

**Expected**
- Both actions logged separately
- Each log includes diff/changes

### F3 — Admin Master Data Change Audit (optional but recommended)
**Steps**
1. Admin deactivates a location

**Expected**
- Audit event exists

---

## G) Export

### G1 — Export Trips CSV
**Steps**
1. Export trips for date range

**Expected**
- File contains `tonnage_status` and `tonnage_source_system`
- Includes trip timestamps and locations

### G2 — Export Anomalies & Audit
**Expected**
- Issues export contains type, status, created/resolved timestamps
- Audit export contains actor, action, before/after, reason

