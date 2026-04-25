# ADR-0002: Control Plane First, UI Later

Status: Accepted

Date: 2026-04-25

## Context

The project is not trying to build another clickable AI LMS prototype. The legacy work already proved that visual concepts are possible, but it also exposed the risk of letting UI screens define the product.

The actual product is an AI Learning Operations OS for Japanese universities. Its core value is not a page layout. Its core value is the governed loop:

```text
learning event -> AI judgment -> evidence -> approval -> execution -> measurement -> audit/rollback
```

## Decision

Build JP LMS VibeOps from the control plane outward.

Implementation priority:

1. Executable contracts.
2. Event ledger.
3. AI operation state machine.
4. Approval routing.
5. Policy and privacy gates.
6. Measurement planner and impact ledger.
7. LMS integration boundary.
8. Evidence UX.

Vite, Next.js, or any UI framework is not the first architectural decision. UI technology is selected after contract and runtime boundaries are stable.

## Consequences

Positive:

- The product cannot collapse into a demo-only screen pack.
- Governance, APPI, approval, and measurement become foundational.
- UI can be generated from contracts rather than hardcoded stories.
- NetLearning/manaba integration can be designed as an adapter boundary.

Tradeoffs:

- There is less immediate visual output.
- Early progress looks like schemas, state machines, fixtures, and validators.
- Presentation assets must be derived later from a stronger runtime model.

## Technology Implication

TypeScript remains useful for shared contracts and server-side control-plane code.

The likely first code package is not a Vite UI app. It is a contract/runtime package that can validate:

- xAI card objects
- event ledger entries
- approval requests
- measurement plans
- policy gate results

UI framework selection remains open.
