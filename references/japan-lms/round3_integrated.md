# Round 3 — 통합 최종안 설계도 · 변경 로그

> **목표**: NetLearning 회장님을 청중으로 하는 AES 발표용 **고도화된 제안서 본문** 확정.
> **산출물**:
> - `AI_LMS_planning_core_summary.md` — **원본 보존** (수정 금지)
> - `AI_LMS_planning_v2_enhancement.md` — **제안서 v2 본문** (이 설계도를 그대로 구현)
> - `review/round3_integrated.md` — **이 문서** (변경 로그·rationale)

---

## 0. Round 3 도출의 근거

- Round 1: Claude · Codex 각자 독립 리뷰 완료 (`round1_claude.md` 30KB, `round1_codex.md` 52KB)
- Round 2: 상호 교차 비평 완료 (`round2_claude.md` 29KB, `round2_codex.md` 14KB)
- **합의 수렴 포인트** (양쪽 자동 일치 or 한쪽이 상대 의견 수용):
  - S07 판정: 현재 서술 B+ (Codex R2 수용)
  - S08 판정: B+ 상향 (Claude R2가 Codex 수용)
  - 신규 시나리오 Top 5 동일 (네이밍만 조율)
  - 뜬소리 10개 원문 라인·대체 문장 양쪽 동일 방향
  - "We compose, not replace" 표준 철학
  - 프레젠: 1 폐루프 증명 + 일본 3장 + 90일 파일럿
- **Claude R3 최종 결정 (이견 해소)**:
  - **Ambient AI 이어피스** → Codex 쪽 따름 (개인정보·시연 리스크). 프레젠 영상에서도 제외. 대체 임팩트 자산 = Co-Creation Studio 생성 순간의 실시간 영상.
  - **데모 3번째** → **Zemi Hub 채택** (Claude R2 고수). 이유: 일본 차별화가 "이 팀은 일본 대학 안다"는 메시지의 핵심. Support Policy Simulator는 Defense 섹션 "Early Warning 다 해봤어" 질문 봉쇄용 1 슬라이드로.
  - **프레젠 Hook** → Codex 쪽 따름. "LMS 대체가 아니라 레이어 확장" 도입 2분.

---

## 1. Round 3 작성 10대 원칙 (v2 본문 작성 규칙)

| # | 원칙 | 구현 위치 |
|---|---|---|
| 1 | 원문 철학·구조 유지 (시나리오 카탈로그 · 공통 자산) | v2 전체 |
| 2 | 뜬소리 10개 문장 반드시 교체 | §0·§1·§01·§02·§10 등 |
| 3 | AI 출력 5요소: 근거·모델버전·불확실성·권장행동·효과측정계획 | §3-3 xAI 카드 표준 재작성 |
| 4 | xAPI/internal event 분리 · CASE/local concept 분리 · CLR/audit 분리 | §3-1, §3-2 스키마 재설계 |
| 5 | 일본 특화는 **5대 실증 요소** — Meiwaku · Honne/Tatemae · 敬語 3단계 · 前期/後期/履修/卒論/集中 학사 구조 · 설문 n≥300 | §1.6 재작성 + §3-6 신규 |
| 6 | 일본어 CTA 병기 (모든 UI mock) | §01-H · §02 · §03 · §11~S13 mock |
| 7 | Recall 단독 금지 · PPV·uplift·calibration·regret 필수 | §10 수용 기준 + 모든 수용 기준 재작성 |
| 8 | S01 업그레이드 + Top 5 신규 시나리오(S11~S15) 편입 | §2.1 재작성 + §2.11~§2.15 신규 |
| 9 | 섹션 신규: §4-B CLR 시나리오 매핑 · §8 파일럿+4자 역할 · §9 프레젠 20분 구조 | 본문 하단 추가 |
| 10 | "We compose, not replace" 표준 슬라이드 1장 포함 | §3-5 바로 앞 |

---

## 2. 변경 포인트 · 원문 → v2 매핑

### 2-1. 뜬소리 10개 재작성 (Round 2 합의)

| # | 원문 라인 | 이전 표현 | 새 표현 (출처) |
|---|---|---|---|
| 1 | 24 | "모든 행동을 xAPI로 수집" | "학습·평가·개입 이벤트를 **목적별 표준 프로파일**로 수집하고, 각 AI 판단의 근거·불확실성·권장 행동·효과 검증 계획을 설명하는 일본 대학용 **학습 운영 AI 레이어**" (Codex) |
| 2 | 30, 785 | "Evidence + Reasoning + Action 3종 강제" | "모든 AI 출력은 **근거 이벤트·모델 버전·불확실성·권장 행동·효과 측정 계획** 5요소를 포함하며, 스키마 CI · Bias/drift 리뷰 · Mei-waku 재학습의 4-Gate Governance 통과 카드만 배포" (Codex+Claude) |
| 3 | 32, 348, 794 | "BKT/DKT 기반 개념별 숙달 확률" | "MVP = **BKT + IRT + 개인 half-life** (숙달도 + 불확실성 온라인 갱신). P2 → **GKT / SAKT** 전환 (코호트 50+ 수렴 시점). 현재 사용 모델·한계는 UI·감사 로그에 투명 표시" (Codex+Claude) |
| 4 | 43, 620, 625 | "모든 행동 xAPI Statement / SDK 외 DB 직쓰기 금지" | "모든 학습 관련 이벤트는 SDK로 수집. **교환 가치 있는 이벤트**만 xAPI/Caliper 프로파일 변환. 운영·AI 감사 이벤트는 **internal audit schema** 별도 보존" (Codex) |
| 5 | 47 | "일본 문화 특화" | "**5대 일본 특화**: ① Meiwaku Awareness (경고어 금지·낙인방지) ② Honne/Tatemae Tone (직설 수위 자동 조정) ③ 敬語 3단계 자동 (です・ます / である / 敬語 선택) ④ 前期後期·履修登録·通年·集中·卒論ゼミ **학사 구조 1급 시민 스키마** ⑤ 파일럿 내 **Omotenashi 설문 n≥300 정량 검증**" (Claude) |
| 6 | 76, 158 | "재시청률 -30%" / "유사 개선 7건 -45% 예측" | "**section × content cluster-randomized trial, 2주 사전 등록 outcome, two-sided 95% CI**. 효과 표기는 언제나 **구간 + overlap 점수** 포함. 예: '재시청률 -18 ~ -32%, overlap 0.71, 유사 강좌 12건'" (Codex) |
| 7 | 90-94 | `signal_score = w1·seek_back + ...` / z-score | "구간별 난관 확률은 **행동 시퀀스 + 자막·슬라이드 OCR + 질문 임베딩 + 선수 개념 상태**를 입력한 `segment_struggle_model` (Bayesian change-point + sequence transformer) 이 **P(struggle) + 원인 개념**을 예측. z-score는 **보조 설명 근거**로만 표시" (Codex) |
| 8 | 348 | "망각 곡선 < 40% · 반 30% 이상" | "개인별·개념별 **forgetting rate Bayesian posterior** (10응답 수렴, cold start는 L5 그래프 neighbor pooled prior). 복습 큐는 **'expected class gain이 큰 개념' 정렬** (단순 숙달 하락 정렬 금지)" (Claude+Codex) |
| 9 | 354 | "지금 5분 복습하면 시험 시점 예측 86%" | "지금 5분 복습 완료 시 시험 시점 예상 정답률은 **47% → 68~76%** (유사 학생 42명 복습 이력 + 현재 오답 패턴 기준). 신뢰구간이 넓으면 추천하지 않음" (Codex) |
| 10 | 514 | "L5 Content Graph에 제미 CASE 노드로 편입" | "제미 산출물은 **Research Lineage Graph (RLG)** 에 저장. 학습성과·연구역량만 **CASE-aligned competency item** 과 연결. CLR evidence는 학생 동의 후 검증 링크로 발급" (Codex) |

### 2-2. 시나리오 업그레이드 (본문 재작성)

| # | 제목 변경 | 모델·기능 변경 요지 |
|---|---|---|
| S01 | 동영상 난관 구간 → **난관 감지·해소 폐루프 (Course Co-Creation 진입점)** | `segment_struggle_model` · 원인 개념 예측 · Intervention xAI Card (A/B/C 개입 후보 + overlap + CI) · 2주 효과 검증 · 정책 갱신 |
| S02 | 복습 → **개념 약화·망각 Adaptive Review Policy** | BKT+IRT+개인 half-life · `expected_gain_per_min` · 반 정렬 기준 재설계 |
| S03 | 질문 쏠림 → **Knowledge Debt Graph + Generative Co-Answer** | intent·misconception·conflict 구조화 · 표준 답변 자동 초안 |
| S04 | 몰아치기 → **Survival + Uplift Nudge (bandit tone)** | hazard + uplift + bandit 3-layer · utility 양수일 때만 · opt-out / stress / regret 3지표 |
| S05 | 실시간 강의 → **Live Understanding State** | online BKT/IRT · 2분 예시 바꿔 설명 / 확인 문제 / 그대로 진행 CTA |
| S06 | Liner Mode → **Commute Learning Agent + Personalized Audio Capsule** | 통학 창·네트워크 손실·미스터리 콘텐츠 예측 · 잠금화면 `わかった/まだ不安` → mastery prior 갱신 |
| S07 | Shukatsu Forge → **Evidence-backed Career Narrative Model** | guard: evidence 2종+externally verifiable 1건+confidence 0.7 · 경어 3단계 자동 · 업계별 재구성 |
| S08 | Zemi Hub → **Research Lineage Graph (RLG)** | RLG 노드 8종·엣지 6종 · novelty + duplication score · CASE 매핑 분리 |
| S09 | 채점 drift → **Rubric-Calibrated Grading Copilot** | Many-Facet Rasch severity · uncertainty interval · 거부 이유 구조화 · κ ≥ 0.72 |
| S10 | Early Warning → **Support Policy Simulator** | risk + uplift + fairness audit + uncertainty · "이번 주 효과가 큰 반 지원 3개" 우선 · PPV + regret + calibration + perceived surveillance 지표 |

### 2-3. 신규 시나리오 편입 (§2.11~2.15)

| ID | 시나리오 | 우선순위 | P-band |
|---|---|---|---|
| **S11** | **Course Co-Creation Studio** (S01의 생성 레이어 확장 · 자료 개선안 공동 생성) | **P1 데모 1** | P2 후반 정식 기능 |
| **S12** | **Learning Companion / Pace Agent** (상주 학습 에이전트) | **P1 데모 2** | P2 정식 |
| **S13** | **Counterfactual Intervention Simulator** (개입 후보별 expected uplift + overlap) | **P1 Defense 슬라이드** | P3 정식 (다학기 데이터 필요) |
| **S14** | **Real-time Adaptive Path** (response-level adaptation) | **P2** | 파일럿 이후 |
| **S15** | **Instructor-AI Teaching Profile** (교수법 철학이 시스템 프롬프트로 흡수) | **P2** | 파일럿 이후 |

**의도적 보류 (P4 이후 로드맵 섹션에만 한 줄)**:
- Multimodal Problem-Solving Coach → STEM 학과 확장. Photomath/Khanmigo 카테고리로 오해 위험. MVP·90일 파일럿 범위 밖.
- Institutional Curriculum Optimizer → P4 이상. 다학기 데이터 요구 크고 학교 레벨 판매.
- Ambient AI 이어피스 → P3 이후 R&D. 개인정보·시연·하드웨어 리스크.

### 2-4. 신규 섹션 추가

- **§3-5 직전 "표준 역할 분담 슬라이드"** (v2 한 장 1페이지) — Codex R2 표 채택
- **§4-B "CLR 시나리오 매핑"** — S01→LearningAchievement / S02→Competency / S03→Collaboration / S05→Assessment / S07→VerifiablePresentation / S08→ResearchContribution / S09→RubricCriterion (S10은 student consent only)
- **§8 "파일럿 + 4자 역할"** — 90일 / 1학과 / 2강좌 / 3가설 + 검정력 계산
- **§9 "프레젠 20분 구조"** — 최종 확정

### 2-5. 이벤트 카탈로그 추가 (§3-1)

Codex R1 섹션 4-5 표 전면 편입:
- consent.grant / consent.revoke / data.export.request / data.delete.request
- ai.card.impression / ai.explanation.expand / ai.recommendation.dismiss
- intervention.offer / intervention.accept / intervention.complete / intervention.snooze
- agent.plan.create / agent.tool.execute / agent.plan.revise
- content.variant.generate / content.variant.approve / content.variant.publish / content.variant.abtest.assign
- model.prediction.emit / model.override / model.feedback.label / model.version.deploy
- case.alignment.propose / case.alignment.approve / clr.evidence.issue
- offline.cache.prefetch / audio_capsule.play / audio_capsule.bookmark
- learner.self_report.confidence / learner.self_report.load
- accessibility.caption.enable / screenreader.use / font_size.change

### 2-6. xAI 카드 표준 재작성 (§3-3)

기존 `evidence · reasoning · confidence · comparison · actions · feedback · meiwaku` 에서:
- `modelVersion` 필수 필드 추가
- `uncertainty` ( `{ kind: "interval|posterior", low, high, method }` ) 필드 추가
- `actionPlan` ( `{ expectedEffect, measurementPlan, reevaluateAt }` ) 필드 추가
- `kind` 확장: `insight | recommendation | answer | alert` → `+ intervention | cocreation | diagnostic`

### 2-7. 4-Gate Governance Pipeline (§4 확장)

1. **스키마 CI** (빌드 시) — evidence 0 / uncertainty 누락 → 빌드 실패
2. **Runtime 검증** — 모델 confidence 기반 저신뢰 출력 자동 억제
3. **월간 Bias·drift 리뷰 위원회** — 외부 멤버 1인 포함
4. **Mei-waku 피드백 재학습 루프** — 24시간 내 세그먼트 exclusion + 재학습 배치

---

## 3. v2 본문 목차 (구현 대상)

```
# AI-X Platform 시나리오 명세 v2 (AES 2026 제안서)
## ― 일본 대학 시장 타겟 차세대 AI 학습 운영 레이어 ―

0. 제품 한 줄
1. 제품 철학 (6개 + 일본 특화 5대 요소)
2. 시나리오 카탈로그
   2.1  S01 난관 감지·해소 폐루프
   2.2  S02 개념 약화·망각 Adaptive Review Policy
   2.3  S03 Knowledge Debt Graph + Generative Co-Answer
   2.4  S04 Survival + Uplift Nudge
   2.5  S05 Live Understanding State
   2.6  S06 Commute Learning Agent
   2.7  S07 Evidence-backed Career Narrative Model
   2.8  S08 Research Lineage Graph
   2.9  S09 Rubric-Calibrated Grading Copilot
   2.10 S10 Support Policy Simulator
   2.11 S11 Course Co-Creation Studio (신규)
   2.12 S12 Learning Companion / Pace Agent (신규)
   2.13 S13 Counterfactual Intervention Simulator (신규)
   2.14 S14 Real-time Adaptive Path (신규)
   2.15 S15 Instructor-AI Teaching Profile (신규)
   2.확장 예정 (S16~S23 요약만)
3. 공통 자산 (References)
   3-1 이벤트 카탈로그 (확장)
   3-2 데이터 레이어
   3-3 xAI 카드 컴포넌트 표준 (5요소)
   3-4 3단 UX 구조
   3-5 Standards Stack — "We compose, not replace"
   3-6 시스템 아키텍처
   3-7 일본 특화 스키마 (신규 — 학사·경어)
4. 거버넌스
   4-A APPI 체크리스트
   4-B CLR 시나리오 매핑 (신규)
   4-C 4-Gate Governance Pipeline (신규)
5. 개발 우선순위 (Phased Build)
6. 미결·선제 결정 (Open Decisions)
7. 다음 액션
8. 파일럿 + 4자 역할 (신규)
9. 프레젠 20분 구조 (신규)
```

---

## 4. 체크리스트 (v2 완성도 검증)

- [ ] 뜬소리 10개 문장 원문 위치에 교체 반영
- [ ] S01~S10 본문 재작성 (Round 2 결정 반영)
- [ ] S11~S15 풀 스펙 신규 작성 (한 줄 정의 · 페인 · 감지→추론→출력 · 화면·CTA · 데이터 · 수용 기준)
- [ ] 확장 예정 시나리오 테이블 갱신 (S11~S15가 현재 S11~S18 자리에 들어가므로 기존 S11~S18을 S16~S23로 재넘버)
- [ ] xAI 카드 5요소 변경 반영 (§3-3 + §01-H mock)
- [ ] 이벤트 카탈로그 10개 카테고리 추가
- [ ] 표준 슬라이드 1페이지 (§3-5 앞)
- [ ] CLR 시나리오 매핑 §4-B
- [ ] 4-Gate Governance §4-C
- [ ] 파일럿 §8 (90일 · 1학과 · 2강좌 · 3가설 · 검정력 · 4자 역할)
- [ ] 프레젠 §9 (20분 구조 · 데모 3장 · ask)

---

## 5. 최종 미해결 (사용자 결정 필요)

Round 2에서 올라온 것 + R3 작성 과정에서 추가:

1. **1호 파일럿 대학·학과**: 발표 당일 NetLearning이 연결을 약속하게 하려면 "공동 선정" 슬롯 필요. 영업 전략.
2. **4자 IP · 수익 배분**: 발표에 어디까지 노출할지.
3. **Shukatsu Forge 채용 윤리**: 대학 커리어센터와 합의 필요.
4. **CLR 발급 주체**: 대학 vs 플랫폼. 법적 책임.
5. **CASE × MEXT 매핑**: 실제 승인 기관.
6. **선배 데이터 공개 기본값**: 기본 off vs 학교 프리셋.
7. **가격·비즈니스 모델**: 별도 Commercial Deck 필요 여부.

**이 7개는 v2 본문의 §6 Open Decisions에 반영**하되 답은 "사용자·4자 미팅 후 확정".
