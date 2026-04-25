# Evidence UX Readiness Review

## Verdict

Evidence UX can start, but it must be a surface over runtime objects, not a freehand screen redesign.

The required backend/control-plane objects now exist:

- S01 event fixture.
- xAI card fixtures.
- approval fixture.
- measurement plan and result fixtures.
- impact ledger fixture.
- policy gate.
- approval router.
- event ledger.
- LMS CSV fallback adapter.

## UI Must Render These Objects

| UI Surface | Source Object |
| --- | --- |
| Learning signal timeline | event ledger |
| AI evidence panel | xAI card |
| Instructor approval action | approval record |
| Measurement plan | measurement plan |
| Measured result | measurement result |
| Impact ledger | impact ledger |
| Integration status | adapter spec and adapter sample run |
| Pilot blockers | pilot gates |

## Blockers Cleared

- UI is no longer the source of truth.
- S01 data can be loaded from contract fixtures.
- Approval and measurement are represented as data.
- Adapter boundary exists before frontend work.
- Pilot governance blockers are machine-checkable.

## Remaining Risks

| Risk | Handling |
| --- | --- |
| UI drifts into presentation-only copy | route spec must name source object for every major panel |
| Japanese copy is unreviewed | label copy as draft and keep native review gate |
| Legal claims overstate readiness | show APPI/IRB as pending gates, not completed approvals |
| Browser UX hides uncertainty | every action card must show uncertainty and measurement plan |

## Go Criteria

Evidence UX implementation can start when:

- [x] control plane runtime passes
- [x] contract validation passes
- [x] governance validation passes
- [x] adapter sample passes
- [x] route spec maps UI surfaces to runtime objects
