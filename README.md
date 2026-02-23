# PTBA CHT Hauling Portal

PT Bukit Asam — Coal Hauling & Transportation Fleet Management System.

Built with **Nuxt 4** + **Nuxt UI v4** (Dashboard Template).

---

## Quick Start

```bash
cd prototype
npm install
npm run dev
```

Open: **http://localhost:3000/fleet**

If port 3000 is busy, use:
```bash
npx nuxt dev --port 3001
```

---

## Project Structure

```
prototype/
  app/
    pages/          # Vue pages (fleet, dispatch, production, etc.)
    layouts/        # Dashboard sidebar layout
    assets/css/     # Tailwind + Nuxt UI styles
  server/
    api/            # Mock API endpoints
    utils/          # Shared data store & anomaly engine
  nuxt.config.ts    # Nuxt configuration
docs/               # Project documentation
```

---

## Pages

| Route           | Description                     |
|-----------------|---------------------------------|
| `/`             | Dashboard home                  |
| `/fleet`        | Live Fleet Board (with polling) |
| `/dispatch`     | Dispatch assignments            |
| `/production`   | Production & trip data          |
| `/availability` | Unit availability               |
| `/data-quality` | Data quality issues             |
| `/master-data`  | Read-only master data           |
| `/reports`      | CSV report downloads            |

---

## Mock API

All data is served from in-memory mock stores under `server/api/*`. No external database or auth required.
