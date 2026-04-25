# Production Web App Foundation

## Purpose

`apps/web` is the first production web surface for JP LMS VibeOps.

The legacy `app/evidence-ux` surface remains a static evidence UX artifact and visual reference. The production app is a Next.js and TypeScript workspace that reads the same control-plane payload as a typed runtime contract.

## First Slice

The first implemented slice is `AI Learning Session`.

It proves this product loop:

```text
LMS event signal
  -> xAI card
  -> generated learning object
  -> learner acceptance
  -> instructor approval boundary
  -> measurement / impact ledger
```

## App Boundaries

| Boundary | File |
| --- | --- |
| Next App Router entry | `apps/web/src/app/page.tsx` |
| Session API route | `apps/web/src/app/api/learning-session/route.ts` |
| Runtime data payload | `apps/web/src/data/runtime.json` |
| Domain types | `apps/web/src/features/learning-session/types.ts` |
| Session model builder | `apps/web/src/features/learning-session/session-model.ts` |
| Client interaction shell | `apps/web/src/features/learning-session/AIFlowShell.tsx` |

## Runtime Contract

`scripts/export_evidence_ux_data.py` exports the control-plane fixture payload to both:

- `app/evidence-ux/data/runtime.js`
- `apps/web/src/data/runtime.json`

This keeps the static UX artifact and production web app on the same data contract.

## Validation

Install dependencies:

```powershell
npm ci
```

Validate the web app:

```powershell
npm run web:validate
python scripts\validate_web_app.py
```

Full project validation now includes the web app validation path:

```powershell
python scripts\validate_project.py
```

## Current Non-Goals

- No external LMS connection yet.
- No real database yet.
- No authentication yet.
- No production deployment target yet.

Those are next hardening tracks after the first end-to-end AI Learning Session slice is stable.
