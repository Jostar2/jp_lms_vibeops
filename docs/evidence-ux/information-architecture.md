# Evidence UX Information Architecture

## Principle

Evidence UX is now a product surface inside the LMS, not an operator console.

The first user experience must make it obvious that students and instructors are working with an AI-assisted LMS:

- students receive adjustable learning plans, hints, evidence, and Meiwaku feedback controls inside the course flow
- instructors review aggregate learning signals, AI-generated course improvement drafts, approval gates, rollback notes, and measured outcomes
- every AI-touched surface keeps judgment, evidence, uncertainty, recommended action, measurement, and impact visible

## Primary Views

| View | Job |
| --- | --- |
| Learner Home | help a student continue today with an AI-adjusted plan inside the course |
| Instructor Studio | help a professor inspect aggregate struggle signals and approve AI course drafts |
| AI Evidence Board | let both personas inspect xAI cards, model metadata, uncertainty, approval, measurement, and impact |
| Course Setup | show how the AI layer embeds in NetLearning/manaba without replacing the LMS |

## First Screen

The first screen should be Learner Home, not Operations Home.

It should immediately show:

- current course and lecture context
- an AI learning plan that can change by available time
- a visible AI coach with contextual prompt actions
- a lecture timeline with the AI-highlighted struggle point
- evidence access beside the recommendation
- student controls to accept, adjust, hide, or challenge the recommendation

## Interaction Model

The UX is dynamic even while the demo is static-file deployable.

Primary commands:

- switch between learner and instructor modes
- change available study time and regenerate the plan
- mark learning steps complete
- ask the AI coach for rationale, hints, alternatives, and measurement interpretation
- inspect the xAI card behind any recommendation
- change instructor draft variants
- approve a course draft and expose rollback context
- filter xAI cards by audience
- challenge or hide a student recommendation through Meiwaku feedback

## UI Copy Rule

Student-facing Japanese/Korean copy remains draft until native review. Product implementation must avoid risk labels, student ranking language, and unsupported readiness claims.
