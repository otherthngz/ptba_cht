# Integration Mapping — PTBA Confirmed Tonnage (POC)

## 1) Integration Goal
Portal POC membutuhkan **tonase confirmed** sebagai sumber kebenaran dari sistem PTBA, dengan perilaku:
- Jika confirmed belum masuk → `PENDING`
- Jika weighbridge breakdown → checker input `MANUAL`
- Jika confirmed masuk belakangan → reconcile dan gunakan `CONFIRMED` untuk reporting (manual tetap tersimpan untuk audit)

Confirmed tonnage dapat datang dari salah satu (atau kombinasi):
- Weighbridge system
- RFID system
- Aplikasi produksi

---

## 2) Data Contract (Minimal Fields)
### 2.1 Confirmed Tonnage Payload (Inbound)

| Field | Required | Notes |
|---|---:|---|
| `external_ticket_id` | ✅ | id unik transaksi timbang/produksi |
| `unit_id` | ✅ | harus match master data unit |
| `ts` | ✅ | timestamp timbang / confirmation time |
| `net_tonnage` | ✅ | tonase bersih |
| `source_system` | ✅ | `PTBA_WB` / `PTBA_RFID` / `PTBA_PROD_APP` |
| `loading_location_id` | ❌ | jika tersedia |
| `dumping_location_id` | ❌ | jika tersedia |
| `gross_tonnage` | ❌ | opsional |
| `tare_tonnage` | ❌ | opsional |

### 2.2 Manual Tonnage Payload (Portal)

| Field | Required | Notes |
|---|---:|---|
| `unit_id` | ✅ | |
| `ts` | ✅ | time of trip / reference time |
| `manual_tonnage` | ✅ | |
| `manual_reason` | ✅ | why fallback is used |
| `entered_by` | ✅ | checker user |
| `attachment_ref` | ❌ | optional evidence |

---

## 3) Matching & Reconciliation Strategy (POC)
Because confirmed data may arrive late or without perfect keys, POC uses a pragmatic approach.

### 3.1 Matching Keys (priority order)
1) **Direct ticket match** (best)
- If portal trip has `external_ticket_id` or can be derived from inbound

2) **Unit + Time Window** (fallback)
- Match by `unit_id`
- Find nearest trip end timestamp within configurable window (e.g., ±60 minutes)

3) **Unit + Shift + Location** (fallback+)
- Match by `unit_id`, `shift_id`, `dumping_location_id` (if provided)

### 3.2 Conflict Handling Rules
- If multiple trips match one ticket → flag anomaly `TONNAGE_MULTI_MATCH`
- If one trip receives multiple tickets → flag anomaly `TONNAGE_DUPLICATE_TICKET`

### 3.3 State transitions
- Trip created without tonnage → `PENDING`
- Confirmed tonnage arrives → `CONFIRMED`
- Manual tonnage entered → `MANUAL`
- Manual exists and confirmed arrives later → trip becomes `CONFIRMED`, manual stored as historical record

---

## 4) Integration Modes (choose what PTBA can support)
### Mode A — API Push (preferred)
PTBA pushes confirmed tonnage events to portal endpoint.

### Mode B — API Pull
Portal polls PTBA endpoint per interval (e.g., 1–5 minutes) for new tickets.

### Mode C — File Drop (CSV)
PTBA exports CSV per shift/day. Portal imports and reconciles.

### Mode D — Database View
Portal reads from a read-only DB view exposed by PTBA (restricted network).

---

## 5) Operational Safeguards
- Retry + idempotency using `external_ticket_id`
- Store raw inbound payloads for audit
- Rate limit & dead-letter queue (if implemented) for bad records

---

## 6) Data Quality Hooks (integration-related anomalies)
- `TONNAGE_PENDING_TOO_LONG`: pending > threshold hours
- `TONNAGE_OUTLIER`: tonnage outside expected range by unit capacity
- `TONNAGE_MULTI_MATCH`: one ticket matches multiple trips
- `TONNAGE_DUPLICATE_TICKET`: same ticket ingested twice

