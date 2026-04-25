# Project Management

This repository is the current project management surface for JP LMS VibeOps.

There is no external GitHub Project or Jira board connected yet. Project state is tracked in this repo through:

| Purpose | File |
| --- | --- |
| Current status | [ops/status.md](ops/status.md) |
| Milestones | [ops/milestones.yaml](ops/milestones.yaml) |
| Backlog | [ops/backlog.yaml](ops/backlog.yaml) |
| Architecture decisions | [docs/decisions/](docs/decisions/) |
| Product and system docs | [docs/](docs/) |
| Contract specs | [specs/](specs/) |
| Validation | [scripts/validate_project.py](scripts/validate_project.py) |
| Contract validation | [scripts/validate_contracts.py](scripts/validate_contracts.py) |

## Git Status

Current local repo:

```text
C:\dev\jp_lms_vibeops
```

Current default branch:

```text
main
```

Current remote:

```text
origin https://github.com/Jostar2/jp_lms_vibeops.git
```

This means work is managed locally first and synchronized to GitHub through `origin`.

## Management Rule

Before implementation work begins, every meaningful task should map to:

1. A backlog item.
2. A milestone.
3. An acceptance criterion.
4. A validation command or review artifact.
5. A rollback note when stateful code or data is affected.

## Next Project Management Step

GitHub repository:

```text
Jostar2/jp_lms_vibeops
```

Recommended branch policy once connected:

- `main`: stable design and implementation baseline.
- `jp-lms/contracts/*`: schemas and contract changes.
- `jp-lms/control-plane/*`: event ledger, approval, policy, measurement runtime.
- `jp-lms/integration/*`: LMS adapter and pilot integration work.
- `jp-lms/evidence-ux/*`: UI once control plane contracts are stable.
