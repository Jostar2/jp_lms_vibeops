# VibeOps OS Design Prep Reference Synthesis

기준일: 2026-04-25

이 문서는 Harness, gstack, 자율 운영 OS 계열 연구, 그리고 GitHub에서 채택 신호가 큰 오픈소스 agentic development 프로젝트를 VibeOps OS 설계에 반영하기 위한 준비 메모다. 별점과 제품 기능은 빠르게 변하므로, 여기의 수치는 방향성 신호로만 사용하고 최종 의사결정은 내부 평가 하네스와 운영 리스크 기준으로 내린다.

## 1. 핵심 결론

VibeOps OS는 "프롬프트 모음"이나 "코딩 에이전트 UI"가 아니라, 다음 네 가지를 결합한 운영 계층으로 잡아야 한다.

1. Pipeline-native control plane
   - Harness Agents의 강점은 agent를 별도 봇이 아니라 기존 pipeline, RBAC, secret, approval, audit trail 안에서 실행한다는 점이다.
   - VibeOps OS도 agent run을 독립 채팅 세션이 아니라 `task -> spec -> effect -> evidence -> approval`로 이어지는 실행 가능한 workflow record로 다뤄야 한다.

2. Role workflow without role theater
   - gstack의 채택 신호는 `office-hours -> review -> qa -> ship`처럼 기억하기 쉬운 역할 기반 워크플로가 실제 사용성을 만든다는 점을 보여준다.
   - 단, 역할 이름 자체가 안전성을 보장하지 않는다. VibeOps OS의 역할은 반드시 입력/출력 계약, 권한, 검증 gate, evidence requirement를 가져야 한다.

3. Deterministic effect ledger
   - AgentOS, Sovereign-OS, Qualixar OS 계열은 자율성을 키울수록 replay, signed receipt, budget, permission, drift detection이 핵심이 된다는 설계 압력을 준다.
   - VibeOps OS는 모든 외부 I/O를 explicit effect로 기록하고, tool call과 파일 변경과 테스트 결과를 replay 가능한 event stream으로 남겨야 한다.

4. GitHub-native adoption path
   - 인기 있는 coding agent 프로젝트들은 CLI/TUI, IDE extension, PR checks, repo-local instruction files, MCP integration처럼 개발자의 기존 표면에 붙는다.
   - 초기 MVP는 새 플랫폼 UI보다 GitHub PR, Actions, `AGENTS.md`, `.vibeops/` manifests, CLI command 중심으로 설계하는 편이 채택 가능성이 높다.

## 2. Harness에서 가져올 설계 패턴

참조:

- Harness AI overview: https://developer.harness.io/docs/platform/harness-ai/overview/
- Harness Agents: https://developer.harness.io/docs/platform/harness-ai/harness-agents/
- Harness DevOps Agent: https://developer.harness.io/docs/platform/harness-ai/devops-agent/
- Harness AI product page: https://www.harness.io/products/harness-ai

설계 반영:

| Harness 패턴 | VibeOps OS 반영 |
| --- | --- |
| Agents run inside pipelines | agent session을 pipeline step 또는 GitHub Action job으로 모델링 |
| Same RBAC, secrets, approvals, audit trail | agent 전용 권한 체계를 새로 만들되 기존 CI/CD 권한과 연결 |
| Agents are forkable pipeline templates | `agent_profile`과 `workflow_template`을 버전 관리 가능한 YAML로 정의 |
| Knowledge Graph grounded in org state | Knowledge Substrate에 repo, CI, deploy, incident, owner, policy graph를 함께 저장 |
| OPA policy gates | `policies/vibeops-policy.yaml`을 Rego 또는 CEL 등 실행 가능한 policy로 승격 |
| Visible artifacts only | PR, review packet, comment, manifest 외 silent mutation 금지 |
| MCP Gateway proxy | 외부 tool은 직접 연결하지 않고 allowlist, taint tagging, audit, rate limit을 통과 |
| BYOM connectors | 모델 선택은 agent 코드에 박지 않고 connector와 policy로 분리 |

VibeOps OS 설계 결정:

- "agent가 pipeline을 만든다"보다 먼저 "agent 자체가 pipeline 안에서 돈다"를 기본값으로 둔다.
- self-hosted, SaaS, local model 모두 같은 `model_connector` 인터페이스를 탄다.
- approval은 UI 버튼이 아니라 workflow step이다. 승인 step은 task risk, changed area, evidence completeness를 입력으로 받는다.

## 3. gstack에서 가져올 설계 패턴

참조:

- gstack site: https://gstack.lol/
- gstack GitHub: https://github.com/garrytan/gstack

유효한 신호:

- 시작점을 `/office-hours` 같은 brief 생성으로 고정한다.
- 구현 이후 `/review`, `/qa`, `/ship` 같은 짧고 반복 가능한 command chain을 제공한다.
- browser QA와 release checklist를 agent workflow의 자연스러운 일부로 만든다.
- 독립 모델의 second opinion을 리뷰 gate로 사용한다.
- prompt injection defense, tab isolation, scoped token, domain restriction 등 browser/tool 사용의 위험을 전면에 둔다.

주의할 점:

- gstack은 주로 role-based skill pack이다. VibeOps OS가 그대로 복사하면 정책 없는 역할극이 된다.
- VibeOps OS에서는 skill command가 직접 권한을 갖지 않는다. command는 task spec, required gates, allowed effects를 생성하거나 갱신하는 entrypoint여야 한다.
- `QA Lead` 같은 이름보다 중요한 것은 "어떤 evidence를 생성해야 통과인가"다.

VibeOps OS skill surface 초안:

| Command | 목적 | 출력 |
| --- | --- | --- |
| `/intake` | 자연어 요청을 구조화 명세로 수렴 | `task-spec.yaml` |
| `/plan` | 변경 범위와 위험도 결정 | `change-plan.md`, required gates |
| `/implement` | 제한 권한으로 패치 생성 | diff, `change-manifest.yaml` |
| `/review` | 코드/명세/보안 리뷰 | review findings, risk changes |
| `/qa` | focused test, browser QA, regression check | test evidence, screenshots if UI |
| `/ship` | PR packet, rollback, release 조건 생성 | `review-packet.yaml` |
| `/postmortem` | 장애 신호를 재발 방지 task로 변환 | incident packet, follow-up tests |

## 4. GitHub 인기 프로젝트에서 보이는 채택 패턴

아래 별점은 2026-04-25에 GitHub API로 확인한 스냅샷이다. 인기도는 품질 보증이 아니라 adoption signal이다.

| Repo | Stars | 관찰한 패턴 | 설계 반영 |
| --- | ---: | --- | --- |
| openclaw/openclaw | 363,523 | 개인 장치에서 실행되는 범용 assistant, gateway/control plane | local-first runtime과 personal/enterprise profile 분리 |
| n8n-io/n8n | 185,487 | workflow automation과 많은 integration | agent effect를 workflow node처럼 선언 |
| anomalyco/opencode | 149,084 | provider-agnostic coding agent, TUI, client/server | CLI/TUI 우선, model connector 분리 |
| langflow-ai/langflow | 147,337 | visual agent/workflow builder | Phase 2 이후 visual workflow는 manifest 기반으로 생성 |
| garrytan/gstack | 82,676 | 역할 기반 skill workflow, QA/release command | skill command를 bounded workflow entrypoint로 채택 |
| openai/codex | 77,717 | local terminal coding agent | local sandbox와 cloud task를 같은 run model로 추상화 |
| OpenHands/OpenHands | 72,020 | SDK, CLI, local GUI, cloud, enterprise | runtime과 UI를 분리하고 SDK-first 구조 고려 |
| cline/cline | 60,965 | IDE 안에서 file edit, command, browser use를 permission 기반 실행 | effectful action마다 user-visible approval |
| microsoft/autogen | 57,408 | multi-agent framework, maintenance mode 공지 | 외부 framework 의존은 교체 가능하게 둠 |
| crewAIInc/crewAI | 49,823 | role-playing autonomous agents, HITL, observability | 역할 기반 orchestrator는 evidence contract와 함께 사용 |
| Aider-AI/aider | 43,900 | terminal pair programming, codebase map | Phase 1에는 단순한 repo map과 focused edit loop 우선 |
| aaif-goose/goose | 43,183 | extensible local agent, MCP support | MCP gateway와 local extension story 정리 |
| continuedev/continue | 32,777 | repo-local AI checks, CI-enforced status checks | `.vibeops/checks/`와 GitHub Action gate 도입 |
| langchain-ai/langgraph | 30,288 | graph 기반 resilient agent runtime | long-running workflow는 DAG/graph로 명시 |
| RooCodeInc/Roo-Code | 23,365 | editor 내 modes, checkpoints, custom modes | mode는 permission profile과 output contract로 정의 |
| SWE-agent/SWE-agent | 19,054 | issue-to-fix loop와 ACI 연구 기반 | ACI syscall 설계를 MVP 핵심으로 유지 |

반영해야 할 공통점:

- 설치와 사용 표면이 짧아야 한다. `npx`, `brew`, VS Code extension, CLI 같은 진입점이 중요하다.
- repo-local config가 강하다. `AGENTS.md`, `.continue/checks/`, custom modes, skills는 모두 "프로젝트가 agent에게 지침을 제공"하는 패턴이다.
- browser와 real app QA가 중요해지고 있다. UI 변경은 screenshot, trace, video, accessibility check가 review packet에 들어가야 한다.
- provider-agnostic과 local model 지원은 장기 채택의 기본 기대치가 되고 있다.
- 별도 대시보드보다 PR status check와 comment가 초기 신뢰 형성에 더 유리하다.

## 5. 자율 운영 OS 연구에서 가져올 설계 패턴

참조:

- AgentOS: https://github.com/smartcomputer-ai/agent-os
- Qualixar OS: https://arxiv.org/abs/2604.06392
- Sovereign-OS: https://arxiv.org/abs/2603.14011

설계 반영:

| 자율 OS 패턴 | VibeOps OS 반영 |
| --- | --- |
| Declarative charter | `task-spec.yaml` 위에 조직 단위 `operating-charter.yaml` 추가 |
| Budget and fiscal gates | token, wall time, tool call, infra cost, deploy risk budget을 gate화 |
| Earned autonomy | task success, gate escape, rollback history 기반 agent permission 상승 |
| Signed receipts | 외부 tool call, deploy, approval, file mutation에 hash-linked receipt 부여 |
| Event-sourced replay | trajectory store를 append-only event log로 정의 |
| Explicit effects | shell/network/file/db/cloud 작업을 선언된 effect로 제한 |
| Drift and Goodhart detection | KPI 최적화가 테스트 약화나 scope gaming으로 변질되는지 탐지 |
| Multi-topology orchestration | Phase 2 이후 graph/DAG 기반 orchestrator로 확장 |

중요한 제약:

- 운영 코드 자기수정은 계속 금지한다.
- self-improvement는 prompt, workflow, policy, test selection에 한정한다.
- 자율성 상승은 사람이 부여하는 label이 아니라 평가 하네스 결과와 gate escape rate를 근거로 한다.

## 6. VibeOps OS 설계 준비안

### 6.1 Repository Surface

초기 MVP는 다음 파일 구조를 기준으로 설계한다.

```text
AGENTS.md
.github/
  pull_request_template.md
  workflows/
    vibeops-gate.yml
schemas/
  task-spec.schema.yaml
  task-spec.example.yaml
  policy.schema.yaml
  workflow.schema.yaml
  change-manifest.schema.yaml
  change-manifest.example.yaml
  review-packet.schema.yaml
  review-packet.example.yaml
  trajectory-event.schema.yaml
  trajectory-event.example.jsonl
.vibeops/
  operating-charter.yaml
  vibeops-gate.yaml
  checks/
    security-review.md
    test-coverage.md
    spec-conformance.md
    browser-qa.md
  workflows/
    intake.yaml
    implement.yaml
    review.yaml
    qa.yaml
    ship.yaml
scripts/
  vibeops_gate.py
```

### 6.2 Runtime Layers

```text
[CLI / GitHub Comment / IDE Command]
        |
        v
[Workflow Entrypoint]
intake, plan, implement, review, qa, ship
        |
        v
[Policy Kernel]
risk, permission, budget, model, effect allowlist
        |
        v
[Agent Runtime]
role profile, model connector, context selector, ACI syscall
        |
        v
[Effect Gateway]
file, test, shell, network, MCP, GitHub, CI, browser
        |
        v
[Evidence Store]
trajectory, receipts, logs, screenshots, test outputs, diff
        |
        v
[Governance Gate]
review packet, approval, PR status, audit log
```

### 6.3 MVP Workflows

1. Intake
   - Input: user request, issue, PR comment, alert
   - Output: `task-spec.yaml`
   - Gate: acceptance criteria must be verifiable

2. Implement
   - Input: task spec, repo context, policy
   - Output: patch, `change-manifest.yaml`
   - Gate: declared changed areas must match diff

3. QA
   - Input: diff, manifest, required gates
   - Output: test evidence, browser evidence when relevant
   - Gate: focused tests pass, no test weakening

4. Review
   - Input: diff, evidence, risk profile
   - Output: review findings and security notes
   - Gate: unresolved high severity finding blocks PR readiness

5. Ship
   - Input: spec, manifest, review, tests
   - Output: `review-packet.yaml`, PR description
   - Gate: approval requirement computed from risk and confidence

### 6.4 Evaluation Harness Additions

세부 설계는 [evaluation-harness-design.md](evaluation-harness-design.md)에 둔다. 기존 Phase 0.5 평가 하네스에는 다음 항목을 추가한다.

| Metric | 목적 |
| --- | --- |
| workflow completion rate | command chain이 중간에 깨지는지 측정 |
| effect denial rate | 정책이 과도하거나 느슨한지 측정 |
| evidence completeness | 수용 기준이 test/log/screenshot과 매핑되는지 측정 |
| review finding precision | review agent가 실제 결함을 잡는지 측정 |
| browser QA catch rate | UI/UX 회귀를 browser QA가 잡는지 측정 |
| second-opinion delta | 다른 모델/agent 리뷰가 고유한 결함을 찾는 비율 |
| gate escape rate | gate 통과 후 발견된 결함 비율 |
| autonomy promotion safety | 권한 상승 후 실패율 변화 |

### 6.5 Design Backlog

P0 산출물:

- 정책 용어는 `verified_by_test` 같은 snake_case identifier로 통일
- ACI syscall 이름과 policy action 이름은 `test_run_focused`, `change_manifest_write`처럼 통일
- `task-spec.schema.yaml`은 실제 schema로 유지하고 example은 별도 파일로 분리
- `change-manifest`, `review-packet`, `trajectory-event` schema 추가
- GitHub Action 기반 `vibeops-gate` 초안 작성
- Review Packet PR template 작성

P1:

- `operating-charter.yaml` 설계
- effect receipt format 설계
- trajectory event schema 설계
- `.vibeops/checks/*.md`를 CI-enforced AI check로 실행하는 PoC
- browser QA artifact format 설계
- model connector와 MCP gateway policy 연결

P2:

- role profile registry 설계
- parallel worktree scheduler 설계
- cross-model second opinion gate 설계
- earned autonomy scoring 설계
- visual workflow builder는 manifest editor 위에 얹는 형태로 검토

## 7. 복사하지 않을 것

- 별점 높은 프로젝트의 UX를 그대로 복사하지 않는다. 별점은 adoption signal일 뿐이다.
- 역할 이름만 늘리지 않는다. 역할은 output contract와 gate가 있을 때만 추가한다.
- 모든 것을 multi-agent로 시작하지 않는다. Phase 1은 단일 agent와 강한 검증 루프가 우선이다.
- self-modifying agent를 운영 코드에 적용하지 않는다. 자기개선은 평가 하네스와 사람 리뷰를 통과한 workflow/prompt/policy 변경에 한정한다.
- 외부 tool을 agent에 직접 연결하지 않는다. MCP gateway와 effect gateway가 기본 경계다.
