# Master Data Template — PTBA CHT Web Portal POC

This document provides master data structures required for the POC.

Principles:
- No hardcoding locations or units
- Active/inactive toggles for operational control
- Ownership and type are first-class fields

---

## 1) Units (`mt_unit`)

| Field | Type | Required | Example | Notes |
|---|---|---:|---|---|
| `unit_id` | string | ✅ | DT-043 | unique identifier |
| `unit_name` | string | ✅ | DT 043 | display |
| `unit_type` | enum | ✅ | `DUMP_TRUCK` | extendable: `LOADER`, `SUPPORT` |
| `ownership` | enum | ✅ | `OWN` / `RENTAL` | required |
| `vendor_name` | string | ❌ | ABC Rental | for rentals |
| `capacity_ton` | number | ❌ | 35 | optional |
| `is_active` | boolean | ✅ | true | active in fleet board |
| `notes` | text | ❌ | - | optional |

---

## 2) Locations (`mt_location`)

All locations share the same table with a `location_role`.

| Field | Type | Required | Example | Notes |
|---|---|---:|---|---|
| `location_id` | string | ✅ | DUMP-JTY-01 | unique |
| `location_name` | string | ✅ | Jetty Stockpile 1 | display |
| `location_role` | enum | ✅ | `LOADING` / `DUMPING` / `OTHER` | mandatory |
| `is_active` | boolean | ✅ | true | |
| `sort_order` | number | ❌ | 10 | optional |
| `notes` | text | ❌ | - | |

**POC note:** dumping locations can be many (stockpile/jetty/hopper/transit). Keep naming consistent.

---

## 3) Shifts (`mt_shift`)

| Field | Type | Required | Example |
|---|---|---:|---|
| `shift_id` | string | ✅ | SHIFT-A |
| `shift_name` | string | ✅ | Shift A |
| `start_time` | time | ✅ | 07:00 |
| `end_time` | time | ✅ | 19:00 |
| `timezone` | string | ✅ | Asia/Jakarta |
| `is_active` | boolean | ✅ | true |

---

## 4) Users (`mt_user`) & Roles (`mt_role`)

### Roles (POC)
- `ADMIN`
- `DISPATCHER`
- `CHECKER`
- `SUPERVISOR`

### User fields

| Field | Type | Required | Example |
|---|---|---:|---|
| `user_id` | string | ✅ | u-102 |
| `full_name` | string | ✅ | Nanda |
| `role` | enum | ✅ | DISPATCHER |
| `is_active` | boolean | ✅ | true |

---

## 5) Delay / Breakdown Categories (Optional but recommended)

### Delay categories (`mt_delay_category`)
| Field | Type | Required | Example |
|---|---|---:|---|
| `category_id` | string | ✅ | DEL-QUEUE |
| `category_name` | string | ✅ | Queue at loading |
| `is_active` | boolean | ✅ | true |

### Breakdown categories (`mt_breakdown_category`)
| Field | Type | Required | Example |
|---|---|---:|---|
| `category_id` | string | ✅ | BD-TIRE |
| `category_name` | string | ✅ | Tire issue |
| `is_active` | boolean | ✅ | true |

---

## 6) Export Templates (CSV headers)

### Units export
`unit_id,unit_name,unit_type,ownership,vendor_name,capacity_ton,is_active,notes`

### Locations export
`location_id,location_name,location_role,is_active,sort_order,notes`

### Shifts export
`shift_id,shift_name,start_time,end_time,timezone,is_active`

