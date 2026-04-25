# 다음 액션 — 최종 통합 추천

> **두 AI의 합의**: 발표 한 장면을 멋있게 만드는 것과 **파일럿이 실제로 가동되게 만드는 것**은 다른 작업이다. 지금은 **후자를 막는 blocker**부터 제거하는 것이 우선이다.

---

## 0. Codex가 Claude보다 예리하게 잡은 3가지 (인정하고 수용)

### ① 내 우선순위 공식 (U+I-0.5C-0.3D) 은 critical path를 놓친다

내가 쓴 공식은 **복잡도·의존성을 감점**하기 때문에, 오래 걸리는 blocker (MoU, CLR issuer 결정, APPI 검토, 데이터 확보) 가 뒤로 밀린다. Codex가 제안한 **5-Gate 판단 기준**이 훨씬 정확:

1. **Stage Trust Gate** — 발표장에서 없으면 설득이 무너지는가?
2. **Pilot Permission Gate** — 대학·법무·데이터가 허락할 구조인가?
3. **Standards Credibility Gate** — 조용상 교수가 들어도 표준 오남용이 없는가?
4. **Commercial Conversion Gate** — 회장이 다음 미팅을 잡을 이유가 있는가?
5. **Build Feasibility Gate** — 위키드스톰이 실제로 만들 수 있음을 보이는가?

**복잡도는 우선순위를 낮추는 지표가 아니라, 언제 착수해야 하는지를 정하는 입력값이다.** 이 관점 수용.

### ② 내가 완전히 놓친 작업 7개

| 작업 | 내가 놓친 이유 | Codex 지적의 핵심 |
|---|---|---|
| **Decision Brief (정확한 Ask 문서)** | 발표 슬라이드만 생각함 | 발표 목적은 "감탄"이 아니라 **"다음 의사결정 확보"**. 회장에게 **무엇을 요청할지** 1장 문서가 없으면 발표 끝나고 공허 |
| **NetLearning Integration Fit Brief** | "We compose" 슬라이드만 생각함 | 회장은 "우리 manaba·네트워크에 **어떻게, 언제, 무슨 책임으로** 붙나?" 를 묻는다. LTI/OneRoster/SSO/CSV fallback 연동 그림이 필요 |
| **Data / APPI / IRB Readiness Pack** | 법무는 나중에 생각 | **파일럿은 기술보다 데이터·법무에서 막힌다.** APPI 사전 체크 없으면 파일럿 착수 3개월 지연 |
| **Standards Claim Audit** | v2에서 표준 슬라이드 만들면 끝이라고 생각 | 조용상 교수 앞에서는 **"표준을 안다" 보다 "과장하지 않는다"가 더 중요**. xAPI/Caliper/CASE/CLR 각각의 역할과 **금지 표현**을 정리한 audit 필요 |
| **일본어 Native UX/Copy Review** | Codex의 일본어 CTA를 그대로 채택 | AI가 쓴 일본어를 **원어민·일본 대학 관계자**가 검증 안 하면 회장님이 즉시 간파 |
| **Build Capacity & Budget Plan** | 기술에만 집중 | "좋다" 다음 질문: **"누가 · 언제 · 얼마로 만드나"**. 이 답 없으면 회장은 심각하게 안 받음 |
| **파일럿 측정 운영 패키지** | v2에 가설·검정력만 씀 | outcome 사전등록 · 분석 protocol · 실패 보고 방식 · 월간 리포트 템플릿이 문서로 없으면 **"과학적으로 한다" 약속이 비어보임** |

### ③ 라이브 데모는 절대 금지 — 사전 녹화·클릭 프로토타입·PNG 백업 3중화

내 제안에는 "Figma 인터랙션 프로토타입" 까지만 있었는데, Codex가 지적한 대로 **현장에서 하나라도 고장나면 치명적**. 3가지 모두 준비:

1. **영상 (사전 녹화, 자막 포함)** — 기본
2. **클릭 프로토타입 (Figma 또는 Keynote Magic Move)** — Q&A 시 특정 화면 깊이 있게 보여줘야 할 때
3. **PNG backup flow (슬라이드 시퀀스)** — 네트워크·장비 실패 시 최종 방어

---

## 1. 최종 통합 Top 7 (Gate 기준 재정렬)

| Rank | 작업 | 통과시키는 Gate | 소요 | 누가 |
|---|---|---|---|---|
| **1** | **20분 발표본 + Decision Brief (Ask 1장)** + Q&A back-pocket | Stage Trust + Commercial Conversion | 3~5일 | 위키드스톰 발표자 + PPT 디자이너 |
| **2** | **Demo A/B/C 영상·클릭 프로토타입 + 일본어 Native 검수** | Stage Trust | 7~10일 (병렬) | 위키드스톰 + 원어민 검수자 + 일본 대학 관계자 1인 |
| **3** | **공격형 Q&A 리허설 (3트랙: 회장형·조용상 교수형·법무 담당자형)** | Stage Trust + Standards Credibility | 2~3일, 최소 3회 세션 | 발표자 + mock audience (내부 2~3인) |
| **4** | **파일럿 Conversion Packet**: 타겟 대학 3~5 · 접근 루트 · 데이터 가능성 · 법무 난이도 · 후속 미팅 안건 · Decision items | Pilot Permission + Commercial Conversion | 5~7일 | 영업·조용상 교수 네트워크·NetLearning 협조 |
| **5** | **Integration + Data/APPI/IRB Readiness Brief** (1페이지 연동 그림 + 개인정보 준수 체크리스트 + 최소 수집·동의·삭제권·일본 리전·IRB/pre-registration) | Pilot Permission + Commercial Conversion | 3~6일 | 위키드스톰 + 법무 + 조용상 교수 |
| **6** | **4자 Term Sheet** (MoU 이전 간소형: 역할·IP·데이터 Controller/Processor·CLR 서명자·수익 원칙) | Commercial Conversion | 발표 전 내부 합의 5~10일 | 4자 (위키드스톰·레코스·조용상 교수·NetLearning) |
| **7** | **P0 Evidence Kit**: xAI 카드 5요소 Storybook + `edulms.ai-x.v1` xAPI Profile skeleton + CASE mini sample + CLR smoke test | Standards Credibility + Build Feasibility | 2~4주 | 위키드스톰 ML + 레코스 CLR 팀 |

### 1.1 보조 작업 (Top 7 병렬)

| 작업 | Gate | 비고 |
|---|---|---|
| Standards Claim Audit 체크리스트 | Standards Credibility | 발표 전 내부 검증. 조용상 교수 1차 리뷰. |
| Build Capacity & Budget Plan 1페이지 | Build Feasibility | Q&A 대비. "돈은?" 질문에 2문장 답변 + 1페이지 |
| 파일럿 측정 운영 패키지 (outcome 사전등록·분석·실패 보고·월간 리포트 템플릿) | Pilot Permission | T1~T2 병행. H1~H3 운영 전에 고정 |
| 발표 후 24~72시간 follow-up 제안서 초안 | Commercial Conversion | 발표 전 미리 작성, 반응만 끼워넣음 |

---

## 2. 최소 실행 버전 (MLP) — "지금 당장 3개만"

Codex의 결론에 동의. **시간·리소스가 극도로 제한되면 다음 3개만 먼저**:

### A. **발표본 + Decision Brief + Demo 3편 (일본어 검수 포함)**
발표장에서 회장이 "무엇을 요청하는가, 무엇을 증명하는가, 다음에 뭘 하자는 건가" 3질문에 즉답할 수 있는 세트. 없으면 발표 자체가 성립 안 함.

### B. **파일럿 Conversion Packet**
발표 후 회장이 "좋다"고 해도 **다음 미팅에서 결정할 3가지 · 후보 대학 · 90일 프로토콜**이 없으면 모멘텀이 증발한다. "다음 회의 잡기" 가 끝이면 실패.

### C. **Integration + Data/APPI Readiness Brief**
NetLearning 측근이 내부에서 "기술적·법적으로 붙을 수 있나?"를 검토할 때 이게 없으면 **파일럿 시작이 3개월 지연된다**. 특히 일본 대학의 IRB/정보보호 심의는 6~8주 소요되는 경우 흔함.

**이 3개 없이 발표만 하면**: 박수는 받지만 파일럿 시작은 6~12개월 밀린다.

---

## 3. 위험 시나리오 방어 (Codex가 발굴한 영역)

발표·파일럿이 실패할 수 있는 시나리오와 사전 방어 매트릭스.

| 시나리오 | 방어 전략 |
|---|---|
| **파일럿 효과 미발견** (H1/H2/H3 통계적 유의성 실패) | **outcome pre-registration** 유지. 실패도 공개 가능한 **learning report**로 전환. "효과 없음"을 숨기면 표준·학술 신뢰가 무너진다. |
| **회장 미온적 반응** | **MoU를 밀지 말고** "30분 technical discovery · 담당자 1명 지정 · 파일럿 후보 대학 2곳 소개"만 요청. 작게 시작. |
| **과거 데이터 미확보** | **prospective collection**으로 전환. S01 causal claim은 낮추고, **S07/S08처럼 로그 의존이 낮은 데모**를 먼저 살림. |
| **대학·법무 차단** | APPI·동의·삭제권·일본 리전·개인 위험명단 비노출·opt-in 범위를 **1페이지로 제시**. 법무 리뷰 전 미리. |
| **표준 전문가 반박** | xAPI vs internal audit, CASE vs local concept, CLR vs 감시 지표를 **절대 섞지 않음**. 핵심 방어 문장: *"감시 지표는 CLR에 넣지 않습니다."* |
| **데모 실패** (네트워크·장비·UI 버그) | **라이브 데모 절대 금지.** 사전 녹화 + 클릭 프로토타입 + PNG backup flow 3중화. |
| **4자 역할 충돌** | 파일럿 단계 IP, 상용화 단계 수익, CLR issuer 책임, 데이터 controller/processor를 **MoU Term Sheet에 분리**. 발표 전 내부 합의. |
| **일본어 톤 어색** | **원어민 + 일본 대학 관계자 사전 검수**. 특히 敬語 3단계 자동 조정·Honne/Tatemae 표현. |

---

## 4. 사용자 결정이 필요한 블로킹 포인트

다음은 위키드스톰 외부 합의가 필요한 항목. 지금부터 **병렬로 트리거**해야 T0 작업이 제때 진행됨.

| # | 결정 필요 | 트리거 대상 | 긴급도 |
|---|---|---|---|
| 1 | 4자 Term Sheet 내부 1차 합의 (역할·IP·데이터·CLR 서명자·수익 원칙) | 레코스 · 조용상 교수 · NetLearning | **매우 긴급** — 발표 전 |
| 2 | 1호 파일럿 대학 후보 3~5개 리스트 확보 | 조용상 교수 네트워크 + NetLearning 내부 | **매우 긴급** |
| 3 | 일본어 Native 검수자 섭외 (Demo A/B/C 스크립트 검수) | 외부 원어민 + 일본 대학 관계자 | **긴급** |
| 4 | APPI / IRB 법무 자문 계약 | 일본 법무법인 (또는 조용상 교수 네트워크 추천) | **긴급** — 파일럿 전 필수 |
| 5 | Build Capacity (팀 구성 + 예산) 내부 승인 | 위키드스톰 경영진 | **중** — Commercial Deck 작성 전 |
| 6 | 4-Gate Governance 위원회 외부 위원 섭외 (ML Ethicist · 교육 법무) | 조용상 교수 네트워크 · 학술 | **중** — T1~T2 |
| 7 | 발표 당일 후 follow-up 미팅 일정 사전 제안 (NetLearning 측) | NetLearning 측근 | **낮** — 발표 직후 |

---

## 5. Codex vs Claude 최종 합의표

| 영역 | 합의 | 누가 주도했나 |
|---|---|---|
| Top 7 | **Codex 7개 채택** | Codex (Gate 방식이 우수) |
| Decision Brief (정확한 Ask) | **추가 수용** | Codex 발굴 |
| Integration + APPI Readiness | **최우선급으로 상향** | Codex 발굴 |
| 파일럿 Conversion Packet | **내 T0-3 단순 대학 리스트 → 통합 packet으로 확장** | Codex 재편 |
| Standards Claim Audit | **보조 작업으로 추가** | Codex 발굴 |
| 일본어 Native UX 검수 | **Demo 작업에 포함** | Codex 발굴 |
| Build Capacity & Budget | **Commercial Deck 선행 작업으로 편입** | Codex 발굴 |
| 파일럿 측정 운영 패키지 | **T1~T2로 상향** | Codex 발굴 |
| 라이브 데모 금지 · 3중 백업 | **채택** | Codex 실무 경험 |
| 위험 시나리오 7종 방어 매트릭스 | **별도 섹션으로 편입** | Codex 발굴 |
| xAI Storybook | **내 T2-3 → P0 Evidence Kit으로 통합** | 공통 |
| CLR VC PoC | **내 T2-5 → T1 smoke test + T2 full PoC 2단계** | Codex 정교화 |
| 4-Gate 위원회 | **내 T2-6 → T1 Charter + T2 운영 2단계** | Codex 정교화 |
| Counterfactual MVP · GKT 연구 · Multimodal · Ambient AI · Curriculum Optimizer | **후순위 유지** | 양쪽 합의 |

---

## 6. 결론 요약

**Codex가 구조적으로 옳았던 것**: 이 프로젝트는 "발표를 어떻게 예쁘게 만들 것인가"의 문제가 아니라 **"파일럿이 실제로 가동되는 것을 무엇이 막는가"의 문제**. Blocker 제거 우선.

**지금 당장 시작할 3개 (Codex·Claude 합의)**:
1. **발표본 + Decision Brief + Demo 3편 (일본어 검수)**
2. **파일럿 Conversion Packet**
3. **Integration + Data/APPI Readiness Brief**

**동시에 병렬 트리거 4건**:
- 4자 Term Sheet 내부 합의 개시
- 1호 파일럿 대학 후보 리스트 작성 개시
- 일본 APPI 법무 자문 섭외
- 원어민 일본어 검수자 섭외

이 7개 (Top 3 + 병렬 4) 가 굴러가기 시작하면 **나머지 Top 4~7과 P0 Evidence Kit** 는 자연스럽게 따라간다.
