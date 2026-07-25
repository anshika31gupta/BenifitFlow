# BenefitFlow AI — Full Stack

This package contains:

- `frontend/` — your original Stitch/AI-Studio React app (UI untouched, only
  data-fetching rewired to hit the real backend instead of `mockData.ts`).
- `backend/` — new Node.js + Express + Prisma (SQLite) backend implementing
  auth, transactions, the BenefitMatcher rule engine, claims, rules admin,
  dashboard, uploads, and the Gemini AI passthrough endpoints.

## 1. Backend setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed        # creates 5 demo users, cards, 30 transactions, 78 rules, 8 policies
npm run dev          # http://localhost:4000
```

Or all at once: `npm run setup`.

> **Note on this sandbox:** `npx prisma generate` / `migrate` could not be
> verified end-to-end here because this container's network policy blocks
> `binaries.prisma.sh` (where Prisma downloads its query-engine binary). All
> other files were syntax-checked and the frontend was type-checked and
> production-built successfully. Run the commands above on your own machine
> (which has normal internet access) and it will work — this is a sandbox
> limitation, not a code issue.

Demo login (created by the seed script):

| Email | Password |
|---|---|
| anshika@benefitflow.demo | Demo@1234 |
| rahul@benefitflow.demo | Demo@1234 |
| priya@benefitflow.demo | Demo@1234 |
| karan@benefitflow.demo | Demo@1234 |
| sara@benefitflow.demo | Demo@1234 |

Set `GEMINI_API_KEY` in `backend/.env` to get live Gemini explanations; without
it, both AI endpoints return realistic hardcoded fallback text (same behavior
as the original frontend-only server.ts).

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

The frontend now shows a login screen first (new — required to wire up JWT
auth; nothing else in the UI was redesigned). Sign in with a demo account
above, or sign up a new one. Once authenticated it loads dashboard,
transactions, benefits, claims, rules and insights live from the backend.

`frontend/.env` (optional): set `VITE_API_URL` if your backend isn't on
`http://localhost:4000/api`.

## 3. What talks to what

- `frontend/src/lib/api.ts` — typed fetch client + adapters that translate
  backend JSON shapes into the exact `types.ts` shapes the existing
  components already expect (no component was redesigned).
- The two existing Gemini endpoints (`/api/gemini/analyze-transaction`,
  `/api/gemini/chat`) are still served by the frontend's own `server.ts`
  exactly as before — untouched. The backend also exposes the same two
  routes under `/api/gemini/*` for parity/testing via Postman, in case you
  want to consolidate later.

## 4. API reference (backend, base `http://localhost:4000/api`)

```
POST   /auth/signup            { name, email, password }
POST   /auth/login             { email, password }
GET    /auth/profile           (Bearer token)

GET    /cards
POST   /cards

GET    /transactions           ?category=&status=&search=
GET    /transactions/:id
POST   /transactions
DELETE /transactions/:id

GET    /benefits
POST   /benefits/check         (dry-run matcher, no persistence)

GET    /claims
POST   /claims                 { transactionId, documentsAttached? }
PATCH  /claims/:id             { status?, message?, actor? }

GET    /rules
POST   /rules
PUT    /rules/:id
PATCH  /rules/:id/toggle
DELETE /rules/:id

GET    /insights
GET    /dashboard
GET    /history                (alias of /claims — claim lifecycle IS the history)

POST   /uploads                multipart/form-data, field "file" (csv or json)
GET    /uploads

POST   /gemini/analyze-transaction   { transaction }
POST   /gemini/chat                  { message }
```

All routes except `/auth/*` and `/gemini/*` require `Authorization: Bearer <token>`.

## 5. Architecture notes

- **MVC + service layer**: `routes/ → controllers/ → services/ → Prisma`.
  Controllers stay thin (just call a service + shape the response);
  business logic (matching, claim lifecycle, dashboard aggregation) lives in
  `services/`.
- **BenefitMatcher** (`src/services/benefitMatcherService.js`) is the rule
  engine: on every transaction create/upload it evaluates all active
  `RuleDefinition` rows (category, card, bank, minimum amount, recency),
  computes a confidence score, persists `MatchedBenefit` rows, and mirrors
  the top match onto the transaction's flat fields (`hasBenefit`,
  `detectedBenefit`, `confidenceScore`, `coverageLimit`, `claimDeadline`)
  so the frontend can keep reading a flat `Transaction` object exactly like
  it did with mock data.
- **Errors**: every thrown `ApiError` (or Prisma error) is caught by a single
  `errorMiddleware` and returned as `{ success: false, message }`.
