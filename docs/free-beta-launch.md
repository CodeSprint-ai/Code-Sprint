# CodeSprint Free Beta configuration

## Current release

- Free Beta only. No payment gateway, checkout, subscriptions, automatic renewals, or overage billing.
- Free AI allowance: 20 newly revealed hints and 3 completed analyses per UTC calendar month.
- Planned Pro: USD $5/month or $40/year; pilot allowance of 200 hints and 30 analyses/month. These are waitlist information, not entitlements sold by this release.
- Institutional pilots: individually scoped quotes, not the pitch deck's estimated per-seat price.
- Confirmed social/contact/team details live in `frontend/src/features/marketing/config.ts`.
- Public leaderboard is not launched. No simulated rankings or hiring claims are published.

## Backend deployment

Deploy both services from this branch; old backend versions do not provide the new catalogue, forms, inbox, and usage APIs. Apply the existing migration process (`npm run migration:run` in backend) before starting new API/worker processes. Production startup also runs compiled migrations. The backend build includes only src/**/*.ts, emitting dist/main.js and dist/migrations/*.js; CLI helpers under scripts/ are not part of the TypeScript runtime build. The post-build prepare-runtime.cjs validates all compiled migrations and creates a compatibility launcher at dist/src/main.js for the existing Render start command; both node dist/main.js and node dist/src/main.js start the same application.

New migrations create `engagement_requests` and `ai_usage_ledger`. The quota migration invalidates generated level-4 hint cache entries from the old full-solution policy; this cache can be regenerated, but its old contents are not restored by rollback. Account/submission records are not removed. Restart API and analysis/hint workers together so old workers do not write outdated hint content.

Contact/waitlist requests require the existing PostgreSQL database. A success response is sent only after persistence. Optional email notifications use existing `RESEND_API_KEY` and `MAIL_FROM`; `SUPPORT_EMAIL` defaults to `codesprint.ai@gmail.com`. Notifications contain only a request reference. Mail failure does not lose the saved request. No campaign emails are sent by this implementation.

Authenticated admins can review the latest 100 requests at `/admin/inbox`, reply via email, and delete verified removal requests. Ordinary users cannot access `/engagement/inbox` or its delete route. Daily UTC cleanup removes contact entries older than 90 days, waitlist entries older than 365 days, and allowance ledger records older than 90 days. Ensure the existing scheduler runs in at least one API instance.

## Usage accounting

The PostgreSQL ledger uses transaction-scoped advisory locks per user/kind/month and unique resource keys. A hint and its usage record commit in the same transaction. Generation/DB failures roll back the reservation. Rereading revealed hints does not invoke a new reservation.

Analysis requests reuse one reservation and Bull job ID per submission/month. A pending job reserves one slot; retries retain that slot. Successful completion commits usage. Final failure releases an uncompleted reservation; cached report reads bypass reservation. An ambiguous enqueue failure retains the reservation if a job exists, rather than overbooking capacity. For interrupted jobs, check Bull/Redis recovery before manually deleting an orphaned reserved ledger row.

`GET /usage/ai` reports used, pending, remaining, and next UTC reset. `/usage` and compact workspace panels display the result. The backend is authoritative. Pro is not assignable or purchasable in this release.

## Before enabling paid service

Confirm the legal operator, jurisdiction, ownership/IP agreement, and payment-provider account. Replace the informational planned billing terms with reviewed active terms. Measure per-user AI and code execution costs, validate quotas, and implement payments, receipts, renewals, self-service cancellation, annual reminders, and refunds before changing paid launch messaging. The proposed first-purchase refund window is 7 days; no financial charges occur during this beta.

Review privacy text against actual production providers and retention settings. Handle verified access/deletion/consent-withdrawal requests through the support inbox. Never infer operator ownership from team credits. Do not add optional analytics or advertising scripts without implementing consent choices that actually control loading.

Security PR #28 remains a separate pre-existing change. This release does not claim to include its submission ownership/problem permissions fixes.

Submission creation is limited to 10 requests per authenticated user per minute by the existing per-instance rate limiter. Public contact and waitlist submission each allow 5 attempts per IP per hour, using the proxy-resolved client IP. These short-term controls are distinct from the database-backed monthly AI allowance.
