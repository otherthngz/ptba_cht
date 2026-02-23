# PRD — PTBA CHT Hauling Web Portal (POC)

## 1. Overview
### 1.1 Background
PTBA menjalankan operasi **CHT hauling ±15 km** dari **stockpile ke stockpile/jetty**. POC ini menargetkan portal web yang memberi:
- Visibilitas operasional real-time-ish
- Rekap produksi (ritase + tonase)
- Performa alat (Availability / PA–UA)
- Kepercayaan data (Data Quality + Audit)

### 1.2 Product Goal (POC)
Menyediakan **Web Portal** yang cukup untuk operasi harian dan pelaporan awal, dengan desain yang:
- Tidak overspec
- Tahan terhadap kondisi lapangan (weighbridge bisa breakdown; input manual checker tetap jalan)
- Tonase mengikuti **source of truth PTBA** saat tersedia

### 1.3 Success Criteria
POC dianggap sukses jika:
1) User bisa melihat status unit + assignment + aktivitas terakhir (Live Fleet Board)
2) Produksi menampilkan **ritase** dan **tonase** dengan 3 status: **CONFIRMED / PENDING / MANUAL**
3) Availability (PA/UA) tersedia per shift/per hari, dengan indikator completeness
4) Ada **anomaly detection rules** dan **audit trail** sehingga data bisa ditelusuri
5) Data dapat diexport untuk kebutuhan operasional

## 2. Scope
### 2.1 In Scope
- Live Fleet Board
- Dispatch sederhana (assignment tracking)
- Production Dashboard
- Availability (PA/UA)
- Data Quality & Audit
- Master Data
- Export

### 2.2 Out of Scope (Non-Goals)
- **Map tracking wajib** (opsional untuk masa depan; bukan dependency POC)
- **Dispatch optimization** (auto balancing, shortest path, queue optimization, dsb)
- Menggantikan sistem produksi PTBA / weighbridge (portal hanya ingest & reconcile)
- Full mobile workflow untuk semua operator (radio/CCR tetap valid)

## 3. Users & Roles
### 3.1 Personas
- **Dispatcher / CCR**: monitor fleet, buat assignment, cek produksi ringkas, flag data issues
- **Checker / Weighbridge Operator**: input manual tonase saat fallback, validasi data
- **Supervisor**: review KPI produksi & PA/UA, review koreksi
- **Admin**: master data, user management sederhana, export

### 3.2 RBAC (minimal untuk POC)
- Dispatcher: view fleet, create/update assignment, view production/availability, create issue notes
- Checker: create manual tonnage entry, view trip list, submit corrections (limited)
- Supervisor: approve certain corrections (optional), view dashboards, export
- Admin: manage master data, manage users, configure integration mapping

## 4. Key Concepts
### 4.1 Trip / Hauling Cycle
Satu **Trip** merepresentasikan satu ritase hauling:
- Load → Travel → Dump

Trip tetap boleh tercatat meski tonase belum ada.

### 4.2 Tonnage State Machine (mandatory)
- `PENDING`: trip tercatat tetapi tonase confirmed belum masuk dari PTBA
- `CONFIRMED`: tonase confirmed diterima dari sistem PTBA (weighbridge/RFID/aplikasi produksi)
- `MANUAL`: tonase diinput oleh checker saat fallback (mis. weighbridge breakdown)

**Reconcile rule (POC default):**
- Bila data `CONFIRMED` masuk setelah `MANUAL`, maka `CONFIRMED` menjadi nilai aktif untuk reporting, namun nilai manual tetap tersimpan untuk audit (tidak dihapus).

### 4.3 Data Quality & Audit (mandatory)
- Semua perubahan manual atau koreksi harus menghasilkan **audit trail**: who/when/what/before-after/reason
- Sistem menerapkan **anomaly rules** untuk mendeteksi data yang perlu review

## 5. Functional Requirements

### 5.1 Live Fleet Board
**Goal:** satu layar untuk mengetahui “apa yang terjadi sekarang”.

**Must Have**
- Daftar unit aktif: `unit_id`, tipe, ownership (own/rental), last activity, last update time, current assignment
- Status konektivitas sederhana: `OK / STALE / NO DATA`
- Filter: unit type, ownership, assignment destination, status
- Drill-down per unit: timeline event (shift berjalan)

**Nice to Have (POC+)**
- Bulk tag/notes untuk unit (mis. “prioritas jetty”)

### 5.2 Simple Dispatch (Assignment Tracking)
**Goal:** CCR dapat memberi tujuan, tanpa optimisasi.

**Must Have**
- Create assignment: pilih unit → pilih destination (dumping location) + optional loading location
- Status assignment: `ASSIGNED → IN_PROGRESS → COMPLETED`
- Manual update status + auto update jika event memungkinkan
- Notes (free text)

**Explicitly Not Included**
- Auto-dispatch
- Queue/time optimization

### 5.3 Production Dashboard
**Goal:** produksi ritase + tonase yang jujur terhadap sumber data.

**Must Have**
- KPI: total ritase, total tonase
- Tonnage breakdown wajib: `CONFIRMED`, `PENDING`, `MANUAL`
- Breakdown: by loading location, dumping location, unit type, ownership
- Trip list table: setiap trip menampilkan state tonase + source
- Export trip-level & aggregated

### 5.4 Availability / PA–UA
**Goal:** ringkas performa & downtime berbasis event.

**Must Have**
- Rekap per unit per shift: running time, standby, delay, breakdown, total hours
- Output PA/UA sesuai definisi (lihat `02_Metrics_Definitions.md`)
- Indikator **Data Completeness** per unit/shift

**Constraints**
- POC menerima input manual untuk kategori tertentu bila sensor/event belum lengkap

### 5.5 Data Quality & Audit
**Goal:** meningkatkan trust & traceability.

**Must Have**
- Data Quality page:
  - daftar anomaly (rule-based)
  - filter by type, severity, date, unit
  - status resolution: `OPEN → IN_REVIEW → RESOLVED`
- Audit log:
  - semua manual edits (assignment changes, manual tonnage, trip corrections)
  - before/after values + reason
- Export anomaly list + audit log

### 5.6 Master Data
**Goal:** operasi berjalan tanpa hardcode.

**Must Have**
- Units, Locations (loading/dumping), Shifts, Users/Roles
- Active/inactive toggles
- Ownership (own/rental) & unit type

### 5.7 Export
**Must Have**
- CSV minimal untuk:
  - Trips (trip-level)
  - Production aggregate (daily/shift)
  - Availability (unit x shift)
  - Anomalies + audit logs
- XLSX optional

## 6. Key Screens (Web Portal)
- Fleet Board
- Dispatch
- Production
- Availability
- Data Quality
- Master Data
- Export

## 7. Data & Reporting Rules
- Trip dapat eksis tanpa tonase
- Reporting tonase default menggunakan `CONFIRMED` jika ada; jika tidak, gunakan `MANUAL` dengan label
- Semua data yang berasal dari manual input harus diberi label `MANUAL` dan disertai reason

## 8. Risks & Mitigations
- **Weighbridge down / integration delay** → PENDING & MANUAL fallback
- **Data gap event** → Completeness indicator + anomaly rules
- **Perbedaan definisi PA/UA** → definisi dikunci di `02_Metrics_Definitions.md` dan disepakati PTBA saat kickoff

## 9. Milestones (POC suggestion)
- M1: Master Data + Fleet Board skeleton
- M2: Trip ingestion + Production dashboard (PENDING/CONFIRMED)
- M3: Manual tonnage + Audit + Anomaly rules
- M4: Availability + Export + UAT
