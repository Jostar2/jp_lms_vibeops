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

1. Load scenario fixture `S01`.
2. Append learning event records.
3. Produce an AI operation draft.
4. Validate an xAI card.
5. Route action to an approval gate.
6. Block execution until approval exists.
7. Register measurement plan.
8. Emit an impact ledger placeholder.

## Acceptance Criteria

- No UI framework is required.
- No LMS integration secret is required.
- Every produced object validates against a local contract.
- Student-facing text passes forbidden-language checks.
- Missing approval blocks execution.
- Missing measurement plan downgrades the object to informational insight.

## Why This Comes Before UI

The UI should display product truth, not invent it.

If approval state, evidence, measurement, and policy gates are only visual labels, the system is still just a prototype. If they exist as contracts and runtime transitions first, the UI can become a faithful surface over a real operating layer.
