# MS Pay — Local Wallet Module
### Product Requirements Document (v2)
*Sub-module of the MS Pay Environment, standalone project*

---

## 1. Overview

A multi-merchant virtual currency wallet that consumers can spend at any participating merchant (technically a "semi-closed" model, not closed-loop — see §11). The defining feature: a consumer does **not** need a phone, an app, or internet to pay — only a physical ID/QR and a passcode. Consumers who do carry a phone get extra control on top of that: they can pay entirely on their own terms, or approve a merchant's request remotely.

The wallet also lets a merchant act as a cash-in agent, crediting a consumer's wallet directly — solving the case where a consumer wants to fund their wallet but can't pay online, or has left money with a merchant informally and wants it formalized.

## 2. Goals

- A consumer with nothing but an ID/QR and a passcode can pay in any store.
- A consumer with a phone can pay under their own control — never forced to trust a number typed on someone else's screen.
- A merchant can request payment from a consumer who isn't physically present, and the consumer approves it later, from a distance.
- A merchant can accept physical cash and credit a consumer's wallet directly, with zero possibility of doing this without it being centrally recorded and validated.
- One ledger, one settlement process, correctly reconciling all of the above — including the reverse cash flow created by merchant cash-in.

## 3. Terminology

| Term | Meaning |
|---|---|
| Virtual currency (**MSP**) | The wallet's unit of value. Not "points" — a currency-like balance. Exchange rate to real currency (e.g. 1 MSP = ₹1) is admin-configurable. |
| Wallet | A consumer's MSP balance. |
| Funding / recharge | Any operation that adds MSP to a wallet. |
| Sale / debit | Any operation that removes MSP from a wallet in exchange for goods or services. |
| Merchant float | The running balance of cash a merchant has collected on the platform's behalf (via cash-in deposits) that must be reconciled against what the platform owes them for sales. |

*Open question: final name for the currency, and whether the exchange rate is fixed 1:1 or admin-adjustable — needed before the settlement module is finalized.*

## 4. Actors

- **Admin** (you / MS Pay back office)
- **Consumer** — may or may not carry a smartphone with the MS Pay consumer app
- **Merchant / business owner** — always has a connected device (phone, tablet, or terminal)

## 5. Payment modes

Three modes, distinguished by *who is in control of the transaction*.

| | Mode A — Merchant-Assisted | Mode B — Consumer-Initiated ("Scan & Pay") | Mode C — Merchant-Requested ("Request & Approve") |
|---|---|---|---|
| Who starts it | Merchant scans consumer's card/QR | Consumer scans merchant's store QR | Merchant creates a payment request against a known consumer |
| Who approves | Consumer, by typing passcode on the merchant's device | Consumer, entirely inside their own app | Consumer, inside their own app, after reviewing the exact amount |
| Consumer needs | Nothing — ID/QR card only | Own phone + internet | Own phone + internet |
| Merchant needs | Connected device to scan and submit | Just a printed/displayed QR — device can even be offline for this mode | Connected device to create the request |
| Best for | No-phone consumers, fastest in-line checkout | Consumers who want full control and never want to hand anything to staff | Remote/delayed collection — delivery orders, phone orders, closing a tab when the consumer isn't present |
| Distance-friendly? | No — requires being at the merchant's device | Yes, if the merchant shares the QR image/link remotely | Yes — request and approval can happen asynchronously |

**Consumer consent rule (applies to all three modes):** the consumer's own passcode is always the final gate. In Mode A it's typed on the merchant's device (masked, never shown); in Modes B and C it's entered inside the consumer's own app, where they can also see the exact amount before confirming. Mode C in particular exists to remove the "trusting a number on someone else's screen" problem you raised — the consumer sees precisely what's being requested before it's ever debited.

**Anti-abuse notes for Mode C:** requests should expire quickly (e.g. 10–15 minutes) if unapproved, show the merchant's name and exact amount prominently, and be rate-limited per merchant-consumer pair to prevent spamming a consumer with bogus requests hoping for an absent-minded approval.

## 6. Wallet funding modes

| | Funding 1 — Self-Recharge | Funding 2 — Admin Top-up | Funding 3 — Merchant Cash-In Deposit | Funding 4 — Merchant Advance / Tab Credit |
|---|---|---|---|---|
| Who initiates | Consumer, via own app (UPI/card/bank) | Admin, manually | Merchant, after receiving physical cash | Merchant, crediting money a consumer left with them earlier |
| Purpose | Standard self-service top-up | Corrections, promotions, support cases | Consumer has no way to pay online; store acts like a deposit agent | Formalizes an informal "tab" so the merchant no longer has to remember it manually |
| Mechanism | Identical — merchant credits consumer's wallet | Identical — merchant credits consumer's wallet | | |

Funding 3 and 4 are **the same underlying capability** — a merchant crediting a consumer's wallet — used in two different contexts. The system should still tag them differently (`cash_deposit` vs `advance_credit`) so merchant records and any future disputes are traceable to the right context, and so the consumer's transaction history reads correctly ("Deposited via [Merchant]" vs "Advance credited by [Merchant]").

**Hard rule — credits are always online, never offline.** A debit can eventually tolerate reduced connectivity (see roadmap), but a credit must always be validated by the server in real time and can never be queued for later sync. An offline credit is indistinguishable from a merchant fabricating money, so this path simply does not exist in the design — exactly the constraint you flagged.

**Trust safeguard for cash handoffs:** because Funding 3/4 involve real cash changing hands with no other paper trail, the consumer needs an immediate, independently verifiable confirmation the moment it happens — an in-app notification/receipt showing the new balance, not just the merchant's word. This protects the consumer against under-crediting.

## 7. Updated data model

Building on the v1 model, add:

- **payment_requests** — id, merchant_id, consumer_ref, amount, status (`pending` / `approved` / `declined` / `expired`), created_at, approved_at, linked_transaction_id *(supports Mode C)*
- **transactions** — extend `type` to: `sale_merchant_assisted`, `sale_consumer_initiated`, `sale_request_approved`, `recharge_self`, `recharge_admin`, `recharge_merchant_cashin`, `recharge_merchant_advance`, `refund`, `settlement_payout`, `settlement_recovery`
- **merchant_wallet** — merchant_id, live_balance (credits received, unsettled), cash_collected_via_deposits, sales_receivable_owed_by_admin, net_settlement_due, last_settled_at *(new — powers both the merchant's live balance view and settlement netting, see §9)*
- **merchant_store_qr** — merchant_id, static_qr_token *(supports Mode B — this token can be printed and never needs to change unless compromised)*

## 8. Transaction flows (summary)

- **Mode A** — as in v1: merchant scans → enters amount → consumer types passcode on merchant device → server validates & debits.
- **Mode B** — consumer opens own app → scans merchant's static store QR → enters amount → confirms with own passcode → server debits consumer, credits merchant.
- **Mode C** — merchant looks up consumer (ID/QR) → creates a payment request with an amount → consumer gets it in-app → reviews → approves with own passcode → server executes the debit/credit tied to that request.
- **Funding 3/4** — merchant receives cash from consumer → merchant's app looks up consumer → enters amount and tags reason (`deposit` / `advance`) → server validates merchant is online and authorized → credits consumer wallet → consumer gets immediate confirmation → entry recorded against merchant's float.

## 9. Merchant wallet, transaction visibility & settlement

### 9.1 Merchant wallet & transaction details

Merchants get a wallet-like view of their own, mirroring what a consumer sees — this was missing from v1 and needs to be explicit:

- **Live balance** — total credits received (MSP collected from sales across all three payment modes) minus MSP paid out via cash-in deposits/advance credits, i.e. the merchant's current unsettled balance, visible any time, not just at settlement.
- **Full transaction ledger** — every individual transaction touching that merchant: each sale received (amount, payment mode used, consumer reference, timestamp), each cash-in deposit or advance credit given out, and each settlement payout — filterable by date range, type, and consumer/order reference.
- No new storage needed for this — it's the same `transactions` table from §7, filtered by `merchant_id` and surfaced as a merchant-facing view.
- The live balance here and the net settlement figure in §9.2 are related but distinct: live balance is real-time and pre-settlement; net settlement due is calculated periodically and, once paid out, settles that portion of the balance.

### 9.2 Settlement & accounting

Two flows now run in opposite directions and must be netted:

- **Sales settlement (admin → merchant):** merchant collected MSP from consumers → admin owes merchant real currency for it, minus commission.
- **Cash-in recovery (merchant → admin):** merchant collected real cash from consumers and credited MSP directly → merchant now holds cash that belongs to the platform, and owes it back.

```
Net payout to merchant = (MSP collected from sales × exchange rate) − (commission) − (cash collected via cash-in deposits)
```

If a merchant does far more cash-in than sales, the result can go negative — meaning the merchant owes the platform money rather than the other way round. The settlement module needs a path for this: either the merchant remits the shortfall directly, or it carries forward as a debt against future sales settlements. This is exactly the "merchant_wallet" entity in §7.

### 9.3 Formal double-entry accounting model

"Merchant float" and the informal formula above are directionally correct but not precise enough to implement against. Every transaction type should map to a fixed, auditable journal entry — not just a row in the operational `transactions` table. The `transactions` table (§7) stays the activity log (what happened, who did it); this is the financial log (where the money sits and who has a claim on it).

**Chart of accounts**

| Account | Type | Meaning |
|---|---|---|
| Platform Bank/Cash | Asset | Real money the platform actually holds — from UPI/bank recharges, or admin top-ups backed by real funds |
| Consumer Wallet Liability | Liability | MSP the platform owes consumers, redeemable at any merchant |
| Merchant Settlement Payable | Liability | Real currency the platform owes a merchant for MSP they've collected from sales |
| Merchant Cash-in Receivable | Asset | Real currency the platform is owed *by* a merchant, because that merchant credited a consumer's wallet using cash they kept themselves |
| Platform Revenue (Commission) | Equity/P&L | Commission recognized at settlement |
| Promotional Expense | Equity/P&L | Cost of MSP granted with no real money behind it — promos, goodwill credits |

**Journal entries per transaction type**

| Transaction | Debit | Credit |
|---|---|---|
| Consumer self-recharge (Funding 1) | Platform Bank/Cash | Consumer Wallet Liability |
| Admin top-up, real-money backed (Funding 2) | Platform Bank/Cash | Consumer Wallet Liability |
| Admin top-up, promotional (Funding 2) | Promotional Expense | Consumer Wallet Liability |
| Sale — any of Mode A/B/C | Consumer Wallet Liability | Merchant Settlement Payable |
| Merchant cash-in deposit (Funding 3) | Merchant Cash-in Receivable | Consumer Wallet Liability |
| Merchant advance credit (Funding 4) | Merchant Cash-in Receivable | Consumer Wallet Liability |
| Refund | Merchant Settlement Payable | Consumer Wallet Liability |
| Settlement payout, net positive | Merchant Settlement Payable | Platform Bank/Cash; Merchant Cash-in Receivable (cleared); Platform Revenue (commission) |
| Settlement recovery, net negative (merchant remits) | Platform Bank/Cash | Merchant Cash-in Receivable (cleared) |

A sale never touches Platform Bank/Cash at all — it's purely a transfer of liability from the consumer's claim to the merchant's claim. Real money only enters or leaves the platform's actual bank account at recharge and at settlement. That property is what makes the reconciliation check below possible.

**Reconciliation invariant** — should run automatically (nightly, and on demand from the admin panel):

```
Platform Bank/Cash + Σ(Merchant Cash-in Receivable) + Σ(Promotional Expense)
  = Σ(Consumer Wallet Liability) + Σ(Merchant Settlement Payable) + Σ(Platform Revenue recognized)
```

If this doesn't hold, the ledger has a bug or a fraud event somewhere — a duplicate credit, a missed debit, a broken path in one of the three payment modes. This single check is one of the cheapest, highest-value fraud/bug detectors available and should be a release-blocking test, not just a monitoring dashboard.

**Net settlement formula, restated precisely** (replaces the informal version above):

```
Net settlement for merchant M =
    Σ(Merchant Settlement Payable, M)
  − Σ(Merchant Cash-in Receivable, M)
  − Commission(M)
```

- If positive: platform pays the merchant that amount; both legs clear to zero for the settled period.
- If negative: the merchant owes the platform — either remits directly, or it carries forward as a debit balance into the next settlement cycle. That carried-forward balance must be a visible line in the merchant's own ledger (§9.1), never a hidden number only the admin can see.

## 10. Security rules (consolidated, v1 + v2)

- Passcode is always the final approval gate, and is hashed server-side, never stored or logged in plaintext.
- QR codes (consumer ID card *and* merchant store QR) encode opaque tokens, not raw IDs.
- Every debit and credit carries an idempotency key; every wallet mutation happens inside one atomic database transaction (row lock, check, write, commit) to prevent double-spend or duplicate entries regardless of which of the three payment modes triggered it.
- **Credits are always synchronous and online — no exceptions, no queuing, no offline path, ever** (see §6).
- Payment requests (Mode C) expire quickly, are rate-limited per merchant-consumer pair, and always display the exact amount and requesting merchant to the consumer before approval.
- Merchant cash-in/advance credits require an immediate, consumer-visible confirmation, precisely because there's no other record of the cash handoff.
- Account lockout after repeated failed passcode attempts; passcode reset requires an in-person identity-verification flow since there's no phone-based OTP fallback for device-free consumers.

## 11. Terminology & compliance note

Precisely, this is a **semi-closed system** wallet, not a closed-loop one: value is redeemable across independent, contracted merchants rather than only from the issuing entity itself. Multi-merchant acceptance *alone* — independent of cash-in — is what puts a wallet in that category (India's RBI PPI framework is one concrete example of this three-way split; most jurisdictions have some analogous regime for stored-value instruments). Merchant cash-in adds a further agent-cash-handling layer on top of that, it isn't what triggers the classification in the first place.

I'm not a lawyer and this isn't legal advice. Since this project isn't headed for real-world deployment right now, none of this blocks anything here — it's recorded so the terminology is accurate and so the compliance question is already scoped correctly if this ever does move toward production.

## 12. Feature list per app (updated)

**Admin** — everything from v1, plus: view and manage merchant float/net settlement, approve or flag unusual cash-in patterns (a classic money-laundering vector for agent-style deposits), configure request expiry and rate limits for Mode C.

**Consumer app** — now a first-class part of the product, not just account management: scan merchant QR to pay (Mode B), view and approve/decline incoming payment requests (Mode C), view balance/history including how each funding entry arrived (self, admin, or a named merchant), request passcode reset.

**Merchant/business app** — scan or search consumer (Mode A), display a static store QR for Mode B, create payment requests for Mode C, record a cash-in deposit or advance credit against a consumer, view live wallet balance and full transaction history (every sale, deposit, advance, and settlement payout — filterable by date, type, and consumer), view own settlement including net amount owed either direction.

## 13. Open items for next pass

- Final currency name and exchange-rate policy (fixed vs admin-adjustable).
- Whether Mode B/C need an optional proximity check (e.g. comparing merchant and consumer location) as an extra fraud control for "in-person" use, distinct from genuinely remote use.
- Compliance review per §11 before enabling merchant cash-in in any live market (not needed for this project's current scope — flagged here only for completeness).
- NFC/offline roadmap (from v1) — reconfirm that any future offline path applies to debits only, never credits.
