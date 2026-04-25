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
| AI LMS product UX readiness | [docs/evidence-ux/](docs/evidence-ux/) |
| AI LMS product UX app | [app/evidence-ux/index.html](app/evidence-ux/index.html) |
| Release readiness | [docs/release-readiness.md](docs/release-readiness.md) |
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

This is now a repo-managed product foundation with a Python control-plane runtime and a browser-rendered AI LMS product UX.

The current UX is not an operator console. It starts from learner and instructor workflows:

- learner home with an AI-adjusted study plan, lecture timeline marker, AI hint, evidence access, and Meiwaku feedback
- instructor studio with aggregate struggle signals, AI co-creation drafts, approval-gated publishing, rollback context, and measured outcomes
- shared xAI evidence drawer showing model, evidence, uncertainty, action, approval, measurement, and impact

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
python scripts\run_scenario_matrix.py
python scripts\run_adapter_sample.py
python scripts\validate_governance.py
python scripts\validate_evidence_ux.py
python scripts\export_evidence_ux_data.py
python scripts\validate_static_ui.py
python scripts\validate_browser_smoke.py
python scripts\validate_screenshots.py
python scripts\validate_packaging.py
python scripts\validate_formal_schemas.py
python -m unittest discover -s tests
```

Package CLI smoke:

```powershell
$env:PYTHONPATH="src"; python -m jp_lms_vibeops run-s01 --json
```

Refresh AI LMS product UX screenshot snapshot:

```powershell
python scripts\capture_evidence_ux_snapshot.py
```

The next implementation step is product hardening beyond the static-file shell:

1. Package the AI LMS UX as a real web app surface.
2. Add richer dynamic flows for learner AI chat, instructor approval, and rollback execution.
3. Add S15 Teaching Profile runtime coverage.
4. Move schema validation toward full JSON Schema or Pydantic enforcement.
5. Prepare release artifact workflow and GitHub PR templates.
