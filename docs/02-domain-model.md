# Domain Model

## Core Entities

| Entity | Meaning |
| --- | --- |
| Institution | University or college tenant |
| Course | Academic course within a term |
| Section | Operational class instance |
| Learner | Student identity, privacy-scoped |
| Instructor | Faculty member or teaching staff |
| Academic Term | Japanese academic unit such as 前期, 後期, 通年, 集中 |
| Learning Event | Activity, assessment, interaction, or support signal |
| AI Signal | Derived observation with model metadata |
| xAI Card | Governed explanation and recommendation object |
| Approval | Human decision required before action |
| Intervention | Action taken to improve learning outcome |
| Measurement | Post-action evaluation result |
| Impact Ledger | Evidence of what changed and whether it worked |

## Invariants

1. A recommendation without a measurement plan is an insight, not an action.
2. A learner-facing message cannot use stigmatizing risk language by default.
3. Sensitive data access must record purpose, actor, time, and retention.
4. Model output must include version and uncertainty before it enters the UI.
5. Instructor-approved content changes must be reversible.
6. Pilot claims must map to pre-registered metrics.

## AI Output State Machine

```text
drafted
  -> evidence_attached
  -> policy_checked
  -> awaiting_approval
  -> approved
  -> executed
  -> measuring
  -> measured
  -> retained | revised | rolled_back
```

Blocked states:

- insufficient_sample
- missing_consent
- policy_rejected
- high_uncertainty
- native_copy_review_required
- legal_review_required

## Persona-Specific Trust Contract

| Persona | Trust Contract |
| --- | --- |
| Student | Support me without labelling me |
| Instructor | Show me evidence and keep me in control |
| Academic admin | Prove improvement without privacy shortcuts |
| IT/legal | Show exact data, purpose, retention, and audit |
| NetLearning operator | Compose with our platform and reduce deployment risk |
