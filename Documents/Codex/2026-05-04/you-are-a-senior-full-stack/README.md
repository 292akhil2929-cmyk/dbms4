# Blunder

Blunder is a reverse dating experiment. It stores what a user says they want, computes compatibility against candidate profiles, then deliberately ranks candidates by highest mismatch score. The product question is not "who is perfect?" It is "where does observed engagement contradict stated preference?"

## 1. System Design

Architecture:
- Next.js App Router serves the React UI and API routes from one deployable Node service.
- SQLite is the default database for local and small pilot deployments. PostgreSQL is the natural production upgrade once concurrency, backups, and analytics volume matter.
- `better-sqlite3` keeps the data layer synchronous and simple. The tradeoff is that high write throughput should move to Postgres plus a background event queue.
- API routes own auth, matching, interactions, messages, and analytics aggregation. The frontend never recomputes experimental scores.

Main flow:
1. A user registers with profile attributes and value ratings.
2. The user edits stated preferences and scoring weights.
3. `/api/matches` loads all non-swiped candidates, computes compatibility, stores shown matches, and returns candidates sorted by mismatch.
4. Swipes and messages are written to `interactions` and `analytics_events`.
5. `/api/analytics` compares stated values to engaged profiles using likes and sent messages as behavior proxies.

Constraints:
- The prototype does not model mutual consent for chat. A production dating product must require reciprocal opt-in before live messaging.
- Engagement is not attraction. Likes and messages are only measurable proxies.
- A small inventory can create artificial mismatch findings. The dashboard calls this out instead of overclaiming.
- Email/password auth is intentionally basic. Production needs password reset, rate limiting, secure secrets, audit logs, and a privacy policy.

## 2. Folder Structure

```txt
migrations/              SQL schema
scripts/                 migration and seed scripts
src/app/                 Next pages and API routes
src/app/api/auth/        register, login, logout
src/app/api/matches/     mismatch candidate generation
src/app/api/swipes/      swipe tracking
src/app/api/chat/        basic chat over liked mismatches
src/app/api/analytics/   dashboard aggregation and event tracking
src/components/          React screens and shared UI
src/lib/                 auth, db, repositories, scoring, types, validators
```

## 3. Data Models

Core tables:
- `users`: account, profile traits, self-described values, and bio.
- `preferences`: stated partner criteria plus scoring weights.
- `matches`: generated user-candidate pairs with compatibility and mismatch scores.
- `interactions`: behavioral records such as swipe and message initiation.
- `messages`: basic conversation messages for liked mismatch candidates.
- `analytics_events`: append-only product events with optional session id.

## 4. Matching Logic

`compatibility_score(userA_preferences, userB_profile)` is a weighted score from 0 to 1:
- Demographics: age range plus preferred gender.
- Income: range fit with tolerance outside the range.
- Personality: ordered axis, introvert -> ambivert -> extrovert.
- Lifestyle: ordered axis, quiet -> balanced -> social.
- Values: five-dimensional vector similarity for ambition, family, adventure, stability, creativity.

Then:

```txt
mismatch_score = 1 - compatibility_score
```

Candidates are sorted by highest `mismatch_score`.

Edge cases:
- Missing preferences return no candidates.
- Already-swiped candidates are excluded.
- `preferredGender = any` gives full categorical score.
- Out-of-range numeric dimensions degrade gradually instead of dropping straight to zero.
- If all weights are zero, total weight falls back to 1 to avoid division by zero.

## 5. Full Code

The application code lives in this repository. Key entry points:
- `src/lib/scoring.ts`
- `src/lib/repositories.ts`
- `src/components/swipe-view.tsx`
- `src/components/analytics-view.tsx`
- `migrations/001_init.sql`

## 6. Setup Instructions

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Seed accounts use password `password123`, for example `maya@example.com`.

For production:
- Set `JWT_SECRET`.
- Move from SQLite to PostgreSQL before multi-instance deployment.
- Add rate limiting to auth routes.
- Require reciprocal match consent before chat.
- Add event retention rules and privacy controls.
