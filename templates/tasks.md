---
feature: <feature-slug>
status: draft
owner: <engineer-name>
created: <YYYY-MM-DD>
---

# Tasks: <Feature Name>

> Do not start this file until `plan.md` has `status: approved`. Each task should be small enough to close in a single PR and should state how to verify it's done.

Task ID format: `T001`, `T002`, … — used for traceability back to `FR-NNN` requirements.
`[P]` marks tasks that can run in parallel with other `[P]` tasks at the same dependency level.
`[US1]` references the user story this task satisfies.

- [ ] **T001 [US1]:** <description>
      Verify: <how you'll confirm this is correct>
- [ ] **T002 [P] [US1]:** <description>
      Verify: <how you'll confirm this is correct>
- [ ] **T003 [P] [US2]:** <description>
      Verify: <how you'll confirm this is correct>

## Dependencies between tasks

Note any ordering constraints not obvious from the list above. Show which tasks block others and which can run in parallel.
