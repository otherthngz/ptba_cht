# Metrics & Definitions — PTBA CHT Web Portal POC

This document defines the core metrics used across **Production**, **Availability (PA/UA)**, and **Data Quality**.

> Note: Final PA/UA formulas may be aligned with PTBA’s internal standard. This doc provides a POC-safe baseline and explicit data requirements.

---

## 1) Production Metrics

### 1.1 Trip Count (Ritase)
**Definition:** number of valid hauling trips within a time window (shift/day).

**Counting rules (POC):**
- A trip is counted if it has at least:
  - `unit_id`
  - `loading_location_id` (or unknown)
  - `dumping_location_id`
  - a minimum timestamp (e.g., `depart_load_ts` or `dump_done_ts`)
- Trips flagged as duplicates (see anomaly rules) are excluded from aggregate counts until resolved.

### 1.2 Total Tonnage
Total tonnage is displayed with **three mandatory buckets**:

- **Confirmed Tonnage** (`CONFIRMED`)
  - Source: PTBA system (weighbridge/RFID/production app)
  - Used as primary reporting value

- **Pending Tonnage** (`PENDING`)
  - Trip exists but confirmed tonnage has not arrived
  - Value may be null/blank (no estimation by default)

- **Manual Tonnage** (`MANUAL`)
  - Entered by checker during fallback (e.g., weighbridge breakdown)
  - Must include `manual_reason`

**Roll-up rule:**
- Aggregated tonnage shows totals per bucket and the overall total.

### 1.3 Tonnage Coverage
**Definition:** proportion of trips with non-null tonnage (confirmed or manual).

Formula:
- `tonnage_coverage = trips_with_tonnage / total_trips`

Display:
- show % coverage and absolute numbers: `X of Y trips have tonnage`

---

## 2) Availability / PA–UA Metrics

### 2.1 Time Buckets
We store time as durations per unit per shift/day:
- `running_time` (engine on / productive)
- `loading_time`
- `hauling_time` (travel)
- `dumping_time`
- `standby_time`
- `delay_time`
- `breakdown_time`
- `idle_time` (optional; if needed)

> In a POC, some buckets may be derived from event timestamps or manual input.

### 2.2 Scheduled Time
**Definition:** total scheduled time for a unit in a shift.

Baseline:
- `scheduled_time = shift_end - shift_start`

If unit is marked inactive/offline/maintenance (master data), scheduled_time can be excluded based on business rule.

### 2.3 Physical Availability (PA)
**POC Baseline Definition:** proportion of time a unit is physically available for work.

Baseline formula (typical):
- `PA = (scheduled_time - breakdown_time) / scheduled_time`

Notes:
- Some orgs treat certain planned maintenance differently; align with PTBA standard if provided.

### 2.4 Utilization / Use of Availability (UA)
**POC Baseline Definition:** proportion of available time that is actually used productively.

Baseline formula:
- `UA = productive_time / (scheduled_time - breakdown_time)`

Where:
- `productive_time` can be defined as `running_time` or `(loading + hauling + dumping)` depending on data availability.

### 2.5 Data Completeness (Availability)
Because events can be partial, we display a completeness indicator.

Definition:
- `availability_completeness = time_covered_by_events / scheduled_time`

Implementation option (POC):
- Sum durations derived from event timeline (including manual segments) and divide by scheduled_time.

Interpretation:
- 90–100%: high confidence
- 60–89%: medium confidence
- <60%: low confidence (highlight)

---

## 3) Data Quality Metrics

### 3.1 Staleness Rate
**Definition:** fraction of active units with no updates beyond threshold.

- `stale_unit` if `now - last_update_ts > STALE_THRESHOLD_MIN`
- `staleness_rate = stale_units / active_units`

### 3.2 Pending Tonnage Rate
- `pending_rate = pending_trips / total_trips`

### 3.3 Manual Override Rate
- `manual_rate = manual_tonnage_trips / total_trips`

Use case:
- monitoring weighbridge breakdown frequency and operational friction.

### 3.4 Anomaly Resolution Time
If anomalies have workflow status:
- `resolution_time = resolved_at - created_at`

---

## 4) Standard Time Windowing
- **Shift-based** is primary (operations)
- **Daily** is secondary (management)

All dashboards must allow:
- date range
- shift selection
- location filter (loading/dumping)

---

## 5) Naming Conventions
- Use consistent enums across FE/BE:
  - `tonnage_status`: `CONFIRMED | PENDING | MANUAL`
  - `issue_status`: `OPEN | IN_REVIEW | RESOLVED`

