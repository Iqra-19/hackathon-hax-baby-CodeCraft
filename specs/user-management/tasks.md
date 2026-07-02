---
feature: user-management
status: draft
owner: amin.tai@tntra.io
jira_key:
created: 2026-06-30
---

# Tasks: User Management

> Do not start this file until `plan.md` has `status: approved`. Each task should be small enough to close in a single PR and should state how to verify it's done.

- [ ] **T001:** Define Mongoose schemas for `User` and `InviteToken` collections, including all indexes (unique on `email`, TTL on `invite_tokens.expiresAt`, status index on `users`). Satisfies: FR-001, FR-009.
      Verify: Running the app connects to MongoDB without index errors; `db.users.getIndexes()` and `db.invite_tokens.getIndexes()` show the expected indexes.

- [ ] **T002 [P] [US4]:** Implement bootstrap admin logic — on server startup, if `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` are set and the `users` collection is empty, insert one Admin user with a bcrypt-hashed password.
      Verify: Start a fresh instance with env vars set; confirm one admin document exists in MongoDB. Start a second instance with the same vars and non-empty DB; confirm no duplicate is created (unique index catches it).

- [ ] **T003 [P]:** Implement JWT auth middleware — verify access token, load user from DB, check `status === "active"`, attach `req.user`. Implement `/api/auth/login` and `/api/auth/refresh`. Satisfies: FR-004 (deactivation side), FR-007.
      Verify: Unit tests cover: valid token → `req.user` set; expired token → 401; inactive user → 401; tampered signature → 401. Integration test: login → refresh → deactivate user → refresh returns 401.

- [ ] **T004 [P] [US1]:** Implement `POST /api/users/invite` and `POST /api/auth/invite/accept`. Invite upserts an `InviteToken` doc and sends email via Nodemailer. Accept hashes the token, validates expiry, creates the `User`, deletes the token. Satisfies: FR-001, FR-009.
      Verify: End-to-end test: invite → extract token → accept → user in DB with correct role and `status: active`. Re-invite same email → only one `InviteToken` doc in DB.

- [ ] **T005 [US2, US3, US4]:** Implement `GET /api/users` (paginated, Admin only), `PATCH /api/users/:id/role` (self-demotion guard + last-admin guard), `PATCH /api/users/:id/status` (setting `inactive` nulls `refreshTokenHash`). Satisfies: FR-002, FR-003, FR-004, FR-007.
      Verify: Tests cover: non-admin → 403; self role downgrade → 403; last admin downgrade → 403; deactivation → subsequent `/refresh` returns 401. Pagination returns correct `total` and page slice.

- [ ] **T006 [P] [US5, US6]:** Implement `PATCH /api/users/me` (only `displayName` and `avatarUrl`) and `PUT /api/users/me/password` (verify current password, 12-char minimum, rotate `refreshTokenHash`). Satisfies: FR-005, FR-006.
      Verify: Tests cover: wrong `currentPassword` → 400; `newPassword` < 12 chars → 400; successful change → old refresh token rejected; extra fields in PATCH body ignored.

- [ ] **T007 [P] [US2, US3, US4]:** Build the React admin user table — paginated list with role inline `<select>` and status toggle. Optimistic UI updates; revert row on 4xx. Satisfies: FR-002, FR-003, FR-004, FR-008.
      Verify: Manual: change role → DB reflects change without page reload. Deactivate user → row shows inactive immediately. Non-admin reaches admin route → redirect to home.

- [ ] **T008 [P] [US1]:** Build invite flow UI — admin form (`POST /api/users/invite`) and accept-invite page at `/accept-invite?token=…` (`POST /api/auth/invite/accept`). Satisfies: FR-001, FR-008.
      Verify: Manual end-to-end: submit form → open accept link → complete form → can log in as new user. Expired token (backdate `expiresAt` in DB) → accept page shows "invite expired" error.

- [ ] **T009 [P] [US5, US6]:** Build self-service profile page — `displayName`, `avatarUrl`, and password change via `/api/users/me` endpoints. Satisfies: FR-005, FR-006.
      Verify: Manual: update display name → reflected in nav immediately; wrong current password → inline error; new password < 12 chars → inline validation before submit.

- [ ] **T010:** Write environment variable documentation and runbook — all required env vars, how to bootstrap the first admin, how to re-invite an expired user, how to deactivate via API when the UI is unavailable.
      Verify: A team member with no prior context can follow the runbook to spin up a fresh instance, create the first admin, invite a second user, and deactivate them — without asking questions.

## Dependencies between tasks

```
T001 (schemas — foundational)
  ├─► T002 [P]  bootstrap admin
  ├─► T003 [P]  auth middleware
  └─► T004 [P]  invite flow API

       T003 ──► T005  admin endpoints (role, status, list)
       T003 ──► T006 [P]  self-service endpoints

       T005 ──► T007 [P]  admin UI
       T004 ──► T008 [P]  invite UI
       T006 ──► T009 [P]  profile UI

       T007 + T008 + T009 ──► T010  runbook
```

T002, T003, T004 all unblock once T001 merges — start them in parallel.
T007, T008, T009 are independent of each other — start each as soon as its API task merges.
T010 is last.
