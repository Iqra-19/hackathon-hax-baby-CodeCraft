---
feature: engineering-arcade-leaderboard
status: in-progress
execution-strategy: MVP First
---

# Tasks: Engineering Arcade Leaderboard

**Execution strategy:** MVP First — T001 (schema) is foundational. Once merged, T002–T005 run in parallel. T006 (frontend) starts after T002 and T003 are merged, since it consumes both the REST endpoint and WebSocket.

---

- [ ] **T001:** Create PostgreSQL schema — `engineers` and `score_events` tables, all indexes, idempotency constraint. Satisfies: FR-003 (persistence), FR-001 (data source).
      Verify: Running `\d score_events` shows all columns, the `UNIQUE (engineer_id, challenge_id)` constraint, and the `GREATEST` upsert logic confirmed by inserting a lower score for an existing `(engineer, challenge)` pair and checking the row is unchanged.

- [ ] **T002 [P]:** Implement JWT auth middleware — validate RS256 tokens against the JWKS endpoint, extract `engineer_id` and `role` claims, attach to `req.user`. Satisfies: FR-004.
      Verify: Unit tests pass for: valid token → `req.user` populated; expired token → 401; missing token → 401; token with wrong role on POST /api/scores → 403; tampered signature → 401.

- [ ] **T003 [P]:** Implement `GET /api/leaderboard` and `POST /api/scores` REST endpoints, backed by `LeaderboardService`. Service reads from Redis sorted set; on score write, upserts PostgreSQL then updates Redis. Satisfies: FR-001, FR-003, FR-005.
      Verify: Integration tests confirm: GET returns top 10 by default; `?limit=5` returns 5; `?limit=101` returns 422; POST with valid body returns 204 and updates Redis ZSET; POST with duplicate lower score returns 409 and leaves score unchanged.

- [ ] **T004 [P]:** Implement WebSocket server — accept connections at `/ws/leaderboard`, validate JWT on connect, subscribe to Redis pub/sub channel, send snapshot on connect, broadcast full leaderboard on score-changed events. Satisfies: FR-002, FR-004.
      Verify: Integration test: open two WebSocket clients; POST a score via the REST endpoint; both clients receive `{ type: "update", entries: [...] }` within 2 seconds; client connecting with invalid JWT receives close frame 4401.

- [ ] **T005 [P]:** Implement Redis pub/sub integration in `LeaderboardService` — publish `score-changed` event after every successful score write. Connect the WebSocket server as the subscriber. Satisfies: FR-002 (event propagation).
      Verify: Unit test confirms `score-changed` is published after a successful upsert. T004's integration test provides end-to-end confirmation.

- [ ] **T006:** Implement React leaderboard component — WebSocket client, ranked display (name, score, rank badge), connection status indicator, auto-reconnect with exponential backoff. Satisfies: FR-001, FR-002.
      Verify: Manual test in browser: page loads and shows top 10 within 1 second; POST a score via curl; rank order on page updates within 2 seconds without reload; disconnect network and reconnect — component recovers without page refresh.

- [ ] **T007:** End-to-end runbook and environment setup — `JWKS_URL`, `REDIS_URL`, `DATABASE_URL` documented in `.env.example`; migration script confirmed to run clean on a fresh database; README section for local dev setup. Satisfies: all FRs (operational).
      Verify: A developer who has not seen the code can run `npm run db:migrate && npm start` on a clean machine and reach a working leaderboard in under 10 minutes, following only the README.

---

## Dependency tree

```
T001  (schema — foundational)
  ├─► T002 [P]   JWT auth middleware
  ├─► T003 [P]   REST endpoints + LeaderboardService
  ├─► T004 [P]   WebSocket server
  └─► T005 [P]   Redis pub/sub

       T003 + T004 + T005 ──► T006   React frontend

       T006 ──► T007   runbook + env setup
```

**Notes:**
- T002, T003, T004, T005 can all start as soon as T001 merges — they share the schema but don't share write paths.
- T004 depends on T005 at the integration test level (WebSocket test exercises pub/sub), but they can be coded in parallel and merged together.
- T007 is last — it documents the full working system.
