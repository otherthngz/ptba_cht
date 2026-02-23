# PTBA CHT Hauling — Web Portal Documentation Pack

This `/docs` folder contains the product + implementation documentation package for the **PT Bukit Asam (PTBA) CHT hauling prototype**.

## What this package is
A **docs-only** blueprint for a **Web Portal** prototype focused on:
- Live Fleet Board
- Simple Dispatch (assignment tracking; **no optimization**)
- Production Dashboard (ritase + tonnage with **confirmed/pending/manual**)
- Availability (PA/UA)
- Data Quality (anomaly rules) & Audit Trail
- Master Data
- Export

## What this package is NOT
- **No mandatory map tracking**
- **No dispatch optimization / algorithmic dispatch**
- Not replacing PTBA’s production / weighbridge systems (we consume & reconcile)

## Document Index
1. **01_PRD_Web_Portal.md** — Product Requirements Document (product team format)
2. **02_Metrics_Definitions.md** — KPI definitions (production, PA/UA, data quality)
3. **03_Event_Dictionary.md** — Event taxonomy & payload fields
4. **04_Master_Data_Template.md** — Master data tables (templates + required fields)
5. **05_Integration_Mapping_PTBA.md** — Integration mapping for confirmed tonnage sources
6. **06_UAT_Test_Scenarios.md** — UAT scenarios & acceptance criteria
7. **07_Antigravity_StepByStep.md** — Docs-only workflow to generate outputs using Antigravity
8. **08_FE_Guidance_Nuxt_UI.md** — Frontend guidance for Nuxt 3 + Nuxt UI

## Core Principles (must hold)
- **Tonnage has 3 states**: `CONFIRMED` (PTBA source), `PENDING` (waiting), `MANUAL` (fallback)
- **Anomaly rules exist** for data quality (outliers, duplicates, missing timestamps, stale updates)
- **Audit trail is mandatory** for any manual edit / correction
- Operasional **tolerant to breakdowns** (weighbridge down → manual checker entry)

## How to use
- Product team: start with **01_PRD_Web_Portal.md**.
- Engineering: align event ingestion with **03_Event_Dictionary.md** and integration contracts in **05_Integration_Mapping_PTBA.md**.
- QA/UAT: use **06_UAT_Test_Scenarios.md** as the test plan.
- FE: implement UI skeletons based on **08_FE_Guidance_Nuxt_UI.md**.
