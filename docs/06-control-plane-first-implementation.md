# Control Plane First Implementation Plan

## Goal

Turn the design repo into a product foundation without becoming a UI prototype.

The first implementation must prove that JP LMS VibeOps can represent and govern AI learning operations.

## Package Boundaries

Recommended future structure:

```text
packages/
  contracts/
    xai-card
    event-ledger
    approval
    measurement
    policy
  core/
    ai-operation-state-machine
    approval-router
    measurement-planner
    audit-ledger
  adapters/
    lms-common
    netlearning-mock
    manaba-mock
  evidence-ux/
    selected after contracts stabilize
```

## First Executable Slice

The first slice should be non-visual:

1. Load scenario fixture `S01`. Current seed: [../specs/scenarios.yaml](../specs/scenarios.yaml).
2. Append learning event records. Current examples: [../specs/examples/events/](../specs/examples/events/).
3. Produce an AI operation draft. Current example: [../specs/examples/ai-operations/s01-closed-loop-operation.json](../specs/examples/ai-operations/s01-closed-loop-operation.json).
4. Validate xAI cards. Current examples: [../specs/examples/xai-cards/](../specs/examples/xai-cards/).
5. Route action to an approval gate. Current example: [../specs/examples/approvals/s01-instructor-content-approval.json](../specs/examples/approvals/s01-instructor-content-approval.json).
6. Block execution until approval exists.
7. Register measurement plan. Current example: [../specs/examples/measurements/s01-two-week-effect-plan.json](../specs/examples/measurements/s01-two-week-effect-plan.json).
8. Emit an impact ledger placeholder.

## Acceptance Criteria

- No UI framework is required.
- No LMS integration secret is required.
- Every produced object validates against a local contract.
- Student-facing text passes forbidden-language checks.
- Missing approval blocks execution.
- Missing measurement plan downgrades the object to informational insight.

## Current Validator

The first local validator is:

```powershell
python scripts\validate_contracts.py
```

It checks required fields, cross references, approval/action matching, operation transition chain, measurement linkage, and forbidden student-facing language.

## Current Runtime Skeleton

The first non-visual runtime slice is implemented under [../src/jp_lms_vibeops/](../src/jp_lms_vibeops/).

Run it with:

```powershell
python scripts\run_control_plane.py --json
python -m unittest discover -s tests
```

It loads the S01 fixtures, appends events to an in-memory ledger, checks xAI cards through the policy gate, requires approved instructor action, resolves the measurement plan, and emits a runtime impact ledger result.

## Why This Comes Before UI

The UI should display product truth, not invent it.

If approval state, evidence, measurement, and policy gates are only visual labels, the system is still just a prototype. If they exist as contracts and runtime transitions first, the UI can become a faithful surface over a real operating layer.
