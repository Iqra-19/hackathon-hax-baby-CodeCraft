# Notes: Engineering Arcade Leaderboard

Append-only decision log. Record deviations from the approved plan, ad-hoc decisions, and anything not captured in an ADR. Never edit previous entries — only append.

---

## 2026-06-18

- Deviated from ADR-1: initially attempted to use HTTP long-polling instead of WebSockets for the live update feed. Switched back to WebSockets after testing showed long-polling caused noticeable lag above 50 concurrent users. ADR-1 reasoning holds.

## 2026-06-20

- Discovered that the Redis sorted set TTL we planned (24h rolling window) conflicted with the weekly leaderboard reset requirement in FR-004. Adjusted TTL logic to expire at end of each ISO week boundary rather than 24h from last write. No ADR needed — implementation detail within the bounds of ADR-3.

## 2026-06-23

- JWT validation moved from per-request middleware to a shared `authGuard` decorator after the Reviewer flagged inconsistent auth enforcement across two route handlers. Satisfies FR-005 more cleanly than the original approach.
