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

## Phase 1: Clickable Product Skeleton

Goal: rebuild the prototype as maintainable app structure.

Recommended stack:

- Vite or Next.js for UI.
- TypeScript for schema contracts.
- Playwright for visual and console verification.
- Static JSON/YAML scenario fixtures before API integration.

Outputs:

- route manifest
- scenario fixture loader
- xAI card component
- Focus AI panel
- instructor decision queue
- impact ledger screen
- Playwright screenshot harness

Exit criteria:

- Demo A runs from static fixture data.
- All routes have screenshots and no console errors.
- xAI card fixtures validate against schema.

## Phase 2: Pilot Packet And Integration Mock

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

## Phase 3: Runtime Prototype

Goal: replace static fixture decisions with bounded AI operation records.

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

## Phase 4: External Pilot Candidate

Goal: prepare for a constrained real pilot.

Outputs:

- tenant isolation plan
- data processing agreement checklist
- native copy signoff
- pilot university onboarding checklist
- go/no-go review template

Exit criteria:

- legal/IT review packet complete
- pilot success/failure criteria pre-registered
- rollback and data deletion tested
