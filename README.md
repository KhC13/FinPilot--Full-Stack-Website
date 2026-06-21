# FinPilot — Your Financial Co-Pilot

A full-stack fintech dashboard with a glassmorphism, dark-themed UI. FinPilot scores your
financial health, simulates how inflation affects future costs, builds a goal-based
micro-investment plan, and surfaces rule-based smart insights — all backed by a small
Express API.

## Tech stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Recharts + lucide-react
- **Backend**: Node.js + Express
- **Fonts**: Sora (headings), Inter (body), JetBrains Mono (numeric/data), loaded via `next/font/google`

## Project structure

```
finpilot/
├── backend/                   # Express API
│   ├── controllers/           # Request handlers
│   ├── routes/                # Route definitions
│   ├── utils/calculations.js  # Core financial math (score, inflation, SIP, insights)
│   ├── server.js              # App entry point
│   └── package.json
│
└── frontend/                  # Next.js app
    ├── app/
    │   ├── layout.tsx         # Root layout, fonts, ambient background
    │   ├── page.tsx           # Dashboard page (assembles all sections)
    │   └── globals.css        # Design tokens, glass utilities
    ├── components/
    │   ├── Navbar.tsx
    │   ├── GlassCard.tsx          # Reusable frosted-glass card + header
    │   ├── ScoreRing.tsx          # Animated circular score gauge (signature element)
    │   ├── FinancialScoreCard.tsx # Section 1: Financial Health Score
    │   ├── FutureCostSimulator.tsx# Section 2: Future Cost Simulator
    │   ├── InvestmentEngine.tsx   # Section 3: Micro-Investment Engine
    │   └── SmartInsights.tsx      # Section 4: Smart Insights
    ├── lib/
    │   ├── api.ts              # Typed client for the backend API
    │   └── format.ts           # Currency/number formatting helpers
    ├── tailwind.config.ts       # Glassmorphism design tokens
    └── package.json
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev        # nodemon, http://localhost:5000
# or: npm start
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev         # http://localhost:3000
```

The frontend proxies `/api/*` requests to the backend via `next.config.js` rewrites, so no CORS
configuration is needed in dev. `NEXT_PUBLIC_API_URL` controls the proxy target (defaults to
`http://localhost:5000`).

Open `http://localhost:3000` — the dashboard loads with example numbers prefilled, and every
section recalculates live as you edit inputs.

> Note: the frontend build fetches Sora, Inter, and JetBrains Mono from Google Fonts at build
> time via `next/font/google`. Make sure the machine running `npm run build` / `npm run dev` has
> outbound internet access to `fonts.googleapis.com` and `fonts.gstatic.com`.

## API reference

All endpoints accept/return JSON.

### `POST /api/score`
**Body:** `{ income, expenses, savings, debt }` (monthly figures, debt = total outstanding)
**Returns:** `{ score, label, tone, breakdown, metrics, topInsights }`

### `POST /api/future-cost`
**Body:** `{ cost, years, inflation }` (inflation in %, default 6 if omitted)
**Returns:** `{ series: [{ year, label, value }], summary }`

### `POST /api/investment`
**Body:** `{ goalAmount, years, expectedReturn, monthlyExpenseTransactions?, avgRoundOff? }`
**Returns:** `{ inputs, plan: { dailyInvestment, monthlyInvestment, monthlyRoundOffSavings, yearlyRoundOffSavings, totalMonthlyContribution }, growthSeries }`

### `POST /api/insights`
**Body:** `{ income, expenses, savings, debt }`
**Returns:** `{ insights: [{ type, severity, title, message }] }`

## Design system

Defined in `frontend/tailwind.config.ts` and `frontend/app/globals.css`:

- **Palette**: deep navy base (`#05060F`), glass surfaces at 6–10% white opacity, gradient
  accent purple → blue → cyan (`#8B5CF6 → #3B82F6 → #22D3EE`), semantic success/warning/danger.
- **Typography**: Sora for headings, Inter for body copy, JetBrains Mono for all currency and
  numeric values (keeps figures legible and tabular).
- **Components**: `.glass-card`, `.glass-panel`, `.btn-primary`, `.btn-ghost`, `.input-field`,
  `.gradient-text` utility classes encapsulate the glassmorphism look so every section stays
  visually consistent.
- **Signature element**: the circular score ring (`ScoreRing.tsx`) — a gradient-stroked SVG gauge
  with an animated count-up and a tone-tinted ambient glow that reflects financial health at a
  glance.

## Features

- Financial Health Score Analysis
- Future Cost Prediction (Inflation-based)
- Micro-Investment Planning
- What-If Financial Simulator 
- PDF Report Generation 
- Interactive Charts & Insights


## Notes

- The "smart insights" engine is intentionally rule-based (see `backend/utils/calculations.js`)
  so it's transparent and fast — it's structured so a real ML model could be swapped in later
  without changing the API shape.
- This is a demo application; figures and recommendations are illustrative and not financial
  advice.

