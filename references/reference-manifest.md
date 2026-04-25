# Reference Manifest

This project intentionally copies only source documents that are useful for a clean design restart.

## Copied From `C:\dev\japan_lms_claude_max`

| File | Reason |
| --- | --- |
| `AI_LMS_Action_Items.md` | concise product action constraints |
| `AI_LMS_planning_v2_enhancement.md` | full scenario and governance source |
| `review/next_steps_final.md` | pilot blocker and MLP priority source |
| `review/round3_integrated.md` | final synthesis and scenario mapping |
| `review/codex_full_ia_refinement_plan.md` | IA and route-level intent source |
| `review/focus_ai_mode_implementation.md` | Focus AI Mode decision source |
| `review/claude_design_brief.md` | visual/UX locked decision source |

## Copied From `C:\dev\vibeops-os-design`

| File | Reason |
| --- | --- |
| `docs/design-prep-reference-synthesis.md` | Harness, gstack, GitHub, autonomous OS reference synthesis |
| `docs/vibeops-os-v2-architecture.md` | VibeOps operating model reference |

## Not Copied By Default

| Source | Reason |
| --- | --- |
| `xAI_LMS_Prototype.html` | useful visual reference, but too monolithic to serve as the new base |
| `xAI_LMS_Design_Spec*.html` | generated/visual spec; can be referenced later if needed |
| `.pptx` proposal | large binary artifact, not suitable for design repo seed |
| `review/_codex_log_*.txt` | large historical logs, low signal for first design |
| screenshots | generated binary artifacts |
| `node_modules` | dependency output |

## Rule For Future Imports

If a legacy artifact is imported, add it to this manifest and state whether it is:

- source of truth
- historical reference
- generated artifact
- temporary migration aid
