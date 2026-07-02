---
feature: engineering-arcade-leaderboard
status: approved
approved-by: Amin Tai
approved-date: 2026-06-15
---

# Spec: Engineering Arcade Leaderboard

## Context

The Engineering Arcade pilot rewards engineers for completing technical challenges. A real-time leaderboard is required to display ranked scores, drive competition, and give participants immediate feedback when their score changes. The leaderboard is a read-heavy system that must handle score updates pushed from the challenge engine without polling.

## Technical requirements

- Expose a ranked leaderboard of the top N engineers by cumulative score.
- Update all connected leaderboard views within 2 seconds of any score change, without a page reload.
- Accept score submissions from the challenge engine via an authenticated POST endpoint.
- Enforce authentication on all leaderboard endpoints — no anonymous reads or writes.
- Support configurable top-N display (default 10, max 100).

## Acceptance criteria

- [ ] **FR-001:** View leaderboard
      Given an authenticated user loads the leaderboard page
      When the frontend connects to the API
      Then they see a ranked list of the top 10 engineer display names and cumulative scores,
      ordered highest to lowest, with rank numbers (1st, 2nd, 3rd…).

- [ ] **FR-002:** Real-time score update
      Given an authenticated user is viewing the leaderboard
      When the challenge engine submits a score event that changes any engineer's rank
      Then the user's view updates within 2 seconds, without a page reload or manual refresh,
      showing the new rank order.

- [ ] **FR-003:** Score submission
      Given the challenge engine POSTs to `/api/scores` with a valid auth token, engineer ID, challenge ID, and point value
      When the request is processed
      Then the score is recorded in the database, the engineer's cumulative total is updated,
      and a score-changed event is emitted to all connected leaderboard clients.

- [ ] **FR-004:** Authentication enforcement
      Given any request to a leaderboard endpoint (read or write) arrives without a valid JWT
      When the request is processed
      Then 401 is returned with `{ "error": "Unauthorized" }` and no leaderboard data is returned.

- [ ] **FR-005:** Configurable top-N
      Given an authenticated API request includes a `?limit=N` query parameter where N is between 1 and 100
      When the leaderboard data is fetched
      Then exactly N entries are returned. If N is absent, 10 is used. If N > 100 or < 1, 422 is returned with `{ "error": "limit must be between 1 and 100" }`.

## Out of scope

- Per-challenge score breakdowns (cumulative total only)
- Historical score trends or leaderboard snapshots over time
- Admin UI for score correction or manual overrides
- Email or Slack notifications on rank changes
- Pagination beyond the top-100 limit

## Open questions

*All resolved before approval.*

- Q: Should score events be idempotent (duplicate challenge submissions)? **Resolved:** Yes — the challenge engine may retry. Deduplicate by `(engineer_id, challenge_id)` — only the highest score for a given challenge counts.
- Q: WebSocket or SSE for real-time updates? **Resolved:** WebSocket — see ADR-1 in plan.md.
- Q: Who issues JWTs? **Resolved:** Existing auth service. Leaderboard validates but does not issue tokens.
