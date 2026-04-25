# Focus AI Mode Implementation Review

## Context

- Target files: `xAI_LMS_Prototype.html`, `xAI_LMS_Design_Spec.html`
- Goal: add collapsible SNB and expanded right AI Panel without breaking the existing Claritas shell.
- Hard constraint: preserve the left Navigation / center Workspace / right AI Panel structure. Do not turn the prototype into a separate AI-X app.

## Claude Critique

1. Critical risk: a sudden jump from `248px 1fr 344px` to `72px 1fr 480px` can disorient users.
2. Critical risk: icon-only SNB removes labels, counts, and the path card, so wayfinding must be preserved elsewhere.
3. Critical risk: the expanded right panel can become a wall of text if judgment, evidence, uncertainty, action, measurement, and override are all shown at once.
4. Risk to Claritas structure: if Focus Mode auto-opens from too many CTAs, Claritas becomes AI-first instead of workspace-first.
5. Must-have details: single source of truth for mode state, explicit exit affordance, Esc exit, icon tooltips, collapsible detail sections, and override reason logging.
6. Recommendation: proceed with a trimmed v1. Use explicit toggle entry, icon-only nav with tooltip, expanded AI panel hierarchy, and defer broad CTA auto-entry/debate UX.

## Codex Decision

| Claude point | Decision | Rationale |
|---|---|---|
| Explicit reversible Focus Mode | Adopted | Added top-bar toggle, right-panel exit button, and Esc exit. |
| Single mode source of truth | Adopted | Mode is controlled by `state.aiFocus`, `.app.ai-focus`, and `data-mode`. |
| Wayfinding loss | Adopted | Added central Focus breadcrumb and nav hover tooltips. |
| Panel text overload | Adopted | Judgment and Action stay visible; Evidence, Uncertainty, and Measurement are collapsible. |
| Override safety | Adopted | Added override reason selector instead of a bare disagreement button. |
| Broad CTA auto-entry risk | Partially adopted | Added explicit top-bar toggle and only one visible `AI 재계획` CTA entry. Did not wire every AI action into Focus Mode. |
| Debate CTA | Deferred | Removed from v1 wording. The panel uses override-with-reason only. |

## Final Changes

- Prototype shell now supports default mode and `AI Focus Mode`.
- Default grid remains `248px 1fr 344px`.
- SNB and AI Panel controls are now owned by their own regions:
  - SNB collapse/expand button lives inside the SNB.
  - AI Panel expand/collapse button lives inside the AI Panel.
- Grid states:
  - Default: `248px 1fr 344px`
  - SNB collapsed: `72px 1fr 344px`
  - AI Panel expanded: `248px 1fr 480px`
  - Both active: `72px 1fr 480px`
- SNB collapses to icon-only when its own handle is used.
- Right AI Panel gets a Focus Dock with:
  - Judgment
  - Recommended Action
  - Evidence events
  - Uncertainty
  - Measurement plan
  - Override reason selector
- Topbar tooltips now open downward so refresh/notification hover text does not escape above the viewport.
- AI-interactable items now use an explicit AI touchpoint treatment:
  - AI-marked cards use an `AI` marker.
  - AI badges open the AI Panel instead of acting as passive decoration.
  - Key cards expose an action strip with a clear execution verb.
- Design spec now includes Focus AI Mode as an xAI interaction pattern and documents grid, entry, exit, ordering, and forbidden behaviors.

## Logical UX Rule Added

Every visible AI item must answer one of these questions:

1. What did AI judge?
2. What evidence did it use?
3. What can the user do next?
4. What happens if the user rejects the AI judgment?

If an item cannot answer at least one of these, it should not receive an AI marker.

## Remaining Follow-up

- If this becomes a recorded demo, verify one desktop viewport and one narrower laptop viewport with screenshots.
- If broader CTA entry is desired later, add it only to high-intent buttons such as `개입안 비교`, `채점 불확실성 검토`, and `자료 개선안 생성`.
- Japanese copy should still be reviewed by a native speaker before external presentation.
