# Sentinel Chain — Frontend

AI-Powered Autonomous Cyber Defense Platform — enterprise SOC console frontend.
**This is a frontend-only prototype.** All data is realistic mock data in `src/mocks/`; there is no backend. Auth is a
frontend-only mock (any email/password signs you in) persisted to `localStorage` via Zustand.

## Getting Started

This sandbox had no internet access, so the project was written by hand but never installed/run. Do that locally:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`. The Landing page is at `/`; sign in (any credentials work) to reach the console at `/dashboard`.

> **Note:** `.npmrc` sets `legacy-peer-deps=true`. React 19 is very recent and a few libraries (e.g. `recharts`) haven't
> widened their official peer-dependency range to include it yet, even though they work fine with it in practice.
> This setting tells npm to install anyway instead of failing on those peer-range mismatches.

```bash
npm run build     # production build (runs tsc -b then vite build)
npm run preview   # preview the production build locally
```

If `npm install` or `npm run build` surfaces any TypeScript/import errors, they're almost certainly quick fixes — paste
the error back to Claude and it can patch the exact file.

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · React Router DOM v7 · Zustand · Recharts ·
TanStack Table · React Hook Form · Lucide Icons · Sonner (toasts) · ReactFlow & React-Leaflet (installed, ready for
deeper graph/map work)

## Folder Structure

```
src/
├── components/
│   ├── layout/          Sidebar, Header, Breadcrumbs — the app shell
│   └── ui/               Reusable primitives: Button, Card, Badge, Modal, Tabs,
│                          Input/Textarea, Toggle/Progress/EmptyState/Skeleton,
│                          PageHeader, OtpInput, StatCard
├── layouts/
│   ├── DashboardLayout.tsx   Sidebar + Header + <Outlet/> shell for the app
│   └── AuthLayout.tsx        Split branding/form shell for auth pages
├── pages/                    One folder per route; dynamic detail pages
│   │                         (IncidentDetail, AssetDetail, EvidenceDetail) live
│   │                         beside their list page
│   ├── Landing/               Public marketing site (Hero, Features, Architecture,
│   │   └── components/        HowItWorks, TechStack, Screenshots, Comparison,
│   │                          Benefits, Pricing, Testimonials, Team, FAQ, Contact)
│   ├── Auth/                  Login, Register, ForgotPassword, ResetPassword,
│   │                          VerifyOTP, TwoFactor
│   ├── Dashboard/
│   │   └── components/        KpiGrid, LiveThreatMap, LiveAlertsFeed,
│   │                          AiThreatAnalysisPanel, AssetRelationshipGraph,
│   │                          BlockchainStatusPanel, RecentIncidentsTable,
│   │                          ThreatDistributionChart, ThreatTimelineChart,
│   │                          AnalystPerformancePanel
│   ├── LiveThreats/           List + search/filter + ThreatDetailModal
│   ├── Incidents/             List + IncidentDetail (tabs: timeline, evidence,
│   │                          logs, notes, MITRE)
│   ├── Assets/                List + AssetDetail (risk score, related threats)
│   ├── AIAnalysis/            Tabs: prediction, behavior, anomaly, risk, UEBA
│   ├── ThreatIntelligence/    IOC feed, CVE database, MITRE matrix, malware feed
│   ├── BlockchainEvidence/    Ledger explorer + EvidenceDetail (verify action)
│   ├── Reports/                Generate + export (PDF/Excel/Print)
│   ├── Analytics/              Trend, radar, heatmap, geo charts
│   ├── Compliance/             SOC2 / ISO27001 / NIST / HIPAA / GDPR / PCI DSS
│   ├── Users/                  User management + invite modal
│   ├── SOCTeam/                Analyst roster + performance
│   ├── AuditLogs/              Immutable action log
│   ├── Integrations/           Connect/disconnect toggles
│   ├── ApiKeys/                Generate/revoke keys
│   ├── Settings/                7-tab settings (general, security, notifications,
│   │                            theme, language, API, account)
│   ├── Profile/                 User profile + activity
│   ├── Notifications/           Full notification center
│   ├── HelpCenter/              Searchable FAQ + support
│   ├── Documentation/           Sidebar doc reader
│   ├── About/                   Mission + team
│   └── NotFound.tsx             404
├── routes/
│   ├── AppRoutes.tsx          All route definitions
│   └── Guards.tsx             ProtectedRoute / PublicOnlyRoute
├── store/                     Zustand stores: uiStore (sidebar), authStore (mock auth)
├── types/                     Shared TypeScript domain types
├── mocks/                     All mock/sample data, typed to match src/types
├── constants/                 nav.ts (sidebar registry), icons.ts (icon lookup)
├── utils/                     cn() classname merge, format.ts (dates/numbers)
└── styles/globals.css         Tailwind layers + scrollbar/panel utility classes
```

## Design System

Dark navy/blue-purple "cyber" theme defined entirely as Tailwind tokens in `tailwind.config.ts`:
- `bg-base` / `bg-surface` / `bg-surface-raised` — background layers
- `brand-blue` / `brand-purple` / `brand-cyan` — accent gradient family
- `severity-critical/high/medium/low` — consistent severity color scale used everywhere
- `.panel` / `.panel-hover` utility classes (in `globals.css`) — the glass-card look used by every card in the app
- Fonts: Space Grotesk (headings/display), Inter (body), JetBrains Mono (IDs, hashes, timestamps)

## Routing Map

- `/` — Public landing page
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-otp`, `/two-factor` — public, redirect to
  `/dashboard` if already "signed in"
- `/dashboard`, `/live-threats`, `/incidents(/:id)`, `/assets(/:id)`, `/ai-analysis`, `/threat-intelligence`,
  `/blockchain-evidence(/:id)`, `/reports`, `/analytics`, `/compliance`, `/users`, `/soc-team`, `/audit-logs`,
  `/integrations`, `/api-keys`, `/settings`, `/profile`, `/notifications`, `/help`, `/docs`, `/about` — protected,
  require a mock session (any login works)
- `*` — 404

## Wiring In a Real Backend

Every page reads from `src/mocks/*`. To connect real data:
1. Replace mock imports with React Query hooks calling your API (add `src/services/` for API clients).
2. Keep the same TypeScript shapes in `src/types/` as your contract — pages are already typed against them.
3. Swap `useAuthStore`'s mock `login()`/`logout()` for real API calls; keep the same store shape so components don't change.
