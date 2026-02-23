# Antigravity Step-by-Step — Docs-only Workflow (PTBA POC)

Goal: use **Antigravity** to generate consistent outputs (PRD → UI copy → test cases → summaries) using this `/docs` folder as the single source of truth.

This workflow is intentionally **docs-only**:
- No design files required to start
- No over-spec features (no map tracking mandatory, no dispatch optimization)

---

## 1) Preparation
1. Ensure the following docs exist and are up to date:
   - `01_PRD_Web_Portal.md`
   - `02_Metrics_Definitions.md`
   - `03_Event_Dictionary.md`
   - `05_Integration_Mapping_PTBA.md`
   - `06_UAT_Test_Scenarios.md`

2. Decide the scope of generation per run:
   - **POC UI skeleton** (pages + components)
   - **User stories + acceptance criteria**
   - **API contracts**
   - **Test cases & test data**

---

## 2) Core Prompt Template (copy-paste)
Use this as your base system prompt inside Antigravity:

```
You are a product + engineering documentation assistant.
Use the attached markdown documents as source of truth.
Do NOT invent new modules beyond the scope.
Non-goals: no mandatory map tracking, no dispatch optimization.
Mandatory behaviors:
- tonnage has CONFIRMED / PENDING / MANUAL states
- anomaly rules exist and are referenced
- audit trail is required for manual edits and corrections
Output must be concise, implementation-ready, and consistent with the docs.
When information is missing, propose the smallest safe assumption and label it clearly as an assumption.
```

---

## 3) Recommended Generation Runs

### Run A — User Stories (per module)
**Input:** `01_PRD_Web_Portal.md`

**Prompt:**
```
Generate user stories and acceptance criteria for each module in the PRD.
Keep dispatch simple and radio-friendly.
Include audit trail requirements in relevant stories.
```

**Output artifacts:**
- Stories by role: Dispatcher, Checker, Supervisor, Admin

### Run B — API & Data Contracts
**Input:** `03_Event_Dictionary.md` + `05_Integration_Mapping_PTBA.md`

**Prompt:**
```
Generate API contract drafts for event ingestion and confirmed tonnage ingestion.
Include idempotency and matching keys.
Do not add new data sources.
```

### Run C — Data Quality Rules Spec
**Input:** `02_Metrics_Definitions.md` + `06_UAT_Test_Scenarios.md`

**Prompt:**
```
List anomaly rules, severity, and recommended UI messaging.
Rules must cover: pending too long, outliers, duplicates, stale updates, multi-match.
Include audit requirements.
```

### Run D — UI Copy (short, operational)
**Input:** `01_PRD_Web_Portal.md` + `06_UAT_Test_Scenarios.md`

**Prompt:**
```
Generate UI microcopy for statuses, badges, empty states, and confirmation dialogs.
Keep it short and operational.
Do not use overly technical words.
```

### Run E — UAT Pack Refinement
**Input:** `06_UAT_Test_Scenarios.md`

**Prompt:**
```
Refine UAT scenarios into a checklist format.
Add minimal test data examples for each scenario.
```

---

## 4) Output Quality Checklist
Before accepting Antigravity output, verify:
- Mentions and uses `CONFIRMED / PENDING / MANUAL`
- Does not introduce map tracking as a requirement
- Does not introduce dispatch optimization
- Includes anomaly detection + audit trail
- Uses the same enum names and definitions as the docs

---

## 5) Suggested Folder Convention for Generated Outputs
Create a sibling folder:
- `/docs_generated/`

Subfolders:
- `/docs_generated/stories/`
- `/docs_generated/api/`
- `/docs_generated/ui-copy/`
- `/docs_generated/testing/`

