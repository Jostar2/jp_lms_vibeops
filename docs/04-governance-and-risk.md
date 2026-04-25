# Governance And Risk

## Governance Principle

The product earns trust by constraining action, not by making broad AI promises.

Every AI-touched workflow must declare:

- data purpose
- data source
- model version
- uncertainty
- allowed action
- approval owner
- measurement plan
- rollback route

## APPI And Privacy Baseline

MVP must include:

1. Purpose limitation for each data use.
2. Consent grant, revoke, export, and delete request events.
3. Japanese-region deployment assumption for pilot.
4. Sensitive view audit logs.
5. Data minimization by scenario.
6. Retention policy per event family.

## Student Safety

Default forbidden learner-facing patterns:

- "dropout risk"
- "low ability"
- "problem student"
- visible ranking of vulnerable learners
- automated disciplinary implication

Preferred framing:

- support availability
- next best learning action
- recovery window
- concept gap
- confidence and uncertainty

## Instructor Control

Instructor-facing AI may recommend, draft, rank, and measure. It must not silently publish course material, send high-stakes learner messages, or change grades without explicit approval.

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Generic AI LMS perception | High | lead with closed-loop measurement and NetLearning composition |
| APPI/legal delay | High | prepare Data/APPI/IRB Readiness Brief before pilot |
| Japanese copy feels unnatural | High | native review gate before presentation or pilot |
| Overclaiming standards | Medium | separate xAPI, LTI, OneRoster, CLR, CASE claims by actual use |
| Prediction without action | High | require action and measurement plan for all recommendations |
| Instructor distrust | Medium | evidence-first cards and approval-controlled execution |
| Student surveillance concern | High | avoid risk labels and expose Meiwaku challenge controls |
| Prototype fragility | Medium | scripted demo, screenshots, console/a11y verification |

## Governance Gates

| Gate | Required Before |
| --- | --- |
| Schema gate | event or xAI card enters demo |
| Copy gate | Japanese user-facing text enters executive material |
| Privacy gate | learner-level data appears in any pilot workflow |
| Approval gate | AI recommendation triggers an action |
| Measurement gate | outcome claim appears in pitch or report |
| Rollback gate | content or message is published |
