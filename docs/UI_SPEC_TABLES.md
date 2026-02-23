# UI Table / Card Specifications

## Dashboard Overview (`/dashboard`)

### KPI Summary Cards (10 cards in grid)
| Card | Field | Color Logic |
|------|-------|-------------|
| Active Units | fleet `data_status === 'OK'` count | Green |
| Stale Units | fleet `data_status === 'STALE'` count | Amber |
| Open Issues | issues `status === 'OPEN'` count | Red |
| Active Assignments | assignments (ASSIGNED + IN_PROGRESS) | Blue |
| Completed Today | assignments `status === 'COMPLETED'` count | Default |
| Ritase Today | trips count | Default |
| Tonnage Total | confirmed + manual tonnage sum | Badge chips: conf/pend/man |
| Avg PA | availability PA average | Green >= 85, Amber >= 70, Red |
| Avg UA | availability UA average | Green >= 80, Amber >= 60, Red |
| Data Completeness | availability completeness average | Progress bar |

### Preview Tables
**Fleet preview (8 rows):** Unit, Type, Ownership, Activity, Status
**Dispatch preview (8 rows):** Unit, Destination, Status, Notes
**Production preview (8 rows):** Trip, Unit, Loading, Dumping, Tonnes, Status
**Availability preview (8 rows):** Unit, Running (h), Standby (h), PA %, UA %
**Issues preview (8 rows):** Type, Severity, Unit, Status
**Audit preview (10 rows):** Action, Entity, Actor, Time, Reason

---

## Fleet Board Table (`/fleet`)

| Column | Field | Type | Notes |
|--------|-------|------|-------|
| Unit | `unit_id`, `unit_name` | string | Bold ID + muted name |
| Type | `unit_type` | badge | DUMP_TRUCK (primary), LOADER (warning), SUPPORT (neutral) |
| Ownership | `ownership` | badge (outline) | OWN (info), RENTAL (neutral) |
| Assignment | `current_assignment.dumping_location_name` | badge | Blue info badge or `--` if unassigned |
| Last Activity | `last_activity` | badge | LOADING, HAULING, DUMPING, STANDBY, IDLE |
| Last Update | `last_update_ts` | relative time | "Just now", "5 min ago" |
| Data Status | `data_status` | badge | OK (green), STALE (amber), NO_DATA (neutral) |

**KPI Cards:** Active Units, Stale Units, Open Issues, Last Refresh

---

## Dispatch Board Card (`/dispatch`)

### Board View (grouped by destination)
| Field | Type | Notes |
|-------|------|-------|
| Unit ID | string | Bold |
| Status | badge | ASSIGNED (blue), IN_PROGRESS (green), COMPLETED (neutral) |
| From | text | Loading location (if set) |
| Notes | text | Optional, muted |
| Actions | buttons | Start / Complete |

### Table View
| Column | Field | Type | Notes |
|--------|-------|------|-------|
| Unit | `unit_id` | string | Bold |
| Destination | `dumping_location_name` | string | with loading location below |
| Status | `status` | badge | Color-coded |
| Notes | `notes` | text | Muted, truncated |
| Actions | -- | buttons | Start / Complete |

**KPI Cards:** Active, In Progress, Completed, Unassigned

---

## Production Trips Table (`/production`)

| Column | Field | Type | Notes |
|--------|-------|------|-------|
| Trip | `trip_id` | link button | Opens detail modal |
| Unit | `unit_id` | string | Bold |
| Loading | `loading_location` | string | Location name |
| Dumping | `dumping_location` | string | Location name |
| Tonnes | `tonnage_value` | number | Suffixed with `t`, `--` if null |
| Status | `tonnage_status` | badge | CONFIRMED (green solid), PENDING (neutral outline), MANUAL (amber soft) |
| Source | `tonnage_source` | text | Muted text, fallback to `entered_by` |

**KPI Cards:** Ritase, Confirmed Tonnage, Manual Tonnage, Pending, Coverage

---

## Availability Table (`/availability`)

| Column | Field | Type | Notes |
|--------|-------|------|-------|
| Unit | `unit_id` | string | Bold |
| Shift | `shift_id` | string | -- |
| Running | `running_hours` | number | Suffixed `h` |
| Standby | `standby_hours` | number | Suffixed `h` |
| Breakdown | `breakdown_hours` | number | Red if > 2h |
| Delay | `delay_hours` | number | Suffixed `h` |
| PA % | `pa_pct` | badge | Green >= 85, Amber >= 70, Red < 70 |
| UA % | `ua_pct` | badge | Green >= 80, Amber >= 60, Red < 60 |
| Completeness | `completeness_pct` | progress bar | Colored bar + percentage |

**KPI Cards:** Avg PA%, Avg UA%, Total Running Hours, Data Completeness

---

## Data Quality Issues Table (`/data-quality`)

| Column | Field | Type | Notes |
|--------|-------|------|-------|
| Type | `issue_type` | badge | Primary subtle |
| Severity | `severity` | badge | CRITICAL/HIGH (red), MEDIUM (amber), LOW (neutral) |
| Unit | `unit_id` | string | Bold |
| Detail | `detail` | text | Truncated to 50 chars |
| Status | `status` | badge | OPEN (red), IN_REVIEW (amber), RESOLVED (green) |
| Actions | -- | button | Review / Resolve |

### Audit Table
| Column | Field | Type | Notes |
|--------|-------|------|-------|
| Action | `action` | badge | CREATE, UPDATE, TRANSITION, DELETE |
| Entity | `entity_type`, `entity_id` | text | Type + muted ID |
| Actor | `actor` | string | -- |
| Time | `timestamp` | datetime | Formatted |
| Before | `payload_before` | text | Serialized key-value pairs |
| After | `payload_after` | text | Serialized key-value pairs |
| Reason | `reason` | text | Muted |

**KPI Cards:** Open Issues, High Severity, Resolved, Top Anomaly Type

---

## Master Data Tables

### Units (`/master-data/units`)
| Column | Field | Type |
|--------|-------|------|
| ID | `unit_id` | string (bold) |
| Name | `unit_name` | string |
| Type | `unit_type` | badge |
| Ownership | `ownership` | badge (outline) |
| Vendor | `vendor_name` | string |
| Capacity | `capacity_ton` | number + `t` |
| Status | `is_active` | badge |

### Locations (`/master-data/locations`)
| Column | Field | Type |
|--------|-------|------|
| ID | `location_id` | string (bold) |
| Name | `location_name` | string |
| Role | `location_role` | badge |
| Type | `location_type` | badge (outline) |
| Status | `is_active` | badge |

### Shifts (`/master-data/shifts`)
| Column | Field | Type |
|--------|-------|------|
| ID | `shift_id` | string (bold) |
| Name | `shift_name` | string |
| Start | `start_time` | string |
| End | `end_time` | string |
| Timezone | `timezone` | string |
| Status | `is_active` | badge |

---

## Reports (`/reports`)

### Analytics Charts (CSS bar charts)
- **Tonnage by Status:** Confirmed / Pending / Manual (count + tonnage total)
- **Issues by Type:** Horizontal bars per anomaly type
- **Availability Breakdown:** Running / Standby / Breakdown / Delay

### CSV Exports
- Trip Production, Availability Report, Data Quality Issues, Audit Log
