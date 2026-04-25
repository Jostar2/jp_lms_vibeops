# Integration Fit Brief

## Position

JP LMS VibeOps composes with existing LMS infrastructure. It does not replace NetLearning, manaba, identity systems, or gradebook authority.

## Integration Options

| Path | Use | Pilot Fit |
| --- | --- | --- |
| LTI Advantage | launch evidence UX inside LMS | best long-term |
| OneRoster | roster/course/enrollment sync | useful when available |
| SSO/SAML/OIDC | staff and student identity | required for real deployment |
| LMS API adapter | direct activity/course data sync | depends on platform access |
| CSV fallback | low-friction pilot data import | best first fallback |

## Recommended Pilot Path

Start with CSV fallback plus a mocked LMS adapter boundary.

Reason:

- avoids blocking on full platform integration
- lets legal/data review happen in parallel
- proves S01 event, approval, measurement, and impact-ledger loop

## Adapter Boundary

The adapter must map external platform data into internal event families:

- `video.segment.pause`
- `video.segment.rewatch`
- `checkpoint.answer.submit`
- `content.publish.approve`
- `measurement.result.publish`

## Responsibilities

| Party | Responsibility |
| --- | --- |
| University | data permission, course owner, student communication |
| NetLearning | platform context, integration feasibility, commercial review |
| JP LMS VibeOps | control plane, evidence UX, governance packet |
| Legal/privacy reviewer | APPI, retention, processor roles, consent basis |

## Integration Blockers

- no course activity export path
- no accountable data owner
- no role mapping for instructor approval
- no deletion/retention agreement
- no pilot support contact
