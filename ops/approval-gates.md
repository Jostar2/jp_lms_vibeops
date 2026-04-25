# Approval Gates

## Gate Model

Approval is a workflow step, not a UI decoration.

Every action-producing AI recommendation must pass the smallest gate that matches its risk.

## Gate Levels

| Level | Name | Examples | Approval Owner |
| --- | --- | --- | --- |
| G0 | Informational | aggregate insight, non-actionable trend | none |
| G1 | Personal planning | student pace plan, reminder | student opt-in or user action |
| G2 | Instructor content action | draft explanation, quiz checkpoint, rubric suggestion | instructor |
| G3 | Sensitive learner support | identified support queue, advisor message | instructor plus student-support policy |
| G4 | Institutional policy | department-wide intervention, data sharing, model policy | academic admin/legal |

## Required Evidence By Gate

| Gate | Evidence |
| --- | --- |
| G0 | source events and model version |
| G1 | consent scope and override control |
| G2 | xAI card, content diff, rollback plan |
| G3 | APPI purpose, access audit, uncertainty, message review |
| G4 | legal basis, data processing role, pilot measurement plan, executive signoff |

## Blockers

An action must be blocked when:

- model version is missing
- uncertainty is not stated
- measurement plan is absent
- learner-facing copy has not passed Japanese review where required
- sample size is too low for the claimed inference
- sensitive data purpose is not recorded
- rollback is impossible for the proposed action

## First Implementation Target

Implement G0-G2 in the first control plane skeleton.

G3-G4 can be represented as blocked gate results and fully specified in pilot packet documents before real deployment. UI can display those states later.
