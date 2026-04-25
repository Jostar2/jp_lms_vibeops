# Evidence UX Readiness Review

## Verdict

Evidence UX must be treated as the AI LMS product layer for learners and instructors.

The earlier operator-console direction is not sufficient for university adoption because professors and students need to use the product in their normal course workflow. The runtime/control-plane objects remain the source of truth, but the UI must present them as learning assistance, teaching assistance, approval, measurement, and student control.

The required backend/control-plane objects now exist:

- S01 lecture struggle event fixture.
- S11 instructor co-creation fixture.
- S12 learner pace-agent fixture.
- S13 policy simulation blocker.
- xAI card fixtures.
- approval fixtures.
- measurement plan and result fixtures.
- impact ledger fixtures.
- policy gate.
- approval router.
- event ledger.
- LMS CSV fallback adapter.

## UI Must Render These Objects

| UI Surface | Source Object |
| --- | --- |
| Learner learning plan | S12 xAI card, measurement plan, student approval gate |
| Learner AI hint | S01 student xAI card, event evidence, Meiwaku control |
| Lecture timeline marker | event ledger and student hint card |
| Instructor struggle summary | S01 aggregate events and instructor xAI card |
| AI co-creation draft | S11 xAI card and approval record |
| Instructor approval action | approval record with rollback note |
| Measurement result | measurement result and impact ledger |
| AI evidence drawer | xAI card, model metadata, uncertainty, recommended action |
| LMS embedding setup | adapter spec and adapter sample events |
| Pilot blockers | pilot gates and S13 blocked scenario |

## Blockers Cleared

- UI is no longer the source of truth.
- Product UX now starts from learner and instructor workflows.
- S01/S11/S12/S13 data can be loaded from contract fixtures.
- Approval and measurement are represented as data.
- Adapter boundary exists before frontend work.
- Pilot governance blockers are machine-checkable.

## Remaining Risks

| Risk | Handling |
| --- | --- |
| UX drifts back into operator language | static and browser validators now require learner/instructor product surfaces |
| Japanese copy is unreviewed | keep native review gate before real pilot copy |
| AI feels passive or hidden | every primary view includes AI coach, AI draft, or xAI evidence action |
| Legal claims overstate readiness | show APPI/IRB and G4 as pending gates, not completed approvals |
| Browser UX hides uncertainty | evidence drawer shows uncertainty and measurement for the selected card |

## Go Criteria

Evidence UX implementation can advance when:

- [x] control plane runtime passes
- [x] contract validation passes
- [x] governance validation passes
- [x] adapter sample passes
- [x] route spec maps product surfaces to runtime objects
- [x] static UI validation requires learner/instructor AI LMS concepts
- [x] browser smoke renders product-level learner and instructor surfaces
