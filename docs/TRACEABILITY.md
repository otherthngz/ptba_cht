# Traceability Matrix -- PTBA CHT Web Portal

Maps each implemented feature/module to its source document and section.

---

## Dashboard Overview (`/dashboard`)

| Feature | Source | Section |
|---|---|---|
| KPI summary cards (10 metrics) | `/docs/02_Metrics_Definitions.md` | All metric sections |
| Fleet/Dispatch/Production/Availability/DQ/Audit previews | `/docs/01_PRD_Web_Portal.md` | All module sections |
| No polling on dashboard | `/docs/09_Scope_Guardrails.md` | Polling constraint |

---

## Fleet Board (`/fleet`)

| Feature | Source | Section |
|---|---|---|
| Feature | Source | Section |
|---|---|---|
| Unit list with unitId, type, ownership | `/docs/01_PRD_Web_Portal.md` | §5.1 Live Fleet Board |
| Polling (5-10s) | `/docs/08_FE_Guidance_Nuxt_UI.md` | Polling guidance |
| Stale status (last update > 10m) | `/docs/02_Metrics_Definitions.md` | §3.1 Staleness Rate |
| Open Issue Count in table | `/docs/01_PRD_Web_Portal.md` | §5.1 Must Have (Issues integration) |
| Unit Detail Slideover (Timeline, Trips) | `/docs/01_PRD_Web_Portal.md` | §5.1 Detail View |
| Filters: Search, Ownership, Stale | `/docs/01_PRD_Web_Portal.md` | §5.1 Must Have |

## Dispatch (`/dispatch`)

| Feature | Source | Section |
|---|---|---|
| Create assignment: unit → destination | `/docs/01_PRD_Web_Portal.md` | §5.2 Simple Dispatch |
| Optional loading location | `/docs/09_Scope_Guardrails.md` | §1.B Dispatch sederhana |
| Status flow: ASSIGNED → IN_PROGRESS → COMPLETED | `/docs/01_PRD_Web_Portal.md` | §5.2 Must Have |
| Notes (free text) | `/docs/01_PRD_Web_Portal.md` | §5.2 Must Have |
| Audit trail on changes | `/docs/09_Scope_Guardrails.md` | §1.B |
| No auto-dispatch / optimization | `/docs/09_Scope_Guardrails.md` | §2.B Out of Scope |

## Production (`/production`)

| Feature | Source | Section |
|---|---|---|
| KPI: Total Trips | `/docs/02_Metrics_Definitions.md` | §1.1 Trip Count |
| KPI: Tonnage Breakdown (Confirmed/Manual) | `/docs/02_Metrics_Definitions.md` | §1.2 Total Tonnage |
| KPI: Coverage % | `/docs/02_Metrics_Definitions.md` | §1.3 Tonnage Coverage |
| Trip list with status badges | `/docs/01_PRD_Web_Portal.md` | §5.3 Must Have |
| Manual tonnage entry (Reason + Actor) | `/docs/01_PRD_Web_Portal.md` | §4.2 Tonnage State Machine |
| Confirm Feed overrides Manual rule | `/docs/01_PRD_Web_Portal.md` | §4.2 Reconcile rule |
| History + Audit in Slideover | `/docs/09_Scope_Guardrails.md` | §4 Reconciliation + Audit |
| Simulate Feed Action | `/docs/06_UAT_Test_Scenarios.md` | Simulation Scenario |

## Availability (`/availability`)

| Feature | Source | Section |
|---|---|---|
| Time buckets: running, standby, delay, breakdown | `/docs/02_Metrics_Definitions.md` | §2.1 Time Buckets |
| PA formula | `/docs/02_Metrics_Definitions.md` | §2.3 Physical Availability |
| UA formula | `/docs/02_Metrics_Definitions.md` | §2.4 Use of Availability |
| Data completeness indicator | `/docs/02_Metrics_Definitions.md` | §2.5 Data Completeness |
| Completeness thresholds (90+/60-89/<60) | `/docs/02_Metrics_Definitions.md` | §2.5 Interpretation |
| Manual adjustment with audit | `/docs/09_Scope_Guardrails.md` | §1.D |

## Data Quality (`/data-quality`)

| Feature | Source | Section |
|---|---|---|
| Anomaly rules: pending too long | `/docs/09_Scope_Guardrails.md` | §1.E + §4 Data Quality |
| Anomaly rules: duplicate trip | `/docs/02_Metrics_Definitions.md` | §1.1 Counting rules |
| Anomaly rules: tonnage outlier | `/docs/09_Scope_Guardrails.md` | §4 Data Quality |
| Anomaly rules: stale unit updates | `/docs/02_Metrics_Definitions.md` | §3.1 Staleness Rate |
| Anomaly rules: low completeness | `/docs/02_Metrics_Definitions.md` | §2.5 Data Completeness |
| Issue workflow: OPEN → IN_REVIEW → RESOLVED | `/docs/01_PRD_Web_Portal.md` | §5.5 Must Have |
| Audit trail (who/when/what/before-after/reason) | `/docs/01_PRD_Web_Portal.md` | §4.3 Data Quality & Audit |
| Filter by type, severity, status | `/docs/01_PRD_Web_Portal.md` | §5.5 Must Have |

## Master Data (`/master-data`)

| Feature | Source | Section |
|---|---|---|
| Units (type, ownership, active) | `/docs/04_Master_Data_Template.md` | Units |
| Locations (loading/dumping, role) | `/docs/04_Master_Data_Template.md` | Locations |
| Shifts (start/end, timezone) | `/docs/04_Master_Data_Template.md` | Shifts |
| Read-only in prototype | `/docs/01_PRD_Web_Portal.md` | §5.6 Master Data |

## Reports / Export (`/reports`)

| Feature | Source | Section |
|---|---|---|
| CSV export: trips (with tonnage status) | `/docs/01_PRD_Web_Portal.md` | 5.7 Export |
| CSV export: availability | `/docs/01_PRD_Web_Portal.md` | 5.7 Export |
| CSV export: anomalies + audit | `/docs/01_PRD_Web_Portal.md` | 5.7 Export |
| Analytics: tonnage by status chart | `/docs/02_Metrics_Definitions.md` | 1.2 Tonnage |
| Analytics: issues by type chart | `/docs/09_Scope_Guardrails.md` | 4 Data Quality |
| Analytics: availability breakdown | `/docs/02_Metrics_Definitions.md` | 2.1 Time Buckets |

## Layout & Navigation

| Feature | Source | Section |
|---|---|---|
| Collapsible sidebar (Nuxt UI Dashboard Template) | `/docs/08_FE_Guidance_Nuxt_UI.md` | Dashboard guidance |
| Master Data as submenu (/units, /locations, /shifts) | `/docs/04_Master_Data_Template.md` | Tables |
| Dark/Light mode toggle | `/docs/08_FE_Guidance_Nuxt_UI.md` | Color mode |
| KPI metric cards per module | `/docs/02_Metrics_Definitions.md` | All sections |

## Dispatch Board View

| Feature | Source | Section |
|---|---|---|
| Board lanes by destination | `/docs/01_PRD_Web_Portal.md` | 5.2 Simple Dispatch |
| Card with unit, status, notes, actions | `/docs/01_PRD_Web_Portal.md` | 5.2 Must Have |
| New Assignment modal | `/docs/01_PRD_Web_Portal.md` | 5.2 Must Have |

## Data Simulation

| Feature | Source | Section |
|---|---|---|
| POST /api/simulate/tick endpoint | `/docs/06_UAT_Test_Scenarios.md` | Simulation |
| Seeded issues (25 records, 5 anomaly types) | `/docs/09_Scope_Guardrails.md` | 4 Data Quality |
| Seeded audit logs (35+ records) | `/docs/01_PRD_Web_Portal.md` | 4.3 Audit Trail |

---

## Assumptions

See [ASSUMPTIONS.md](./ASSUMPTIONS.md) for items not explicitly defined in `/docs`.

