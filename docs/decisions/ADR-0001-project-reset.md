# ADR-0001: Restart As JP LMS VibeOps

Status: Accepted

Date: 2026-04-25

## Context

The prior Japanese AI LMS work produced a useful static prototype and a strong set of review notes. However, the main prototype is a large single HTML file with inline CSS, inline JavaScript, hardcoded data, and mixed demo decisions. It is useful as a visual reference but weak as the foundation for a maintainable product.

In parallel, VibeOps OS design work established a stronger operating model: task specs, evidence, approval, worktree sandboxing, rollback, PR execution paths, and evaluation gates.

## Decision

Create `C:\dev\jp_lms_vibeops` as a new independent project.

Start from product and system design. Copy only essential reference documents. Do not copy the large legacy prototype HTML, PPT, generated screenshots, node_modules, or review logs into the new project by default.

## Consequences

Positive:

- The new repo has a clean product thesis.
- Legacy prototype decisions can be reinterpreted as scenarios and schemas.
- VibeOps governance becomes part of the product architecture from day one.
- Future implementation can use maintainable route/component/data boundaries.

Tradeoffs:

- The existing visual prototype is not immediately runnable from this repo.
- Some visual polish must be rebuilt.
- Additional work is needed to turn design specs into a frontend skeleton.

## Reference Material Copied

See [references/reference-manifest.md](../../references/reference-manifest.md).
