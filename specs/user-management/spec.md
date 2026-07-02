---
feature: user-management
status: approved
owner: amin.tai@tntra.io
jira_key:
created: 2026-06-30
---

# Spec: User Management

## Problem statement

Admins currently have no in-product way to manage who can access the application. New users must be created directly in MongoDB, role changes require a developer, and there is no mechanism to deactivate a user without deleting their data. This blocks the team from onboarding customers without engineering involvement and creates a security gap when employees leave.

The immediate need is a management interface that lets admins invite, configure, and deactivate users entirely from within the product.

## User stories

- As an **admin**, I want to invite a user by email so that they can access the application without requiring a developer to insert a database record.
- As an **admin**, I want to assign a role (Admin, Member, Viewer) to a user so that access is scoped to what each person needs.
- As an **admin**, I want to deactivate a user account so that a departing employee immediately loses access without their data being deleted.
- As an **admin**, I want to view a paginated list of all users with their role and status so that I can audit who has access at a glance.
- As a **user**, I want to update my display name and avatar so that colleagues can identify me within the product.
- As a **user**, I want to change my own password so that I can maintain account security without contacting an admin.

## Acceptance criteria

- [ ] **FR-001:** Invite by email (US1)
      Given an admin submits the invite form with a valid email and a role
      When `POST /api/users/invite` is called
      Then an email is dispatched with a 72-hour accept link and an `InviteToken` document exists in MongoDB; no `User` document is created yet.

- [ ] **FR-002:** Paginated user list (US4)
      Given an admin is authenticated
      When `GET /api/users?page=1&limit=20` is called
      Then the response contains `{ users, total, page }` where each user has `id`, `email`, `displayName`, `role`, `status`, and `createdAt`.

- [ ] **FR-003:** Role assignment (US2)
      Given an admin calls `PATCH /api/users/:id/role` with a valid role
      When the target user is not the caller
      Then the role is updated and 200 is returned; when the target is the caller, 403 is returned.

- [ ] **FR-004:** User deactivation (US3)
      Given an admin calls `PATCH /api/users/:id/status` with `{ status: "inactive" }`
      When the request is processed
      Then the user's status is set to `inactive`, their `refreshTokenHash` is nulled, and any subsequent request from that user returns 401.

- [ ] **FR-005:** Self-service profile update (US5)
      Given an authenticated user calls `PATCH /api/users/me` with any body
      When the request is processed
      Then only `displayName` and `avatarUrl` are updated; all other fields in the body are silently ignored.

- [ ] **FR-006:** Password change (US6)
      Given an authenticated user calls `PUT /api/users/me/password`
      When `currentPassword` matches and `newPassword` is ≥ 12 characters
      Then the password is updated and the old refresh token is invalidated; when `currentPassword` is wrong or `newPassword` is < 12 characters, 400 is returned.

- [ ] **FR-007:** Role-based access control (all stories)
      Given a non-Admin user is authenticated
      When they call any `/api/users/:id/*` endpoint
      Then 403 is returned; `/api/users/me/*` endpoints are accessible to any authenticated user.

- [ ] **FR-008:** Admin UI real-time updates (US2, US3, US4)
      Given an admin is on the Users page
      When they change a role via the inline selector or toggle a user's status
      Then the table row reflects the change immediately without a full page reload; a failed request reverts the row to its previous state.

- [ ] **FR-009:** Invite token security (US1)
      Given an invite is created
      When the `invite_tokens` collection is inspected
      Then only the SHA-256 hash of the token is present; the plain token exists only inside the invite email.

## Non-goals

- OAuth / SSO (SAML, Google, GitHub login) — separate feature.
- Two-factor authentication — separate feature.
- Granular permission scopes beyond three fixed roles (Admin, Member, Viewer).
- Self-registration / public sign-up — only admin-initiated invites are in scope.
- Audit log or activity history per user — separate feature.
- Email template customisation — a single fixed invite email template is sufficient for now.

## Open questions

- **Roles on first user**: when the application is first deployed and no admin exists, how is the first admin created? Options: seed script, environment-variable bootstrap user, or first-registrant-becomes-admin. This must be answered before plan phase.
- **Invite expiry behaviour**: if an invite expires before the user accepts, can the admin re-send it, or must they create a new invite? (Affects whether we store or void the old token.)
- **Soft-delete vs deactivation**: the spec uses status-based deactivation. Are there any compliance or data-retention requirements that would require a separate hard-delete path?
- **Avatar storage**: is there an existing S3 bucket / object storage to use for `avatarUrl`, or should avatar be limited to an external URL provided by the user for now?
