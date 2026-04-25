# Build Roadmap

## Phase 0: Design Lock

Goal: freeze the product thesis and first demo loop.

Outputs:

- Product brief.
- Scenario manifest.
- xAI card schema.
- Event catalog.
- Demo A/B/C script.
- Pilot readiness checklist.

Exit criteria:

- One closed-loop scenario is fully specified.
- Every AI output maps to the 5-part xAI card structure.
- No critical APPI or integration assumption is unstated.

## Phase 1: Executable Contracts

Goal: turn the design contracts into machine-checkable artifacts.

Outputs:

- xAI card examples and validator.
- event ledger examples and validator.
- approval request/result examples and validator.
- measurement plan examples and validator.
- forbidden student-facing language check.

Exit criteria:

- `S01` can be represented as event, AI operation, approval, and measurement records.
- Missing measurement plan blocks action-grade recommendations.
- Missing approval blocks execution.

## Phase 2: Control Plane Skeleton

Goal: create the first runtime boundary without UI-first assumptions.

Outputs:

- event ledger append/read boundary
- AI operation state machine
- approval router
- policy/privacy gate
- measurement planner
- impact ledger record generator

Exit criteria:

- No UI framework is required.
- Every AI operation has evidence and model metadata.
- Unsafe action attempts are blocked with a structured reason.
- Measurement records update an impact ledger object.

## Phase 3: Pilot Packet And Integration Mock

Goal: make the product credible to NetLearning and a university pilot committee.

Outputs:

- integration fit brief
- APPI/IRB readiness brief
- data mapping
- pilot measurement protocol
- approval and rollback packet
- NetLearning/manaba adapter mock

Exit criteria:

- CSV fallback can simulate pilot data.
- LTI/OneRoster/SSO assumptions are documented.
- Monthly report template exists.

## Phase 4: Integration Runtime Prototype

Goal: connect the control plane to bounded LMS adapter mocks.

Outputs:

- event ingest stub
- AI signal generation stub
- approval workflow
- audit ledger
- measurement job stub
- rollback execution path

Exit criteria:

- Every AI action creates a run record.
- Sensitive actions are blocked without approval.
- Measurement records update the Impact Ledger.

## Phase 5: Evidence UX And External Pilot Candidate

Goal: build UI and prepare for a constrained real pilot only after contracts and governance are stable.

Outputs:

- learner home with AI-adjusted study plan, lecture marker, xAI evidence, and Meiwaku feedback
- instructor studio with aggregate struggle signals, AI co-creation drafts, approval, rollback, and measurement
- shared AI coach and xAI evidence drawer
- tenant isolation plan
- data processing agreement checklist
- native copy signoff
- pilot university onboarding checklist
- go/no-go review template

Exit criteria:

- first screen serves learners, not operators
- instructor flow proves professor-controlled AI assistance
- dynamic browser interactions cover plan adjustment, task completion, AI prompts, draft variants, approval, and recommendation challenge
- legal/IT review packet complete
- pilot success/failure criteria pre-registered
- rollback and data deletion tested
- browser verification passes for selected evidence UX flows

## Phase 6: Production Web App Foundation

Goal: move the AI LMS product surface from static Evidence UX artifact to typed production web app.

Outputs:

- Next.js and TypeScript workspace under `apps/web`
- control-plane payload export to web app JSON
- AI Learning Session product slice
- generated learning object model
- agent run trace in the product UI
- API route for session data
- CI web app validation

Exit criteria:

- `npm run web:validate` passes.
- `python scripts\validate_web_app.py` passes.
- the first production page connects xAI evidence, generated learning objects, learner acceptance, instructor approval boundary, measurement, and impact.
- the static Evidence UX remains available as a visual and evidence reference.
