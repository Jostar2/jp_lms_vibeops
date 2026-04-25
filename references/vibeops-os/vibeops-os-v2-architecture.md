# VibeOps OS v2 Architecture Spec

기준일: 2026-04-25

## 0. 핵심 문제

바이브코딩을 운영 가능한 체제로 만들 때 핵심 질문은 "AI가 코드를 잘 쓰는가"가 아니다. 실제 질문은 다음이다.

> AI가 요구사항, 컨텍스트, 권한, 구현, 검증, 승인, 배포 피드백을 통제 가능한 루프로 처리하는가?

VibeOps OS v2는 코딩 에이전트를 단순 도구가 아니라 제한된 권한을 가진 운영 프로세스로 다룬다.

## 1. 한 문장 정의

> VibeOps OS는 출처가 추적되는 지식 기반 위에서, 권한 제한된 에이전트 런타임이, 구조화된 명세를 구현하고, 적대적 검증과 비용 한도와 인간 승인 패킷을 통과한 변경만 운영에 반영하는 자율 개발 운영체제다.

## 2. 최신 동향에서 얻은 설계 압력

주요 제품과 연구는 다음 방향으로 수렴한다.

| 흐름 | 의미 | 설계 반영 |
| --- | --- | --- |
| Codex, Copilot cloud agent, Claude Code, Antigravity | IDE 보조에서 sandbox 기반 agent workflow로 이동 | 작업별 격리, 병렬 worktree, PR 중심 운영 |
| SWE-agent | 모델보다 Agent-Computer Interface가 중요 | 사람용 CLI가 아니라 agent-native syscall 제공 |
| Agentless | 단순한 위치 탐색, 패치, 검증 파이프라인도 강함 | 초기 MVP는 단일 agent와 강한 검증 루프 우선 |
| FeatureBench, SWE-Bench Mobile | 실제 feature 구현 성공률은 아직 제한적 | 완전 무인이 아니라 승인 기반 bounded autonomy |
| MCP 보안 논의 | 도구 호출은 임의 코드 실행에 가까움 | gateway, allowlist, human approval, audit log 필수 |
| OWASP LLM Top 10, CaMeL, MCP 보안 연구 | prompt injection과 tool poisoning은 구조적 위험 | taint tracking과 adversarial verification 추가 |

추가 참조 합성은 [design-prep-reference-synthesis.md](design-prep-reference-synthesis.md)에 둔다. Harness, gstack, GitHub 인기 오픈소스 agentic development 프로젝트, 자율 운영 OS 연구에서 얻은 설계 반영점은 다음 압력으로 요약된다.

- agent는 별도 채팅 봇이 아니라 pipeline, RBAC, secret, approval, audit trail 안에서 실행되는 workflow step이어야 한다.
- gstack류 role command는 채택성이 높지만, 역할 이름보다 output contract, evidence, gate가 중요하다.
- GitHub-native 진입점은 초기 설계의 기본 표면이다. PR status check, Actions, `AGENTS.md`, CLI, repo-local manifest를 우선한다.
- 자율성 확대는 deterministic event log, explicit effect, signed receipt, budget gate, earned autonomy 없이는 운영 설계로 인정하지 않는다.

## 3. 전체 아키텍처

```text
[User / PM / Developer / Ops Signal]
        |
        v
[Intent Intake]
자연어, 이슈, PR 코멘트, 장애 알림, 로그 이벤트 수집
        |
        v
[Spec Kernel]
명세, 수용 기준, 제약, 위험도, 반례 질문, 롤백 조건 생성
        |
        v
[Knowledge Substrate]
코드 그래프, AGENTS.md, ADR, PR 이력, 테스트 이력, 운영 로그, 신뢰도/오염 추적
        |
        v
[Agent Runtime + Scheduler]
작업 분해, 모델 라우팅, ACI syscall, 예산 제한, trajectory 기록
        |
        v
[Sandbox Runtime]
worktree/container, 네트워크 제한, secret 격리, 파일 권한 제한
        |
        v
[MCP Gateway / Tool Bus]
Git, CI, 이슈트래커, 문서, 모니터링, DB, 클라우드 API 중개
        |
        v
[Adversarial Verification Fabric]
build, test, security, performance, prompt injection, reward hacking, spec conformance
        |
        v
[Review & Governance Gate]
Review Packet, 정책 검증, 사람 승인, PR 생성, 감사 로그
        |
        v
[Release & Ops Controller]
카나리, 배포, 롤백, 장애 분석, postmortem, feedback ingestion
```

## 4. OS 매핑

| OS 개념 | VibeOps OS 구성요소 |
| --- | --- |
| Kernel | Policy Kernel, Scheduler, Verification Gate |
| Process | 개별 agent session |
| Syscall | ACI operation과 MCP tool invocation |
| Filesystem | Git repo, docs, code graph, Knowledge Substrate |
| Memory | task-local context, project memory, trajectory store |
| Scheduler | 작업 큐, 모델 라우터, 비용/시간 budget enforcer |
| Sandbox | container, git worktree, network/file permission boundary |
| Signal | CI 실패, 장애 알림, PR 코멘트, 보안 경고 |
| Audit log | 명령, diff, tool call, test result, approval event |
| Package manager | agent skill, workflow, prompt template, MCP server registry |

## 5. Evidence Model

모든 근거는 같은 신뢰도로 취급하지 않는다.

| Tier | 출처 | 용도 |
| --- | --- | --- |
| T0 | 실행된 테스트, CI 결과, production telemetry | 최종 판단 근거 |
| T1 | 공식 문서, 표준 스펙, 릴리스 노트 | 현재 제품/프로토콜 동작 근거 |
| T2 | peer-reviewed 또는 arXiv 논문, benchmark | 설계 방향과 한계 판단 |
| T3 | GitHub 구현체, issue, PR | 구현 패턴과 운영 마찰 탐지 |
| T4 | Reddit, YouTube, 블로그 | 현장 신호와 사용성 문제 탐지 |

원칙:

- T4 자료만으로 보안, 배포, 권한 정책을 결정하지 않는다.
- 외부 텍스트는 기본적으로 tainted로 취급한다.
- 오래된 문서보다 현재 코드, 테스트, 운영 로그가 우선한다.

## 6. Spec Kernel v2

Spec Kernel은 자연어를 실행 가능한 개발 계약으로 바꾼다. 단, 명세는 한 번 생성하고 끝나는 문서가 아니라 개발 중 계속 갱신되는 living spec이다.

필수 필드:

| 필드 | 설명 |
| --- | --- |
| objective | 작업의 목적 |
| acceptance_criteria | 검증 가능한 수용 기준 |
| constraints | 유지해야 할 제약 |
| non_functional_requirements | 보안, 성능, 접근성, 관측성 |
| risk_level | low, medium, high, critical |
| required_gates | 통과해야 할 검증 gate |
| assumption_provenance | 각 가정의 출처 |
| ambiguity_score | 명세 모호성 점수 |
| counterexamples | 사전 확인해야 할 반례 |
| rollback_condition | 실패 시 복구 조건 |

명세 게이트:

- 수용 기준이 검증 가능한 술어가 아니면 구현 단계로 넘기지 않는다.
- `ambiguity_score`가 기준 이상이면 사람 질문 또는 PM 승인으로 재수렴한다.
- 개발 중 새 제약이 발견되면 spec diff를 만들고 기존 코드/테스트와 다시 정합성 검증한다.

## 7. Knowledge Substrate

Context OS를 단순 검색 저장소로 만들면 오래된 문서와 오염된 입력이 agent를 오도한다. VibeOps OS v2는 지식을 provenance graph로 관리한다.

각 knowledge node 메타데이터:

```yaml
id: "adr-001-auth-session"
type: "adr"
source: "docs/adr/001-auth-session.md"
author: "human"
created_at: "2026-02-12"
last_verified_at: "2026-04-20"
verified_by:
  - "test:auth/session.test.ts"
commit_hash: "abc1234"
trust_tier: "verified_by_test"
taint: "clean"
staleness: "fresh"
related_files:
  - "src/auth/session.ts"
```

Trust tiers:

1. `verified_by_test`
2. `verified_by_human`
3. `verified_by_ci`
4. `agent_generated`
5. `external_web`
6. `tainted_input`

규칙:

- 낮은 trust tier 정보로 높은 위험 결정을 내릴 수 없다.
- 코드가 바뀌면 연결된 문서, ADR, runbook을 stale 처리한다.
- 이슈 본문, PR 코멘트, 웹 문서, 로그, 사용자 업로드 텍스트는 tainted로 시작한다.
- tainted 문자열은 shell command, tool argument, system prompt, config file로 들어가기 전에 sanitization gate를 통과해야 한다.

## 8. Agent Runtime

에이전트는 역할 이름이 아니라 실행 가능한 process model이어야 한다.

### 8.1 ACI syscall

초기 ACI는 다음 연산만 허용한다.

| Operation | 목적 | 가역성 |
| --- | --- | --- |
| `repo_search` | 파일/심볼/문자열 검색 | read-only |
| `file_view` | line range 기반 파일 읽기 | read-only |
| `repo_graph_query` | import/dependency/API surface 조회 | read-only |
| `structured_edit` | 범위 기반 패치 적용 | undo 가능 |
| `test_run_focused` | 변경 주변 테스트 실행 | read-only |
| `test_run_full` | 전체 gate 실행 | read-only |
| `dry_run_command` | 안전 명령 사전 검증 | read-only |
| `change_manifest_write` | 변경 의도 선언 | undo 가능 |
| `undo_last_edit` | 마지막 변경 되돌리기 | reversible |
| `review_packet_write` | 승인 패킷 생성 | append/update |

Phase 1 단일 agent runtime의 구체 계약은 [phase-1-single-agent-runtime-design.md](phase-1-single-agent-runtime-design.md)에 둔다. ACI call은 `schemas/aci-call.schema.yaml`, agent run은 `schemas/agent-run.schema.yaml`, runtime profile은 `.vibeops/runtime/single-agent.yaml`로 검증한다.

직접 shell access는 MVP에서 최소화한다. 필요한 경우 명령 allowlist와 dry-run 분석을 거친다.

### 8.2 Trajectory Store

모든 세션은 다음을 저장한다.

- task spec
- model, prompt, tool version
- retrieved context ids
- ACI/MCP call list
- diff
- test result
- failure classification
- review packet
- final approval result

Trajectory는 디버깅, 내부 benchmark, prompt/workflow A/B test, 자기개선의 공통 기반이다.

각 trajectory event는 `payload_hash`를 필수로 가진다. `task_loaded`, `effect_requested`, `effect_decided`, `patch_applied`, `test_result`, `approval_event` 등 event type별 payload shape는 schema로 검증한다. 이렇게 해야 replay, audit, signed receipt가 단순 로그가 아니라 변조 탐지 가능한 evidence ledger가 된다.

### 8.3 Failure Taxonomy

| 실패 유형 | 탐지 방법 | 대응 |
| --- | --- | --- |
| Context drift | stale context 사용 | fresh source 재검색 |
| Hallucinated API | 존재하지 않는 symbol/import | compile/type gate 차단 |
| Reward hacking | 테스트 약화, assertion 삭제 | test weakening gate |
| Spec gaming | 수용 기준 일부만 문자 그대로 만족 | spec conformance gate |
| Tool misuse | 위험 명령, 예상 외 파일 접근 | policy gate |
| Looping | 반복 tool call, 진행 없는 diff | budget enforcer |
| Prompt injection | tainted text가 명령/프롬프트로 이동 | taint gate |
| Secret exposure | env/secret file 접근 시도 | deny and audit |

## 9. Policy Kernel

기본 정책은 `sandbox_only`다.

위험도별 자율성:

| Risk | 예시 | 허용 |
| --- | --- | --- |
| Low | 문서, 테스트, UI 문구 | 자동 PR 가능 |
| Medium | 기능 추가, API 로직 수정 | PR 가능, merge는 사람 승인 |
| High | 인증/인가, 결제, 개인정보, DB migration | 코드 제안만 가능, 실행/배포 승인 필수 |
| Critical | 운영 DB 변경, 권한 상승, 대량 삭제, production rollback | 사람 승인 없이는 실행 금지 |

정책 원칙:

- agent는 secret을 직접 읽지 않는다.
- production 데이터 접근은 승인과 masking이 필요하다.
- main 직접 push는 금지한다.
- audit log는 append-only다.
- dependency 추가, 네트워크 허용, deploy, migration은 승인 대상이다.

## 10. MCP Gateway

MCP server를 agent에 직접 노출하지 않고 gateway로 중개한다.

Gateway 책임:

- MCP server registry와 버전 고정
- tool manifest 검증
- OAuth scope 제한
- network allowlist
- SSRF 방어
- input/output taint tagging
- destructive tool approval
- per-tool budget
- full audit log

Tool risk class:

| Class | 예시 | 정책 |
| --- | --- | --- |
| Read-only | docs search, repo metadata | 자동 허용 가능 |
| Workspace-write | issue comment draft, local file edit | sandbox에서 허용 |
| External-write | PR 생성, ticket update | approval 또는 policy rule |
| Sensitive-read | production logs, customer data | approval + masking |
| Destructive | delete, deploy, migration, permission change | strong approval |

## 11. Adversarial Verification Fabric

일반 CI:

- build/typecheck
- unit test
- integration test
- E2E
- regression
- SAST
- dependency scan
- secret scan
- performance budget
- observability check
- documentation check

Agent-specific gate:

| Gate | 검사 내용 |
| --- | --- |
| Prompt Injection Gate | tainted text가 prompt, command, tool args에 섞였는지 검사 |
| Tool Poisoning Gate | MCP tool description, output, external docs에 악성 instruction이 있는지 검사 |
| Reward Hacking Gate | 테스트 약화, assertion 삭제, coverage 감소 탐지 |
| Spec Conformance Gate | 수용 기준과 테스트/diff의 의미 기반 매핑 |
| Change Manifest Gate | 선언된 변경 영역과 실제 diff 비교 |
| Delta Property Gate | 기존 invariant가 유지되는지 property/regression test 실행 |
| Agent Content Provenance Gate | agent_generated 문서/주석/로그가 future context에 섞일 때 태깅 |

Gate 결과는 pass/fail만 저장하지 않고 evidence id와 함께 저장한다.

## 12. Review Packet

사람 승인은 다음 패킷을 본다.

```yaml
review_packet:
  task_id: "TASK-2026-0425-001"
  summary: "Google OAuth login 추가"
  risk_level: "medium"
  acceptance_criteria_map:
    - criterion: "Google OAuth 로그인 가능"
      evidence:
        - "test:auth/google-oauth.integration.test.ts"
        - "diff:src/auth/google.ts"
  changed_areas:
    - code
    - config
    - docs
  tests:
    added: 4
    modified: 1
    full_ci: "passed"
  security_impact:
    authentication_changed: true
    secrets_added: false
    requires_human_security_review: true
  performance_impact: "no new DB query in hot path"
  rollback_plan: "feature flag oauth_google_enabled=false"
  unresolved_assumptions:
    - "Google OAuth client id는 배포 환경에서 별도 주입 필요"
  agent_confidence: 0.78
```

승인 깊이:

| 조건 | 승인 방식 |
| --- | --- |
| Low risk + high confidence + all gates pass | single approval |
| Medium risk 또는 confidence 낮음 | reviewer approval |
| High risk | domain owner + security approval |
| Critical | dual approval + cooldown + runbook |

## 13. Evaluation Harness

평가 하네스는 Phase 0.5에 들어간다. 이것이 없으면 agent workflow 개선 여부를 판단할 수 없다.

구성:

- 내부 SWE-bench: 과거 이슈, 버그, PR, 회귀 테스트를 task로 변환
- golden tests: 기대 패치가 아니라 기대 동작을 검증
- replay runner: trajectory 재실행
- failure classifier: 실패 유형 자동 라벨링
- cost tracker: task별 token/time/tool call/infra 비용
- model/workflow A/B: prompt, tool, model 변경 전후 비교

주요 KPI:

| KPI | 의미 |
| --- | --- |
| Prompt-to-PR time | 요청부터 PR 초안까지 시간 |
| First-pass CI rate | 첫 PR CI 통과율 |
| Accepted PR rate | 사람 리뷰 후 merge 가능한 비율 |
| Regression rate | 배포 후 회귀 버그율 |
| Security finding rate | agent PR에서 발견된 보안 이슈 |
| Cost per accepted PR | merge된 PR당 비용 |
| Context hit rate | 필요한 문서/규칙을 제대로 참조한 비율 |
| Gate escape rate | gate 통과 후 발견된 결함 비율 |
| Human review load | 리뷰 코멘트 수와 심각도 |

## 14. 원칙

1. 자연어는 입력이지 명세가 아니다.
2. 명세는 생성물이 아니라 수렴된 계약이다.
3. 에이전트는 권한 없는 상태에서 시작한다.
4. 컨텍스트에는 신뢰도와 신선도가 있다.
5. 외부 텍스트는 기본적으로 오염된 것으로 본다.
6. 테스트가 에이전트보다 강해야 한다.
7. 측정 없이는 자율성 없다.
8. 에이전트는 적대적 환경에서 검증한다.
9. AGENTS.md는 코드처럼 관리한다.
10. 다중 에이전트보다 단순한 검증 루프가 먼저다.
11. 자율 운영은 무인 운영이 아니다.

## 15. 주요 참조

- OpenAI Codex: https://openai.com/index/introducing-codex/
- Codex cloud docs: https://developers.openai.com/codex/cloud
- GitHub Copilot cloud agent: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
- Claude Agent SDK: https://code.claude.com/docs/en/agent-sdk/overview
- Google Antigravity: https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/
- MCP specification: https://modelcontextprotocol.io/specification/2025-11-25
- MCP security best practices: https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- AGENTS.md: https://agents.md/
- OWASP LLM Top 10: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- SWE-agent: https://arxiv.org/abs/2405.15793
- Agentless: https://arxiv.org/abs/2407.01489
- CaMeL: https://arxiv.org/abs/2503.18813
- Repository Intelligence Graph: https://arxiv.org/abs/2601.10112
- FeatureBench: https://arxiv.org/abs/2602.10975
- SWE-Bench Mobile: https://arxiv.org/abs/2602.09540
- Evaluating AGENTS.md: https://arxiv.org/abs/2602.11988
- SWE-Skills-Bench: https://arxiv.org/abs/2603.15401
- AI dev tools prompt injection: https://arxiv.org/abs/2603.21642
