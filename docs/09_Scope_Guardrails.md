# 09 — Scope Guardrails (POC PTBA CHT Hauling Web Portal)

Dokumen ini adalah **pagar pembatas** agar POC tetap fokus, tidak melebar, dan tidak overspec.

---

## 1) In Scope (Web Portal POC)

### A. Live Fleet Board
- Tampilan live status unit (tabel/board) untuk operasional.
- Status aktivitas terakhir (mis. P2H, loading, hauling/travel, dumping, standby, breakdown/delay).
- **Last update timestamp** + indikator data **stale/telat**.
- Drill-down ringkas per unit (timeline event shift berjalan).

### B. Dispatch sederhana (radio-friendly)
- Assign unit ke tujuan (dumping) + opsional lokasi loading.
- Status assignment: **Assigned → In Progress → Completed** (manual atau dari event).
- Catatan dispatch (free text) untuk konteks komunikasi radio.
- Log perubahan assignment (**audit trail**).

> Catatan: tidak ada optimisasi dispatch (lihat Out of Scope).

### C. Production Dashboard
- KPI ritase & tonase per shift/hari.
- Breakdown per lokasi loading/dumping, tipe unit (own/rental), periode.
- **Status tonase wajib**: `CONFIRMED / PENDING / MANUAL`.
  - **CONFIRMED**: dari sistem PTBA (weighbridge/RFID/aplikasi produksi).
  - **PENDING**: trip ada, tonase belum masuk.
  - **MANUAL**: fallback input checker saat breakdown.

### D. Availability / PA–UA
- Rekap jam kerja/jam jalan vs downtime (breakdown/delay/standby) per unit per shift/hari.
- Perhitungan PA/UA berbasis data yang tersedia + label **data completeness/coverage**.

### E. Data Quality & Audit
- Panel isu/anomali data (mis. pending tonase, duplikasi trip, outlier tonase, timestamp hilang).
- Workflow review sederhana (acknowledge/resolve) untuk isu tertentu.
- **Audit trail wajib** untuk perubahan manual: siapa, kapan, apa yang diubah, alasan, before/after.

### F. Master Data
- Unit, tipe unit, ownership (own/rental), status aktif.
- Lokasi loading & dumping (stockpile, jetty, hopper, transit/endstock).
- Shift & kalender operasi (minimal untuk agregasi).
- User & role (RBAC sederhana: Dispatch/CCR, Checker, Supervisor, Admin).

### G. Export
- Export CSV/XLSX (minimal CSV) untuk:
  - Trip/production (termasuk status tonase)
  - Availability/PA-UA
  - Data quality issues & audit log (sesuai kebutuhan)

### H. Integrasi (minimum viable)
- Consume data **confirmed tonnage** dari sistem PTBA.
- Reconcile **pending → confirmed**.
- Mendukung fallback manual bila integrasi/alat upstream bermasalah.

---

## 2) Out of Scope (Anti-overspec)

### A. Map tracking wajib
- Tidak mewajibkan peta, GPS, geofence, atau live route tracking.
- Jika suatu saat ada lokasi/koordinat, itu **opsional** dan **bukan** acceptance criteria POC.

### B. Dispatch optimization / algorithmic dispatch
- Tidak ada auto-assign, balancing, shortest path, queue optimization, atau rekomendasi rute otomatis.
- Tidak ada simulasi strategi dispatch atau model predictive.

### C. Sistem produksi utama pengganti PTBA
- Web portal **bukan** pengganti aplikasi produksi PTBA.
- Portal hanya menampilkan, merekonsiliasi, dan mengaudit data produksi (ritase/tonase).

### D. Dependensi device & MDT advanced sebagai syarat
- POC tidak mensyaratkan setiap unit memiliki MDT/handheld canggih.
- Komunikasi radio dan input manual checker tetap dianggap normal.

### E. Advanced analytics & ML
- Tidak ada forecasting produksi, anomaly ML, atau model perilaku alat.
- Anomali menggunakan rule sederhana (lihat Anomaly Rules di dokumen Data Quality/Audit).

### F. Workflow kompleks & approvals bertingkat
- Tidak ada multi-step approvals rumit.
- Approval koreksi dapat dibatasi sebagai “Supervisor review” bila diperlukan, tapi **bukan** governance full.

---

## 3) Asumsi POC

1. **Operasional fleksibel**: weighbridge dapat breakdown, sehingga input manual checker harus tersedia.
2. Integrasi data PTBA untuk tonase **mungkin terlambat** → sistem harus mendukung status `PENDING`.
3. Ada rute/flow yang tidak selalu melewati weighbridge → trip bisa tercatat tanpa tonase confirmed.
4. Data event minimal (loading/dumping/activity) tersedia dari kombinasi:
   - input CCR/checker/operator, dan/atau
   - sumber otomatis terbatas (bila ada).
5. PA/UA dihitung dari data yang tersedia; sistem harus menampilkan **data coverage** agar hasil tidak menyesatkan.
6. Satu portal dipakai oleh beberapa peran: Dispatch/CCR, Checker, Supervisor, Admin (RBAC sederhana).
7. POC fokus pada keterpakaian operasional harian, bukan perfect automation.

---

## 4) Definisi Sukses (Acceptance Criteria singkat)

POC dianggap sukses bila memenuhi semua poin berikut:

### Live Monitoring
- Fleet Board menampilkan seluruh unit aktif, status aktivitas terakhir, last update, dan penanda stale.

### Dispatch sederhana
- CCR dapat membuat assignment unit → tujuan, melihat status assignment, dan semua perubahan tercatat di audit.

### Produksi (ritase & tonase)
- Dashboard produksi menampilkan ritase + tonase dengan status **CONFIRMED/PENDING/MANUAL**.
- Saat confirmed tonnage masuk belakangan, trip `PENDING` otomatis berubah menjadi `CONFIRMED`.
- Saat weighbridge breakdown, checker bisa input `MANUAL` dengan alasan, dan perubahan tercatat.

### Reconciliation + Audit
- Jika data `CONFIRMED` masuk untuk trip yang sebelumnya `MANUAL`, sistem:
  - menjadikan `CONFIRMED` sebagai nilai utama, dan
  - menyimpan nilai `MANUAL` di history/audit (tidak hilang).

### Data Quality
- Sistem menandai anomali dasar (minimal: pending tonase, duplikasi trip, outlier tonase, timestamp hilang) dan menyediakan daftar isu untuk ditinjau.
- Semua edit manual dan aksi resolve isu tercatat di audit trail.

### Availability (PA/UA)
- Sistem menampilkan ringkasan PA/UA per unit per shift/hari, plus indikator data completeness.

### Export
- User dapat export data produksi & availability, dan export memuat status tonase serta referensi audit bila relevan.

---

## 5) Daftar Istilah (Glossary)

- **PTBA**: PT Bukit Asam (pemilik operasi / pihak tender).
- **POC**: Proof of Concept; implementasi terbatas untuk membuktikan solusi.
- **CHT (Coal Hauling Truck / Contract Hauling Truck)**: armada hauling (biasanya dump truck) untuk angkut batubara dari stockpile ke stockpile/jetty.
- **Hauling**: aktivitas pengangkutan material dari loading point ke dumping point.
- **Ritase**: 1 kali perjalanan/1 trip pengangkutan yang dihitung sebagai unit produksi.
- **Tonase**: berat muatan (ton) untuk trip/ritase tertentu.
- **Weighbridge**: jembatan timbang; sistem penimbang (bisa terintegrasi RFID/QR/tiket).
- **RFID**: teknologi identifikasi menggunakan radio frequency; sering dipakai untuk identitas kendaraan/tiket.
- **CCR (Central Control Room)**: tim/pos kontrol operasional (sering menjadi peran “dispatch”).
- **Checker**: petugas lapangan/timbang yang dapat input/validasi data manual.
- **Loading location**: lokasi muat (mis. stockpile/loading point).
- **Dumping location**: lokasi bongkar (mis. stockpile tujuan, jetty, hopper, transit/endstock).
- **Shift**: pembagian waktu kerja (mis. shift 1/2/3) untuk agregasi produksi & performa.
- **Availability**: ukuran ketersediaan alat untuk beroperasi.
- **PA (Physical Availability)**: persentase waktu alat “tersedia secara fisik” (tidak breakdown) pada periode tertentu. Definisi detail mengikuti standar internal PTBA.
- **UA (Utilization Availability / Utilization)**: ukuran pemanfaatan alat saat tersedia (berapa banyak benar-benar digunakan). Definisi detail mengikuti standar internal PTBA.
- **Data coverage / completeness**: indikator seberapa lengkap data event yang masuk untuk perhitungan metrik.
- **Audit trail**: catatan perubahan (who/when/what/why) termasuk before/after.
- **Anomaly / data issue**: indikasi data bermasalah/aneh (mis. duplikasi, outlier, missing timestamp, pending tonase terlalu lama).
- **CONFIRMED tonnage**: tonase yang disahkan dari sistem PTBA (weighbridge/RFID/aplikasi produksi).
- **PENDING tonnage**: trip tercatat tetapi tonase belum diterima dari sistem PTBA.
- **MANUAL tonnage**: tonase input manual oleh checker saat fallback; harus ada alasan dan audit.

---

## 6) Referensi Dokumen
- Lihat **/docs/01_PRD_Web_Portal.md** untuk ruang lingkup modul.
- Lihat **/docs/02_Metrics_Definitions.md** untuk definisi metrik (PA/UA, ritase, dsb).
- Lihat **/docs/03_Event_Dictionary.md** untuk definisi event & status.
- Lihat **/docs/05_Integration_Mapping_PTBA.md** untuk mapping integrasi confirmed tonnage.
- Lihat **/docs/06_UAT_Test_Scenarios.md** untuk baseline UAT.
