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
| Control-plane-first plan | [docs/06-control-plane-first-implementation.md](docs/06-control-plane-first-implementation.md) |
| Pilot governance packet | [docs/pilot/](docs/pilot/) |
| Evidence UX readiness | [docs/evidence-ux/](docs/evidence-ux/) |
| Project reset decision | [docs/decisions/ADR-0001-project-reset.md](docs/decisions/ADR-0001-project-reset.md) |
| Control-plane-first decision | [docs/decisions/ADR-0002-control-plane-first.md](docs/decisions/ADR-0002-control-plane-first.md) |
| Project management | [PROJECT.md](PROJECT.md) |
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

Project management currently happens inside this repository through [PROJECT.md](PROJECT.md), [ops/status.md](ops/status.md), [ops/milestones.yaml](ops/milestones.yaml), and [ops/backlog.yaml](ops/backlog.yaml).

The local Git repository is connected to:

```text
https://github.com/Jostar2/jp_lms_vibeops.git
```

## Validation

Run the lightweight design repository check:

```powershell
python scripts\validate_project.py
```

Run contract checks directly:

```powershell
python scripts\validate_contracts.py
```

Run the current control-plane skeleton:

```powershell
python scripts\run_control_plane.py --json
python scripts\run_adapter_sample.py
python scripts\validate_governance.py
python scripts\validate_evidence_ux.py
python -m unittest discover -s tests
```

The next implementation step is not a UI prototype. It is an executable control-plane foundation:

1. Contract validators for xAI cards, events, approvals, and measurement plans.
2. AI operation state machine.
3. Approval routing and blocking behavior.
4. Policy/privacy gates.
5. Measurement and impact ledger records.
6. LMS adapter boundary.
7. Evidence UX after the above contracts are stable.
