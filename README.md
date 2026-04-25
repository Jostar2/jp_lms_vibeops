# JP LMS VibeOps

`jp_lms_vibeops` is a clean design restart for a Japanese university AI learning operations layer.

The product is not a replacement LMS. It sits above systems such as NetLearning or manaba and turns learning events, AI reasoning, approvals, interventions, and measurement into an auditable operating system for university learning operations.

## Product Line

One sentence:

> JP LMS VibeOps is a Japanese university AI Learning Operations OS that connects LMS events to explainable AI recommendations, instructor-approved actions, APPI-aware governance, and measured pilot outcomes.

## What This Repo Is

This repository starts from design, not from the legacy prototype implementation.

| Area | File |
| --- | --- |
| Product brief | [docs/00-product-brief.md](docs/00-product-brief.md) |
| System architecture | [docs/01-system-architecture.md](docs/01-system-architecture.md) |
| Domain model | [docs/02-domain-model.md](docs/02-domain-model.md) |
| Demo and pilot plan | [docs/03-demo-and-pilot-plan.md](docs/03-demo-and-pilot-plan.md) |
| Governance and risk | [docs/04-governance-and-risk.md](docs/04-governance-and-risk.md) |
| Build roadmap | [docs/05-build-roadmap.md](docs/05-build-roadmap.md) |
| Project reset decision | [docs/decisions/ADR-0001-project-reset.md](docs/decisions/ADR-0001-project-reset.md) |
| Scenario seed spec | [specs/scenarios.yaml](specs/scenarios.yaml) |
| xAI card schema | [specs/xai-card.schema.yaml](specs/xai-card.schema.yaml) |
| Event catalog seed | [specs/event-catalog.yaml](specs/event-catalog.yaml) |
| Approval gates | [ops/approval-gates.md](ops/approval-gates.md) |
| Worktree sandbox model | [ops/worktree-sandbox.md](ops/worktree-sandbox.md) |
| Source reference manifest | [references/reference-manifest.md](references/reference-manifest.md) |

## Initial Design Decisions

1. Keep the legacy HTML prototype as reference material, not as the new codebase.
2. Treat every AI output as a governed operation with evidence, uncertainty, model version, recommended action, and measurement plan.
3. Design for NetLearning/manaba composition first: LTI, OneRoster, SSO, CSV fallback, and API adapters are product boundaries.
4. Make Japanese university constraints first-class: APPI, IRB, Meiwaku avoidance, Honne/Tatemae tone, Keigo levels, and Japanese academic calendar semantics.
5. Use VibeOps-style execution records for product work and AI operations: task spec, evidence, approval, execution, rollback, and review packet.

## Current Status

This is a design-first project skeleton. There is no application runtime yet.

## Validation

Run the lightweight design repository check:

```powershell
python scripts\validate_project.py
```

The next implementation step is to convert these docs into a minimal app and verification harness:

1. Route and scenario manifest.
2. xAI card renderer.
3. Playwright visual/console verification.
4. Demo A/B/C scripted flows.
5. Pilot readiness packet.
