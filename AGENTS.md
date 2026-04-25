# Agent Instructions

이 저장소는 일본 대학용 AI Learning Operations OS인 JP LMS VibeOps의 설계와 초기 구현을 관리한다.

## Mission

- 기존 `japan_lms_claude_max` 프로토타입을 그대로 복제하지 않는다.
- NetLearning/manaba 위에 붙는 AI 운영 레이어를 설계한다.
- 모든 AI 판단은 근거, 모델 버전, 불확실성, 권장 행동, 효과 측정 계획을 가져야 한다.
- VibeOps 방식의 실행 기록, 승인, 검증, 롤백 원칙을 제품 설계와 개발 프로세스에 모두 적용한다.

## Source Discipline

- `references/`는 설계 근거다. 직접 수정하지 말고 새 해석은 `docs/` 또는 `specs/`에 작성한다.
- 대형 HTML/PPT 원본은 기본적으로 복제하지 않는다. 필요한 경우 `legacy/` 또는 외부 링크로 분리한다.
- 기존 프로토타입에서 기능을 가져올 때는 화면 조각을 복사하지 말고 scenario, event, xAI schema로 재작성한다.

## Product Constraints

- LMS replacement 금지. 기본 포지션은 "compose, not replace"다.
- 학생 UI에서 낙인성 표현을 기본 금지한다. 위험 명단보다 지원 가능성과 측정 가능한 개입을 우선한다.
- APPI, 동의, 데이터 최소화, 삭제/내보내기, 감사 로그를 MVP 설계에서 제외하지 않는다.
- 일본어 카피는 AI 초안을 최종본으로 간주하지 않는다. 원어민과 일본 대학 관계자 검수가 필요하다.

## Engineering Direction

- 첫 구현은 거대한 단일 HTML이 아니라 route manifest, scenario data, component, verification harness로 나눈다.
- 브라우저 데모는 Playwright screenshot, console error, accessibility check를 통과해야 한다.
- PR에는 acceptance mapping, test evidence, security/privacy impact, rollback plan을 포함한다.
- 실험은 worktree/sandbox에서 진행하고, 본선 반영은 approval gate를 통과한 변경만 허용한다.
