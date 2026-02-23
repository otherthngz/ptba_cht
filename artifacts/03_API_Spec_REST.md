# REST API Specification — PTBA CHT Web Portal POC

> Source of truth: `/docs/01_PRD_Web_Portal.md`, `/docs/02_Metrics_Definitions.md`, `/docs/05_Integration_Mapping_PTBA.md`, `/artifacts/02_DataModel_Schema.md`

**Conventions**
- Base path: `/api/v1`
- Auth: Bearer token (JWT or session). Every request must include `Authorization` header.
- Dates: ISO 8601 (`YYYY-MM-DD`). Timestamps: ISO 8601 with timezone.
- Pagination: `?page=1&per_page=25` (defaults). Response includes `total`, `page`, `per_page`.
- Filtering: query params. Multiple values as comma-separated (e.g., `?status=OPEN,IN_REVIEW`).
- All mutation endpoints return the updated resource in the response body.
- Enums are UPPER_SNAKE_CASE strings.
- No mandatory map/GPS endpoints exist. No dispatch optimization endpoints exist.

**Role abbreviations:** `ADMIN`, `DISPATCHER`, `CHECKER`, `SUPERVISOR`

---

## 1 · Fleet Board

### 1.1 List Fleet Units

`GET /fleet/units`

**Purpose:** Return all active units with last activity, last update, data status, and current assignment for the Fleet Board.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `unit_type` | string | ❌ | Filter: `DUMP_TRUCK`, `LOADER`, `SUPPORT` (comma-separated) |
| `ownership` | string | ❌ | `OWN`, `RENTAL` |
| `data_status` | string | ❌ | `OK`, `STALE`, `NO_DATA` |
| `assignment_destination` | string | ❌ | `location_id` of current assignment destination |
| `search` | string | ❌ | Free-text search on `unit_id` / `unit_name` |
| `page` | integer | ❌ | Default `1` |
| `per_page` | integer | ❌ | Default `25` |

**Response** `200 OK`

```
{
  "data": [
    {
      "unit_id": "DT-043",
      "unit_name": "DT 043",
      "unit_type": "DUMP_TRUCK",
      "ownership": "RENTAL",
      "vendor_name": "ABC Rental",
      "last_activity": "HAULING",
      "last_activity_ts": "2026-02-19T08:42:00+07:00",
      "last_update_ts": "2026-02-19T08:42:00+07:00",
      "data_status": "OK",
      "current_assignment": {
        "assignment_id": "ASG-0091",
        "dumping_location_name": "Jetty Stockpile 1",
        "status": "IN_PROGRESS"
      }
    }
  ],
  "total": 84,
  "page": 1,
  "per_page": 25
}
```

**`data_status` derivation:**
- `OK` — `now − last_update_ts ≤ STALE_THRESHOLD_MIN`
- `STALE` — `now − last_update_ts > STALE_THRESHOLD_MIN`
- `NO_DATA` — unit has never reported

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`

**Audit & DQ:** No audit. Stale units auto-generate `STALE_UPDATE` anomaly (server-side).

---

### 1.2 Get Unit Timeline (Shift)

`GET /fleet/units/{unit_id}/timeline`

**Purpose:** Return chronological event list for a unit within a specific shift (for drill-down).

**Path Parameters**

| Param | Type | Required |
|---|---|:---:|
| `unit_id` | string | ✅ |

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `date` | date | ❌ | Default today |
| `shift_id` | string | ❌ | Default current shift |

**Response** `200 OK`

```
{
  "unit_id": "DT-043",
  "shift_id": "SHIFT-A",
  "date": "2026-02-19",
  "events": [
    {
      "event_id": "EVT-00421",
      "event_type": "LOADING",
      "start_ts": "2026-02-19T07:15:00+07:00",
      "end_ts": "2026-02-19T07:32:00+07:00",
      "location_name": "Stockpile Loading 2",
      "source": "CCR_INPUT",
      "notes": null
    }
  ]
}
```

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`

---

## 2 · Dispatch (Simple Assignment Tracking)

### 2.1 List Assignments

`GET /dispatch/assignments`

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `status` | string | ❌ | `ASSIGNED`, `IN_PROGRESS`, `COMPLETED` (comma-separated) |
| `unit_id` | string | ❌ | Filter by unit |
| `date` | date | ❌ | Default today |
| `page` | integer | ❌ | Default `1` |
| `per_page` | integer | ❌ | Default `25` |

**Response** `200 OK`

```
{
  "data": [
    {
      "assignment_id": "ASG-0091",
      "unit_id": "DT-001",
      "unit_name": "DT 001",
      "dumping_location_id": "DUMP-JTY-01",
      "dumping_location_name": "Jetty Stockpile 1",
      "loading_location_id": "LOAD-SP-02",
      "loading_location_name": "Stockpile Loading 2",
      "status": "ASSIGNED",
      "notes": "Prioritas jetty",
      "created_by": "u-102",
      "created_at": "2026-02-19T07:05:00+07:00",
      "updated_at": "2026-02-19T07:05:00+07:00"
    }
  ],
  "total": 12,
  "page": 1,
  "per_page": 25
}
```

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`

---

### 2.2 Create Assignment

`POST /dispatch/assignments`

**Request Body**

| Field | Type | Required | Description |
|---|---|:---:|---|
| `unit_id` | string | ✅ | Must reference active unit |
| `dumping_location_id` | string | ✅ | Must reference active location with role `DUMPING` |
| `loading_location_id` | string | ❌ | Active location with role `LOADING` |
| `notes` | string | ❌ | Free text |

**Response** `201 Created` — returns full assignment object with `status: "ASSIGNED"`.

**Status Codes**
- `201` — created
- `400` — validation error (inactive unit/location, missing required fields)
- `409` — unit already has an active (non-COMPLETED) assignment (Assumption (POC))

**Roles:** `DISPATCHER`

**Audit & DQ:** Audit log entry created → `action: ASSIGNMENT_CREATED`, actor, timestamp, full assignment payload in `after_value`.

---

### 2.3 Update Assignment

`PATCH /dispatch/assignments/{assignment_id}`

**Request Body** (partial update)

| Field | Type | Required | Description |
|---|---|:---:|---|
| `status` | string | ❌ | Transition: `ASSIGNED → IN_PROGRESS → COMPLETED` |
| `notes` | string | ❌ | Updated notes |

**Response** `200 OK` — returns updated assignment.

**Status Codes**
- `200` — updated
- `400` — invalid status transition (e.g., `COMPLETED → ASSIGNED`)
- `404` — assignment not found

**Roles:** `DISPATCHER`

**Audit & DQ:** Audit log entry → `action: ASSIGNMENT_UPDATED`, before/after values for changed fields. No optimization/recommendation returned.

---

## 3 · Production

### 3.1 List Trips

`GET /production/trips`

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `date_from` | date | ❌ | Default today |
| `date_to` | date | ❌ | Default `date_from` |
| `shift_id` | string | ❌ | Filter by shift |
| `unit_id` | string | ❌ | Filter by unit |
| `tonnage_status` | string | ❌ | `CONFIRMED`, `PENDING`, `MANUAL` (comma-separated) |
| `loading_location_id` | string | ❌ | — |
| `dumping_location_id` | string | ❌ | — |
| `sort` | string | ❌ | `created_at`, `dump_done_ts` (default `created_at desc`) |
| `page` | integer | ❌ | Default `1` |
| `per_page` | integer | ❌ | Default `50` |

**Response** `200 OK`

```
{
  "data": [
    {
      "trip_id": "TRP-20260219-0042",
      "unit_id": "DT-043",
      "unit_name": "DT 043",
      "shift_id": "SHIFT-A",
      "loading_location_name": "Stockpile Loading 2",
      "dumping_location_name": "Jetty Stockpile 1",
      "depart_load_ts": "2026-02-19T07:15:00+07:00",
      "arrive_dump_ts": "2026-02-19T07:48:00+07:00",
      "dump_done_ts": "2026-02-19T07:55:00+07:00",
      "tonnage_status": "CONFIRMED",
      "tonnage_value": 32.5,
      "tonnage_source_system": "PTBA_WB",
      "external_ticket_id": "WB-2026-88421",
      "is_duplicate_flagged": false
    }
  ],
  "total": 186,
  "page": 1,
  "per_page": 50
}
```

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`, `CHECKER` (read-only)

---

### 3.2 Get Trip Detail

`GET /production/trips/{trip_id}`

**Purpose:** Return full trip with tonnage history (all records including superseded MANUAL).

**Response** `200 OK`

```
{
  "trip_id": "TRP-20260219-0042",
  "unit_id": "DT-043",
  ...
  "tonnage_status": "CONFIRMED",
  "tonnage_value": 32.5,
  "tonnage_records": [
    {
      "tonnage_record_id": "TONN-0002",
      "record_type": "CONFIRMED",
      "tonnage_value": 32.5,
      "source_system": "PTBA_WB",
      "is_active": true,
      "created_at": "2026-02-19T08:10:00+07:00"
    },
    {
      "tonnage_record_id": "TONN-0001",
      "record_type": "MANUAL",
      "tonnage_value": 31.0,
      "manual_reason": "Weighbridge down since 06:45",
      "entered_by": "u-105",
      "is_active": false,
      "created_at": "2026-02-19T07:56:00+07:00"
    }
  ],
  "audit_trail": [...]
}
```

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`, `CHECKER`

---

### 3.3 Production Aggregates

`GET /production/aggregates`

**Purpose:** Return KPI summary — total ritase, tonnage by bucket (CONFIRMED / PENDING / MANUAL), coverage.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `date_from` | date | ✅ | — |
| `date_to` | date | ✅ | — |
| `shift_id` | string | ❌ | — |
| `loading_location_id` | string | ❌ | — |
| `dumping_location_id` | string | ❌ | — |
| `group_by` | string | ❌ | `unit_type`, `ownership`, `loading_location`, `dumping_location`, `date`, `shift` (comma-separated for multi-dimensional) |

**Response** `200 OK`

```
{
  "summary": {
    "total_trips": 186,
    "tonnage_confirmed_total": 4820.5,
    "tonnage_confirmed_trips": 152,
    "tonnage_manual_total": 620.0,
    "tonnage_manual_trips": 20,
    "tonnage_pending_trips": 14,
    "tonnage_coverage_pct": 92.5,
    "tonnage_coverage_label": "172 of 186 trips have tonnage"
  },
  "breakdown": [
    {
      "dimension": "dumping_location",
      "value": "Jetty Stockpile 1",
      "trips": 95,
      "tonnage_confirmed": 2480.0,
      "tonnage_manual": 310.0,
      "tonnage_pending_trips": 5
    }
  ]
}
```

**Aggregate rules:**
- Trips with `is_duplicate_flagged = true` excluded from all counts until resolved.
- Tonnage total = `CONFIRMED + MANUAL` (PENDING has null value, excluded from sum).
- Coverage = `trips_with_tonnage / total_trips` (ref: `02_Metrics_Definitions.md` §1.3).

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`

---

### 3.4 Submit Manual Tonnage

`POST /production/trips/{trip_id}/manual-tonnage`

**Purpose:** Checker enters fallback tonnage when weighbridge is down.

**Path Parameters**

| Param | Type | Required |
|---|---|:---:|
| `trip_id` | string | ✅ |

**Request Body**

| Field | Type | Required | Description |
|---|---|:---:|---|
| `manual_tonnage` | decimal | ✅ | Net tonnage value |
| `manual_reason` | string | ✅ | Why fallback is used |
| `attachment_ref` | string | ❌ | Optional evidence file reference |

**Response** `200 OK`

```
{
  "trip_id": "TRP-20260219-0042",
  "tonnage_status": "MANUAL",
  "tonnage_value": 31.0,
  "tonnage_record": {
    "tonnage_record_id": "TONN-0001",
    "record_type": "MANUAL",
    "tonnage_value": 31.0,
    "manual_reason": "Weighbridge down since 06:45",
    "entered_by": "u-105",
    "is_active": true,
    "created_at": "2026-02-19T07:56:00+07:00"
  }
}
```

**Status Codes**
- `200` — tonnage recorded
- `400` — missing `manual_reason`, invalid value
- `404` — trip not found
- `409` — trip already has `CONFIRMED` tonnage (cannot overwrite CONFIRMED with MANUAL)

**Roles:** `CHECKER`

**Audit & DQ:**
- Audit log → `action: MANUAL_TONNAGE_ENTERED`, before (`PENDING` / null), after (`MANUAL` / value), reason.
- DQ: if `manual_tonnage` outside `capacity_ton × [0.10, 1.20]` → raise `TONNAGE_OUTLIER`.

**Tonnage state transition:** `PENDING → MANUAL`. If trip is already `CONFIRMED`, reject with `409`.

---

## 4 · Availability / PA–UA

### 4.1 List Availability Records

`GET /availability`

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `date_from` | date | ✅ | — |
| `date_to` | date | ✅ | — |
| `shift_id` | string | ❌ | — |
| `unit_id` | string | ❌ | — |
| `unit_type` | string | ❌ | `DUMP_TRUCK`, `LOADER`, `SUPPORT` |
| `page` | integer | ❌ | Default `1` |
| `per_page` | integer | ❌ | Default `50` |

**Response** `200 OK`

```
{
  "data": [
    {
      "avail_id": "AVL-0012",
      "unit_id": "DT-043",
      "unit_name": "DT 043",
      "shift_id": "SHIFT-A",
      "shift_name": "Shift A",
      "date": "2026-02-19",
      "scheduled_min": 720,
      "running_min": 480,
      "loading_min": 90,
      "hauling_min": 240,
      "dumping_min": 60,
      "standby_min": 60,
      "delay_min": 30,
      "breakdown_min": 40,
      "idle_min": 0,
      "pa_pct": 94.4,
      "ua_pct": 70.6,
      "completeness_pct": 92.0,
      "completeness_label": "HIGH",
      "is_manual_adjusted": false
    }
  ],
  "total": 84,
  "page": 1,
  "per_page": 50
}
```

**Completeness label derivation:**
- `≥ 90%` → `HIGH`
- `60–89%` → `MEDIUM`
- `< 60%` → `LOW` (also triggers `AVAILABILITY_LOW_COMPLETENESS` anomaly)

**Roles:** `SUPERVISOR`, `ADMIN`, `DISPATCHER` (read-only)

**Audit & DQ:** Low completeness auto-generates `AVAILABILITY_LOW_COMPLETENESS` anomaly.

---

### 4.2 Update Availability Record (Manual Adjustment)

`PATCH /availability/{avail_id}`

**Purpose:** Supervisor or Admin manually adjusts time buckets when event data is incomplete.

**Request Body** (partial update — any combination of time fields)

| Field | Type | Required | Description |
|---|---|:---:|---|
| `running_min` | integer | ❌ | Corrected value |
| `standby_min` | integer | ❌ | — |
| `delay_min` | integer | ❌ | — |
| `breakdown_min` | integer | ❌ | — |
| `reason` | string | ✅ | Reason for manual adjustment |

**Response** `200 OK` — returns updated record with recalculated `pa_pct`, `ua_pct`, `completeness_pct`, and `is_manual_adjusted: true`.

**Status Codes**
- `200` — updated
- `400` — sum of buckets exceeds `scheduled_min`; missing reason
- `404` — record not found

**Roles:** `SUPERVISOR`, `ADMIN`

**Audit & DQ:** Audit log → `action: AVAILABILITY_ADJUSTED`, before/after bucket values, reason.

---

## 5 · Data Quality & Audit

### 5.1 List Anomaly Issues

`GET /data-quality/issues`

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `issue_type` | string | ❌ | Comma-separated (see rule types below) |
| `severity` | string | ❌ | `LOW`, `MEDIUM`, `HIGH` |
| `status` | string | ❌ | `OPEN`, `IN_REVIEW`, `RESOLVED` |
| `unit_id` | string | ❌ | — |
| `date_from` | date | ❌ | Issue `created_at` range |
| `date_to` | date | ❌ | — |
| `page` | integer | ❌ | Default `1` |
| `per_page` | integer | ❌ | Default `25` |

**Supported `issue_type` values:**
`STALE_UPDATE`, `TONNAGE_PENDING_TOO_LONG`, `TONNAGE_OUTLIER`, `TRIP_DUPLICATE_SUSPECTED`, `TONNAGE_MULTI_MATCH`, `TONNAGE_DUPLICATE_TICKET`, `AVAILABILITY_LOW_COMPLETENESS`, `MANUAL_OVERRIDDEN_BY_CONFIRMED`

**Response** `200 OK`

```
{
  "data": [
    {
      "issue_id": "ISS-0034",
      "issue_type": "TONNAGE_OUTLIER",
      "severity": "HIGH",
      "status": "OPEN",
      "unit_id": "DT-043",
      "unit_name": "DT 043",
      "trip_id": "TRP-20260219-0042",
      "rule_threshold": "capacity 35t ± [10%, 120%] → band [3.5, 42.0]",
      "detail_context": "reported tonnage: 55.0",
      "created_at": "2026-02-19T08:15:00+07:00",
      "resolved_by": null,
      "resolved_at": null,
      "resolution_note": null
    }
  ],
  "total": 7,
  "page": 1,
  "per_page": 25
}
```

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`

---

### 5.2 Get Issue Detail

`GET /data-quality/issues/{issue_id}`

**Response** `200 OK` — full issue object plus related entities and audit trail for this issue.

```
{
  "issue_id": "ISS-0034",
  ...
  "related_entities": {
    "trip": { "trip_id": "...", "tonnage_status": "...", ... },
    "unit": { "unit_id": "...", "capacity_ton": 35 }
  },
  "audit_trail": [
    {
      "log_id": "AUD-...",
      "action": "ISSUE_STATUS_CHANGED",
      "actor": "u-102",
      "timestamp": "...",
      "before_value": { "status": "OPEN" },
      "after_value": { "status": "IN_REVIEW" },
      "reason": null
    }
  ]
}
```

**Roles:** `DISPATCHER`, `SUPERVISOR`, `ADMIN`

---

### 5.3 Update Issue Status

`PATCH /data-quality/issues/{issue_id}`

**Request Body**

| Field | Type | Required | Description |
|---|---|:---:|---|
| `status` | string | ✅ | `IN_REVIEW` or `RESOLVED` |
| `resolution_note` | string | cond. | **Required when** `status = RESOLVED` |

**Status Codes**
- `200` — updated
- `400` — invalid transition (e.g., `RESOLVED → OPEN`), missing `resolution_note`
- `404` — issue not found

**Allowed transitions:** `OPEN → IN_REVIEW`, `OPEN → RESOLVED`, `IN_REVIEW → RESOLVED`.

**Roles:** `DISPATCHER`, `SUPERVISOR`

**Audit & DQ:** Audit log → `action: ISSUE_STATUS_CHANGED`, before/after status, resolution_note.

---

### 5.4 List Audit Log

`GET /data-quality/audit-log`

**Query Parameters**

| Param | Type | Required | Description |
|---|---|:---:|---|
| `action` | string | ❌ | Filter by action enum (comma-separated) |
| `entity_type` | string | ❌ | `TRIP`, `ASSIGNMENT`, `TONNAGE_RECORD`, `ANOMALY_ISSUE`, `MT_UNIT`, etc. |
| `entity_id` | string | ❌ | Specific entity |
| `actor_user_id` | string | ❌ | — |
| `date_from` | date | ❌ | — |
| `date_to` | date | ❌ | — |
| `page` | integer | ❌ | Default `1` |
| `per_page` | integer | ❌ | Default `50` |

**Response** `200 OK`

```
{
  "data": [
    {
      "log_id": "AUD-20260219-0001",
      "action": "MANUAL_TONNAGE_ENTERED",
      "entity_type": "TRIP",
      "entity_id": "TRP-20260219-0042",
      "actor_user_id": "u-105",
      "actor_name": "Budi",
      "timestamp": "2026-02-19T07:56:00+07:00",
      "before_value": { "tonnage_status": "PENDING", "tonnage_value": null },
      "after_value": { "tonnage_status": "MANUAL", "tonnage_value": 31.0 },
      "reason": "Weighbridge down since 06:45"
    }
  ],
  "total": 340,
  "page": 1,
  "per_page": 50
}
```

**Roles:** `SUPERVISOR`, `ADMIN`

**Note:** Audit log is read-only. No mutation endpoints exist for audit records.

---

## 6 · Integration Ingestion (PTBA Confirmed Tonnage)

### 6.1 Ingest Confirmed Tonnage

`POST /integration/tonnage/confirmed`

**Purpose:** Receive confirmed tonnage from PTBA systems. This endpoint is called by PTBA integration (push mode) or by the portal's own polling adapter (pull mode). documented here as the contract interface regardless of integration mode.

**Request Body**

| Field | Type | Required | Description |
|---|---|:---:|---|
| `external_ticket_id` | string | ✅ | Unique transaction ID from PTBA |
| `unit_id` | string | ✅ | Must match `mt_unit.unit_id` |
| `ts` | timestamp | ✅ | Weighing / confirmation timestamp |
| `net_tonnage` | decimal | ✅ | Net tonnage |
| `source_system` | string | ✅ | `PTBA_WB`, `PTBA_RFID`, `PTBA_PROD_APP` |
| `loading_location_id` | string | ❌ | If available |
| `dumping_location_id` | string | ❌ | If available |
| `gross_tonnage` | decimal | ❌ | Optional |
| `tare_tonnage` | decimal | ❌ | Optional |

**Response** `200 OK`

```
{
  "status": "MATCHED",
  "trip_id": "TRP-20260219-0042",
  "tonnage_status": "CONFIRMED",
  "previous_status": "PENDING",
  "tonnage_record_id": "TONN-0002"
}
```

**Alternative responses:**

| Scenario | Status | Response `status` field |
|---|---|---|
| Matched to PENDING trip | `200` | `MATCHED` |
| Matched to MANUAL trip (reconcile) | `200` | `RECONCILED` — MANUAL record set `is_active=false`, CONFIRMED becomes active |
| Duplicate ticket (idempotent) | `200` | `DUPLICATE_IGNORED` — no new record created |
| No matching trip found | `202` | `UNMATCHED` — tonnage stored; matching retried later or flagged |
| Multiple trips match | `200` | `MULTI_MATCH` — anomaly `TONNAGE_MULTI_MATCH` raised, best match used |
| Unknown `unit_id` | `400` | Error: unit not found in master data |

**Matching strategy** (ref: `05_Integration_Mapping_PTBA.md` §3.1):
1. Direct ticket match (`external_ticket_id`)
2. `unit_id` + nearest trip end within `±MATCHING_TIME_WINDOW_MIN` (default 60 min)
3. `unit_id` + `shift_id` + `dumping_location_id`

**Idempotency:** Duplicate `external_ticket_id` returns `200 DUPLICATE_IGNORED`.

**Roles / Auth:** Service account / integration API key. Not directly accessible to portal users.

**Audit & DQ:**
- Raw inbound payload stored in `tonnage_record.raw_payload`.
- On `RECONCILED`: audit log → `action: TONNAGE_RECONCILED`, before (MANUAL), after (CONFIRMED).
- On `MULTI_MATCH`: anomaly `TONNAGE_MULTI_MATCH` created.
- On `UNMATCHED`: anomaly `TONNAGE_PENDING_TOO_LONG` may trigger later.
- Outlier check against `mt_unit.capacity_ton` → anomaly `TONNAGE_OUTLIER` if outside band.

---

### 6.2 Ingest Confirmed Tonnage (Batch / File Import)

`POST /integration/tonnage/confirmed/batch`

**Purpose:** Bulk import for Mode C (CSV file drop) or batch catch-up.

**Request Body**

| Field | Type | Required | Description |
|---|---|:---:|---|
| `records` | array | ✅ | Array of objects with same fields as §6.1 |

**Response** `200 OK`

```
{
  "total_received": 48,
  "matched": 40,
  "reconciled": 3,
  "duplicates_ignored": 2,
  "unmatched": 2,
  "errors": 1,
  "error_details": [
    { "index": 22, "external_ticket_id": "WB-ERR", "error": "unit_id not found" }
  ]
}
```

**Roles / Auth:** Service account / `ADMIN`

**Audit & DQ:** Same rules as §6.1 applied per record. Each matched/reconciled record generates its own audit entry.

---

## 7 · Master Data

All master data endpoints follow the same pattern. Only unit endpoints shown in full; others follow identical structure.

### 7.1 Units

#### List Units
`GET /master-data/units`

**Query:** `?is_active=true&unit_type=DUMP_TRUCK&search=DT&page=1&per_page=25`

**Response** `200 OK` — paginated list of `mt_unit` records.

**Roles:** `ADMIN`, `SUPERVISOR` (read-only), `DISPATCHER` (read-only)

#### Get Unit
`GET /master-data/units/{unit_id}`

**Response** `200 OK`

#### Create Unit
`POST /master-data/units`

**Request Body:** all fields from `mt_unit` schema (ref: `02_DataModel_Schema.md` §2.1).

**Response** `201 Created`

**Roles:** `ADMIN`

**Audit:** `action: MASTER_DATA_CHANGED`, entity_type: `MT_UNIT`, after_value. (P1 recommended; see backlog US-P1-005.)

#### Update Unit
`PATCH /master-data/units/{unit_id}`

**Request Body:** partial update of `mt_unit` fields.

**Response** `200 OK`

**Roles:** `ADMIN`

**Audit:** before/after values of changed fields.

#### Deactivate Unit
`PATCH /master-data/units/{unit_id}` with `{ "is_active": false }`

Same as update. Unit removed from Fleet Board but retained in historical data.

---

### 7.2 Locations

| Action | Method + Path |
|---|---|
| List | `GET /master-data/locations` |
| Get | `GET /master-data/locations/{location_id}` |
| Create | `POST /master-data/locations` |
| Update | `PATCH /master-data/locations/{location_id}` |

**Query filters:** `?location_role=DUMPING&is_active=true&search=jetty`

**Body schema:** per `mt_location` in data model. `latitude` / `longitude` are optional — no map tracking dependency.

**Roles:** `ADMIN` (write), `DISPATCHER` / `SUPERVISOR` (read)

---

### 7.3 Shifts

| Action | Method + Path |
|---|---|
| List | `GET /master-data/shifts` |
| Get | `GET /master-data/shifts/{shift_id}` |
| Create | `POST /master-data/shifts` |
| Update | `PATCH /master-data/shifts/{shift_id}` |

**Body schema:** per `mt_shift` in data model.

**Roles:** `ADMIN`

---

### 7.4 Users & Roles

| Action | Method + Path |
|---|---|
| List users | `GET /master-data/users` |
| Get user | `GET /master-data/users/{user_id}` |
| Create user | `POST /master-data/users` |
| Update user | `PATCH /master-data/users/{user_id}` |

**Body schema:** per `mt_user` in data model. `role` enum: `ADMIN`, `DISPATCHER`, `CHECKER`, `SUPERVISOR`.

**Roles:** `ADMIN`

---

## 8 · Export

### 8.1 Request Export

`POST /export`

**Purpose:** Request an async export job. Returns a job ID for polling / download.

**Request Body**

| Field | Type | Required | Description |
|---|---|:---:|---|
| `export_type` | enum | ✅ | `TRIPS`, `PRODUCTION_AGGREGATE`, `AVAILABILITY`, `ANOMALIES`, `AUDIT_LOG` |
| `format` | enum | ✅ | `CSV` (P0). `XLSX` (P1 — optional) |
| `date_from` | date | ✅ | — |
| `date_to` | date | ✅ | — |
| `shift_id` | string | ❌ | — |
| `unit_id` | string | ❌ | — |
| `filters` | object | ❌ | Additional filters matching list endpoint params for the type |

**Response** `202 Accepted`

```
{
  "job_id": "EXP-20260219-001",
  "export_type": "TRIPS",
  "format": "CSV",
  "status": "PROCESSING",
  "created_at": "2026-02-19T09:00:00+07:00"
}
```

**Roles:** `SUPERVISOR`, `ADMIN`

---

### 8.2 Check Export Status

`GET /export/{job_id}`

**Response** `200 OK`

```
{
  "job_id": "EXP-20260219-001",
  "status": "COMPLETED",
  "download_url": "/api/v1/export/EXP-20260219-001/download",
  "row_count": 186,
  "file_size_bytes": 24500,
  "expires_at": "2026-02-19T21:00:00+07:00"
}
```

**Status values:** `PROCESSING`, `COMPLETED`, `FAILED`

---

### 8.3 Download Export File

`GET /export/{job_id}/download`

**Response** `200 OK` — binary file download (Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).

**Status Codes**
- `200` — file ready
- `404` — job not found or expired
- `409` — job not yet completed

**Roles:** `SUPERVISOR`, `ADMIN`

---

### 8.4 Export CSV Column Reference

| Export Type | Key Columns |
|---|---|
| `TRIPS` | trip_id, unit_id, unit_name, shift, loading_location, dumping_location, timestamps, tonnage_value, **tonnage_status**, **tonnage_source_system**, entered_by |
| `PRODUCTION_AGGREGATE` | date, shift, total_ritase, tonnage_confirmed, tonnage_manual, tonnage_pending_trips, tonnage_coverage_pct |
| `AVAILABILITY` | date, shift, unit_id, unit_name, running_min, standby_min, delay_min, breakdown_min, pa_pct, ua_pct, completeness_pct |
| `ANOMALIES` | issue_id, issue_type, severity, status, unit_id, trip_id, created_at, resolved_at, resolution_note |
| `AUDIT_LOG` | log_id, action, entity_type, entity_id, actor, timestamp, before_value, after_value, reason |

---

## 9 · Common Error Response Shape

All error responses follow a consistent structure:

```
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "manual_reason is required for manual tonnage entry",
    "details": [
      { "field": "manual_reason", "issue": "required" }
    ]
  }
}
```

**Standard status codes used across all endpoints:**

| Code | Meaning |
|---|---|
| `200` | Success (read / update) |
| `201` | Created |
| `202` | Accepted (async processing) |
| `400` | Validation error / bad request |
| `401` | Unauthorized (missing / invalid token) |
| `403` | Forbidden (role not permitted) |
| `404` | Resource not found |
| `409` | Conflict (duplicate, invalid state transition) |
| `500` | Internal server error |

---

## 10 · RBAC Summary Matrix

| Endpoint Group | ADMIN | DISPATCHER | CHECKER | SUPERVISOR |
|---|:---:|:---:|:---:|:---:|
| Fleet Board (read) | ✅ | ✅ | ❌ | ✅ |
| Unit Timeline | ✅ | ✅ | ❌ | ✅ |
| Assignments (create/update) | ❌ | ✅ | ❌ | ❌ |
| Assignments (read) | ✅ | ✅ | ❌ | ✅ |
| Trips (read) | ✅ | ✅ | ✅ | ✅ |
| Manual Tonnage (create) | ❌ | ❌ | ✅ | ❌ |
| Production Aggregates | ✅ | ✅ | ❌ | ✅ |
| Availability (read) | ✅ | ✅ | ❌ | ✅ |
| Availability (adjust) | ✅ | ❌ | ❌ | ✅ |
| Anomaly Issues (read) | ✅ | ✅ | ❌ | ✅ |
| Anomaly Issues (update) | ❌ | ✅ | ❌ | ✅ |
| Audit Log (read) | ✅ | ❌ | ❌ | ✅ |
| Master Data (write) | ✅ | ❌ | ❌ | ❌ |
| Master Data (read) | ✅ | ✅ | ❌ | ✅ |
| Export | ✅ | ❌ | ❌ | ✅ |
| Integration Ingestion | 🔑 service | ❌ | ❌ | ❌ |

---

*Document generated: 2026-02-19 · Aligned with `/docs` v1 and `/artifacts/02_DataModel_Schema.md` · No map tracking endpoints · No dispatch optimization endpoints*
