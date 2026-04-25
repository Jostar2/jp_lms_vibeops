# Claude Design Brief — AI-LMS Prototype Visual Polish

> Paste this entire file into the Claude Design session. Baseline is the **current state of `xAI_LMS_Prototype.html`** — do **not** rebuild from `xAI_LMS_Prototype_codex.html` (that file is reference-only). Instructions are English; Korean/Japanese copy inside the product must stay as-is.

---

## 1. Context

We built an AI-LMS prototype (single-file HTML) for a NetLearning executive demo. Logic, IA, AI-notation grammar, and Round-2 copy fixes are already locked through multiple Claude↔Codex rounds. What remains is **presentation-grade visual polish**: elevate typography, color system, spacing, and affordance visibility so the prototype reads as an intentional product — while preserving every locked decision below.

---

## 2. Baseline + Reading order

Read in this order; stop when you have enough to start:

1. `xAI_LMS_Prototype.html` — **the baseline you edit**. 4,009 lines, single file.
2. `review/codex_debate_round2_response.md` — final agreement on the 2-layer AI grammar (3 Intent + 5 Role) and the 5-Affordance rules.
3. `review/codex_to_claude_affordance_handoff.md` — concrete definitions of the 5 Affordance Grammars.
4. `review/ia_debate_codex_response.md` — why all 16 nav items stay visible and why SNB uses current-focus group collapse.
5. `AI_LMS_Action_Items.md` — NetLearning demo context.

Visual references only (do **not** merge): `xAI_LMS_Design_Spec.html`, `xAI_LMS_Prototype_codex.html`, `reference_html_screens/*`.

---

## 3. Locked UX decisions

### 3A. 2-layer grammar (3 Intent + 5 Role)

Every AI-touching UI element declares itself on two layers:

- **User Intent** (screen-level, user's goal): `VIEW` / `DECIDE` / `GENERATE`. Drives section structure, primary CTA, and button grouping.
- **AI Role** (element-level, what AI did): `Detect` / `Prioritize` / `Recommend` / `Draft` / `Verify`. Drives badge copy, xAI card titles, and CSS modifier hooks.

Example mappings already in the baseline:
- `VIEW + Detect` — "막힘 구간 감지" evidence card
- `DECIDE + Prioritize` — instructor dashboard "오늘의 결정 3건 우선순위화"
- `GENERATE + Draft` — co-creation "AI 초안 3종"
- `DECIDE + Verify` — grading "검토 필수 8건"

**CSS hooks**: use `ai-intent-*` and `ai-role-*` modifiers on existing components. **Do not** introduce parallel component libraries — `ai-badge`, `xai-panel`, `ai-touchpoint` are canonical.

### 3B. 5 Affordance Grammar — usage rules

Treat these as **visual grammar hints**, never as standalone global components.

- **Signal Marker (Detect)** — thin left-edge rail + pulse dot, suggests "detected". Quiet by default.
- **Decision Rail (Prioritize)** — top priority strip inside the card + single meta line `우선순위 · 근거 수 · 신뢰도`. **Do not** add a physical vertical rail column.
- **Action Stack (Recommend)** — 1–2 primary + grouped hold/reject/edit. 3-button stack only at high-risk decision points (grading confirm, intervention send).
- **Draft Canvas (Draft)** — visually distinct from normal cards. State ("초안 / 공개 전 / 승인 대기") always explicit in copy.
- **Audit Checklist (Verify)** — full form only on `grading`, `cocreation`, `intervention`. Other screens get a one-line `신뢰도 · 근거 · 검증 상태`.

### 3C. 7 principles (with rationale — use to judge edge cases)

1. **No load-bearing tooltips** — hover copy is invisible on a projector.
2. **No badge inflation** — overused badges say "AI exists" without revealing affordance. Prefer in-copy role words.
3. **Never conflate execute-CTA with evidence-CTA** — `시작`/`검토`/`발송` is execution; `근거 보기` is explanation. Swapping these via layout toggles breaks the mental model.
4. **`openAiContext()` is idempotent-open** — re-clicking in focus mode must not close it. The baseline already enforces this; preserve it.
5. **Human-in-the-loop is visible** — every AI execution exposes approve / edit / hold.
6. **Kill duplicate plain-LMS cards first** — "generic LMS + AI sticker" is the failure mode to avoid.
7. **No ambient companion chat on dashboards** — dashboards show xAI summaries; conversational Companion lives on `student.lecture` and `instructor.cocreation` only.

---

## 4. Do-not-revert list (baseline anchors)

File: `xAI_LMS_Prototype.html`. Line numbers are current-baseline; re-locate by string search if layout shifts.

### 4A. State / JS (do not rewrite)

- `state.navCollapsed` is the **single source of truth** (line ~1463). `aiExpanded` was removed — do not resurrect.
- `openAiContext()` at line ~1471 — comment: *"idempotent-open. Always enters focus mode; never toggles closed."* Keep this contract.
- `exitFocusMode()` at line ~1482 + Esc handler at ~1502: ignore Esc when focus is on `input / textarea / select / contenteditable`.
- **Deleted functions — do not restore**: `toggleAiPanel`, `collapseAiPanel`, `expandAiPanel`, `setAiFocus`, `toggleAiFocus`, `focusAiMode`, `exitAiMode`.
- `.ai-badge` global capture click handler → `openAiContext()` must remain.

### 4B. Nav / IA

- All **16 nav items** visible, no `hidden:true` flag. Item list at lines ~1308–1336.
- Each nav item carries an `aiObject` attribute (Decision Queue, Pace Plan, Struggle Segment, Uncertainty Queue, Draft Canvas, Cohort Pattern, Intervention Draft, Impact Ledger, …). These are the 16 representative AI objects — preserve every one.
- SNB current-focus group-collapse pattern (line ~1371 onward): `state.expandedGroups` Set, `toggleNavGroup()`, CSS class `.nav-group.collapsed`. Initial set is `['오늘']`. Do **not** regress to "all groups always expanded".
- Header `.topbar-right` (line ~1225): avatar only. Do **not** restore refresh / notification buttons (they caused hover jitter).

### 4C. Round-2 copy & structure

- **Grading page-sub (line ~3056)**: `52건 중 AI 초안 완료 32건 — 확정 가능 24건 + 검토 필수 8건. 나머지 20건은 채점 대기 중.` Tags: `확정 가능 24 · 검토 필수 8 · 미실행 20`.
- **Grading top warn banner**: "검토 필수 8건" + "8건 순서대로 검토" start button.
- **Grading aside header**: "학생 피드백 미리보기 · AI 초안 · 발송 전 검토".
- **Focus Dock (`focusModeDock()` line ~1693)**: DOM order Judgment → Action → Evidence → Uncertainty → Measurement → [execute buttons] → Override. Evidence / Uncertainty / Measurement `<details>` all `open` by default.
- **student.dashboard hero eyebrow (line ~1759)**: `AI 분석 · 신뢰도 74%` badge.
- **student.dashboard aside top (line ~1841)**: xAI panel "왜 오늘 이 경로인가 · AI 분석" with 74% confidence + xaiMeta.
- **instructor.dashboard hero eyebrow (line ~2621)**: `AI 분석 · 오늘의 결정 3건 우선순위화`.
- **instructor.cocreation section titles**: `1 · 난관 구간 입력` / `2 · AI 초안 3종` / `3 · 선택 초안 편집 · 4 · 승인 후 배포` / `5 · 지난 배포의 2주 후 효과 검증`.
- **Cocreation primary CTA (line ~2991)**: `承認後に公開 · 승인 후 공개 (AB 테스트 on)`. Not "편집 후 공개".
- **Teaching Profile chips (lines ~3033–3035)**: exactly three — `です・ます 어조` / `具体的には` / `반례 먼저` — plus the one-sentence declaration "공식 제시 전 반례 먼저…".
- **coStudioVariant badge**: `AI 생성 · 교수 승인 대기`.
- **student.lecture subtitle badge (line ~2013)**: `AI 생성 · 자막 번역` (not "AI 자막 · 4개 언어 번역").
- **student.lecture peer-hint xAI panel (line ~2056)**: sample-confidence 82% bar.
- **Decision Cards (instructor.dashboard)**: badge is urgency-driven via helper; `onClick` → `openAiContext()`. Do **not** navigate to `intervention` / `rubric`.
- **student.dashboard assignment card (line ~1809)**: `onclick="openAiContext()"` + badge `AI 예측 · 4h 소요`. Not `go('assignment')`.
- **student.dashboard AI review card (line ~1826)**: badge `AI 생성 · 오답 기반`; `시작` button fires `showToast`, not a focus toggle.

---

## 5. Can change / cannot change / discretion

| Category | Can change | Cannot change | Discretion (preserve intent) |
|---|---|---|---|
| Typography | Font family, size, weight, hierarchy | Meaning of KR/JP mixed copy | Keep proper nouns: CASE, BKT, xAPI, Mei-waku Care, 敬語 |
| Color | Full palette redesign; optional dark mode | Semantic role of `--xai` (#6d4dbd) as "AI presence" | If retoning xAI purple, re-establish a distinct AI accent |
| Spacing / Density | Padding, card size, rhythm | 3-column grid defaults (`248 / 1fr / 344`) and focus grid (`72 / minmax(560,1fr) / minmax(440,480)`) | Adjust within the same grid contract |
| Components | New components, restyle existing | 3-column shell, SNB position, AI-panel position | Card / badge / xai-panel styling is open |
| State / JS | Add CSS classes, add data attributes, augment handlers | All of §4A | Add design-only data attributes freely |
| Nav / IA | SNB chevron style, meta badge style, group-label typography | All of §4B | Visual treatment of active state is open |
| Copy | Minor section-title polish | All of §4C (Round-2 locked strings) | Eyebrow label retypesetting is OK |
| Language | Keep KR primary + JP mixed | No forced single-language flattening | Preserve 敬語 3-tier structure and Mei-waku Care terms |
| Icons | Add / swap Lucide icons, add data-viz | Remove sparkle (✦) from AI shared mark | Additional AI-role icons beyond sparkle are fine |

---

## 6. Scope / time / language

- **Scope**: 16 routes total. **Polish order**: (1) `instructor.cocreation` (2) `instructor.grading` (3) `instructor.dashboard` (4) `student.dashboard` (5) `student.lecture`. The other 11 inherit the visual system automatically.
- **Time budget**: 6–10 hours. Partial ship is acceptable if the top-5 are complete and the remaining 11 are at least style-consistent.
- **Language**: KR-first UI, JP kept where present (cocreation CTA, 敬語 tiers, グラデーション level tags). Prioritize natural Korean tone; leave Japanese accuracy to a later JP-native pass.

---

## 7. Deliverables + verification checklist

### Deliverables

1. Edited `xAI_LMS_Prototype.html` — single-file diff.
2. `xAI_LMS_Design_Spec.html` — minimal update **only if** visual grammar changed materially.
3. `review/visual_checks/claude_design_final/` — 7 screenshots: the 5 polish-priority routes + `classhealth` + `intervention`. Playwright is fine.
4. `review/claude_design_summary.md`: (a) visual-system changes, (b) UX logic preserved, (c) new AI affordance syntax, (d) remaining risks.

### Verification checklist (all must pass)

- [ ] Browser console: zero JS errors across persona switch + all 16 routes.
- [ ] Persona switch (student ↔ instructor) works.
- [ ] `go(id)` renders every one of the 16 routes without error.
- [ ] SNB group collapse: only the current page's group is open by default; clicking a group header toggles it.
- [ ] Single SNB toggle: 248 → 72px SNB width, 344 → 480px AI panel width.
- [ ] Esc exits focus mode only; ignored while an input/textarea/select/contenteditable has focus.
- [ ] Any `.ai-badge` click invokes `openAiContext()` via the global capture handler.
- [ ] Grading page-sub contains `52건 중 AI 초안 완료 32건 — 확정 가능 24건 + 검토 필수 8건`.
- [ ] Grading top warn banner + "8건 순서대로 검토" button present.
- [ ] Focus Dock order: Judgment → Action → Evidence → Uncertainty → Measurement; all three `<details>` open by default.
- [ ] Cocreation section numbers 1–5 present; CTA reads `承認後に公開 · 승인 후 공개 (AB 테스트 on)`; Teaching Profile shows exactly 3 chips.
- [ ] Both dashboards' hero eyebrows carry an `AI 분석` badge.
- [ ] `student.dashboard` aside's top card is the "왜 오늘 이 경로인가 · AI 분석" xAI panel.
- [ ] `.topbar-right` contains avatar only (no refresh, no notification buttons).
- [ ] All 16 nav items visible; none has `hidden:true`.
- [ ] Every `.ai-touchpoint` / Decision Card carries its AI badge (no silent removals).
- [ ] KR + JP mixed copy preserved; no single-language flattening.
- [ ] Conversational Companion appears only on `student.lecture` and `instructor.cocreation`; dashboards use xAI summary cards.

---

*End of brief. When ambiguous, defer to §3C principles and the rationale lines.*
