# Evidence UX Information Architecture

## Principle

Evidence UX shows the operating state of JP LMS VibeOps.

It should not look like a generic LMS dashboard. It should look like an AI learning operations console where every recommendation has evidence, approval, measurement, and rollback context.

## Primary Views

| View | Job |
| --- | --- |
| Operations Home | show current AI learning operations and gate state |
| S01 Closed Loop | show the complete event -> card -> approval -> measurement -> impact chain |
| Evidence Detail | inspect xAI card evidence, uncertainty, model, and action |
| Approval Queue | show what requires instructor approval and why |
| Measurement Ledger | show measured effects and limitations |
| Integration Readiness | show adapter path and pilot blockers |

## First Screen

The first screen should be Operations Home, not a marketing landing page.

It should immediately show:

- current scenario: S01 Closed Loop Struggle Intervention
- operation state: approved / ready for controlled execution
- evidence count
- approval gate
- measurement plan
- pilot blockers

## Interaction Model

Clicking a card must open evidence detail, not navigate to an unrelated feature page.

Primary commands:

- inspect evidence
- review approval
- view measurement plan
- inspect impact ledger
- view pilot blockers

## UI Copy Rule

User-facing Japanese/Korean copy remains draft until native review. UI implementation must keep review status visible where text affects students.
