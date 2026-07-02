---
feature: engineering-arcade-leaderboard
status: approved
approved-by: Amin Tai
approved-date: 2026-06-17
---

# Plan: Engineering Arcade Leaderboard

## Architecture overview

```
Challenge Engine ──POST /api/scores──► Express API ──► PostgreSQL (scores table)
                                            │
                                            └──► Redis (sorted set: leaderboard)
                                                      │
                                            WebSocket Server ◄── Redis pub/sub
                                                      │
                                          ┌───────────┴───────────┐
                                       Client A              Client B
                                    (React frontend)      (React frontend)
```

**Read path:** Client connects via WebSocket on load, receives the current leaderboard snapshot, then receives delta updates as scores change.

**Write path:** Challenge engine POSTs a score → Express validates auth → score written to PostgreSQL → cumulative total recalculated → Redis sorted set updated → pub/sub event published → WebSocket server broadcasts updated leaderboard to all connected clients.

## Tech stack

| Component | Choice | Rationale |
|---|---|---|
| Backend runtime | Node.js / Express | Existing org standard; event-driven model suits WebSocket |
| Database | PostgreSQL | Existing org standard; audit trail for score history |
| Real-time cache | Redis sorted set | O(log N) rank operations; native pub/sub for broadcast |
| Real-time transport | WebSocket (`ws` library) | See ADR-1 |
| Frontend | React | Existing org standard |
| Auth | JWT validation against existing auth service | See ADR-2 |

## Data model

### PostgreSQL: `score_events` table
```sql
CREATE TABLE score_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engineer_id   UUID NOT NULL REFERENCES engineers(id),
  challenge_id  UUID NOT NULL,
  points        INTEGER NOT NULL CHECK (points >= 0),
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (engineer_id, challenge_id)   -- idempotency: highest score wins
);

CREATE TABLE engineers (
  id            UUID PRIMARY KEY,
  display_name  TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE
);
```

Cumulative score is computed as `SUM(points)` per engineer. On a conflict (same engineer + challenge), keep the row with the higher points value (`ON CONFLICT DO UPDATE SET points = GREATEST(excluded.points, score_events.points)`).

### Redis: `leaderboard` sorted set

Key: `leaderboard`
Members: `engineer_id` (string)
Scores: cumulative points (float, updated on each score write)

`ZREVRANGE leaderboard 0 N-1 WITHSCORES` returns the top-N entries in O(log N + N).

## API contracts

### `GET /api/leaderboard?limit=N`
- Auth: Bearer JWT required (401 if absent or invalid)
- Query: `limit` integer 1–100, default 10 (422 if out of range)
- Response 200:
```json
{
  "entries": [
    { "rank": 1, "engineer_id": "uuid", "display_name": "Alice", "score": 4200 },
    { "rank": 2, "engineer_id": "uuid", "display_name": "Bob",   "score": 3800 }
  ],
  "total_engineers": 47
}
```

### `POST /api/scores`
- Auth: Bearer JWT required, must carry `role: challenge_engine` claim (403 if wrong role)
- Body:
```json
{ "engineer_id": "uuid", "challenge_id": "uuid", "points": 150 }
```
- Response 204 on success. 422 on invalid body. 409 if submitted score is lower than existing score for the same challenge (no-op, but explicit).

### WebSocket: `ws://host/ws/leaderboard`
- Auth: JWT passed as `Authorization` query param on connect (401 disconnect if invalid)
- On connect: server sends `{ "type": "snapshot", "entries": [...] }`
- On score change: server sends `{ "type": "update", "entries": [...] }` (full leaderboard, not delta)

## ADRs

### ADR-1: WebSocket vs. Server-Sent Events (SSE) for real-time
- **Problem:** How to push leaderboard updates to browser clients.
- **Options considered:**
  - *WebSocket*: bidirectional, works for both the read (receive updates) and any future write path from the browser. Requires a stateful server connection.
  - *SSE*: simpler, unidirectional, built into browsers with native reconnect. Stateless-friendly.
- **Chosen solution:** WebSocket (`ws` npm package).
- **Reasoning:** The spec requires score submissions from the challenge engine (a separate system), not from the browser — so SSE's unidirectional limitation is acceptable for now. However, future iterations may add in-browser score submissions or chat. WebSocket avoids a transport migration. The added complexity of stateful connections is acceptable at pilot scale (< 100 concurrent users).

### ADR-2: JWT validation without issuing tokens
- **Problem:** The leaderboard must authenticate requests without becoming an auth server.
- **Options considered:**
  - *Shared secret (HMAC)*: validate JWTs using a shared secret from the existing auth service.
  - *Public key (RS256)*: fetch the auth service's public key at startup and validate with asymmetric verification.
- **Chosen solution:** RS256 public key verification.
- **Reasoning:** Shared secrets require distributing a secret to the leaderboard service, creating a rotation problem. Public key verification requires only a one-time fetch of the public key (or JWKS endpoint). No secret is stored in this service. Accepted tradeoff: startup dependency on the auth service's JWKS endpoint.

### ADR-3: Full snapshot on every update vs. delta diffs
- **Problem:** When a score changes, send only the changed entries (delta) or the full leaderboard.
- **Options considered:**
  - *Delta*: smaller payloads, but requires clients to maintain state and apply diffs correctly.
  - *Full snapshot*: larger payloads, but client logic is stateless — always display what you received.
- **Chosen solution:** Full leaderboard snapshot on every update.
- **Reasoning:** At pilot scale (≤ 100 engineers, ≤ 100 entries), a full snapshot is ~10 KB. The engineering cost of correct delta application (ordering, out-of-order delivery) outweighs the bandwidth saving. Revisit if the leaderboard grows past 1,000 entries.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Redis unavailable | Low | High — updates stop | Redis connection error falls back to PostgreSQL direct query; stale snapshot served |
| WebSocket connection storms on leaderboard page load | Low | Medium | Connection backoff on client; server-side connection rate limit per IP |
| JWT secret rotation causes 401 spikes | Low | Medium | Fetch JWKS on 401 and retry once before returning error to client |

## Constitution check

- [x] No new infrastructure dependency introduced without an ADR. (Redis: ADR-1 and ADR-3 context; WebSocket: ADR-1)
- [x] All API errors follow `{ "error": string }` shape.
- [x] No business logic in route handlers — score accumulation and rank calculation live in `LeaderboardService`, not in route handlers.
- [x] All secrets managed via environment variables, never hardcoded. (`JWKS_URL`, `REDIS_URL`, `DATABASE_URL` via env.)
