---
feature: user-management
status: approved
owner: amin.tai@tntra.io
jira_key:
created: 2026-06-30
---

# Plan: User Management

## Architecture overview

Standard MERN layering. The Express API owns all user state; the React SPA never reads MongoDB directly.

```
┌─────────────────────────────────────┐
│           React SPA                 │
│  Admin UI (user table, role select, │
│  activate/deactivate toggle)        │
└────────────────┬────────────────────┘
                 │ REST / JSON
┌────────────────▼────────────────────┐
│           Express API               │
│  /api/users/*   /api/users/me/*     │
│  Auth middleware → role guard       │
└────────────────┬────────────────────┘
                 │ Mongoose
┌────────────────▼────────────────────┐
│           MongoDB                   │
│  users   invite_tokens              │
└─────────────────────────────────────┘
                 │
        (invite emails only)
┌────────────────▼────────────────────┐
│      Transactional email provider   │
│      (SendGrid / Postmark / SMTP)   │
└─────────────────────────────────────┘
```

## Tech stack & rationale

| Layer | Choice | Reason |
|---|---|---|
| Auth tokens | JWT (access 15 min) + refresh token (httpOnly cookie, 7 d) | Short access token TTL means deactivation takes effect within 15 min without a Redis denylist. Refresh token is invalidated server-side on deactivation. |
| Password hashing | bcrypt (cost 12) | Industry standard; cost 12 is ~250 ms on commodity hardware — too slow to brute-force, fast enough for UX. |
| Invite tokens | `crypto.randomBytes(32)` → base64url → SHA-256 stored in DB | Plain token travels only in the invite email; the hash is what lives in MongoDB. |
| Email | Provider-agnostic Nodemailer transport | Swap SMTP → SendGrid → Postmark by changing one env var. |
| Pagination | Cursor-based on `_id` (fallback: offset) | Consistent results under concurrent inserts. Offset pagination exposed as fallback for the first release since the admin list is small. |

## Data model

### `users` collection

```js
{
  _id:          ObjectId,
  email:        String,   // unique, lowercase-normalised
  displayName:  String,
  avatarUrl:    String,   // nullable; external URL only (no S3 in this release)
  passwordHash: String,   // bcrypt output
  role:         String,   // enum: "admin" | "member" | "viewer"
  status:       String,   // enum: "active" | "inactive"
  refreshTokenHash: String | null,  // SHA-256 of current refresh token; null = logged out
  createdAt:    Date,
  updatedAt:    Date,
}
```

Indexes: `{ email: 1 }` unique; `{ status: 1 }` for auth middleware status check.

### `invite_tokens` collection

```js
{
  _id:       ObjectId,
  tokenHash: String,  // SHA-256(plain token); unique index
  email:     String,  // unique index — one pending invite per email
  role:      String,  // role to assign on acceptance
  expiresAt: Date,    // createdAt + 72 h
  createdAt: Date,
}
```

TTL index on `expiresAt` (MongoDB auto-deletes expired documents — no cron needed).

## API contracts

All endpoints require a valid JWT in `Authorization: Bearer <token>` unless noted. Errors follow `{ error: string }` shape.

### POST /api/auth/invite/accept
No auth required. Body: `{ token: string, displayName: string, password: string }`.
- Hashes token, looks up `invite_tokens`. Returns 400 if missing or expired.
- Creates `users` document. Returns 201 with user object (no passwordHash).

### POST /api/users/invite
Role: Admin. Body: `{ email: string, role: "admin" | "member" | "viewer" }`.
- Upserts `invite_tokens` (replaces any existing invite for that email — covers re-invite after expiry).
- Sends email with link: `APP_URL/accept-invite?token=<plainToken>`.
- Returns 202.

### GET /api/users
Role: Admin. Query: `?page=1&limit=20`.
- Returns `{ users: User[], total: number, page: number }`.

### PATCH /api/users/:id/role
Role: Admin. Body: `{ role: "admin" | "member" | "viewer" }`.
- Returns 403 if `id` matches the caller's own `_id` (self-demotion guard).
- Returns 200 with updated user.

### PATCH /api/users/:id/status
Role: Admin. Body: `{ status: "active" | "inactive" }`.
- On `inactive`: sets `refreshTokenHash: null` to invalidate any live session immediately.
- Returns 200 with updated user.

### PATCH /api/users/me
Authenticated (any role). Body: `{ displayName?: string, avatarUrl?: string }`.
- Only `displayName` and `avatarUrl` are writable. Other fields silently ignored.
- Returns 200 with updated user.

### PUT /api/users/me/password
Authenticated (any role). Body: `{ currentPassword: string, newPassword: string }`.
- Returns 400 if `currentPassword` does not match stored hash.
- Returns 400 if `newPassword` length < 12.
- Rotates `refreshTokenHash` — invalidates other sessions.
- Returns 200.

### Auth middleware behaviour
Every protected route:
1. Verifies JWT signature and expiry.
2. Loads `users` document by `sub` claim.
3. Returns 401 if user not found or `status === "inactive"`.
4. Attaches `req.user` for downstream handlers.

## Integration points

- **Email provider**: configured via `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` env vars (Nodemailer SMTP). For SendGrid: set `EMAIL_HOST=smtp.sendgrid.net`, `EMAIL_USER=apikey`, `EMAIL_PASS=<sendgrid-api-key>`.
- **Bootstrap admin** (answers open question #1): on server startup, if `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` env vars are set and the `users` collection is empty, create one Admin user. The unique index on email makes this idempotent across concurrent instances — only one insert wins.
- **Frontend**: React admin table uses `PATCH /api/users/:id/role` and `/status` with optimistic UI updates (revert on 4xx).

## Constitution check

- [ ] No new infrastructure dependency introduced without an ADR — Redis denylist was considered and explicitly rejected in ADR-1.
- [ ] All API errors follow `{ error: string }` shape — confirmed across all endpoint contracts above.
- [ ] No raw MongoDB queries — all collection access goes through Mongoose models.
- [ ] All secrets (`JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `BOOTSTRAP_ADMIN_PASSWORD`, email credentials) managed via environment variables; no hardcoded values.
- [ ] Invite tokens never logged or persisted in plain form — SHA-256 hash only in MongoDB (FR-009).
- [ ] No business logic in Express route handlers — handlers call service functions only; validation and DB access live in the service layer.

## Architecture Decision Records

### ADR-1: Short-lived JWT + server-side refresh token invalidation over a Redis denylist

- **Problem:** Stateless JWTs cannot be revoked mid-lifetime, but the spec requires that deactivating a user produces an immediate 401.
- **Options considered:**
  - A: Pure stateless JWT (no DB on every request) — violates the immediate-deactivation requirement.
  - B: Redis token denylist — immediate revocation, but adds Redis as a required dependency.
  - C: 15-minute access token + refresh token with `refreshTokenHash` stored in MongoDB — access tokens expire quickly; deactivation sets `refreshTokenHash: null` which blocks refresh immediately.
- **Chosen solution:** Option C.
- **Reasoning:** Adds no new infrastructure (MongoDB already present). A 15-minute window of continued access after deactivation is acceptable for the team's security posture. Redis can be added later if requirements tighten.

### ADR-2: External URL for avatar instead of object storage

- **Problem:** The spec leaves avatar storage open. S3 adds IAM, bucket policy, and CORS complexity.
- **Options considered:**
  - A: S3 upload — full control, no hotlinking risk.
  - B: User-supplied external URL — zero infra, risk of dead links.
- **Chosen solution:** Option B for this release.
- **Reasoning:** The user table is internal-facing (admin UI). Dead avatar links have no security impact and low UX impact. S3 integration is a one-line change to the `avatarUrl` update handler when needed.

### ADR-3: MongoDB TTL index for invite token expiry instead of a cron job

- **Problem:** Expired invite tokens need cleanup.
- **Options considered:**
  - A: Application-layer cron — requires a scheduler or separate worker process.
  - B: MongoDB TTL index on `expiresAt` — MongoDB background thread deletes documents automatically.
- **Chosen solution:** Option B.
- **Reasoning:** Zero application code. TTL indexes are a MongoDB primitive designed for exactly this use case.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Invite emails land in spam | Medium | High — blocks onboarding | Configure SPF/DKIM for the sending domain before launch. Use a reputable transactional provider. |
| Bootstrap race condition (two instances start simultaneously) | Low | Low — unique index on email lets only one insert succeed; the other instance logs and continues | Unique index is the guard; no additional logic needed. |
| Plain invite token logged accidentally | Low | High — token grants account creation | Structured logging must never log the raw `token` query param. Add a log-scrubbing rule for `/accept-invite` routes. |
| Self-demotion causes no remaining admin | Low | High — lockout | PATCH /api/users/:id/role checks: if `role` is being changed away from `admin`, verify at least one other active admin exists. |
