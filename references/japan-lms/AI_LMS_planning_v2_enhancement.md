# AI-X Platform 시나리오 명세 v2 (AES 2026 제안서 본문)
## ― 일본 대학 시장 타겟 차세대 AI 학습 운영 레이어 ―

> **v2 메모**: 본 문서는 `AI_LMS_planning_core_summary.md`(원본) 을 AES 2026 NetLearning 회장 프레젠테이션용으로 재작성한 버전이다. Claude + Codex 2라운드 교차 리뷰를 통해 **뜬소리 10개 문장 교체**, **시나리오 10종 업그레이드**, **신규 시나리오 5종(S11~S15) 편입**, **표준 스택 1페이지**, **CLR 시나리오 매핑**, **4-Gate Governance**, **90일 파일럿 + 4자 역할**, **20분 프레젠 구조**를 반영했다.

> **이 문서의 방식**
> 이 기획은 "기능 목록"이 아니라 **"현장 시나리오"**로 설계된다.
> 각 시나리오는 다음 순서로 기술한다.
>
> 1. **페인포인트** — 누가 · 어떤 상황에서 · 무엇이 고통인가
> 2. **감지(Signals) → 원인 추정(Reasoning) → 개입 후보(Actions)** — 감지가 아니라 **폐루프(감지→원인→개입→효과→정책갱신)** 로 끝까지 기술
> 3. **교수자에게** — 무슨 화면에서 · 어떤 xAI 카드가 · 어떤 행동으로 이어지는가
> 4. **학생에게** — 우측 패널 또는 인라인에서 · 무엇이 · 어떤 톤으로 제공되는가
> 5. **(관리자에게)** — 해당 시 집계 시각화
> 6. **데이터 출처 · 표준 매핑** — 참조 이벤트 · 테이블 · xAPI/Caliper/CASE/CLR
> 7. **수용 기준** — calibration / uplift / PPV / regret / perceived surveillance 포함 지표

공통 자산(이벤트 카탈로그·데이터 레이어·xAI 카드 표준·표준 스택·아키텍처)은 §3 참조(References)에 모여 있다.

---

## 0. 제품 한 줄

**제품명**: AI-X Platform (기반 기술: Lecognizer LRS + GROWA LMS + AI/xAI 레이어)

**한 줄**: 학습·평가·개입 이벤트를 **목적별 표준 프로파일**로 수집하고, 각 AI 판단의 **근거·모델 버전·불확실성·권장 행동·효과 측정 계획**을 설명하는 일본 대학용 **학습 운영 AI 레이어**.

**기존 LMS와의 구조적 차이**

| 항목 | 기존 (Moodle/manaba/Classi) | AI-X Platform v2 |
|---|---|---|
| AI 출력 | 추천 결과만 | **5요소 렌더링**: 근거·모델버전·불확실성·권장행동·효과측정계획 |
| 데이터 자산 | 콘텐츠·제출물 DB | + xAPI/Caliper LRS + CASE 정렬 개념 그래프 + CLR evidence ledger + Learner Profile |
| 학습 진단 | 점수 통계 | **MVP: BKT+IRT+개인 half-life** (숙달도 + 불확실성 온라인 갱신) / **P2: GKT/SAKT** 전환 (코호트 50+ 수렴 시) |
| 교수자 개입 | 사후 성적 기반 | **Support Policy Simulator**: risk + uplift + fairness audit + uncertainty 4모델 스택. "위험 명단"이 아니라 "이번 주 효과가 큰 지원 3개" 우선 |
| 콘텐츠 개선 | 학기 종료 후 수작업 | **Course Co-Creation Studio**: 감지 → 원인 추정 → 교수자 승인 기반 자료 초안 생성 → 2주 효과 검증 → 정책 갱신 폐루프 |
| 외부 연동 | SSO + 일부 LTI | **Standards Stack**: OneRoster + LTI Advantage (Deep Linking/AGS/NRPS) + Caliper + xAPI Profile + CASE + CLR + EDU-API |

**One-liner Pitch (발표 첫 문장)**:
> "우리는 LMS를 대체하지 않습니다. NetLearning과 manaba가 이미 가진 학습 운영 접점 위에, **개입 효과를 학습하는 AI 레이어**를 얹자는 제안입니다."

---

## 1. 제품 철학 (모든 시나리오가 지켜야 하는 것)

이건 엔지니어링 불변 조항이자 기획 심사 기준이다.

1. **AI 출력은 반드시 5요소를 갖는다.** — 근거 이벤트 · 모델 버전 · 불확실성 · 권장 행동 · 효과 측정 계획. 효과 측정이 불가능한 추천은 **"정보성 인사이트"로만** 표시한다. **4-Gate Governance** (스키마 CI · Runtime 검증 · 월간 Bias/drift 리뷰 위원회 · Mei-waku 재학습) 통과한 카드만 배포.
2. **학습 이벤트는 SDK로 수집되고, 용도별로 분리된다.** — 교환 가치 있는 이벤트는 **xAPI/Caliper 프로파일**로, 운영·AI 감사 이벤트는 **internal audit schema**로. 둘을 섞지 않는다.
3. **교수자가 학생 개인 데이터를 볼 때는 목적(purpose) 입력이 필수다.** — 서버측 purpose token 없이는 개인 데이터 API가 401. `instructor.data_access` 감사 로그 영구 보존.
4. **개별 학생 명단보다 "반 단위 병목·효과가 큰 개입"이 먼저 노출된다.** — 낙인 방지가 UX 레벨에서 강제(컴포넌트·서버·클라이언트 3중).
5. **모든 AI 판단에는 "Mei-waku Care (이의 제기)" 링크가 상시 붙는다.** — 오판 회수 경로 보장. 24시간 내 세그먼트 exclusion + 재학습 배치.
6. **학생 UI의 경고성 단어("위험", "탈락 예측")는 기본 금지.** — **5대 일본 특화** 중 하나.

### 1.6. 일본 특화 5대 요소

"일본 문화 특화"는 슬로건이 아니라 다음 5요소의 실제 구현을 의미한다:

| # | 요소 | 구현 |
|---|---|---|
| ① | **Meiwaku Awareness** | 경고어 금지 사전 · 낙인 방지 UX 3중 강제 · 이의 제기 상시 링크 |
| ② | **Honne/Tatemae Tone** | 일본어 피드백의 직설 수위를 학생·교수 관계·맥락별 자동 조정 |
| ③ | **敬語 3단계 자동** | `です・ます / である / 敬語` 레벨을 actor·recipient·artifact 별 자동 선택 |
| ④ | **학사 구조 1급 시민 스키마** | 前期/後期 · 履修登録 · 通年科目 · 集中講義 · 卒論ゼミ 를 `academic_term.type`·`course.cadence` 필드로 정식 지원 |
| ⑤ | **정량 검증** | 파일럿 내 **Omotenashi 설문 n≥300** · "주시감(監視感)" 지표 분기별 < 2.5/5 · Mei-waku 회수·반영률 공개 |

---

## 2. 시나리오 카탈로그

### Scenario 01. 난관 감지·해소 폐루프 (Course Co-Creation Studio 진입점)

> **이 시나리오의 위상**
> 이후 모든 시나리오는 이 항목의 구조·세부 수준을 따라 기술한다. Scenario 01은 템플릿이자 **AES 발표 데모 1**의 주인공이다.
> **핵심 변화 (v1 → v2)**: "난관 구간을 z-score로 탐지"에서 **"원인 개념을 추정하고, 교수자와 함께 개선 자료를 생성하고, 효과를 2주 뒤 검증하는 폐루프"** 로 승격. **Course Co-Creation Studio(S11)** 가 이 시나리오의 생성 레이어로 연동된다.

#### 01-A. 한 줄 정의
동영상 재생 중 **P(struggle)** 이 상승한 구간을 **선수 개념 공백 + 문맥 의미**까지 함께 추정해, **교수자에겐** Intervention xAI Card(개입 후보 3종 + overlap + CI)를, **학생에겐** 익명화된 선배 질문을 재구성한 **개인화 hint pack**을, **학과장에겐** 반복 난관 구간 Top10 리포트를 제공하고, 교수자 개입 2주 뒤 **효과를 자동 재측정·정책 갱신**한다.

#### 01-B. 페인포인트 (3 actors, 인용체)

*교수자 (학기 말 피드백 수집 중)*
> "내 영상 강의 어디가 잘 전달됐고 어디가 안 됐는지 구체적으로 모른다. 매 학기 비슷한 학생 피드백만 쌓이고, 개선의 효과를 수치로 보여줄 수 없다."

*학생 (VOD 시청 중)*
> "이 부분 이해가 안 가서 두 번 되돌렸다. 뭐가 빠진 건지 모르겠고, 구글로 찾아도 우리 교수님 강의 맥락은 나오지 않는다."

*후배 학생 (다음 학기 같은 수업)*
> "선배들이 고민했던 질문·메모가 분명 있을 텐데 포럼에서 찾기 어렵다. 답변이 끊기거나 지워진 것도 많다."

#### 01-C. 성공 장면 (도입 3개월 뒤)

- 교수자 A: "학기 중에 자료 개편 우선순위가 잡히고, 개선 후 2주 뒤 효과가 수치로 돌아온다. 학과장 리포트 작성 시간이 반으로 줄었다."
- 학생 B: "영상에서 막힌 순간 우측 패널이 먼저 답을 준다. 선배들이 남긴 궤적이 바로 보인다."
- 데이터: 적용 세그먼트 재시청률 **-18 ~ -32%** (cluster-randomized trial, 2주, 95% CI, overlap 0.71), 보조 자료 클릭 후 끝까지 시청률 **≥ 82% (CI 78~86%)**.

#### 01-D. 감지 → 원인 추정 → 개입 후보 → 효과 검증 파이프라인

```
[클라이언트 이벤트]
  content.video.play / pause / seek / rate_change / complete
  ai.ask.submit           (context_anchor: content_id + position_s)
  content.note.create     (anchor)
  forum.thread.create     (tags, 본문 타임스탬프)
      │
      ▼
[Stream Processor] 실시간
  5초 bucket 이벤트 집계 (feature store에만 저장, 최종 판단 근거 아님)
      │
      ▼
[Segment Struggle Model]
  입력: 행동 시퀀스 + 자막/슬라이드 OCR + 질문 임베딩 + 선수 개념 상태 + L5 인접 개념
  모델: Bayesian change-point detection + sequence transformer
  출력: P(struggle | behavior, transcript, learner_state) per 구간
       + 원인 개념 candidate k=1..3 (each with P, top prerequisite gap)
       + calibration error (post-hoc Platt/isotonic)
  cold start: L5 동일 개념 다른 영상의 난관 패턴을 pooled prior로 시드
      │
      ▼
[Intervention Candidate Generator]
  후보 3종(동적 가변):
    A. 강의 시 5분 복기 (교수자)
    B. 보조 영상/자료 생성 (Course Co-Creation Studio = S11 호출)
    C. 즉석 퀴즈 3문항 (IRT 난이도 calibrated)
  각 후보에 uplift 추정:
    doubly robust estimator on similar course-concept pairs (n≥30, overlap≥0.6)
    estimated effect CI + propensity overlap 표시
      │
      ▼
[출력]
  1) 교수자 Intervention xAI Card (§01-H)
  2) 학생 우측 패널 hint pack (LLM 합성 요약, k-anonymity ≥ 5)
  3) 학과장 월간 반복 난관 Top10 리포트 (재시청률·개선 적용 여부·CLR evidence 생성 여부)
      │
      ▼
[효과 검증 루프] (2주 후 자동)
  section × content cluster-randomized trial
  two-sided 95% CI on primary outcome
  결과를 Intervention Policy에 입력 → 후보 우선순위 업데이트
  (교수자가 무시한 세그먼트도 negative label로 정책에 반영)
```

#### 01-E. 교수자 여정

1. **진입**: 코스 대시보드 → "콘텐츠 분석" 탭 (영상 썸네일 그리드).
2. **히트맵 뷰**: 영상을 열면 타임라인 하단에 **난관 히트맵** (P(struggle) gradient). z-score는 hover 시 보조 근거로만 표시.
3. **구간 클릭**: 12:34 구간 클릭 → 우측 패널에 Intervention xAI Card 슬라이드 인.
4. **카드 실제 문구** (§01-H 참조).
5. **액션 (5버튼)**:
   - `[5分復習を追加 / 5분 복기 추가]` → 다음 강의안 편집 화면에 해당 지점 북마크 + 권장 스크립트 템플릿.
   - `[教材案を生成 / 자료 개선안 생성]` → **Course Co-Creation Studio (S11)** 진입. AI가 **대체 설명 스크립트 + 확인 문제 + 슬라이드 초안**을 생성, 교수자가 편집·승인 후 게시. (승인 전까지는 공개되지 않음. "AI 자동 배포"는 약속하지 않는다.)
   - `[2週間後に検証 / 2주 후 검증]` → 2주 뒤 동일 세그먼트 재측정 예약.
   - `[AIとこの判断を議論 / AI와 이 판단 토론]` 🎙️ → 음성/텍스트 입력으로 교수자가 근거 반박, 모델이 재추론한 후 diff 표시.
   - `[判断が違う / 판단이 다름]` (Mei-waku) → 세그먼트 무효화 + 재학습 입력.
6. **무시 의미 확장**: `[判断が違う]` 클릭 시 모달로 이유 선택:
   - `既に授業で説明済み / 이미 수업에서 설명함` → content version / context 반영
   - `重要ではない / 중요하지 않음` → course objective weight 하향
   - `データが偏っている / 데이터가 편향됨` → cohort anomaly flag
   - `概念の紐づけが違う / 개념 매핑이 다름` → L5 graph edge review queue 생성
7. **누적**: 주간 **"개선 적용 전/후 비교 리포트"** 자동 생성 → 학과장 보고에 그대로 첨부 가능. 2주 효과 검증 결과가 **intervention uplift**로 표기.

#### 01-F. 학생 여정

1. **트리거**: VOD 시청 중, 본인이 **같은 5초 bucket에서 되감기 2회 OR 일시정지 30초 누적** + 해당 구간 `P(struggle) ≥ 0.6` 이면 트리거 충족.
2. **알림**: 우측 AI 패널 상단 배지 (소리 없음, 진동 1회).
3. **카드 실제 문구** (§01-H 참조).
4. **선배 데이터 공개 규칙**:
   - 원문 그대로 노출 ❌ → LLM이 3~5건을 **합성 요약 1개**로 재구성
   - 출처 표기는 "2024년 후기 수강생" 같은 **학기 단위**까지만
   - k-anonymity ≥ 5 (역참조로 개인 특정 불가)
   - 선배 공개 동의 기본값 **off** (학교 정책으로 on 프리셋 가능) — v2 결정 사항
5. **피드백 루프 (5선택지)**:
   - `30秒で説明 / 30초 설명` → hint type reward +1 (정책 갱신)
   - `例題を1問 / 예제 1문제` → IRT item difficulty 매칭
   - `通学の音声ポッドキャストに追加 / 통학 팟캐스트에 추가` 🎧 → S06 Commute Learning Agent 큐에 편입
   - `もう知っている / 이미 알아요` → 해당 개념 mastery prior 즉시 상향, 추천 억제
   - `違うところが難しい / 다른 부분이 어려워요` → 음성/텍스트 입력, 새 misconception candidate 생성
6. **복귀 루틴**: 5분 보조 영상 시청 후 본 영상 복귀 시 `meta_cognition_calibration` 자가 체크 1-클릭.

#### 01-G. 관리자 여정 (학과장)

월간 리포트에 **"반복 난관 구간 Top 10 (학과 전체)"** 섹션이 자동 삽입.

| 강의명 | 구간 | 반복 학기 | 개념 노드 | 개선 여부 | 개선 후 uplift (CI) | CLR evidence |
|---|---|---|---|---|---|---|
| 통계학 II | 12:34–12:42 | 3학기 | 신뢰구간 | ✅ 자료 개선안 배포 | 재시청률 -24% (CI -18~-32) | `LearningAchievementEvidence` |
| 미시경제 | 08:10–08:25 | 2학기 | 한계효용 | 🟡 메모만 | — | — |

용도: 차년도 콘텐츠 제작 예산 배분, 교수별 지원 필요도 판단, 경영위원회 보고.

#### 01-H. xAI 카드 실제 mock (Intervention variant)

```
[교수자용 — kind: intervention, tone: neutral]
┌──────────────────────────────────────────────┐
│ 難所候補 — 12:34–12:42                       │
├──────────────────────────────────────────────┤
│ 📊 난관 확률 0.82  (calibration error 0.04)  │
│ 🧠 원인 추정 (top 3)                          │
│   · '표준오차' 선수 개념 공백        P=0.71   │
│   · '분산 vs 표준편차' 용어 혼동     P=0.18   │
│   · '단일·양측 검정' 맥락 누락       P=0.06   │
│ 🏷️ model: segment_struggle_model v0.9.3      │
│                                              │
│ 👥 관측 근거                                  │
│   · 되감기 +3.2σ · 일시정지 +2.1σ            │
│   · 질문 12건 · 메모 3건                      │
│   · (z-score는 보조 설명 근거)               │
│                                              │
│ 🎯 개입 후보 · 예상 효과 (유사 강좌 12건)    │
│   A. 5분 복기 (다음 강의)                     │
│     재평가 정답률 +8 ~ +14%p                  │
│     overlap 0.74 · 부담 증가 낮음             │
│   B. 자료 개선안 생성 (S11)                   │
│     재시청률 -18 ~ -32% · overlap 0.71        │
│     학습효과 근거 강함                        │
│   C. 퀴즈 3문항                               │
│     정답률 +5 ~ +9%p · 부담 증가 낮음         │
│                                              │
│ 📝 효과 측정 계획                             │
│   적용 후 2주 동일 세그먼트 자동 재측정       │
│   section × content cluster RCT · 95% CI     │
├──────────────────────────────────────────────┤
│ [5分復習を追加 / 5분 복기 추가]               │
│ [教材案を生成 / 자료 개선안 생성]            │
│ [2週間後に検証 / 2주 후 검증]                │
│ [AIとこの判断を議論 / AI와 이 판단 토론] 🎙️ │
│ [判断が違う / 판단이 다름 🚩]                 │
└──────────────────────────────────────────────┘

[학생용 — kind: insight, tone: gentle]
┌──────────────────────────────────────────────┐
│ ここで少し止まりましたね 🌸                  │
│ 여기서 잠깐 멈췄네요                          │
├──────────────────────────────────────────────┤
│ 2024년 후기 수강생 47명 중 31명이            │
│ "분산과 표준오차 차이"에서 헷갈렸어요.        │
│ (선배 발화는 익명화 · 학기 단위 출처만 표기) │
│                                              │
│ 📊 익명화된 선배 질문 요약 ▼                 │
├──────────────────────────────────────────────┤
│ [30秒で説明 / 30초 설명]                      │
│ [例題を1問 / 예제 1문제]                      │
│ [通学ポッドキャストに追加 / 통학 팟캐스트 추가] 🎧 │
│ [もう知っている / 이미 알아요]                │
│ [違うところが難しい / 다른 부분이 어려워요]   │
│                                              │
│ 🚩 이 추천이 안 맞으면 알려주세요             │
└──────────────────────────────────────────────┘
```

#### 01-I. 데이터 스키마

**참조 이벤트 (§3-1)**
- 행동: `content.video.seek`, `content.video.pause`, `content.video.play`, `content.video.rate_change`, `content.video.complete`
- 언어: `ai.ask.submit`, `content.note.create`, `forum.thread.create`
- AI 표출: `ai.card.impression`, `ai.explanation.expand`, `ai.recommendation.dismiss`
- 개입: `intervention.offer`, `intervention.accept`, `intervention.complete`, `intervention.snooze`
- 생성 자산: `content.variant.generate`, `content.variant.approve`, `content.variant.publish`, `content.variant.abtest.assign`
- 감사: `instructor.data_access` (교수자 세그먼트 원문 열람 시), `model.prediction.emit`, `model.override`
- 표준: `case.alignment.propose`, `clr.evidence.issue`

**신규 집계 테이블 (L2 확장)**

```sql
segment_struggle_prediction (
  segment_id                  uuid PK,
  content_id                  uuid,
  start_s, end_s              int,
  p_struggle                  float,           -- 모델 출력
  p_struggle_ci               float_interval,  -- [low, high]
  calibration_error           float,
  top_cause_concept_ids       uuid[],
  top_cause_probs             float[],
  model_version               text,            -- semver
  inputs_hash                 text,
  cohort_size, k_anonymity    int,
  created_at                  timestamp,
  primary key (content_id, start_s)
)

intervention_candidate (
  candidate_id                uuid PK,
  segment_id                  uuid FK,
  kind                        text,            -- 'review_5min' | 'content_generation' | 'quiz_3'
  expected_effect_low         float,
  expected_effect_high        float,
  propensity_overlap          float,
  similar_case_count          int,
  estimator                   text,            -- 'doubly_robust' | 'uplift_forest'
  created_at                  timestamp
)

intervention_outcome (
  outcome_id                  uuid PK,
  candidate_id                uuid FK,
  accepted_at                 timestamp,
  completed_at                timestamp,
  primary_outcome_name        text,            -- e.g., 'rewatch_rate', 'reassessment_correct_rate'
  primary_outcome_value       float,
  primary_outcome_ci          float_interval,
  policy_update_batch_id      uuid
)
```

#### 01-J. API 엔드포인트

**교수자**
```
GET  /api/v1/courses/{course_id}/contents/{content_id}/struggle-segments
GET  /api/v1/struggle-segments/{segment_id}/evidence
GET  /api/v1/struggle-segments/{segment_id}/interventions    # 후보 조회
POST /api/v1/struggle-segments/{segment_id}/actions
     body: { action_type, candidate_id?, reason? }
POST /api/v1/struggle-segments/{segment_id}/meiwaku
     body: { reason, note }
POST /api/v1/struggle-segments/{segment_id}/dialogue        # AI 반박 음성/텍스트
     body: { input_mode: 'voice'|'text', payload }
```

**학생**
```
GET  /api/v1/contents/{content_id}/struggle-hint?position_s=754
     → null OR { hint_pack: { summary, materials[], source_count, cta_options[] } }
POST /api/v1/hints/{hint_id}/feedback
     body: { option: '30s'|'example'|'podcast'|'already_known'|'different', free_text? }
```

**Co-Creation (S11과 공유)**
```
POST /api/v1/segments/{segment_id}/variants/generate
     body: { style: 'example'|'analogy'|'visualization', tone_level: 1|2|3 }
     → { draft_script, draft_quiz[], draft_slides[], alignment_case_item_uri[], generation_id }
POST /api/v1/variants/{generation_id}/approve
POST /api/v1/variants/{generation_id}/publish
     body: { target_cohort, abtest_enabled, reevaluate_at }
```

#### 01-K. 처리 로직 세부

**임계값 자동 조정 (false positive 방지)**

| 수강생 n | 판단 기준 | 표시 |
|---|---|---|
| < 20 | `segment_struggle_model` 실행 안 함 | "측정 중" 플레이스홀더 |
| 20 ≤ n < 50 | P(struggle) ≥ 0.7 AND CI 하한 ≥ 0.55 | 엄격 모드 |
| n ≥ 50 | P(struggle) ≥ 0.6 AND CI 하한 ≥ 0.4 | 기본 모드 |

Runtime 품질 게이트: `calibration_error > 0.08` 이면 해당 모델 버전의 카드 표출 억제.

**초기 학기 cold start**
해당 영상이 이 학기 처음 사용이면, L5의 동일 개념 다른 영상에서 관측된 난관 패턴을 **pooled prior**로 시드. 교수자에겐 **"예측 히트맵(시드 기반)"** 라벨을 붙여 실측과 구분. 실측 이벤트 ≥ 30 bucket 쌓이면 자동으로 "실측 히트맵" 전환.

**영상 종류별 처리**

| 유형 | segment_struggle_model 입력 차이 |
|---|---|
| 사전 녹화 VOD | 기본 입력 셋 |
| 라이브 스트림 | seek 제거, pause + 실시간 질의 + 즉석 퀴즈 정답률 조합 (S05와 공유) |
| 다시보기(라이브 녹화) | VOD 입력 셋 + 라이브 당시 신호 가중합 |

#### 01-L. 프라이버시·거버넌스

| 항목 | 규칙 |
|---|---|
| 학생 개별 발화 원문을 교수자에게 노출 | ❌ 원문 인용 시도 → LLM 합성 요약만, k-anonymity ≥ 5 |
| 선배 → 후배 노출 | **기본 off** (v2 변경). 학과 정책으로 기본 on 프리셋 가능 |
| 원문 그대로 복사 | 금지 (LLM 프롬프트 가드에 원문 보존 금지 조건 하드코딩) |
| Mei-waku Care | 오분석 신고 시 24h 내 해당 세그먼트에서 해당 발화 제외 + 모델 재학습 입력 |
| 교수자 열람 감사 | `instructor.data_access` 에 segment_id · purpose 기록, purpose 없으면 401. 집계 레벨은 purpose token 없이 접근 가능, 개인 식별 레벨은 token 필수 |
| AI 호출 감사 | `model.prediction.emit` · `model.override` 전수 기록, 2년 보존 |
| 4-Gate Governance | §4-C 참조 |

#### 01-M. 에지 케이스·실패 모드

**에지 케이스**
- 수강생 < 10명 → 기능 비활성, UI에 "통계적 유의성 부족으로 측정 중".
- 영상 업로드 후 < 3일 → 동일 플레이스홀더.
- 교수자가 영상 교체·편집 → 기존 세그먼트 무효화, 과거 버전 archive, 새 집계 시작.
- 자막 없는 영상 → 개념 매핑을 파일명·코스 메타 기반으로 fallback, confidence 표시에 반영 (⚠ 자막 없음 뱃지).
- 세션당 이벤트 상한 + `focused` 플래그로 어뷰징(고의 seek 반복) 가중치 감쇠.

**실패 모드**
- `calibration_error > 0.08` → 교수자 카드 생성 안 함. 히트맵은 hover 시 경고 표시.
- 클러스터 결속력 낮음 (DBCV < 0.3) → 학생 hint pack 생성 보류.
- L5 개념 매핑 실패 → `top_cause_concept_ids = null`, 학생 카드는 "이 구간 학습 보조" 일반 문구.
- 후보 uplift 추정 `overlap < 0.6` 또는 `n_similar < 30` → 해당 후보 "효과 추정 불가" 표시. 추천 목록에서 제외.

#### 01-N. 측정 지표

**프로덕트**
- 난관 탐지 Recall ≥ 0.75 AND PPV ≥ 0.55 (교수자 정답셋 기준) — **Recall 단독 금지**
- calibration error ≤ 0.05
- 교수자 Intervention Card `action_accept` 채택률 ≥ 30%
- 학생 hint pack 클릭률 ≥ 25% (알림 수신자 기준)
- 보조 자료 클릭 후 이탈률 < 15%

**비즈니스**
- 적용 세그먼트 재시청률 **-18 ~ -32%** (cluster RCT, 2주, 95% CI)
- 학과장 리포트 작성 시간 **-50%** (이전 수작업 대비)
- Co-Creation Studio 자료 재사용률 ≥ 40% (차학기)

**UX**
- 교수자 NPS ("강의 설계에 실제 도움이 되나")
- 학생 "주시감(監視感)" 설문 분기별 < 2.5/5
- Mei-waku 회수·반영률 ≥ 95% within 24h

#### 01-O. 확장 포인트

- **콘텐츠 타입 확장**: PDF(페이지 체류 + 하이라이트 클러스터), 라이브(S05 연계), 실습 코드(에러 발생 지점을 난관으로 매핑).
- **기관 간 메타 비교**: 여러 학교에서 동일 교재·동일 개념 난관이 재현되면 L5 개념 난도 라벨에 반영.
- **교수자 라이브러리**: 유사 개선 7건의 "before/after 영상 클립"을 라이브러리화해 개선안 카드에 링크 첨부.
- **Course Co-Creation Studio (S11)** 와의 생성 레이어 연동이 실질적 확장 중심축.

#### 01-P. 의존성

**선행 필요**
- 이벤트 SDK (P0)
- L1 수집 안정화 (P0)
- L5 개념 그래프 시드 1학과 분량 (D-1 결정)
- xAI 카드 Storybook — 5요소 (§3-3) 포함 (P0)
- 4-Gate Governance Pipeline 기본 구성 (P0)

**후속 시나리오에 공유되는 자산**
- `segment_struggle_prediction` → S03(질문 쏠림)에서 concept_id 기준 재사용
- 학생 hint pack 생성 파이프라인 → S11(Co-Creation)·S13(자동 노트)와 공유
- k-anonymity·LLM 합성 요약 룰 → 모든 학생 발화 노출 시나리오에 재사용
- Intervention candidate generator → S10 Support Policy Simulator의 후보 생성기와 공유

#### 01-Q. 개발 견적 (러프)

| 역할 | 투입 | 담당 |
|---|---|---|
| FE | 1 FTE × 7주 | 교수자 히트맵 · Intervention xAI Card · 학생 우측 패널 · AI 반박 음성 모달 |
| BE | 1 FTE × 7주 | bucket feature store · segment 모델 API · intervention 후보 API · 효과 검증 파이프라인 |
| ML | 1 FTE × 10주 | segment_struggle_model · 원인 개념 추정 · uplift estimator · cold-start pooled prior |
| QA | 0.5 FTE × 5주 | 정답셋 제작 · Recall/PPV/calibration 검증 · AB 검정력 |

#### 01-R. 마이크로 페이즈 (서브 릴리즈)

| # | 목표 | 검증 |
|---|---|---|
| 1.1 | 교수자 히트맵만 (카드 없음) | 교수자 주관 판단과 κ ≥ 0.5 |
| 1.2 | Intervention xAI Card · 후보 3종 · evidence · uncertainty | 교수자 NPS +10, calibration error ≤ 0.08 |
| 1.3 | 후보 B "자료 개선안 생성" = S11 Co-Creation Studio 런칭 | 자료 변이 생성 · 교수자 승인 플로우 |
| 1.4 | 학생 우측 패널 hint pack 5선택 CTA | 클릭률 ≥ 25% |
| 1.5 | 2주 효과 검증 루프 + 정책 갱신 | cluster RCT 정상 가동, 결과가 후보 priority에 반영 |
| 1.6 | AI 반박 음성 인터랙션 | Mei-waku 회수율 상승 · 재학습 routing 정상 |

---

### Scenario 02. 개념이 무너지기 전에 복습이 먼저 찾아온다 (Adaptive Review Policy)

**페인포인트**
학생: *"2주 전에 배운 신뢰구간이 이미 머리에서 지워졌다. 시험 2주 전인데 교재 어디부터 다시 볼지 모르겠다."*
교수자: *"반 전체가 어느 개념에서 동시에 이탈 중인지 안 보인다. 기말 성적 보고서야 안다."*

**감지 → 원인 추정 → 개입**
문항 응답·소요시간·힌트 사용·자가 확신도를 입력으로 **BKT + IRT + 개인 half-life Bayesian posterior**가 숙달도와 불확실성을 온라인 갱신한다. 복습 큐는 **`expected_gain_per_min` 높은 순** 정렬 (단순 숙달 하락 정렬 금지). 반 전체의 **"expected class gain이 큰 개념 Top 3"** 가 교수자 첫 화면에 뜬다 (개인 명단보다 먼저).

추천 게이트: `expected_gain_per_min ≥ 0.025` AND `uncertainty ≤ 0.15` 인 경우에만 자동 추천. cold start는 L5 개념 그래프 neighbor pooled prior.

로드맵: **MVP = BKT + IRT + 개인 half-life** (투명 표시). **P2 = GKT / SAKT** 전환 (코호트 50+ 수렴 시점, D-2에 명시).

**교수자에게**
주간 뷰 첫 화면에 **"이 주 반에 가장 효과 큰 복기 Top 3"**. 각 항목에 "다음 강의 5분 도입 복기" 또는 "관련 퀴즈 자동 생성" 버튼, 예상 class gain 구간 표시.

**학생에게**
아침 홈에 **"오늘의 5분"** 카드:
> "신뢰구간 · 마지막 학습 11일 전 · 현재 예상 정답률 47% · 시험 D-12 · 지금 5분 복습 완료 시 **시험 시점 예상 정답률 68~76%** (유사 학생 42명 + 현재 오답 패턴 기준)."

카드에 `5分だけ復習する / 5분만 복습` · `問題の難しさを調整 / 난이도 조정` · `この予測は合っていません / 이 예측은 맞지 않음`.

5분 세션 후 `meta_cognition_calibration` 자가 예측 점수 1-클릭 입력 → 메타인지 정확도 누적.

**데이터 출처**
- 이벤트: `assessment.response.submit`, `content.video.complete`, `learner.self_report.confidence`
- 테이블: L3 `concept_mastery` (posterior), `concept_forgetting` (개인 half-life), `meta_cognition_calibration`

**수용 기준**
- 복습 완료 군의 해당 개념 재평가 정답률 +15%p (cluster RCT, 2주)
- 교수자 주관 병목 판단과 κ ≥ 0.6
- `expected_gain_per_min` 예측 MAE < 0.02
- 학생 "5분 복습이 실제 도움됐다" 주관 평가 ≥ 3.8 / 5

---

### Scenario 03. 같은 질문이 쏠릴 때 — Knowledge Debt Graph + Generative Co-Answer

**페인포인트**
교수자: *"같은 질문을 메일·오피스 아워·포럼에서 여러 번 따로따로 답한다. 시간 낭비고 학생마다 답이 일정하지 않다."*
학생: *"이미 누가 물어봤을 것 같은데 찾기가 어렵다. 다시 올리면 눈치가 보인다."*

**감지 → 원인 추정 → 개입**
최근 7일치 `ai.ask.submit` + `forum.thread.create` 를 임베딩하고 HDBSCAN 클러스터링. 각 질문을 **`intent · misconception · missing prerequisite · answer_status · conflict_status`** 로 구조화 (LLM misconception extractor + L5 concept grounding + answer quality classifier).

이것을 **Knowledge Debt Graph (KDG)** 로 관리. 단순 "중복 질문" 이 아니라 "**Big O 질문 31건 중 22건은 '상수항 무시'가 아니라 '입력 크기 n의 정의' 오개념**" · "교수 답변 3개가 서로 다른 설명"을 identify.

**교수자에게**
"주간 인사이트" 탭:
> "이번 주 질문 47건 중 31건은 'Big O 표기법' · 오개념은 '상수항 무시' 아님, **'입력 크기 n의 정의' 공백**. 교수 답변 3개 중 2개가 서로 다른 설명을 사용."

카드 액션:
- `この質問を標準回答に統合 / 이 질문을 표준 답변으로 통합` → AI가 **표준 답변 초안** 생성, 교수자 승인 후 과거 답변들에 cross-link 추가.
- `次回授業の5分説明を生成 / 다음 강의 5분 설명 생성` → S01의 Course Co-Creation Studio 진입.

**학생에게 (공동 지식 생성 톤)**
질문 타이핑 중 인라인 안내:
> "비슷한 질문 14건이 같은 오개념으로 묶입니다. AI가 표준 질문으로 정리하면 다음 학생도 바로 찾을 수 있습니다."
>
> 표준 질문안: "Big O에서 상수항을 무시해도 되는 이유는?"
> 부족한 부분 (AI가 탐지): 입력 크기 n의 정의

- `この質問に統合して投稿 / 이 질문에 합쳐 올리기`
- `新しい観点として投稿 / 새 관점으로 올리기`
- `先生に5分説明を依頼 / 교수님께 5분 설명 요청`

**데이터 출처**
- 이벤트: `ai.ask.submit`, `forum.thread.create`, `forum.reply.create`, `content.variant.generate` (표준 답변 초안)
- 테이블: L5 `content_graph`, 신규 `knowledge_debt_graph` (intent·misconception·conflict 노드)

**수용 기준**
- 중복 질문 비율 -40% (적용 전후)
- 표준 답변 채택률 ≥ 50% (교수자)
- 학생 "질문 부담감" 주관 평가 분기별 < 2.5 / 5
- 오개념 extractor F1 ≥ 0.75

---

### Scenario 04. 마감 직전 몰아치기를 Survival + Uplift Nudge

**페인포인트**
학생: *"또 마감 전날 밤에 과제한다. 알면서도 못 고친다. 경고 알림은 스트레스만 준다."*
교수자: *"누가 몰아치는지 명단을 받으면 일일이 개입이 부담이다. 낙인 찍고 싶지 않다."*

**감지 → 원인 추정 → 개입 (3계층 정책 스택)**

- **계층 1: Hazard 예측** — Survival analysis로 마감 실패 확률 추정. `P(late_submission | history, current_state, deadline_distance)`.
- **계층 2: Uplift 추정** — Uplift model로 **개입 후보별** `P(on_time | intervention) - P(on_time | no_intervention)`, **부작용** `P(stress_increase | intervention)` 동시 추정.
- **계층 3: Tone Bandit** — Contextual bandit (LinUCB)으로 해당 학생에게 효과적인 **톤·시간·채널**을 개인 학습.

**게이트**: `expected_utility = uplift - λ·P(stress_increase) > 0` 일 때만 개입. `stress uplift ≤ +0.05` · `opt-out rate < 12%` · `intervention helpfulness ≥ 3.6/5`.

**학생에게 — Omotenashi Nudge (3단계)**
- **L1 (hazard 0.4~0.6)**: "학습 컨디션 체크" 자가진단 카드 — AI가 판정하는 게 아니라 본인이 체크하는 톤.
- **L2 (0.6~0.8)**: Soft Sakura Pink 테마의 *"오늘 15분만 이 과제에 나눠볼까요"* 카드. **캘린더에 15분 블록 1-click 삽입**.
- **L3 (>0.8)**: 상담 슬롯 자동 오픈. 학생이 동의 체크해야만 교수자에게 알림이 간다.
- 모든 단계에 **Mei-waku Care** 링크 상시.

**교수자에게**
대시보드 첫 화면은 **"반 전체 몰아치기 지수 추이"** 그래프. 개별 학생 명단은 한 번 더 클릭해야 도달 (낙인 방지 UX 강제).

**데이터 출처**
- 이벤트: `assignment.save_draft`, `assignment.submit`, `learner.session.heartbeat`, `intervention.offer`, `intervention.accept`, `intervention.snooze`
- 테이블: L2 `deadline_behavior`, `engagement_intensity_daily`, 신규 `nudge_policy_reward`

**수용 기준**
- `stress uplift ≤ +0.05` (학생 설문 사전-사후 difference)
- `nudge opt-out rate < 12%`
- `intervention helpfulness ≥ 3.6 / 5`
- L1/L2 수신 후 24h 내 과제 진입률 (uplift CI 표기)
- Mei-waku 회수·반영률 공개

---

### Scenario 05. 강의실 안에서 학생 이해가 흔들리는 순간 — Live Understanding State

**페인포인트**
교수자: *"강의 중엔 학생이 이해하는지 모른다. 질문은 끝나야 온다. 재설명 타이밍을 놓친다."*
학생: *"손들기 애매하다. 다른 애들은 이해하는 것 같은데 나만 모르는 게 쪽팔리다."*

**감지 → 원인 추정 → 개입**
강의실 모드 입장 시 실시간 스트림이 켜진다. `content.doc.page_view` · `content.scroll.depth` · `ai.ask.submit` · 즉석 퀴즈(`assessment.response.submit`) · 익명 "이해 안 됨" 버튼 을 WebSocket으로 흘린다.

**Live Understanding State** = online BKT/IRT + Bayesian uncertainty update. 슬라이드별 이해도 점수 + 오개념 candidate.

**교수자에게 — 3선택지 CTA**
대형 화면에 슬라이드별 이해도 히트맵. 특정 슬라이드 클릭 시 팝업:
> "슬라이드 12 '카이제곱 검정' · 이해도 0.42 (CI 0.32~0.52) · 오개념 candidate: '자유도 계산'(0.71) / '카이제곱 분포 모양'(0.19)"

액션 3선택:
- `2分で例を変えて説明 / 2분 예시 바꿔 설명` (expected ΔUnderstanding +0.18 ~ +0.24)
- `確認問題を1問出す / 확인 문제 1개 출제` (expected ΔUnderstanding +0.10 ~ +0.15)
- `このまま進む / 그대로 진행`

교수자가 선택하면 학생 노트의 해당 concept anchor에 자동 bookmark 생성. 재설명 시작 시 학생 화면은 "지금 이 지점 재설명 중" 앵커로 자동 이동.

**학생에게**
**익명 "이해 안 됨" 버튼** 상시 제공 (한 손 탭). 누르면 교수자 카운터에 +1, 개인 ID 절대 식별 안 됨 (서버측 hash only). 익명 버튼 외에 개인적 궁금증은 `ai.ask.submit`으로 즉시 AI 답변 (교수자 전체 공개 없음).

**데이터 출처**
- 이벤트: 위 나열
- 실시간: WebSocket `/ws/classroom/{course_id}/live`

**수용 기준**
- 이벤트 → 대시보드 반영 p95 < 3s
- 동시 접속 500명 강의 안정
- 익명성 검증 (개인 ID 리버싱 불가)
- 재설명 CTA 채택률 ≥ 40%
- 재설명 후 이해도 delta +0.15 ~ +0.25 (CI)

---

### Scenario 06. 통학 전철에서도 학습이 끊기지 않는다 — Commute Learning Agent

**페인포인트**
학생: *"편도 1시간 반 통학인데 앱이 두 손을 요구한다. 지하 구간 들어가면 영상이 끊긴다. 결국 휴대폰 만지작거리다 끝난다."*

**감지 → 원인 추정 → 개입**
모바일 + 세로 모드 감지 시 Liner Mode 자동 전환. **Commute Learning Agent** 가:
- 통학 패턴(요일·시간대·자주 여는 위치)을 2주간 학습 → "곧 통학 시간" 예측
- 네트워크 상태(Navigator.connection) + 지하구간 예측 → **네트워크 손실 확률** 사전 계산
- 오늘 과제 · 최근 약점 개념 · 가용 micro content inventory → **"통학 창에 맞춘 학습 패키지"** 자동 편성

**게이트**:
- `predicted_commute_window ≥ 20min`
- `network_loss_probability ≥ 0.35` → pre-fetch trigger
- `available_micro_content ≥ 3`
- `expected_mastery_gain ≥ 0.05`

**학생에게**
- **One-Hand UI** — 모든 액션 버튼이 하단 80% 영역에 배치. 엄지로 전부 조작.
- **Personalized Audio Capsule** — 오늘 학습 자료 + 본인 형광펜 + 최근 약점 개념을 NotebookLM 스타일 대화 스크립트로 개인 생성. TTS + 챕터 북마크. 잠금 화면에서 `わかった / まだ不安` → L3 knowledge state 즉시 갱신.
- **Smart Pre-fetch** — 통학 출발 10분 전 오늘 분량 자동 캐싱.

**교수자에게 (간접 가치)**
콘텐츠 소비 **시간대 히트맵**:
> "내 강의는 화요일 아침 7:30~8:30 통학 시간에 50% 재생" → 강의 길이 / 분할 설계에 활용.

**데이터 출처**
- 이벤트: 기기 메타 (공통 헤더) + `content.video.*` + `learner.session.heartbeat` + `offline.cache.prefetch` + `audio_capsule.play` + `audio_capsule.bookmark`
- 저장: PWA Service Worker 캐시 전략

**수용 기준**
- 네트워크 off 30분 상태에서도 학습 세션 지속
- 엄지 가동 영역 가이드 준수
- Audio Capsule 완청률 ≥ 60%
- 잠금화면 `わかった/まだ不安` 응답률 ≥ 30% (응답 시 L3 갱신)

---

### Scenario 07. 학습 이력이 그대로 취업 ES가 된다 — Evidence-backed Career Narrative Model (Shukatsu Forge)

**페인포인트**
학생: *"가쿠치카(学生時代に力を入れたこと)에 쓸 이야기가 없다. 공부는 열심히 한 건 맞는데 글로 못 옮긴다. 증빙도 없다."*

**감지 → 원인 추정 → 개입**
학기 내내 쌓인 `learning_episode` 중 **"난관 극복 구간"** 을 자동 추출 — 성적 하락 → 개입 → 회복의 연속 세그먼트. 과제·프로젝트·상호평가·자격 배지를 **CLR 2.0 + Open Badges 3.0** 표준으로 누적. 역량 Radar를 각 강좌의 learning objective에 **CASE-aligned competency item**으로 매핑.

**생성 전 Guard (채용 윤리)**
초안 생성 버튼 클릭 시 사전 체크 모달:

```
┌─ 가쿠치카 초안 생성 조건 확인 ──────────────────────┐
│ ✅ 근거 이벤트: 18건 (요건: 3건 이상)               │
│ ✅ 증빙 종류: 4종 — 면담·제출·피어·성적 (요건: 2종 이상) │
│ ✅ 외부 검증 가능: 루브릭 성적 1건 (요건: 1건 이상)  │
│ ✅ 역량 confidence: 0.82 (요건: 0.70 이상)          │
├──────────────────────────────────────────────┤
│ [この条件で生成 / 이 조건으로 생성]                 │
│ [증빙 더 확인 후 생성]                              │
└──────────────────────────────────────────────┘
```

하나라도 미달이면 생성 거부 + 부족한 증빙 리스트 표시.

**학생에게**
커리어 섹션 **"가쿠치카 초안"**. 지망 업계 선택 → **"문제 · 행동 · 결과 3단 구조"** 초안 자동 생성. 일본어 경어 레벨 3종 자동 (**です・ます / である / 敬語**). 업계별 문체 자동 조정 (商社/金融/メーカー技術/コンサル).

```
┌─ 가쿠치카 초안 v2 — 商社営業志望向け ───────────┐
│ 【問題】                                         │
│ 統計学IIで中間62点(下位20%)。確率分布の概念理解が │
│ 原因。                                           │
│                                                  │
│ 【行動】                                         │
│ 2ヶ月間、TA面談12回(毎週1.5時間)に自主参加。     │
│ 課題を全て締切前に提出。AIアシスタントと合計37時間、│
│ 弱点「分散」を反復演習。                          │
│                                                  │
│ 【結果】                                         │
│ 期末89点(上位10%)。同期12名へ勉強法を共有し、     │
│ 平均スコア+8点に寄与(ピア評価ログより)。        │
│                                                  │
│ ─────────────────────────                     │
│ 🔗 全ての根拠が CLR で検証可能:                 │
│   · 面談記録 × 12 (verified by University)      │
│   · 課題提出履歴 (verified by LMS)              │
│   · ピア評価ログ (verified by 3 peers)          │
│                                                  │
│ 📝 文体: です・ます / 敬語レベル: 3 (商社向け)  │
│                                                  │
│ ▼ 他の業界向けに再構成                          │
│ [金融] [メーカー技術] [コンサル]                │
│                                                  │
│ 💬 "この表現は少し強すぎますか?" AIに相談       │
│ ⚠️ "この表現は根拠より強い" AI 경고             │
└──────────────────────────────────────────────┘
```

편집 중 실시간 경고:
- "이 표현은 근거보다 강합니다" (과장 위험)
- "이 주장에 대한 증빙이 없습니다"
- "역량 표현이 약합니다"

**교수자에게 (간접)**
졸업생 CLR 품질이 높아질수록 학과의 **취업 연계 지표**(S16)가 강화 — 입시 홍보·취업처 개척 자료로 활용.

**데이터 출처 · 표준 매핑**
- 테이블: L2 `learning_episode`, L4 `learner_profile`, CLR evidence ledger
- 표준: **CLR 2.0 VerifiablePresentation + Open Badges 3.0 + CASE CFItem (역량 참조)**

**수용 기준**
- 초안 생성 시 evidence 2종·외부 검증 1건·confidence 0.7 guard 100% 동작
- 증빙 1-click 검증 동작 (CLR VC verification)
- 학생 만족도 설문 > 3.8 / 5
- "AI가 과장한 표현 검출" precision ≥ 0.80

---

### Scenario 08. 제미에서 선배의 연구가 사라지지 않는다 — Research Lineage Graph (RLG)

**페인포인트**
제미 학생: *"선배 연구가 졸업과 함께 사라진다. 매년 비슷한 조사를 반복한다. 회의록은 아무도 안 남긴다."*
지도교수: *"제미 지도에 시간은 많이 드는데 아카이빙 체계가 없다."*

**감지 · 처리**
제미 미팅 녹음 → Whisper + Speaker Diarization으로 **Zemi Minutes** 자동 생성 (핵심 논점·다음 과제 추출). 현재 연구 주제 임베딩 vs 과거 제미 산출물 벡터 비교.

**Research Lineage Graph (RLG)**:
- 노드: `research_question · method · dataset · theory · cited_paper · finding · unresolved_issue · competency_alignment`
- 엣지: `extends · contradicts · reuses_dataset · shares_method · cites · supervised_by`

**CASE 매핑은 분리**:
제미 산출물 자체는 RLG에 저장. 관련 연구역량만 CASE-aligned `competency_alignment` 노드로 연결. CLR evidence는 학생 동의 후 발급.

교수·선배 대상 이메일 작성 시 **경어 어시스턴트**가 비즈니스 경어를 검증 (S07 문체 엔진 공유).

**후배 학생에게**
"연구 주제 등록" 시 자동으로:
> "**선행 연구 3건 추천** — 2023년 田中 선배가 동일 개념 노드 3개 · 공통 인용 논문 5편이 겹치는 연구를 했어요."
> "**미해결 질문 이어받기** — 田中 선배가 '설문 n 부족'으로 보류한 가설이 있어요."

액션:
- `先行研究の系譜を見る / 선행 연구 계보 보기`
- `未解決の問いを引き継ぐ / 미해결 질문 이어받기`
- `重複ではなく発展案に変換 / 중복이 아닌 발전안으로 바꾸기`

새 연구 주제 입력 시 **novelty score** 와 **duplication risk** 동시 표시.

**지도교수에게**
제미별 **Research Lineage Graph 시각화** — "이 연구실의 지식 자산 누적 궤적". 신규 주제 제안 시 자동으로 중복 체크. 다음 회의 전날 에이전트가 **토론 안건 초안**을 생성 (지난 미팅 액션 · 최신 arXiv/J-STAGE 관련 논문 포함).

**데이터 출처 · 표준 매핑**
- 별도 테넌트: Zemi 네임스페이스 (코스와 분리)
- 이벤트: Zemi Minutes 업로드 · `forum.thread.create` (제미용) · `case.alignment.propose`
- 저장: RLG (신규) — L5 Content Graph와 별개. CASE aligned competency item만 L5 reference.

**수용 기준**
- 미니츠 핵심 논점 재현율 > 80%
- novelty score · duplication risk 클릭률·유용성 평가 ≥ 3.8/5
- 다음 회의 안건 초안의 교수자 채택률 ≥ 40%

---

### Scenario 09. 채점 일관성을 자기도 모르게 잡는다 — Rubric-Calibrated Grading Copilot

**페인포인트**
교수자: *"오전엔 후하게, 오후엔 짜게 주고 있다는 걸 본인이 모른다. 학생이 부당하게 느껴도 말을 꺼내지 못한다."*
학생: *"왜 내 점수가 이렇게 나왔는지 모른다. 옆 친구는 비슷한 답을 썼는데 나보다 5점 높다."*

**감지 → 원인 추정 → 개입**
- **Rubric criterion classifier**: 답안을 루브릭 항목별로 분해 · 각 항목 스코어 후보 생성.
- **Embedding-based similar answer retrieval**: k-NN 유사 답안.
- **Many-Facet Rasch / IRT**: 채점자 severity drift 추정 (시간대·순서·과제별).
- **Uncertainty-calibrated score interval**: 단일 점수가 아니라 **78±3점** (중심·하한·상한).

채점 세션 시작 전 **anchor answer 5개** 채점 후 calibration. 세션 중 drift가 발생하면 우측 패널 실시간 경고.

**교수자에게**
채점 화면 우측 패널에 xAI 카드:
> "**77~80점 권장** (중심 78). 루브릭 5/6 충족 · 유사 답안 12개 평균 76점 (CI 73~79) · 현재 오전 대비 오후 -9점 drift 진행 중, 재검토 권장. 모델 불확실성: 낮음."

수락/거부 선택. **거부 시 이유 선택 (구조화)**:
- `rubric_exception` (이 답안은 루브릭 예외 상황)
- `creative_answer` (창의적 답변)
- `model_missed_point` (모델이 놓친 핵심)
- `similar_answer_not_relevant` (유사 답안 부적절)

이 피드백이 **anchor set 재학습** 에 입력.

**학생에게 (간접)**
성적 공개 후 **"이 점수는 어떻게 나왔나요?"** 링크 → 루브릭 항목별 평가 내역 + 익명화된 유사 답안 대비 내 위치 투명 공개. 이의 제기 시 Mei-waku Care.

**데이터 출처**
- 이벤트: `instructor.grading.submit`, `instructor.feedback.write`, `model.override`, `model.feedback.label`
- 테이블: L6 `grading_pattern`, 신규 `grading_anchor_set`

**수용 기준**
- 동일 답안 블라인드 재채점 편차 **< 3점**
- Rubric criterion agreement **κ ≥ 0.72** (채점자-모델 간)
- 학생 이의 제기 건수·반영률 공개
- drift 자동 감지 Recall ≥ 0.75

---

### Scenario 10. 장기 이탈 조짐 — Support Policy Simulator (낙인 방지 UX)

**페인포인트**
교수자: *"학기 중반에 무너지는 학생을 나중에 알면 만회할 시간이 없다. 그렇다고 데이터로 '위험 학생' 찍어서 부르는 건 부담이다."*
학생: *"내 행동이 계속 감시당하는 느낌이 싫다. 잘못한 것도 없는데 주시받는 기분."*

**감지 → 원인 추정 → 개입 (4모델 스택)**
- **Risk model**: `P(D_or_lower)` (보조 신호로만 사용)
- **Uplift model (Causal Forest)**: `P(recovery | intervention) - P(recovery | no intervention)` 개입 후보별
- **Fairness audit**: 학과·성별·유학생·장학 상태별 calibration audit
- **Uncertainty model**: sparse data 학생에 대한 예측 보류 (충분 신호 없을 때 "측정 보류")

**교수자 화면 (낙인 방지 UX 강제)**
첫 화면엔 **"이번 주 반 전체에 효과가 큰 지원 3개"**:

```
┌─ 今週のクラス支援 / 이번 주 반 지원 ───────────────────┐
│ 개인명은 숨긴 상태입니다.                                │
│ 먼저 반 전체에 효과가 큰 개입을 봅니다.                   │
├──────────────────────────────────────────────┤
│ 1. 과제 시작 장벽 낮추기                                 │
│    대상 패턴: draft 0건 + 개념 숙달 정체 28명             │
│    expected uplift: 제출 지연 -9~13%p                     │
│    false positive contact regret: 6%                     │
│    [15分スタート枠を送る / 15분 시작 블록 보내기]         │
│                                                            │
│ 2. 신뢰구간 5분 복기                                     │
│    대상 패턴: 선수 개념 '표준오차' 약화 34명              │
│    expected uplift: 재평가 정답률 +8~14%p                 │
│    [次回授業に追加 / 다음 수업에 추가]                    │
│                                                            │
│ 3. Pace Agent (S12) 자동 권유                            │
│    대상 패턴: 로그인 하락 + 과제 지연 12명                │
│    expected uplift: active_ms 회복 +14~22% 2주            │
│    [学生に提案送信 / 학생에게 제안 발송]                  │
├──────────────────────────────────────────────┤
│ [個別支援が必要な学生を見る / 개별 지원 필요 학생 보기]   │
│ 목적 입력 후 열람됩니다 (purpose token 필수).            │
└──────────────────────────────────────────────┘
```

개별 학생 열람 시:
- **예측 점수**보다 **"지원 근거 · 권장 접촉 톤 · 개입 예상 효과 · 오판 가능성"** 표시
- `instructor.data_access` 에 `segment_id · purpose` 기록 · purpose 없으면 401

**학생에게**
- UI에 "위험" 단어 금지
- Omotenashi 3단계 에스컬레이션(S04)으로만 접촉
- Mei-waku Care 링크 상시

**관리자에게**
학과 단위 위험 분포 · 개입 효과 ROC만 공개. 개인 식별 불가능한 집계 레벨.

**데이터 출처 · 표준 매핑**
- 이벤트: 세션 · 과제 · 포럼 · 평가 전반 + `intervention.*` · `consent.grant`
- 감사: `instructor.data_access` (열람 목적 필수)
- CLR: **감시 지표는 CLR 금지.** 학생에게 유리한 회복 evidence만 학생 동의 후 CLR.

**수용 기준** (Recall 단독 금지, **다지표**)
- `risk recall ≥ 0.7` AND `PPV ≥ 0.45`
- `false positive contact regret < 8%`
- `calibration error ≤ 0.05`
- `intervention uplift ≥ +10%p` (cluster RCT)
- 학생 "주시감" 분기별 < 2.5 / 5
- 열람 감사 로그 100% 남음

---

### Scenario 11. Course Co-Creation Studio — AI와 강의자료를 함께 개선한다 (신규)

**한 줄 정의**: 난관 구간(S01) · 오개념 클러스터(S03) · 실시간 흔들림(S05) 데이터를 입력받아, 교수자가 AI와 함께 **대체 설명 스크립트 · 확인 문제 · 슬라이드 초안 · 용어 glossary**를 생성·승인하고 2주 효과를 자동 검증하는 공동 창작 환경.

**페인포인트**
- 교수자: *"어디가 문제인지는 알겠는데, 고칠 시간이 없다."*
- 학생: *"보조 자료가 기존 강의와 말투·범위가 달라 더 헷갈린다."*
- 학과장: *"콘텐츠 개선의 전후 효과가 누적되지 않는다."*

**감지 → 원인 추정 → 개입**

- **입력**: S01 struggle segment · S03 misconception · S05 live confusion · 교수자 기존 자료 · syllabus · rubric · CASE objective · 교수자 Teaching Profile (S15)
- **모델**:
  - RAG over course material (교수자 기존 강의 · 교재 · 논문 · 공식 자료)
  - LLM content generation **제약**: CASE objective alignment · 교수자 style · 용어 일관성 (기존 강의와의 term consistency score)
  - IRT item generation + difficulty calibration
  - Switchback / cluster RCT for efficacy measurement
- **Gate**:
  - `source_coverage ≥ 0.8` (사용된 출처가 교수자 자료 80% 이상)
  - `alignment_to_objective ≥ 0.75` (CASE objective alignment)
  - `hallucination_check = pass` (별도 검증기)
  - `term_consistency_score ≥ 0.85` (기존 강의 용어와 일치)
  - `professor_approval = required` (승인 전 공개 불가)

**교수자에게**

```
┌─ 教材改善案をAIと作成 / AI와 강의자료 개선 ───────────┐
│ 난관: 12:34-12:42, 개념: 신뢰구간                        │
│ 학생 오개념 (S03): 분산과 표준오차 혼동 (68%)             │
│ 기존 강의 유사 설명: content_video_08 3:20~ (재사용 가능) │
│                                                            │
│ AI 생성 후보 (source_coverage 0.82, CASE 정렬 0.89):       │
│   · 5분 설명 스크립트 1개 (비유 중심)                     │
│   · 5분 설명 스크립트 1개 (예제 중심)                     │
│   · 확인문제 3개 (IRT 난이도 0.42 / 0.55 / 0.68)           │
│   · 슬라이드 2장 (용어 glossary 포함)                      │
│   · 용어집: 분산·표준편차·표준오차 구분                    │
├──────────────────────────────────────────────┤
│ [比喩中心で生成 / 비유 중심으로 생성]                     │
│ [数式中心で生成 / 수식 중심으로 생성]                     │
│ [学生向けにやさしく / 학생용으로 쉽게]                    │
│ [この先生の過去の口調で / 이 선생님의 과거 말투로]        │
│ ─────────────────────────                              │
│ ✅ 교수자 Teaching Profile 반영: 공식 제시 전 반례 먼저    │
│ ✅ 용어 일관성: 기존 강의와 0.91                           │
│ ─────────────────────────                              │
│ [プレビュー / 미리보기]                                    │
│ [편집 후 공개 (AB 테스트 활성화)]                         │
│ [2週間後に効果測定 / 2주 후 효과 측정]                    │
└──────────────────────────────────────────────┘
```

**학생에게 (간접)**
교수자가 승인·배포한 자료가 S01 hint pack 으로 자동 연결. 학생 관점에서는 기존 강의와 이어지는 보충 자료로 자연 노출.

**데이터 출처 · 표준 매핑**
- 이벤트: `content.variant.generate · approve · publish · abtest.assign`
- 표준: 생성된 콘텐츠는 CASE CFItem(competency alignment) · CLR(교수자 개선 기여 evidence) · xAPI(학습 경험 기록)

**수용 기준**
- AI 초안이 교수자 최종 공개 자료와 유사도 ≥ 0.7 (편집 부담 낮다는 지표)
- 교수자 편집 시간 평균 < 15분 / 변이
- 공개 후 해당 세그먼트 uplift ≥ +8%p (cluster RCT, 2주)
- hallucination 검증 실패율 < 3%
- 차학기 자료 재사용률 ≥ 40%

**의존성**: S01 (진입점) · S03 (오개념 입력) · S15 Teaching Profile (말투·철학 입력) · 4-Gate Governance (hallucination 검증)

---

### Scenario 12. Learning Companion / Pace Agent — 상주하는 학습 에이전트 (신규)

**한 줄 정의**: 단발 추천이 아닌 학기 내내 학생의 과제·복습·시험 대비를 추적·계획·실행·회수하는 **persistent agent with episodic memory**.

**페인포인트**
- 학생: *"추천은 많은데 뭘 먼저 해야 할지 모르고, 미루면 아무도 회수하지 않는다."*
- 교수자: *"학생에게 계속 리마인드하기 어렵고, 개별 계획을 봐줄 시간이 없다."*
- 학교: *"LMS 접속은 있는데 실제 학습 진전이 보이지 않는다."*

**감지 → 원인 추정 → 개입**

- **신호**: `assignment.due_date` · `assignment.save_draft` · `assessment.response.submit` · `content.video.complete` · 캘린더 가용성 · S02 mastery · S04 deadline behavior · S06 통학 예측
- **모델**:
  - Task graph planner (DAG based on due dates · prerequisites · mastery gaps)
  - Episodic memory (매일 밤 reflection — "어제 이 학생의 학습은?"  "오늘 계획은?")
  - Contextual bandit (nudge timing · tone · channel)
  - LLM tool-calling agent (calendar block · review set · draft checklist 생성)
- **게이트**:
  - `expected_late_probability ≥ 0.35`
  - `available_time_block ≥ 15min`
  - `expected_mastery_gain_per_min ≥ 0.02`
  - `student_opt_in = true`

**학생에게**

```
┌─ 今日のAI学習プラン / 오늘의 AI 학습 계획 ─────────────┐
│ おはようございます 🌸                                     │
│                                                            │
│ 18:40-18:55  統計学: 信頼区間 3問だけ                    │
│ 근거: 어제 오답 2개, 시험 D-9, 통학 예상 22분             │
│ 예상 효과: 시험 시점 숙달 +6~9%p                          │
│                                                            │
│ 21:00-21:10  課題「経済学レポート」 書き出し             │
│ 근거: 마감 D-2 · 현재 draft 0건 · 시작 장벽 높음           │
│ 예상 효과: 마감 내 제출 확률 +18%p                        │
│                                                            │
│ ✨ あなたの昨夜の振り返り (AIが整理)                      │
│  · 昨日「分散」で3回止まったね、今日の朝 5分復習準備       │
│  · 明後日の提出物は書き出しが一番大変そう                 │
├──────────────────────────────────────────────┤
│ [このまま始める / 이대로 시작]                           │
│ [5分に短くする / 5분으로 줄이기]                          │
│ [今日は無理 / 오늘은 어려움]                              │
└──────────────────────────────────────────────┘
```

학생이 실행하지 않으면:
- 6시간 뒤 **더 작은 행동 단위**로 쪼개 재제안
- 48시간 미응답 시 학생 동의 기반으로 TA/교수자 지원 권유

**교수자에게**

`支援が必要な計画だけ見る / 지원 필요한 계획만 보기` — 학생이 명시적으로 "도움 요청" 한 건만 (개인정보 접근 감사 로그 자동 기록).
`クラス共通の遅延要因を見る / 반 공통 지연 요인 보기` — 개인명 없이 반 전체 패턴만.

**데이터 출처**
- 이벤트: `agent.plan.create · tool.execute · plan.revise` (신규)
- 테이블: 신규 `pace_agent_memory` (학생별 episodic memory · 매일 갱신), `pace_agent_policy` (bandit state)

**수용 기준**
- Opt-in 학생의 plan 실행률 ≥ 45%
- "AI가 내 계획을 이해한다" 주관 평가 ≥ 3.8/5
- 48h 미응답 후 TA/교수 권유 채택률 ≥ 30%
- Opt-out 24h 내 가능률 100% (학생 권리)

---

### Scenario 13. Counterfactual Intervention Simulator — "이 개입을 하면 성적이 바뀌는가" (신규)

**한 줄 정의**: 교수자가 강의 개입을 선택하기 전에, 유사 학기·유사 학생·유사 개념 데이터를 바탕으로 **expected impact + uncertainty interval + overlap score**를 보여준다.

**페인포인트**
- 교수자: *"5분 복기, 추가 퀴즈, 보조 영상 중 뭘 해야 실제로 효과가 있는지 모른다."*
- 학과장: *"콘텐츠 개선 예산을 어디에 써야 할지 근거가 약하다."*
- NetLearning (발표 관점): *"AI LMS의 차별성은 예측보다 **개입 효과 증명**에 있다."*

**감지 → 원인 추정 → 개입**

- **입력**: S01 segment · S02 mastery · S05 live quiz · S10 intervention outcomes · 교수자 action log · 과거 다학기 데이터
- **모델**:
  - Causal DAG (prerequisite · content exposure · prior ability · intervention · outcome)
  - Doubly robust estimation
  - Causal forest / uplift modeling
  - Propensity overlap check
- **게이트**:
  - `overlap_score ≥ 0.6`
  - `n_similar_cases ≥ 30`
  - `effect_ci_width ≤ 0.18`
  - 조건 미달 시 **"효과 추정 불가"** 로 표시 (fake precision 금지)

**교수자에게**

```
┌─ 介入効果シミュレーション / 개입 효과 시뮬레이션 ─────┐
│ 개념: 신뢰구간, 대상: 2학년 통계학 II                     │
│                                                            │
│ 후보 A: 다음 강의 5분 복기                                │
│   예상 재평가 정답률 +8~14%p, overlap 0.74                │
│   유사 강좌 23건 기준                                      │
│   추천 (uplift CI 양호)                                    │
│                                                            │
│ 후보 B: 5분 보조 영상 생성·배포 (S11)                     │
│   예상 재시청률 -12~22%, overlap 0.71                     │
│   학습효과 근거 중간 (n=12, CI 넓음)                       │
│                                                            │
│ 후보 C: 퀴즈 3문항                                         │
│   예상 정답률 +5~9%p, 부담 증가 낮음                       │
│                                                            │
│ 후보 D: 과제 마감을 금→월로 이동                          │
│   ⚠ 효과 추정 불가 (유사 사례 n=14, overlap 0.45)         │
├──────────────────────────────────────────────┤
│ [5分復習を授業計画に追加 / 5분 복기 강의계획 추가]        │
│ [2週間後に効果検証 / 2주 후 효과 검증]                    │
│ [What-if: 過去の別授業でこの介入を適用したら]             │
└──────────────────────────────────────────────┘
```

**학과장·관리자에게**
"만약 '확률론'을 주차 3 → 주차 1로 앞당기면?" 같은 과정 레벨 시뮬레이션:
> "통계학 II 중간 정답률 +6.2% (CI 3.1~9.8%, overlap 0.68, 유사 학과 7건)"

**데이터 출처**
- 이벤트: `experiment.intervention.apply`, `experiment.outcome.measure` (신규)
- 테이블: 신규 `causal_graph_snapshot`, `intervention_effect_estimate`

**수용 기준**
- `effect_ci_width` 평균 ≤ 0.18 (충분한 추정 정밀도)
- 추정 vs 실측 MAE ≤ 0.05 (calibration)
- "효과 추정 불가" 비율 공개 (과추정 회피 증명)
- 교수자 "이 시뮬레이터가 의사결정에 도움됐다" 평가 ≥ 3.8/5

**주의**: 이 시나리오는 **다학기 다학과 데이터**가 필요하다. MVP에서는 **"발표 데모용 시뮬레이션 모드"** + P3 이후 정식 가동.

---

### Scenario 14. Real-time Adaptive Path — 응답 1건마다 경로가 바뀐다 (신규)

**한 줄 정의**: 퀴즈 한 문항을 풀 때마다 다음 문항·힌트·설명 방식·난이도를 즉시 재계산하는 **response-level adaptation**.

**페인포인트**
- 학생: *"추천 복습은 있는데 지금 내가 틀린 이유에 맞는 다음 문제가 아니다."*
- 교수자: *"개인화가 있다고 하지만 결국 같은 문제 세트를 풀린다."*
- (청중): *"진짜 AI라면 response-level adaptation을 보여줘야 한다."*

**감지 → 원인 추정 → 개입**

- **입력**: `assessment.response.submit` (response, time_ms, changes, hint_used) · `learner.self_report.confidence` (잘 안다 / 애매하다 / 찍었다) · L5 concept prerequisites · item metadata (difficulty, discrimination, misconception tag)
- **모델**:
  - IRT 2PL/3PL for item parameters
  - Online BKT/DKT for concept mastery
  - RL/bandit policy for next best item
  - LLM hint generator constrained by misconception tag
- **게이트**:
  - `P(misconception_x) ≥ 0.55` → targeted hint
  - `mastery_uncertainty ≥ 0.20` → diagnostic item 우선
  - `frustration_proxy ≥ 0.65` → 난이도 하향 + 설명형 문항

**학생 화면 (문항 제출 직후)**

```
┌─ 次の1問をAIが調整しました / 다음 1문항을 조정했습니다 ─┐
│ 방금 오답은 계산 실수보다                                 │
│ '표준오차' 개념 혼동 가능성이 큽니다.                      │
│                                                            │
│ 다음 문제는 난이도를 낮추고,                               │
│ 표준오차만 분리해서 확인합니다.                            │
│                                                            │
│ 📊 현재 숙달도: 0.47 (±0.12)                              │
├──────────────────────────────────────────────┤
│ [次の問題へ / 다음 문제]                                   │
│ [先に30秒説明 / 먼저 30초 설명]                            │
│ [難しすぎる / 너무 어려움]                                 │
│ [自分で次の問題を選ぶ / 직접 다음 문제 선택]               │
└──────────────────────────────────────────────┘
```

완료 후: CLR/competency evidence 업데이트.

**교수자에게 (사후)**
학생별 path 시각화 (익명 집계) — "이 반 학생 평균 Path 진입율, 분기율, 탈출율" · 아이템 풀 차지 · 자주 발생한 misconception 순위.

**데이터 출처**
- 이벤트: `assessment.response.submit`, `assessment.item.hint_used`, `learner.self_report.confidence`
- 테이블: L3 `concept_mastery`, 신규 `adaptive_path_session`

**수용 기준**
- 동일 난이도에서 전통적 선형 퀴즈 대비 **mastery gain +15%p** (cluster RCT)
- 학생 "다음 문제가 내 상황에 맞다" 평가 ≥ 3.8/5
- 평균 세션 시간 **감소** (효율 증가)
- misconception 추정 F1 ≥ 0.70

---

### Scenario 15. Instructor-AI Teaching Profile — 교수법 철학이 AI 출력을 지배한다 (신규)

**한 줄 정의**: 교수자 프로필에 **"교수법 철학 선언"** + **"과거 강의 말투 샘플"** 을 등록하면, 그 교수의 학생을 향한 모든 AI 출력이 해당 스타일·철학을 반영한다.

**페인포인트**
- 교수자: *"AI가 내 학생한테 내가 싫어하는 방식으로 설명하면 반대 효과다."*
- 학생: *"AI 설명과 교수님 강의 톤이 달라서 오히려 헷갈린다."*
- 학과: *"교수마다 다른 교수법을 AI가 덮어버린다."*

**감지 → 원인 추정 → 개입**

- **입력**:
  - 교수자 선언 (자유 텍스트): *"나는 '암기보다 유도'를 중시한다. 공식 제시 전에 반드시 2개의 반례를 먼저 보여준다. 어려운 개념일수록 역사적 맥락을 먼저 설명한다."*
  - 교수자 과거 강의 자막 · 피드백 작성 이력 · 자료 선호
- **모델**:
  - LLM system prompt에 Teaching Profile 주입
  - 스타일 임베딩 (term preference · explanation order · tone level)
  - 한 학기 학생 반응으로 **선언 자체의 효과** 측정 (선언 준수 시 vs 미준수 시 학생 mastery gain)

**교수자에게**

```
┌─ Teaching Profile 설정 ────────────────────────────────┐
│ 교수법 철학 선언:                                         │
│ [암기보다 유도를 중시. 공식 제시 전 반례 2개 먼저. ...]   │
│                                                            │
│ 말투 샘플 (10개 강의 자막 자동 분석):                     │
│   · 평균 문장 길이: 18 단어                               │
│   · 경어 레벨: 2 (です・ます 기본)                        │
│   · 선호 용어: 「具体的には」 「つまり」                   │
│   · 회피 용어: 「簡単ですね」                             │
│                                                            │
│ 이 Profile이 적용되는 곳:                                 │
│   · S01 학생 hint pack                                    │
│   · S02 학생 복습 카드                                    │
│   · S11 Co-Creation Studio 생성물                         │
│   · S12 Learning Companion Agent 응답                     │
│                                                            │
│ 효과 측정 (지난 한 학기):                                 │
│   · 선언 준수 시 학생 mastery gain +2.3%p                 │
│   · 학생 "선생님 같은 말투" 평가: 4.1 / 5                  │
├──────────────────────────────────────────────┤
│ [選言を編集 / 선언 편집]                                   │
│ [口調サンプルを再分析 / 말투 샘플 재분석]                 │
│ [ONにして学生向け出力に反映 / 학생 출력에 반영 ON]        │
└──────────────────────────────────────────────┘
```

**학생에게 (간접)**
학생 UI는 변화 없음. 단, AI 응답의 용어 선택·설명 순서·톤이 교수자별로 달라짐. 학생은 인지하지 못해도 "내 교수님 같다"는 친숙함을 느낌.

**데이터 출처**
- 이벤트: `teaching_profile.declare`, `teaching_profile.update`, `ai.output.profile_applied`
- 테이블: 신규 `instructor_teaching_profile`, `teaching_profile_effect`

**수용 기준**
- 선언 ON 상태 학생의 AI 응답 친숙도 평가 ≥ 3.8/5
- 선언 준수 율 측정 (LLM eval Rubric) ≥ 0.80
- 선언 효과 측정 공개 (효과 없을 시 교수자에게 수정 제안)

---

### 확장 예정 시나리오 (상세화 대기)

각 Phase 진입 시점에 위 포맷으로 풀 스펙을 작성한다. 지금은 핵심 한 줄씩만.

| # | 시나리오 | 페인포인트 한 줄 | 주 입력 | 주 출력 | 우선 단계 |
|---|---|---|---|---|---|
| S16 | 학과 역량 그래프와 취업 연계 | "우리 학과 졸업생이 뭘 할 수 있는 사람들인지 모른다" | CLR 누적 + 역량 Radar | 학과장 리포트 + 취업처 시각화 | P3 |
| S17 | 개인화 시험 대비 예상 문제 | "뭘 공부해야 시험에 나올지 감이 없다" | 과거 시험 · 교수 키워드 · 약점 | 학생별 예상 문제 + 출제 확률 | P2 |
| S18 | 동료 학습 매칭 | "혼자 공부가 지친다. 스터디 파트너가 보완되면" | 보완 지식 상태 + 가용성 | 파트너 추천 · 시간 교차 | P2 |
| S19 | 자동 학습 노트 생성 | "강의마다 요약 정리 시간이 과하다" | 자막 + 형광펜 + 약점 | 개인화 노트 (PDF/Markdown) | P2 |
| S20 | 콘텐츠 효과성 ROI | "내 영상 vs PDF 중 효과 좋은 쪽이 뭔지" | 참여 + 사후 평가 변화 | 콘텐츠별 ROI 매트릭스 | P3 |
| S21 | 강의자료 개선 제안 | "어느 부분 고치면 좋을지" | 학내 우수 자료 비교 + 이탈 구간 | 슬라이드별 개선 포인트 | P3 |
| S22 | 자원 배분 최적화 | "TA·강의실 배정 주먹구구" | 이수·난이도·질문량 | 배치 제안 | P3 |
| S23 | 자퇴·휴학 선행 지표 | "조기 경고보다 더 이른 신호" | 다학기 누적 | 학과 지원팀 알림 | P4 |

**R&D 로드맵 (MVP·파일럿 범위 밖, P3+)**
- **Ambient AI 이어피스** — 실시간 강의 교수자 귀 속삭임. 개인정보·하드웨어·시연 리스크로 P3 이후 연구개발.
- **Multimodal Problem-Solving Coach** — 필기·수식·코드 실시간 인식. STEM 학과 확장 옵션.
- **Institutional Curriculum Optimizer** — 다학기 Causal graph 기반 커리큘럼 자가진화. 학교 레벨 상품.

---

## 3. 공통 자산 (References)

시나리오가 참조하는 공통 인프라. 시나리오 설계 시 이 섹션의 이벤트명·테이블명을 그대로 인용한다.

### 3-1. 이벤트 카탈로그 (확장)

**공통 헤더**

```json
{
  "event_id": "uuid",
  "event_name": "content.video.play",
  "timestamp": "ISO8601 (ms)",
  "actor": { "user_id": "uuid", "role": "learner|instructor|admin" },
  "context": {
    "session_id": "uuid",
    "tenant_id": "string",
    "course_id": "uuid",
    "content_id": "uuid or null",
    "device": { "type": "web|mobile|tablet", "os": "string", "ua": "string" },
    "purpose": "string | null",     // 개인 데이터 접근 시 필수
    "model_version": "string | null" // AI 생성 이벤트
  },
  "payload": { /* 이벤트별 */ },
  "xapi_profile_id": "edulms.ai-x.v1 | null",
  "caliper_profile": "string | null",
  "internal_only": true | false
}
```

**수집 원칙**:
- 모든 학습 관련 이벤트는 **SDK 경유**로 수집.
- 교환 가치가 있는 이벤트는 **xAPI/Caliper 프로파일로 변환**.
- 운영·AI 감사 이벤트는 **internal audit schema**에 별도 보존. `internal_only: true` 플래그로 구분.

**엔드포인트**:
- `POST /events/ingest` (통합 SDK 수집 endpoint)
- `POST /xapi/statements` (xAPI 1.0.3 호환 변환기)
- `POST /caliper/events` (Caliper Analytics 호환 변환기)
- `POST /audit/events` (internal audit)

**거부 조건**: 인증 실패 · 스키마 미스매치 · rate limit(유저당 500/min) 초과.

**핵심 이벤트 (학습 행동)**

| 이벤트명 | 트리거 | 주요 payload | 저장소 | 유지 | 프로파일 |
|---|---|---|---|---|---|
| `learner.session.start` | 로그인 후 첫 렌더 | entry_url | L1 | 13개월 | xAPI |
| `learner.session.heartbeat` | 활성 30초마다 | active_seconds, focused | L1 | 3개월 | Caliper |
| `ui.page.view` | SPA route change | path, referrer | L1 | 6개월 | Caliper |
| `ui.search.query` | 내부 검색 | query, result_count | L1 | 13개월 | internal |
| `content.video.play/pause/seek/rate_change/complete` | video events | content_id, position_s | L1 | 13개월 | xAPI |
| `content.doc.page_view` | 문서 페이지 진입 | page_no, view_ms | L1 | 13개월 | xAPI |
| `content.doc.highlight` | 드래그+저장 | page_no, text, color | L2 | 졸업+1년 | Caliper |
| `content.note.create` | 인라인 노트 저장 | anchor, text | L2 | 졸업+1년 | xAPI |
| `content.scroll.depth` | 5% 단위 진입 | max_depth_pct | L1 | 6개월 | Caliper |
| `assessment.attempt.start/submit` | 퀴즈 start/end | assessment_id, score | L1 | 졸업+1년 | xAPI |
| `assessment.response.submit` | 문항 제출 | item_id, response, time_ms, changes, hint_used | L1 | 졸업+1년 | xAPI |
| `ai.ask.submit` | AI 패널 질의 | query, context_anchor | L1 | 13개월 | xAPI |
| `ai.response.delivered` | AI 응답 완료 | response_id, sources[], confidence | L1 | 13개월 | internal |
| `ai.card.feedback` | 카드 👍/👎 | card_id, polarity, note | L1 | 13개월 | internal |
| `assignment.save_draft` | 과제 임시저장 | assignment_id, len | L1 | 6개월 | Caliper |
| `assignment.submit` | 과제 제출 | assignment_id, late_h | L1 | 졸업+1년 | xAPI |
| `forum.thread.create` / `forum.reply.create` | 포럼 | thread_id, tags | L1 | 졸업+1년 | xAPI |
| `peer.review.submit` | 상호평가 | target_user_id, scores | L1 | 졸업+1년 | xAPI |
| `instructor.grading.submit` | 채점 확정 | submission_id, score, time_ms | L1 | 졸업+1년 | Caliper |
| `instructor.feedback.write` | 피드백 저장 | submission_id, text_len, tone | L1 | 졸업+1년 | internal |
| `instructor.content.publish` | 강의자료 게시 | content_id, version | L1 | 무기한 | xAPI |
| `instructor.data_access` | 학생 개인 데이터 열람 | target_user_id, purpose | audit_log | 5년 | internal |

**핵심 이벤트 (AI·개입·거버넌스 — v2 신규)**

| 카테고리 | 이벤트명 | 목적 | 프로파일 |
|---|---|---|---|
| 동의·권리 | `consent.grant / revoke` · `data.export.request / delete.request` | APPI · 학생 신뢰 | internal |
| AI 노출 | `ai.card.impression` · `ai.explanation.expand` · `ai.recommendation.dismiss` | 추천 denominator | Caliper |
| 개입 | `intervention.offer / accept / complete / snooze` | uplift/causal 학습 | xAPI |
| 에이전트 | `agent.plan.create / tool.execute / plan.revise` | agentic 감사 | internal |
| 콘텐츠 생성 | `content.variant.generate / approve / publish / abtest.assign` | co-creation 효과 | xAPI |
| 모델 감사 | `model.prediction.emit / override / feedback.label / version.deploy` | 재현성·책임성 | internal |
| 표준 매핑 | `case.alignment.propose / approve` · `clr.evidence.issue` | 표준 거버넌스 | Caliper |
| 오프라인 | `offline.cache.prefetch` · `audio_capsule.play / bookmark` | S06 실효성 | xAPI |
| 정서·인지부하 | `learner.self_report.confidence / load` | 적응형 난이도 | xAPI |
| 접근성 | `accessibility.caption.enable` · `screenreader.use` · `font_size.change` | 도입 품질 | Caliper |
| 실험 | `experiment.intervention.apply / outcome.measure` | causal estimation | internal |
| 거버넌스 | `governance.gate.pass / fail` · `governance.review.log` | 4-Gate audit | internal |
| 추론 결과 | `inference.knowledge_state.update` · `inference.risk_flag.raise` | DKT·위험 업데이트 | internal |

### 3-2. 데이터 레이어

| Layer | 기술 | 역할 |
|---|---|---|
| L1 Raw Event | ClickHouse 또는 BigQuery | 원시 이벤트 시계열 |
| L2 Aggregated | PostgreSQL | 학습 에피소드·참여 강도·학습 리듬·마감 행동 |
| L3 Knowledge State | PostgreSQL + Redis | 개념 숙달 posterior·망각·선수 의존·메타인지 |
| L4 Learner Profile | PostgreSQL | 장기 학습 스타일·인지 부하·끈기 지표 |
| L5 Content Knowledge Graph | Neo4j 또는 pgvector | 개념 노드·선후 관계·평가 매핑 + **CASE alignment schema** |
| L6 Instructor Behavior | PostgreSQL | 채점 패턴·피드백 스타일·콘텐츠 편집 이력 · Teaching Profile (S15) |
| L7 Research Lineage | Neo4j | 제미 RLG (S08) — L5와 별개 |
| L8 Evidence Ledger | PostgreSQL | CLR VC + Open Badges (서명·검증) |
| Audit | Append-only Postgres partition | 4-Gate governance · AI prediction · model override · purpose access |

**주요 테이블**

- L2: `learning_episode`, `engagement_intensity_daily`, `rhythm_profile`, `deadline_behavior`, `segment_struggle_prediction` (S01), `intervention_candidate`, `intervention_outcome`, `knowledge_debt_graph` (S03)
- L3: `concept_mastery`, `concept_forgetting`, `concept_dependency_hit`, `meta_cognition_calibration`
- L4: `learner_profile`, `pace_agent_memory` (S12)
- L5: `concept_node`, `concept_edge`, `concept_case_alignment` (신규 — §3-7 참조)
- L6: `grading_pattern`, `feedback_style`, `content_edit_history`, `grading_anchor_set` (S09), `instructor_teaching_profile` (S15)
- L7: `research_lineage_node`, `research_lineage_edge`, `zemi_minutes`
- L8: `clr_evidence`, `open_badges_assertion`, `vc_proof`

### 3-3. xAI 카드 컴포넌트 표준 (5요소)

모든 AI 출력은 동일 컴포넌트로 렌더링한다. **v2 변경: 4요소 → 5요소 (modelVersion · uncertainty · actionPlan 필수)**.

```tsx
<XaiCard
  kind="insight | recommendation | answer | alert |
        intervention | cocreation | diagnostic"
  tone="neutral | gentle"           // gentle = Omotenashi 모드 (학생 UI 기본)
  title="약점 개념 발견"
  body="통계학 III '신뢰구간' 숙달 0.32 (CI 0.24~0.40)"

  // 1. Evidence (근거)
  evidence={[
    { type: "event", ref: "assessment.response.submit/..." },
    { type: "aggregate", ref: "concept_mastery/user/stat-03" },
  ]}

  // 2. Model Version (모델 버전)
  modelVersion={{ name: "segment_struggle_model", version: "0.9.3", method: "bayesian_changepoint+transformer" }}

  // 3. Uncertainty (불확실성)
  uncertainty={{
    kind: "interval",       // "interval" | "posterior" | "class_probabilities"
    low: 0.24, high: 0.40,
    method: "bkt_posterior_95pct",
    calibrationError: 0.04
  }}

  // 4. Recommended Actions (권장 행동) — 각 후보에 expected effect 필수
  actions={[
    {
      label: "표준편차 5분 복습",
      labelJa: "標準偏差を5分復習",
      dispatch: "scenario/adaptive_review",
      expectedEffect: { metric: "retention_at_exam", low: 0.68, high: 0.76 },
      similarCaseCount: 42,
      propensityOverlap: 0.71,
    },
  ]}

  // 5. Action Plan (효과 측정 계획)
  actionPlan={{
    reevaluateAt: "2026-05-08",
    measurementPlan: "cluster_rct_section_x_content_2weeks",
    primaryOutcome: "reassessment_correct_rate",
  }}

  comparison={{ cohort: "동일 코스 수강생", delta: -0.18 }}
  feedback={{ onThumbs }}
  meiwaku={{ onReport }}            // 이의 제기 링크 상시
  dialogue={{ onVoice, onText }}    // AI 반박 음성/텍스트 인터랙션 (v2 신규)
/>
```

**CI 검증 규칙 (4-Gate Governance Gate 1)**
- `evidence.length === 0` → 빌드 실패
- `modelVersion` 누락 → 빌드 실패 (v2)
- `uncertainty` 누락 → 빌드 실패 (v2)
- `actions` 비었으면 → `kind === "insight"` 또는 `"diagnostic"` 만 허용
- `actionPlan` 누락 + `kind === "recommendation" | "intervention"` → 빌드 실패 (v2)
- 학생 role 컨텍스트에서 `tone="neutral"` → 빌드 경고

### 3-4. 3단 UX 구조

**데스크탑 (≥1280px)**
```
┌────────┬──────────────────────┬────────────┐
│  SNB   │      CONTENT         │  AI PANEL  │
│ 240px  │        1fr           │   360px    │
└────────┴──────────────────────┴────────────┘
```

**태블릿 (768~1279)**: SNB 64px 아이콘 모드 / AI PANEL 오버레이.
**모바일 (<768px) = Liner Mode**: SNB 햄버거 / CONTENT 풀스크린 / AI PANEL 플로팅 버튼 + 바텀시트.

**AI 패널 탭**: `Ask` · `Insight` · `Plan` · `Reflect` · `Companion` (v2 신규 — S12 Pace Agent 진입).

### 3-5. Standards Stack — "We compose, not replace"

> **프레젠에 올릴 1페이지 슬라이드**. AI-X Platform 은 어떤 단일 표준도 대체하지 않는다. 기존 표준들을 **목적별로 정확히 배치**한다.

| 레이어 | 표준/스키마 | AI-X 역할 | 적용 시나리오 | 가드레일 |
|---|---|---|---|---|
| **학사·수강** | **OneRoster 1.2** · (옵션 **Ed-Fi**) · **EDU-API** | 사용자·강좌·등록·역할 동기화 | 전체 | xAPI로 roster를 대체 금지 |
| **도구 연결** | **LTI Advantage** (Deep Linking / AGS / NRPS) | NetLearning/manaba 내 AI-X 기능 launch | 전체 | LTI 1.3 미만 레거시는 SAML+CSV 폴백 |
| **학습 이벤트** | **Caliper Analytics** + **xAPI Profile (`edulms.ai-x.v1`)** | 교환 가치 있는 학습 경험 | S01~S10 | internal event와 분리 |
| **내부 감사** | internal audit schema | AI 호출·모델 버전·권한·purpose | S01, S10, S11 | LRS에 억지 저장 금지 |
| **역량 정렬** | **CASE** (CFItem · CFAssociation) | local concept ↔ 공식 역량 | S02, S07, S08, S11 | `exact/close/broad/narrowMatch` 구분 |
| **성취 증명** | **CLR 2.0** + **Open Badges 3.0** + W3C VC | 학생에게 유리한 검증 가능 evidence | S07 중심 + S01·S02·S03·S05·S08·S09 evidence | **감시 지표는 CLR 금지** |
| **개인정보** | **APPI** + 동의 관리 (consent events) | 동의·열람·삭제·목적 제한 | 전체 | 기본 최소 수집 |
| **확장** | MEXT 교과 표준 × CASE 매핑 | **OneEdutechKorea 공동 제안 주도** | 장기 | 일본 교육 데이터 표준 생태계 기여 |

**발표용 문장**:
> "AI-X는 xAPI 하나로 모든 표준을 대체하지 않습니다. OneRoster와 EDU-API는 운영 데이터를, LTI Advantage는 도구 연결을, Caliper와 xAPI는 학습 이벤트를, CASE는 역량 식별자를, CLR은 검증 가능한 학습 성과를 담당합니다. 우리는 **표준을 결합**(compose)합니다, 대체하지 않습니다."

### 3-6. 시스템 아키텍처

```
[Client: Web/Mobile]
     │ (TS Event SDK)
     ▼
[Event Gateway]  ── schema / rate limit / auth / purpose check
     │
     ▼
[Kafka: events.raw]
     │
     ├──► Stream processor  →  L3 online BKT/IRT · S05 Live Understanding State
     └──► Airflow nightly   →  L2/L4/L6/L7 집계 + DKT 재학습 + uplift 재학습
     │
     ▼
[Standards Adapters]
     ├──► xAPI/LRS adapter (edulms.ai-x.v1 profile)
     ├──► Caliper adapter
     ├──► CLR issuer (W3C VC + Open Badges 3.0 signing)
     └──► CASE alignment proposer

Storage
 L1: ClickHouse
 L2/3/4/6: PostgreSQL + Redis
 L5/L7: Neo4j + pgvector
 L8 Evidence Ledger: PostgreSQL (partitioned, append-only)
 Audit: partitioned Postgres
 ML Registry: MLflow
 LLM: Azure OpenAI Japan East (1차) / Bedrock Tokyo (fallback)

[API Gateway] (gRPC 내부 / REST 외부)
 ├─ LMS Core (GROWA)
 ├─ LRS (Lecognizer) — xAPI Statements (edulms profile)
 ├─ Inference Service (BKT/IRT · segment_struggle · uplift · causal forest)
 ├─ xAI Service — 5요소 카드 조립
 ├─ LLM Orchestrator — RAG + Co-Creation constraints (S11)
 ├─ Agent Runtime — Pace Agent (S12) · Research Copilot (S08)
 ├─ Governance Service — 4-Gate pipeline
 └─ Evidence Issuer — CLR VC 서명 / Open Badges
```

**배포**: 일본 리전(AWS Tokyo 또는 GCP asia-northeast1), 학교 단위 테넌트 격리 (DB schema).
**관측**: OpenTelemetry + Grafana + Sentry. 모델 예측 audit trail 별도.

### 3-7. 일본 특화 스키마 (신규)

학사·경어·문화 구조를 코드 레벨의 1급 시민으로 지원.

```sql
-- 학사 구조
academic_term (
  term_id           uuid PK,
  institution_id    uuid,
  kind              text,  -- '前期' | '後期' | '通年' | '集中講義' | '卒論ゼミ'
  start_date, end_date date
)

course (
  course_id         uuid PK,
  term_kind         text references academic_term.kind,
  cadence           text,  -- 'weekly' | 'intensive_block' | 'continuous'
  rishu_deadline    date,  -- 履修登録 마감
  ...
)

-- 경어·문체
style_preset (
  style_id          uuid PK,
  keigo_level       smallint,  -- 1: です・ます / 2: である / 3: 敬語
  industry_target   text,      -- '商社' | '金融' | 'メーカー技術' | 'コンサル' | null
  tone              text,      -- 'Honne' | 'Tatemae' | 'neutral'
  avoided_terms     text[],
  preferred_terms   text[]
)

-- CASE alignment (L5 내부)
concept_case_alignment (
  local_concept_id  uuid references concept_node.concept_id,
  case_framework_uri text,
  case_item_uri     text,
  association_type  text,  -- 'exactMatch' | 'closeMatch' | 'broadMatch' | 'narrowMatch' | 'prerequisiteOf' | 'assessedBy' | 'taughtBy'
  alignment_confidence float,
  approved_by       uuid,
  approved_at       timestamp,
  version           text
)
```

---

## 4. 거버넌스

### 4-A. APPI 체크리스트 (유지 + v2 강화)

| 요구 | 구현 |
|---|---|
| 목적 명시·최소 수집 | 이벤트마다 `purpose` 태그, 런타임 중단 스위치 |
| 학습자 열람·삭제권 | `GET /me/data`, `POST /me/data/delete` (30일 내 완전 삭제) + `consent.grant/revoke` 이벤트 |
| 교수자 접근 로그 | `instructor.data_access` purpose 필수, purpose 없으면 401. **서버·클라이언트·컴포넌트 3중 강제** |
| AI 결정 감사 | `inference.*` · `model.*` · `agent.*` 전수 보존 2년, 모델 버전으로 재현 가능 |
| 데이터 주권 | 일본 리전 저장, 국외 이전 시 학교별 동의 필수 |
| 동의 관리 | 기능별 opt-in, 기본은 최소 세트. **v2: 선배 데이터 공개 기본 off** |
| Mei-waku 권리 | 모든 AI 판단에 이의 제기 링크 상시 보장, 24h 내 재학습 반영 |

### 4-B. CLR 시나리오 매핑 (신규)

CLR은 **S07 전용이 아니라 전 시나리오의 결과물**이다. 단, **"감시 지표"는 CLR 금지**. 학생에게 유리한 검증 가능 성취만 학생 동의 후 발급.

| 시나리오 | CLR Evidence Type | 발급 조건 | 서명자 |
|---|---|---|---|
| S01 | `LearningAchievementEvidence` | 난관 구간 극복 → 재평가 +15%p 이상 | 과목 · 교수자 |
| S02 | `CompetencyEvidence` | 복습 완료 후 개념 숙달 0.8 이상 3회 연속 | 과목 |
| S03 | `CollaborationEvidence` | 표준 답변 기여 채택 · 동료 질문 해결 인정 | 수업 · 동료 |
| S05 | `AssessmentEvidence` | 실시간 퀴즈 누적 성과 | 과목 |
| S07 | `VerifiablePresentation` | 가쿠치카 narrative + guard 통과 | 학생 본인 서명 + 기관 서명 |
| S08 | `ResearchContributionEvidence` | 제미 연구 기여 · 발표 · 미팅 액션 완료 | 지도교수 · 제미 |
| S09 | `RubricCriterionEvidence` | 루브릭 기반 과제 성취 | 과목 · 교수자 |
| S10 | **내부 evidence only** | 지원 후 회복 → **학생 동의 시에만** 외부 CLR export | 학생 본인 서명 |
| S11 | (교수자) `InstructionalImprovementContribution` | Co-Creation 자료 배포 + 2주 uplift ≥ +8%p | 학과 · 교수자 자기 발급 |

### 4-C. 4-Gate Governance Pipeline (신규)

모든 AI 출력은 다음 4 게이트를 통과해야 배포된다.

1. **Gate 1 — Build CI (빌드 시)**
   - evidence 0 / modelVersion 누락 / uncertainty 누락 / actionPlan 누락 (recommendation·intervention 카드) → **빌드 실패**
   - Storybook 스냅샷 100% 필수
2. **Gate 2 — Runtime 검증 (요청 단위)**
   - calibration error > threshold → 카드 표출 자동 억제 + Sentry
   - propensity overlap < 0.6 → "효과 추정 불가" 라벨
   - hallucination classifier (Co-Creation 생성물) → 실패 시 교수자 검토 필수
3. **Gate 3 — 월간 Bias/Drift 리뷰 위원회**
   - 외부 멤버 1인 포함 (권장: 조용상 교수 · 독립 ML ethicist)
   - 민감 변수별 calibration audit · drift 검출 · Mei-waku 통계
   - 통과 실패 시 해당 모델·카드 차단
4. **Gate 4 — Mei-waku 피드백 재학습 루프**
   - 이의 제기 이벤트 `ai.card.feedback` polarity=down + reason
   - 24h 내 해당 세그먼트·학생 exclusion
   - 주간 재학습 배치에 negative label 입력

---

## 5. 개발 우선순위 (Phased Build)

| Phase | 기간 | Exit Criteria | 포함 시나리오 |
|---|---|---|---|
| **P0 인프라** | M0–M3 | 이벤트 SDK 가동 · L1 수집률 99%+ · xAI 카드 5요소 Storybook 100% · 4-Gate Gate 1~2 가동 | — |
| **P1 MVP 데모** | M3–M9 | 1학과 1학기 데이터로 **S01 Course Co-Creation closed loop** + S07 Shukatsu Forge + S08 RLG 시연 | S01, S02, S07, S08, **S11 데모 레벨** |
| **P2 차별화** | M9–M15 | S03 Knowledge Debt Graph · S04 Uplift Nudge · S10 Support Policy Simulator 운영 · **S12 Pace Agent 베타** · GKT 전환 | S03, S04, S05, S09, S10, S12 |
| **P3 일본 특화 확장** | M15–M24 | S06 Commute Agent · S14 Adaptive Path · S15 Teaching Profile · S13 Counterfactual Simulator (다학기 데이터 확보) · 학내 파일럿 | S06, S13, S14, S15 |
| **P4 기관 확장** | M24+ | S16~S23 확장 + Multimodal Coach + Ambient AI R&D + Curriculum Optimizer | S16~S23 |

**규칙**: MVP 시점부터 xAI 카드 5요소는 필수. **4-Gate Governance는 P0부터 Gate 1·2 · P1부터 Gate 3·4**.

---

## 6. 미결·선제 결정 (Open Decisions)

| ID | 결정 대상 | 현재 안 | 결정 시점 |
|---|---|---|---|
| D-1 | L5 초기 시드 전략 | SME 수작업 + CASE mapping proposer (GNN은 P2 이후 편입) | 1호 고객 확정 시 |
| D-2 | 숙달 모델 로드맵 | **MVP: BKT + IRT + 개인 half-life Bayesian posterior** → **P2: GKT / SAKT** (코호트 50+ 수렴 시) · UI·감사 로그에 **현재 모델명·한계 투명 표시** | P1 진입 전 |
| D-3 | LLM 공급자 | Azure Japan East 1차 · Bedrock Tokyo fallback · 데이터 주권 · 리전별 트래픽 라우팅 | P0 종료 전 |
| D-4 | 학사 시스템 연동 | **OneRoster 1.2 우선** + LTI Advantage (Deep Linking/AGS/NRPS) · 레거시는 SAML+CSV | 고객별 |
| D-5 | Zemi Hub 과금 | 학과 라이선스 vs 교수 애드온 | 파일럿 결과 |
| D-6 | Omotenashi 에스컬레이션 임계 | 베이스라인 후 학교별 튜닝 | P2 진입 |
| **D-7 (v2)** | 선배 데이터 공개 기본값 | **기본 off** · 학과 정책 프리셋으로 on 가능 | 위키드스톰·조용상 교수 합의 후 확정 |
| **D-8 (v2)** | 1호 파일럿 대학·학과 | 발표 자리에서 NetLearning 연결 공동 선정 요청 | AES 발표 직후 |
| **D-9 (v2)** | 4자 역할·IP·수익 배분 | 파일럿 단계는 공동 IP · 상용화 단계는 별도 합의 | 파일럿 MoU 체결 시 |
| **D-10 (v2)** | Shukatsu Forge 채용 윤리 | 대학 커리어센터 공동 가이드라인 수립 | P1 전 |
| **D-11 (v2)** | CLR 발급 주체 | 대학(서명자) + AI-X(발급 도구) 이원 · 검증 링크 책임은 대학 | 파일럿 MoU 시 |
| **D-12 (v2)** | CASE × MEXT 매핑 승인 | OneEdutechKorea 주도 제안 · 최종 승인은 MEXT·1EdTech 공동 | 장기 |

---

## 7. 다음 액션

- [ ] **15개 핵심 시나리오** (S01~S15) 각각 **스토리보드 2~3 컷** 시안 제작 (제안서 삽입용 · AES 데모 영상 소재)
- [ ] 확장 예정 시나리오(S16~S23) 중 영업 우선 2~3개 선정해 풀 스펙 작성
- [ ] 이벤트 카탈로그를 **AsyncAPI YAML** + **xAPI Profile JSON-LD (`edulms.ai-x.v1`)** 로 공식화 (`spec/events/`, `spec/xapi-profile/`)
- [ ] xAI 카드 5요소 Storybook 먼저 완성 후 시나리오 구현 착수
- [ ] 학과 시드용 L5 개념 그래프 + CASE alignment 샘플 제작(1학과 분량) — 개발 픽스처
- [ ] APPI 체크리스트 법무 검토 확정 + v2 신규 consent 이벤트 법무 리뷰
- [ ] **CLR VC 서명 파이프라인** (레코스 배지 인프라와 통합 설계)
- [ ] **4-Gate Governance 위원회** 외부 멤버 섭외 (조용상 교수 · ML ethicist 1인)
- [ ] **90일 파일럿 프로토콜** 문서화 (§8 참조)
- [ ] **AES 20분 프레젠 데모 3장** 영상 촬영 스크립트 (§9 참조)

---

## 8. 파일럿 + 4자 역할 (신규)

### 8-1. 90일 파일럿 프로토콜

| 항목 | 내용 |
|---|---|
| 기간 | **90일** (파일럿 승인 → 계약 → 데이터 준비 30일 + 운영 60일) |
| 범위 | **1학과 · 2강좌** (이상적: 통계학 II 또는 경제학 계열 + 연구방법론 혹은 제미 과목 1) |
| 데이터 | **1학기 과거 로그 + 파일럿 학기 실시간 데이터** |
| 적용 시나리오 | **S01 Course Co-Creation · S07 Shukatsu Forge · S08 Zemi Hub** (이상 데모 3장 대응) |
| 부수 가동 | S02 (복습) · S10 (Support Policy) · S11 (Co-Creation Studio) 베타 |

### 8-2. 3 가설 + 검정력

| 가설 ID | 가설 | 지표 | 효과 크기 가정 | 샘플 | 검정력 | p-value |
|---|---|---|---|---|---|---|
| **H1** | S01+S11 자료 개선 후 해당 세그먼트 재시청률 유의 감소 | rewatch_rate 2주 전후 | −20%p | 세그먼트 n=30 × 학생 n≥100 | **0.82** | one-sided 0.05 |
| **H2** | S02 adaptive review 참여 군의 개념 재평가 정답률 +10%p | 재평가 정답률 | +10%p | 치료군 n≥80, 대조 n≥80 | **0.80** | two-sided 0.05 |
| **H3** | S07 CLR-based 가쿠치카 초안 학생 만족도 ≥ 3.8/5 | 설문 5점 | 3.8 vs 중립 3.0 | n≥60 | **0.90** | one-sided 0.05 |

**사전 등록**: OSF 또는 학내 IRB에 **pre-registered outcome + analysis plan** 등록. 결과는 **발견/미발견 무관 공개**.

**보조 지표** (낙인·윤리 검증):
- `학생 주시감(監視感) 분기 평균 < 2.5/5`
- `Mei-waku 회수·반영률 ≥ 95% within 24h`
- `교수자 NPS ≥ +30`

### 8-3. 4자 역할표

| 주체 | 고유 가치 | 파일럿에서의 담당 |
|---|---|---|
| **NetLearning** | 일본 대학 LMS 1티어 · 학교 네트워크 · 일본 학사 know-how · AI LMS 글로벌 인사이트 | 파일럿 대학·학과·강좌 연결 · 학사 연동 요건 정의 · 일본 시장 피드백 리뷰 |
| **레코스 (Recos)** | 표준 배지 인증 인프라 · CLR 2.0 / Open Badges 3.0 발급 전문 | CLR VC 서명 파이프라인 · Open Badges 발급 · 배지 인증 거버넌스 |
| **조용상 교수** | 전 KERIS · CASE · EDU-API · CLR 국내 최고 권위 · MEXT·1EdTech 국제 네트워크 | Standards Stack 거버넌스 · CASE × MEXT 매핑 · 4-Gate Review 위원 · 표준 제안 문서 공동 저자 |
| **위키드스톰 (WickedStorm)** | AI/xAI 레이어 · 시나리오 설계 · agentic/causal/RAG 엔지니어링 · LRS 운영 | 전체 플랫폼 개발 · 모델 파이프라인 · xAI 카드 5요소 · 4-Gate Governance · 효과 측정 |

**공통 설립사**: OneEdutechKorea (레코스 · 조용상 교수 · 위키드스톰)

**메시지 (발표에서)**:
> "AI를 혼자 만들면 윤리·표준·현장 중 하나가 빠집니다. **위키드스톰이 AI를**, **조용상 교수가 표준을**, **레코스가 검증을**, **NetLearning이 현장을** 담당하는 4자 구조가 아시아 AI LMS 레퍼런스를 만드는 조건입니다."

### 8-4. 파일럿 산출물

- 3가설 결과 (수치 + CI)
- 각 시나리오의 수용 기준 달성 리포트
- APPI 준수 감사 리포트
- 4-Gate Governance Gate 3 월간 리포트 3회분
- `edulms.ai-x.v1` xAPI Profile 공식 문서
- CASE × MEXT 매핑 파일럿 샘플 (1학과 분량)
- CLR VC 발급 서명 파이프라인 end-to-end 영상
- 후속 단계 제안서 (6개월 공동 파일럿 · 12개월 상용화 옵션)

---

## 9. 프레젠 20분 구조 (신규)

**청중**: NetLearning 회장 + 조용상 교수 + AES 참석자.
**메시지**: *"우리는 LMS를 대체하지 않습니다. 학습 운영 지능 레이어를 얹고, 개입 효과를 학습합니다."*

| 시간 | 섹션 | 핵심 메시지 · 내용 |
|---|---|---|
| **0:00–2:00** | **도입: 레이어 선언** | "LMS 대체가 아님. NetLearning·manaba 위에 **AI 학습 운영 레이어**를 얹자는 제안. 이미 모두가 AI를 말하지만, 우리는 **closed loop + 표준 compose + 일본 특화**의 3요소를 증명하려 합니다." |
| **2:00–9:00** | **Proof 1: S01 Course Co-Creation closed loop (7분)** | 한 화면에서 끝까지: 난관 감지 → 원인 개념 추정 → Intervention xAI Card → 교수자 승인 → Co-Creation Studio가 자료 초안 생성 → 교수자 편집·배포 → 2주 후 uplift CI로 돌아오는 폐루프. **이 7분이 발표 전체의 중심**. |
| **9:00–11:30** | **Proof 2: Shukatsu Forge + CLR Evidence (2.5분)** | 일본 경어 3단계 자동 전환 + 업계별 재구성 + CLR 검증 링크 + Guard 모달 (2종 evidence + externally verifiable + confidence 0.7). "LLM ES 작성기가 아니라 검증 가능한 학습 성취 narrative". |
| **11:30–13:30** | **Proof 3: Zemi Hub Research Lineage Graph (2분)** | 제미 지식 세습 구조화 · novelty/duplication score · 다음 회의 안건 자동 초안. "글로벌 LMS는 못 하는 일본 대학 고유 단위". |
| **13:30–16:00** | **Defense: Standards Stack (2.5분)** | 1페이지 Standards Stack 슬라이드 · "We compose, not replace" · OneRoster/LTI Advantage/Caliper/xAPI/CASE/CLR/EDU-API 역할 분담 + APPI + 4-Gate Governance. 조용상 교수 톤으로 진행. |
| **16:00–19:00** | **Pilot + 4자 역할 (3분)** | 90일/1학과/2강좌/3가설 + 검정력 + 4자 역할표. "왜 4자 구조가 필요한가" 한 문장. NetLearning 파일럿 대학 공동 선정 제안. |
| **19:00–20:00** | **Ask + 확장 로드맵 (1분)** | P3 이후 확장: Counterfactual Simulator · Multimodal Coach · Ambient AI R&D · Institutional Curriculum Optimizer. "다음 회의에서 MoU 초안 드리겠습니다." |

### 9-1. 발표 데모 영상 3편 (사전 녹화 · 각 60~90초)

1. **Demo A — Course Co-Creation closed loop** (최대 90초)
   - 학생 6명 난관 → 교수자 히트맵 → Intervention xAI Card → 자료 생성 버튼 → AI 초안 3종 → 교수자 편집 → 배포 → 2주 후 uplift 결과 카드
2. **Demo B — Shukatsu Forge Guard** (60초)
   - 학생이 "가쿠치카 생성" 클릭 → Guard 모달 체크 → 일본어 초안 생성 → 업계 탭 전환 → CLR 검증 링크 팝업
3. **Demo C — Zemi RLG** (60초)
   - 후배 주제 입력 → 선행 연구 3건 그래프 표시 → "미해결 질문 이어받기" → 다음 회의 안건 초안

### 9-2. Q&A 대비 Back-pocket 슬라이드 (무대 미표시, Q&A 시 사용)

- **Q: "Early Warning은 다 해봤는데?"** → Support Policy Simulator (S10) 1슬라이드: risk+uplift+fairness+uncertainty 4-stack + "위험 학생 리스트" → "이번 주 효과가 큰 지원 3개" 화면 변화
- **Q: "Counterfactual은 MVP에?"** → S13 로드맵 슬라이드: P3 이후 · 다학기 데이터 요건 명시 · 파일럿 중 시뮬레이션 모드만 가동
- **Q: "Ambient AI 가능한가?"** → "P3 이후 R&D. 파일럿 범위 외. 개인정보·시연 리스크 때문에 보수적으로 접근"
- **Q: "가격은?"** → Commercial Deck 별도 (발표에는 없음). "파일럿 성공 조건 확정 후 모듈별 SKU 제안"
- **Q: "NetLearning 기존 시스템과의 중첩은?"** → OneRoster + LTI Advantage Deep Linking 설명 + "AI-X는 manaba/NetLearning의 기능 확장으로 launch, 단독 LMS 아님"
- **Q: "일본 팀은?"** → 조용상 교수 1EdTech/MEXT 네트워크 + 위키드스톰 도쿄 리전 배포 + 레코스 한국 거점

---

> **이 문서의 본질 (v2)**
> 이건 기능 카탈로그가 아니다. **교수자와 학생이 매일 만나는 순간**을 설계하고, 그 순간에 **감지·원인 추정·개입·효과 검증·정책 갱신의 폐루프**를 얹는다.
> 우리는 **표준을 결합**(compose)한다. **역량(CASE)·이벤트(xAPI/Caliper)·성취(CLR)·수강(OneRoster)·연결(LTI Advantage)** 을 각자 자리에 두고, **그 위에 AI가 개입 효과를 학습**하는 레이어를 올린다.
> **일본 대학만의 장면**(Shukatsu · Zemi · Liner · Meiwaku · 敬語)을 스키마 레벨의 1급 시민으로 구현한다.
> 그리고 **모든 AI 판단에는 근거·모델 버전·불확실성·권장 행동·효과 측정 계획**이 붙고, **이의 제기 링크가 상시**로 있다.
> 이게 NetLearning과 우리가 함께 만드는 **아시아 AI 학습 운영 레이어의 약속**이다.
