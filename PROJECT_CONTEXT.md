# Project Context: PTBA CHT Hauling Portal

Last updated: 2026-02-23

## 1) What this project is
- Prototype web portal for PT Bukit Asam (PTBA) coal hauling operations.
- Combines:
  - Product and implementation docs under `docs/`
  - A runnable Nuxt prototype under `prototype/`
- Main operating modules:
  - Fleet board
  - Dispatch assignment tracking
  - Production and tonnage monitoring
  - Availability
  - Data quality and audit
  - Reports/export

## 2) Scope guardrails (important)
- In scope:
  - Live operational visibility
  - Simple dispatch lifecycle
  - Tonnage reconciliation
  - Basic anomaly detection
  - Auditability of manual changes
- Out of scope:
  - Algorithmic dispatch optimization
  - Mandatory map/geofence tracking
  - Replacing PTBA core production systems
  - Advanced ML analytics

Reference: `docs/09_Scope_Guardrails.md`

## 3) Tech architecture
- Frontend and API runtime:
  - Nuxt 4 + `@nuxt/ui` v4
  - Config: `prototype/nuxt.config.ts`
  - Package: `prototype/package.json`
- UI pages:
  - `prototype/app/pages/*`
  - Sidebar layout: `prototype/app/layouts/default.vue`
- API:
  - `prototype/server/api/*`
- Data layer:
  - In-memory store (seeded at startup): `prototype/server/utils/store.ts`
  - No external DB/auth required for prototype use

## 4) Core domain model
- Tonnage status:
  - `CONFIRMED`: PTBA source/system confirmed
  - `PENDING`: trip exists, tonnage not yet confirmed
  - `MANUAL`: checker fallback/manual input
- Assignment status:
  - `ASSIGNED -> IN_PROGRESS -> COMPLETED`
- Issue lifecycle:
  - `OPEN -> IN_REVIEW -> RESOLVED`
- Audit log:
  - Tracks actor, action, entity, reason, before/after payload

Primary definitions are in `prototype/server/utils/store.ts`.

## 5) Data quality and anomaly engine
- Engine file: `prototype/server/utils/anomalies.ts`
- Implemented anomaly families:
  - Pending too long
  - Duplicate trip (windowed)
  - Tonnage outlier vs capacity
  - Missing timestamp
  - Stale update rule placeholder exists
- New detections are deduplicated and written as issues + audit records.

## 6) Runtime behavior
- Store is seeded with mock units/locations/shifts/assignments/trips/issues/audits.
- Simulation endpoint (`POST /api/simulate/tick`) advances operational state:
  - Progresses assignments periodically
  - Resolves some pending tonnage to confirmed
  - Injects occasional anomalies
- Fleet page polls and refreshes from API on interval.

## 7) Representative API endpoints
- Fleet:
  - `GET /api/fleet`
- Dashboard summary:
  - `GET /api/dashboard/summary`
- Production:
  - `GET /api/production/trips`
  - `POST /api/production/tonnage/manual`
  - `POST /api/production/tonnage/confirm-feed`
- Dispatch:
  - `GET /api/dispatch/assignments`
  - `POST /api/dispatch/assignments`
  - `PATCH /api/dispatch/assignments/[id]`
- Data quality:
  - `GET /api/data-quality/issues`
  - `GET/PATCH /api/data-quality/issues/[id]`
  - `GET /api/data-quality/audit`
- Reports/export:
  - `prototype/server/api/reports/*`

## 8) Documentation map
- Product requirements: `docs/01_PRD_Web_Portal.md`
- Metric definitions: `docs/02_Metrics_Definitions.md`
- Master data template: `docs/04_Master_Data_Template.md`
- Integration mapping: `docs/05_Integration_Mapping_PTBA.md`
- UAT scenarios: `docs/06_UAT_Test_Scenarios.md`
- Scope guardrails: `docs/09_Scope_Guardrails.md`

Note:
- `docs/00_README.md` references `docs/03_Event_Dictionary.md`, but this file is not present in current repo.

## 9) Known prototype constraints
- Data is ephemeral in-memory only.
- Some logic is intentionally simplified for POC scale.
- No production auth/security/integration hardening in this prototype.
