# Worktree Sandbox Model

## Purpose

The product should be built with the same discipline it sells: bounded actions, evidence, review, and rollback.

Worktree sandboxing is the development-side equivalent of AI action governance.

## Default Flow

```text
main project
  -> create worktree for experiment
  -> implement scoped change
  -> run focused verification
  -> produce review packet
  -> request approval
  -> merge or discard
```

## Recommended Branch Naming

```text
jp-lms/design/<topic>
jp-lms/contracts/<topic>
jp-lms/control-plane/<topic>
jp-lms/integration/<topic>
jp-lms/evidence-ux/<topic>
jp-lms/gate/<topic>
```

## Sandbox Rules

1. Do not edit copied reference files unless intentionally updating the source manifest.
2. Runtime experiments should write under future `packages/`, `src/`, or `fixtures/`, not inside `references/`.
3. Generated screenshots and videos stay out of git unless explicitly selected for presentation.
4. Every UI change that affects demo flow must include Playwright verification once the app exists.
5. Every governance/schema change must include an updated example.

## Rollback Packet

Each meaningful change should be able to answer:

- What changed?
- Which scenario or gate does it affect?
- What evidence verifies it?
- What user or pilot risk does it introduce?
- How do we revert it?

This mirrors the product runtime where AI interventions must be reversible or explicitly non-actionable.
