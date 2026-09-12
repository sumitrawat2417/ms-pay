# MS Pay — Local Wallet Module
## Tech Stack Document (TSD) v1

*Companion document to: PRD v2 and Project Design Document (PDD) v2*
*Project context: portfolio / hiring-showcase build — not a production deployment. Built solo, demoed live for a limited period.*

---

## Table of Contents

1. Purpose & context
2. Guiding principles for stack choices
3. Architecture overview
4. Repository structure
5. Frontend stack
6. Backend stack
7. Database & ORM
8. Authentication strategy
9. Realtime & push notifications
10. QR generation & scanning
11. Scheduled jobs (reconciliation)
12. Payments integration (self-recharge)
13. Testing strategy
14. CI/CD pipeline
15. Hosting & deployment
16. Environment & configuration
17. Observability & logging
18. Security notes
19. Non-goals / known limitations (be upfront about these)
20. "What I'd change for production" — the section senior devs actually read

---

## 1. Purpose & context

This document specifies the technical stack for building the MS Pay Local Wallet Module as a **showcase project** — something to demo live to senior engineers and hiring managers, built and maintained solo, running on free-tier infrastructure. It is explicitly *not* headed for real production deployment or real money movement (per PRD §11).

That context shapes every choice below: the priority is **clean architecture, type safety, and correct handling of the hard financial-logic problems** (idempotency, atomic ledger writes, the reconciliation invariant) — because that's what actually demonstrates engineering judgment to a senior reviewer — over horizontal scalability or production hardening that a demo doesn't need.

---

## 2. Guiding principles for stack choices

1. **TypeScript everywhere** — one language, shared types between frontend and backend, zero runtime type-mismatch bugs to explain away in an interview.
2. **$0 infrastructure cost** — every piece below has a real free tier; nothing here requires a credit card to get running.
3. **Solo-dev velocity over enterprise ceremony** — Fastify over NestJS, Prisma over a hand-rolled query layer; structure that helps one person move fast, not process built for a team of ten.
4. **The financial-logic core gets production-grade care, even though the deployment isn't production.** Idempotency keys, atomic transactions, and the reconciliation invariant are implemented properly and tested — that's the part of this project that actually proves something to a reviewer.
5. **Be explicit about what's simulated vs. real.** Sandbox payment gateways, seeded demo data, and a clearly-labeled "this is a demo" posture are a feature here, not a weakness — senior engineers respect a project that knows its own scope.

---

## 3. Architecture overview

```mermaid
flowchart TB
    subgraph Frontend [Frontend — 3 PWAs, one monorepo]
        C[Customer PWA]
        M[Merchant PWA]
        A[Admin PWA]
    end

    subgraph Shared [Shared packages]
        UI[ui-components]
        TY[shared-types]
        API[api-client]
    end

    subgraph Backend [Backend — Fastify + TypeScript]
        R1[Customer routes]
        R2[Merchant routes]
        R3[Admin routes]
        L[Ledger service — atomic debit/credit, idempotency]
        RJ[Reconciliation job]
    end

    DB[(PostgreSQL — local Docker → Supabase/Neon)]

    C --> API
    M --> API
    A --> API
    API --> R1
    API --> R2
    API --> R3
    R1 --> L
    R2 --> L
    R3 --> L
    L --> DB
    RJ --> DB
```

One backend service, three route groups (not three separate backends) — the domain logic (ledger, transactions) is shared and must never diverge between how Customer, Merchant, and Admin touch the same money.

---

## 4. Repository structure

Single monorepo, pnpm workspaces (free, fast, no paid tooling needed):

```
mansula-pay/
├── apps/
│   ├── customer-pwa/        # React + Vite + PWA
│   ├── merchant-pwa/        # React + Vite + PWA
│   ├── admin-pwa/           # React + Vite (PWA optional here)
│   └── api/                 # Fastify + TypeScript backend
├── packages/
│   ├── ui/                  # shared components, design tokens from PDD §5
│   ├── types/                # shared TS types — Transaction, PaymentRequest, MerchantWallet, etc.
│   └── api-client/            # typed fetch wrapper, shared by all 3 PWAs
├── prisma/
│   └── schema.prisma
├── docker-compose.yml         # local Postgres
├── .github/workflows/         # CI
└── pnpm-workspace.yaml
```

---

## 5. Frontend stack

| Piece | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| PWA | `vite-plugin-pwa` (Workbox under the hood) — manifest, service worker, offline shell caching |
| Styling | Tailwind CSS, tokens generated from PDD §5.1 palette |
| Components | shadcn/ui as a base, customized to the MS Pay brand tokens |
| Icons | Lucide (single-weight, matches PDD §5.3 consistent icon system) |
| Server state | TanStack Query — request polling, balance refresh, cache invalidation on transaction success |
| Client state | React Context / Zustand for lightweight local UI state (no Redux needed at this scale) |
| Forms | React Hook Form + Zod (Zod schemas shared with backend validation — one source of truth for "what a valid payment amount looks like") |
| QR scanning | `html5-qrcode` |
| QR display | `qrcode.react` (renders merchant static store QR / consumer ID QR client-side) |

**PWA offline behavior — an explicit design constraint, not an oversight:** the service worker caches the app shell and static assets for installability and fast reloads, but **never** queues a credit-producing action (recharge, cash-in, request approval) for background sync. This directly mirrors PRD §6's hard rule — a credit must always be validated online, in real time, with no offline path. The offline UI state for any of those actions is a disabled button with a clear "you're offline" message, not a silently-queued action.

---

## 6. Backend stack

| Piece | Choice |
|---|---|
| Runtime | Node.js (LTS) + TypeScript |
| Framework | Fastify |
| Validation | Zod (schemas shared with frontend forms via `packages/types`) |
| API style | REST, versioned (`/api/v1/...`), grouped by actor: `/customer/*`, `/merchant/*`, `/admin/*` |
| API docs | `@fastify/swagger` + Swagger UI — auto-generated from the same Zod/JSON schemas, free, and gives a live interactive API doc to show reviewers |
| Ledger/domain logic | A dedicated `ledger` module implementing the double-entry journal from PRD §9.3 as its own service layer, called by every route that mutates a balance — Mode A/B/C sales, all four funding types, refunds, and settlement all go through one function, not three copy-pasted implementations |
| Idempotency | Idempotency-Key header required on every mutating endpoint, checked against a `processed_requests` table before the ledger service runs — this is what prevents PRD §10's "double-spend or duplicate entry" risk |
| Atomicity | Every wallet mutation wrapped in a single Prisma `$transaction` (row lock, check, write, commit) — matches PRD §10 exactly |

---

## 7. Database & ORM

**Local (now):** PostgreSQL via Docker Compose — a single `docker-compose up` gets a dev database running, matching the engine you'll deploy to later.

**Later:** Supabase (or Neon) — connection string swap only, no schema rewrite, because both are plain Postgres.

**ORM:** Prisma — chosen over Drizzle here specifically because Prisma's migration workflow and generated types are the fastest way for a solo dev to keep the schema, the TypeScript types, and the database in lockstep as the PRD's data model (§7) evolves.

**Core schema (abridged, mapped directly to PRD §7 and §9.3):**

```prisma
model Consumer {
  id           String   @id @default(uuid())
  idQrToken    String   @unique
  passcodeHash String
  wallets      Wallet[]
  createdAt    DateTime @default(now())
}

model Merchant {
  id             String   @id @default(uuid())
  name           String
  storeQrToken   String   @unique
  merchantWallet MerchantWallet?
}

model Wallet {
  id         String   @id @default(uuid())
  consumerId String
  consumer   Consumer @relation(fields: [consumerId], references: [id])
  balanceMsp Decimal  @default(0)
}

model MerchantWallet {
  merchantId              String   @id
  merchant                Merchant @relation(fields: [merchantId], references: [id])
  liveBalance             Decimal  @default(0)
  cashCollectedViaDeposits Decimal @default(0)
  salesReceivableOwed      Decimal @default(0)
  netSettlementDue         Decimal @default(0)
  lastSettledAt            DateTime?
}

model PaymentRequest {
  id                 String   @id @default(uuid())
  merchantId         String
  consumerRef        String
  amountMsp          Decimal
  status             String   // pending | approved | declined | expired
  createdAt          DateTime @default(now())
  approvedAt         DateTime?
  linkedTransactionId String?
}

model Transaction {
  id            String   @id @default(uuid())
  type          String   // sale_merchant_assisted | sale_consumer_initiated | sale_request_approved |
                          // recharge_self | recharge_admin | recharge_merchant_cashin |
                          // recharge_merchant_advance | refund | settlement_payout | settlement_recovery
  amountMsp     Decimal
  idempotencyKey String  @unique
  createdAt     DateTime @default(now())
}

model JournalEntry {
  id            String   @id @default(uuid())
  transactionId String
  account       String   // Platform Bank/Cash | Consumer Wallet Liability | Merchant Settlement Payable | ...
  direction     String   // debit | credit
  amountMsp     Decimal
  createdAt     DateTime @default(now())
}
```

`JournalEntry` is what makes PRD §9.3's reconciliation invariant computable as an actual query rather than a manual spreadsheet exercise — every transaction writes matching debit/credit rows here.

---

## 8. Authentication strategy

| Actor | Strategy |
|---|---|
| Consumer | Custom — ID/QR token identifies the account, passcode (hashed with bcrypt/argon2, never logged) is the auth gate, server issues a short-lived JWT session on success. No email/password — matches PRD §10, and matches the no-phone-required design goal (the ID/QR card itself is the credential; the phone is optional convenience) |
| Merchant staff | Supabase Auth (email + password) once migrated off local Postgres; a simple JWT-based login locally for now |
| Admin | Same as merchant staff, with a role claim gating access to `/admin/*` routes |

Passcode reset (PRD §10) is modeled as an admin-approved flow in this demo — a real in-person identity-verification step is out of scope for a portfolio build, and the TSD says so plainly rather than pretending it's solved.

---

## 9. Realtime & push notifications

- **In-app realtime** (incoming Mode C requests, live balance updates): Supabase Realtime (Postgres change subscriptions) once on Supabase; a lightweight WebSocket via `@fastify/websocket` for the local-dev phase.
- **Push notifications** (the cash-in trust-confirmation moment from PRD §6): Web Push via the PWA service worker. This is the one place where the "immediate, independently verifiable confirmation" requirement is a hard UX constraint, not a nice-to-have — it gets an actual push notification, not just a database row the consumer might notice later.

---

## 10. QR generation & scanning

- **Generation:** `qrcode.react` client-side (consumer ID card, merchant static store QR)
- **Scanning:** `html5-qrcode`, used identically in both Customer (Mode B) and Merchant (Mode A) apps — one shared scanning component in `packages/ui`, not two separate implementations that could drift apart

---

## 11. Scheduled jobs (reconciliation)

PRD §9.3's invariant:

```
Platform Bank/Cash + Σ(Merchant Cash-in Receivable) + Σ(Promotional Expense)
  = Σ(Consumer Wallet Liability) + Σ(Merchant Settlement Payable) + Σ(Platform Revenue recognized)
```

Implemented as:
- A `node-cron` job inside the Fastify service (local/demo phase) running nightly, plus an on-demand trigger from the Admin dashboard.
- If migrated to Supabase, this becomes a `pg_cron` job running the same aggregate query directly against `JournalEntry`, which is arguably the more elegant version since it lives right next to the data.
- **This check is treated as a release-blocking test in CI**, not just a monitoring dashboard — a seeded test dataset runs through all payment/funding paths and asserts the invariant holds, exactly as the PRD recommends.

---

## 12. Payments integration (self-recharge)

- **Razorpay** (sandbox/test mode) — free, supports UPI test flows, well-documented, and immediately recognizable to Indian reviewers as "did this correctly" rather than a toy fake-payment form.
- Clearly labeled as **test-mode only** throughout the demo — no real money ever moves, and the UI says so.

---

## 13. Testing strategy

Given the portfolio context, test coverage is deliberately weighted toward the parts that prove engineering judgment:

| Layer | Tooling | Priority |
|---|---|---|
| Ledger service (double-entry journal, all transaction types) | Vitest, unit + integration against a test Postgres instance | **Highest** — this is the part a senior reviewer will actually poke at |
| Reconciliation invariant | Integration test seeding all payment/funding paths, asserting the invariant holds | **Highest** |
| Idempotency behavior (duplicate request submitted twice) | Integration test | High |
| API route contracts | Vitest + supertest/light-my-request (Fastify's own testing tool) | Medium |
| Frontend components | React Testing Library, on key flows only (Scan & Pay, Approve Request) — not exhaustive coverage | Medium |
| E2E | Playwright, a handful of critical-path smoke tests (one per payment mode) — not a full suite | Low-medium, but a couple of green E2E runs in a demo go a long way visually |

---

## 14. CI/CD pipeline

GitHub Actions (free for public/private repos at this scale):

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        ports: ["5432:5432"]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install
      - run: pnpm prisma migrate deploy
      - run: pnpm test          # includes the reconciliation invariant test — build fails if it doesn't hold
      - run: pnpm build
```

A green CI badge with a reconciliation-invariant test in the pipeline is, frankly, one of the more senior-looking things a portfolio repo can show — it demonstrates you understood *why* that check matters, not just that you built a wallet UI.

---

## 15. Hosting & deployment

| Piece | Host | Tier |
|---|---|---|
| Customer / Merchant / Admin PWAs | Vercel | Free — 3 projects from one monorepo |
| Backend API | Render (free web service) or Fly.io | Free — note Render's free tier cold-starts after idle; fine for a demo, mention it if you're doing a live walkthrough so a first request isn't awkward |
| Database | Supabase free tier (or Neon) | Free — generous enough for demo-scale data |
| Domain | Optional — Vercel/Render subdomains are fine for a portfolio link |

---

## 16. Environment & configuration

```
# .env.example
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mansula_pay
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
NODE_ENV=development
```

`.env.example` committed, `.env` gitignored — basic hygiene that's worth stating explicitly since reviewers do check.

---

## 17. Observability & logging

- Fastify's built-in Pino logger, structured JSON logs — free, zero extra infra.
- A simple `/health` endpoint and the reconciliation dashboard (PDD §9.3) double as the demo's "monitoring" — appropriate for this scale; a real production system would add Sentry/Grafana, called out explicitly in §20 below rather than over-built here.

---

## 18. Security notes

- Passcodes hashed with bcrypt/argon2, never logged, never returned in any API response (PRD §10).
- QR tokens are opaque (UUIDs), never raw IDs (PRD §10).
- Idempotency key required on every mutating request.
- Every wallet mutation inside a single Prisma `$transaction` — no partial writes possible.
- Credits (recharge, cash-in, advance) have no offline code path anywhere in the client — enforced at the UI layer (disabled state) and re-enforced at the API layer (rejects any request lacking a fresh server-issued nonce), so it's not just a UI nicety.

---

## 19. Non-goals / known limitations (stated upfront, on purpose)

This is a demo project, and it's more credible to say so plainly than to imply otherwise:

- No real money moves — Razorpay stays in test/sandbox mode throughout.
- No real regulatory/PPI compliance review — flagged in PRD §11 as out of scope for this build.
- No real in-person identity verification for passcode reset — simulated as an admin-approval step.
- No horizontal scaling, load testing, or multi-region setup — free-tier single-instance hosting is the ceiling here, intentionally.
- No dedicated fraud-ML or anomaly-detection system — the admin "unusual cash-in pattern" flag is rule-based (simple thresholds), not a trained model.

---

## 20. "What I'd change for production" — the section senior devs actually read

Stated explicitly here because this is often the single most credibility-building section of a portfolio doc — it shows you know where the walls of your own demo are:

- Move consumer passcode reset to a real KYC/in-person verification flow (as PRD §10 specifies) instead of admin-approval.
- Complete the PPI/semi-closed-wallet compliance review referenced in PRD §11 before ever touching real cash-in flows.
- Add a dedicated fraud/anomaly detection layer for merchant cash-in patterns rather than static thresholds.
- Move off free-tier hosting (Render cold starts, single-region Supabase) to something with real uptime guarantees and horizontal scaling.
- Add proper observability (Sentry for errors, structured metrics/Grafana for the reconciliation job and settlement runs).
- Formalize the currency's exchange-rate governance (fixed vs. admin-adjustable — PRD's own open item) with an audit trail on every rate change.
