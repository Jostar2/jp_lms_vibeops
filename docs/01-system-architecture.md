# System Architecture

## Architecture Summary

JP LMS VibeOps has five layers:

1. Integration Layer
2. Learning Event Ledger
3. AI Operations Kernel
4. Evidence UX Layer
5. Governance And Pilot Ops Layer

Each layer must be independently testable. The first app implementation should preserve these boundaries even if all data is mocked.

## 1. Integration Layer

Purpose: connect to existing platforms without replacing them.

Initial adapter priorities:

| Adapter | Use |
| --- | --- |
| LTI Advantage | launch AI workspaces inside LMS |
| OneRoster | roster/course/enrollment sync |
| SSO/SAML/OIDC | identity and role mapping |
| CSV fallback | pilot-friendly low-integration path |
| LMS API adapter | NetLearning/manaba-specific bridge when available |

Design rule: every connector must declare data purpose, fields accessed, retention, and failure mode.

## 2. Learning Event Ledger

Purpose: create a replayable record of events used by AI decisions.

Event families:

- learning activity
- assessment
- content interaction
- instructor action
- consent and privacy
- AI inference
- approval
- intervention
- measurement

The ledger is not just analytics storage. It is the source for evidence, audit, rollback, and pilot measurement.

## 3. AI Operations Kernel

Purpose: transform event signals into governed recommendations.

Kernel modules:

| Module | Responsibility |
| --- | --- |
| Signal detector | find struggle, overload, grading drift, content debt |
| Evidence builder | connect model output to event evidence |
| Policy selector | choose supported action under governance constraints |
| Approval router | determine whether student, instructor, legal, or admin approval is required |
| Measurement planner | define post-action outcome check |
| Feedback learner | update future policy after measurement |

Design rule: no AI output is publishable unless it can be rendered as a valid xAI card.

## 4. Evidence UX Layer

Purpose: make AI judgment visible, disputable, and actionable.

UX primitives:

- Decision Queue
- Focus AI Panel
- xAI Card
- Intervention Draft
- Co-Creation Studio
- Impact Ledger
- Meiwaku feedback control

The UX must answer three questions on every AI-touched surface:

1. Why am I seeing this?
2. What can I safely do next?
3. How will the system know whether this worked?

## 5. Governance And Pilot Ops Layer

Purpose: make pilots approvable by universities and partners.

Required capabilities:

- APPI readiness checklist
- IRB / research ethics packet
- consent grant/revoke/export/delete events
- model version and drift review
- audit log for sensitive data access
- rollback and removal plan
- monthly pilot outcome report

## VibeOps Execution Model

The product development process and the AI runtime share the same operating pattern:

```text
task -> spec -> evidence -> approval -> execution -> measurement -> review -> rollback if needed
```

This is the key bridge between VibeOps OS and the LMS product.
