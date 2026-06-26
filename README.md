# FinPilot — Your Financial Co-Pilot

> **A modern full-stack personal finance platform that analyzes financial health, simulates future costs, generates investment plans, and provides actionable financial insights.**




\

---

# Live Demo

### Frontend

https://fin-pilot-full-stack-website.vercel.app/

### Backend API

https://finpilot-backend-sd6y.onrender.com

---

# Overview

FinPilot is a modern personal finance assistant that helps users understand and improve their financial health.

Instead of only tracking expenses, FinPilot provides meaningful financial intelligence through:

* Financial Health Score
* What-If Financial Simulator
* Inflation-aware Future Cost Calculator
* Goal-based Investment Planner
* AI-inspired Smart Financial Insights
* Downloadable Financial Report

The platform uses financial formulas commonly used by advisors and presents them through an intuitive dashboard.

---

# Features

## Financial Health Score

Evaluate financial wellness using:

* Monthly Income
* Monthly Expenses
* Current Savings
* Total Debt

Generates:

* Overall Financial Score (0–100)
* Savings Rate
* Expense Ratio
* Debt-to-Income Ratio
* Emergency Fund Cushion
* Financial Breakdown

---

## What-If Simulator

Instantly simulate scenarios like:

* Increasing income
* Reducing expenses
* Increasing savings
* Paying off debt

See the updated Financial Health Score in real time without modifying original data.

---

## Future Cost Simulator

Predict future cost of goals such as:

* House
* Car
* Education
* Vacation

Uses compound inflation to estimate future prices and visualizes the growth trend.

---

## Micro-Investment Engine

Plan investments based on:

* Target Amount
* Time Horizon
* Expected Returns

Calculates:

* Daily Investment
* Monthly SIP
* Round-off Savings
* Total Monthly Contribution
* Portfolio Growth Projection

---

## Smart Insights

Automatically detects:

* High Debt
* Low Savings
* Poor Emergency Fund
* High Expense Ratio
* Healthy Financial Habits

Provides actionable suggestions instead of just displaying numbers.

---

## Download Financial Report

Generate a downloadable PDF containing:

* Financial Health Score
* Metrics Summary
* Future Cost Analysis
* Investment Plan
* Smart Insights

---

# Tech Stack

## Frontend

* Next.js 16
* TypeScript
* React
* Tailwind CSS
* Lucide Icons
* Context API

## Backend

* Node.js
* Express.js

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Project Architecture

```text
finpilot/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   │   └── calculations.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── score/
│   │   ├── what-if/
│   │   ├── future-cost/
│   │   ├── investment/
│   │   ├── insights/
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── LandingPage.tsx
│   │   ├── PageNavigation.tsx
│   │   ├── DownloadReportButton.tsx
│   │   ├── GlassCard.tsx
│   │   ├── ScoreRing.tsx
│   │   ├── FinancialScoreCard.tsx
│   │   ├── WhatIfSimulator.tsx
│   │   ├── FutureCostSimulator.tsx
│   │   ├── InvestmentEngine.tsx
│   │   └── SmartInsights.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── FinancialContext.tsx
│   │   └── format.ts
│   │
│   ├── public/
│   │   ├── logo.png
│   │   ├── hero-bg.png
│   │   ├── score.png
│   │   ├── compare.png
│   │   ├── cost.png
│   │   ├── invest.png
│   │   └── insights.png
│   │    
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── LICENSE
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/KhC13/FinPilot--Full-Stack-Website.git
```

---

## Backend

```bash
cd backend
npm install
npm start
```

Runs on:

```
http://localhost:5000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

# API Endpoints

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| POST   | `/api/score`       | Calculate Financial Health Score |
| POST   | `/api/future-cost` | Predict Future Cost              |
| POST   | `/api/investment`  | Generate Investment Plan         |
| POST   | `/api/insights`    | Generate Smart Insights          |

---

# UI Highlights

* Glassmorphism Design
* Responsive Layout
* Animated Score Ring
* Gradient Backgrounds
* Custom Icons
* Interactive Cards
* Multi-page Navigation
* Downloadable Reports

---

# Future Improvements

* User Authentication
* Secure Database Integration
* Expense Tracker
* AI Chat Financial Advisor
* Goal Progress Dashboard
* Investment Portfolio Tracking
* Expense Categorization
* Multi-Currency Support
* Tax Planning Module
* Dark / Light Theme
* Email Report Delivery
* Mobile App Version

---

# Author

**Khushi Chhakara**

GitHub:
https://github.com/KhC13

---

# Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It motivates me to build more open-source projects.
