# APPI Readiness Checklist

This is a pilot readiness checklist, not legal advice.

Primary official references:

- Personal Information Protection Commission Japan: https://www.ppc.go.jp/en/
- APPI English law text via Japanese Law Translation: https://www.japaneselawtranslation.go.jp/

## Baseline Position

JP LMS VibeOps should assume that learner-level education records can become sensitive operational data even when the pilot starts from pseudonymous or aggregate signals.

The pilot should default to data minimization and purpose limitation.

## Readiness Checklist

| Area | Required Before Pilot | Status |
| --- | --- | --- |
| Purpose definition | Each event family declares why it is collected | draft |
| Data inventory | Fields, source systems, retention, and privacy level listed | draft |
| Consent path | Student opt-in or institutional basis documented | open |
| Revoke/export/delete | Request events and operational owner defined | draft |
| Sensitive access audit | Identified learner views require actor, purpose, and timestamp | draft |
| Cross-border handling | Region, processor, and transfer assumptions reviewed | open |
| Data minimization | S01 can run from aggregate/pseudonymous data by default | draft |
| Retention | Pilot retention and deletion window approved | open |
| Processor roles | NetLearning, university, and JP LMS VibeOps role split drafted | open |
| Incident response | Contact and escalation path defined | open |

## Data Families

| Family | Pilot Default | Note |
| --- | --- | --- |
| Video interaction | pseudonymous or aggregate | avoid learner-level display |
| Checkpoint result | pseudonymous or aggregate | used for support signal |
| Instructor approval | identified staff audit | required for accountability |
| AI inference | aggregate/pseudonymous | model version and run id retained |
| Measurement result | aggregate | publish only with uncertainty |

## Blockers

Pilot execution is blocked if:

- purpose is not defined for an event family
- data retention is not approved
- identified learner views have no audit path
- cross-border or processor roles are unresolved
- student-facing copy implies surveillance or stigmatizing labels
