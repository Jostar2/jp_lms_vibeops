const data = window.JP_LMS_VIBEOPS_DATA || {};
const xaiCards = data.xai_cards || [];
const cardById = Object.fromEntries(xaiCards.map((card) => [card.card_id, card]));

const state = {
  route: routeFromHash(),
  planMinutes: 30,
  completedTaskIds: new Set(['warmup']),
  activeCardId: 'xai_s12_pace_agent_001',
  activeAudience: 'all',
  draftVariant: 'bridge',
  draftStatus: 'review',
  meiwakuStatus: '',
  chat: [
    {
      role: 'assistant',
      text: '오늘은 부담을 줄이는 30분 플랜이 적합합니다. 근거는 학습자 요청, 이번 주 학습량, W7 확인 문제 흐름입니다.',
    },
  ],
};

function routeFromHash() {
  return window.location.hash.replace('#', '') || 'student';
}

const routes = {
  student: {
    title: '학습자 홈',
    context: 'Data Mining · W7 Lecture 2 · AI learning coach',
    render: renderStudentHome,
  },
  instructor: {
    title: '교수자 스튜디오',
    context: 'Course Studio · aggregate signal · instructor approval',
    render: renderInstructorStudio,
  },
  evidence: {
    title: 'AI 근거',
    context: 'xAI cards · uncertainty · measurement · impact',
    render: renderEvidenceBoard,
  },
  course: {
    title: '수업 설정',
    context: 'LMS embed · policy gates · student safety',
    render: renderCourseSetup,
  },
};

const planTemplates = {
  20: [
    {
      id: 'warmup',
      title: '엔트로피 정의 빠른 복습',
      detail: '강의 18:12 지점 전에 핵심 정의와 예시 1개만 확인합니다.',
      minutes: 3,
      cardId: 'xai_s01_student_hint_001',
    },
    {
      id: 'checkpoint',
      title: '확인 문제 1개',
      detail: '정답보다 선택 이유를 먼저 말하게 하여 AI가 오개념을 좁힙니다.',
      minutes: 7,
      cardId: 'xai_s01_student_hint_001',
    },
    {
      id: 'review',
      title: 'W7 과제 시작점 정리',
      detail: '오늘 끝낼 수 있는 최소 단계를 AI 코치가 다시 쪼갭니다.',
      minutes: 10,
      cardId: 'xai_s12_pace_agent_001',
    },
  ],
  30: [
    {
      id: 'warmup',
      title: '엔트로피 정의 3분 복습',
      detail: '멈춤이 집중된 구간으로 바로 들어가기 전 선행 개념을 짧게 맞춥니다.',
      minutes: 3,
      cardId: 'xai_s01_student_hint_001',
    },
    {
      id: 'bridge',
      title: 'AI 브리지 설명 보기',
      detail: 'Gini와 Entropy 비교를 교수자 톤에 맞춘 보강 설명으로 다시 봅니다.',
      minutes: 12,
      cardId: 'xai_s11_cocreation_001',
    },
    {
      id: 'checkpoint',
      title: '확인 문제와 해설',
      detail: '선택 이유를 남기면 AI가 다음 문제 난이도를 조정합니다.',
      minutes: 8,
      cardId: 'xai_s01_student_hint_001',
    },
    {
      id: 'plan',
      title: '과제 계획 저장',
      detail: '마감 전까지 남은 학습량을 오늘 이후 일정으로 자동 배치합니다.',
      minutes: 7,
      cardId: 'xai_s12_pace_agent_001',
    },
  ],
  45: [
    {
      id: 'warmup',
      title: '선행 개념 정리',
      detail: '엔트로피 정의, 불순도 비교, 예시 데이터를 한 번에 묶어 봅니다.',
      minutes: 8,
      cardId: 'xai_s01_student_hint_001',
    },
    {
      id: 'lecture',
      title: 'Lecture 2 집중 시청',
      detail: 'AI가 22% 구간에 표시한 멈춤 지점을 기준으로 재시청합니다.',
      minutes: 15,
      cardId: 'xai_s01_student_hint_001',
    },
    {
      id: 'practice',
      title: '적응형 확인 문제 3개',
      detail: '응답 패턴에 따라 힌트 강도를 조절하지만 성적에는 반영하지 않습니다.',
      minutes: 12,
      cardId: 'xai_s12_pace_agent_001',
    },
    {
      id: 'assignment',
      title: '과제 초안 작성',
      detail: 'AI가 제출물을 대신 쓰지 않고 구조와 체크리스트만 제안합니다.',
      minutes: 10,
      cardId: 'xai_s12_pace_agent_001',
    },
  ],
};

const draftVariants = {
  bridge: {
    label: '3분 브리지',
    title: '엔트로피를 먼저 떠올리게 하는 짧은 도입',
    body: 'Gini는 한 노드가 얼마나 한쪽 클래스로 기울었는지 빠르게 보는 지표이고, Entropy는 선택지가 섞여 있을 때의 불확실성을 더 민감하게 봅니다. 같은 데이터로 두 값을 비교한 뒤 기존 Lecture 2 설명으로 이어집니다.',
    checkpoint: '확인 문제: 두 분할 후보 중 Entropy가 더 낮은 쪽을 고르고 이유를 1문장으로 남깁니다.',
  },
  example: {
    label: '예시 중심',
    title: '작은 표본으로 Gini와 Entropy를 나란히 계산',
    body: '출석/비출석 예시 6개를 사용해 분할 전후의 불순도 변화를 한 줄씩 계산합니다. 수식보다 비교 방향을 먼저 보여주고 이후 수식으로 연결합니다.',
    checkpoint: '확인 문제: 같은 분할에서 Gini와 Entropy가 같은 방향으로 움직이는지 확인합니다.',
  },
  prompt: {
    label: '질문형',
    title: '학습자가 먼저 예측하게 하는 Socratic prompt',
    body: '“두 그룹이 더 섞여 보이는 쪽은 어디인가요?”라는 질문으로 시작한 뒤 AI가 학생 답변에 맞춰 힌트 강도를 조정합니다.',
    checkpoint: '확인 문제: 본인의 예측과 계산 결과가 달랐던 이유를 선택합니다.',
  },
};

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function activeCard() {
  return cardById[state.activeCardId] || xaiCards[0] || {
    card_id: 'empty',
    scenario_id: 'N/A',
    audience: 'student',
    judgment: { summary: 'AI 근거가 아직 연결되지 않았습니다.', confidence: 0 },
    evidence: [],
    model: { name: 'not_available', version: '0.0.0', run_id: 'not_available' },
    uncertainty: { summary: '근거 없음', interval_or_reason: 'not_available' },
    recommended_action: { label: '연결된 행동 없음', owner: 'student', requires_approval: false },
    measurement_plan: { metric: 'not_available', method: 'not_available', reevaluate_at: 'not_available' },
    governance: { privacy_level: 'unknown', approval_gate: 'none', appeal_control: 'none', data_scope: [] },
  };
}

function resultFor(scenarioId) {
  return (data.measurement_results || []).find((result) => result.scenario_id === scenarioId);
}

function approvalFor(scenarioId) {
  return (data.approvals || []).find((approval) => approval.scenario_id === scenarioId);
}

function scenarioFor(scenarioId) {
  return (data.scenario_matrix || []).find((scenario) => scenario.scenario_id === scenarioId);
}

function chip(text, tone = '') {
  return `<span class="chip ${tone}">${esc(text)}</span>`;
}

function tag(text, tone = '') {
  return `<span class="tag ${tone}">${esc(text)}</span>`;
}

function panel(title, subtitle, body, action = '') {
  return `
    <section class="panel">
      <div class="panel-head">
        <div class="panel-title">
          <h3>${esc(title)}</h3>
          ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
        </div>
        ${action}
      </div>
      <div class="panel-body">${body}</div>
    </section>
  `;
}

function metric(label, value, note = '') {
  return `
    <div class="metric">
      <label>${esc(label)}</label>
      <strong>${esc(value)}</strong>
      ${note ? `<small>${esc(note)}</small>` : ''}
    </div>
  `;
}

function formatPercent(value) {
  if (typeof value !== 'number') return 'N/A';
  const percent = Math.round(value * 100);
  return `${percent > 0 ? '+' : ''}${percent}%`;
}

function confidenceLabel(card) {
  return `${Math.round((card.judgment?.confidence || 0) * 100)}%`;
}

function currentPlan() {
  return planTemplates[state.planMinutes] || planTemplates[30];
}

function progressPercent() {
  const plan = currentPlan();
  const done = plan.filter((task) => state.completedTaskIds.has(task.id)).length;
  return Math.round((done / plan.length) * 100);
}

function renderStudentHome() {
  const plan = currentPlan();
  const paceCard = cardById.xai_s12_pace_agent_001 || activeCard();
  const hintCard = cardById.xai_s01_student_hint_001 || activeCard();
  const result = resultFor('S12');
  const progress = progressPercent();

  return `
    <div class="layout-student">
      <div class="lesson-brief">
        ${panel(
          '오늘의 학습 플랜',
          'AI 코치가 학습량, 마감, 강의 멈춤 신호를 보고 지금 가능한 분량으로 재구성합니다.',
          `
            <div class="brief-main">
              <div>
                <h3>W7 의사결정나무: Gini와 Entropy 연결</h3>
                <p>${esc(paceCard.judgment.summary)}</p>
              </div>
              <button class="ai-score" data-action="select-card" data-card-id="xai_s12_pace_agent_001" aria-label="AI 추천 근거 보기">
                <strong>${confidenceLabel(paceCard)}</strong>
                <span>AI 추천 신뢰도</span>
              </button>
            </div>
            <div class="time-control" aria-label="학습 시간 선택">
              ${[20, 30, 45].map((minutes) => `
                <button class="${state.planMinutes === minutes ? 'active' : ''}" data-action="set-minutes" data-minutes="${minutes}">
                  ${minutes}분
                </button>
              `).join('')}
            </div>
            <div class="progress-track" aria-label="학습 진행률">
              <div class="progress-fill" style="--progress: ${progress}%"></div>
            </div>
            <div class="task-list">
              ${plan.map(renderTask).join('')}
            </div>
            ${state.meiwakuStatus ? `<div class="state-note">${esc(state.meiwakuStatus)}</div>` : ''}
            <div class="action-row">
              <button class="primary-button" data-action="ask-ai" data-prompt="start">AI 코치와 시작</button>
              <button class="secondary-button" data-action="select-card" data-card-id="xai_s01_student_hint_001">근거 보기</button>
              <button class="danger-button" data-action="challenge">추천이 맞지 않음</button>
            </div>
          `,
          tag('student controlled', 'ok'),
        )}

        ${panel(
          'AI 튜터 세션',
          '학생이 답을 받기보다 자기 설명을 만들도록 힌트 강도를 조절합니다.',
          `
            <div class="insight-list">
              <button class="insight-row" data-action="ask-ai" data-prompt="why">
                <span class="check">AI</span>
                <div>
                  <b>왜 이 구간을 먼저 보나요?</b>
                  <span>${esc(hintCard.judgment.summary)}</span>
                </div>
                <span class="minutes">근거</span>
              </button>
              <button class="insight-row" data-action="ask-ai" data-prompt="quiz">
                <span class="check">?</span>
                <div>
                  <b>확인 문제를 한 개만 풀기</b>
                  <span>정답 여부보다 선택 이유를 보고 다음 힌트를 조절합니다.</span>
                </div>
                <span class="minutes">7분</span>
              </button>
              <button class="insight-row" data-action="request-help">
                <span class="check">↗</span>
                <div>
                  <b>교수자에게 도움 요청</b>
                  <span>개인 낙인 없이 “강의 구간 설명 보강 요청”으로 전달됩니다.</span>
                </div>
                <span class="minutes">선택</span>
              </button>
            </div>
          `,
        )}
      </div>

      <div class="course-player">
        ${panel(
          '강의 안에서 보이는 AI',
          '추천은 별도 대시보드가 아니라 실제 학습 화면 안에 붙습니다.',
          renderVideoSurface(),
          tag('LMS embedded', 'ok'),
        )}

        ${panel(
          '학습자 안전 장치',
          'AI는 성적 판단자가 아니라 설명 가능한 보조자입니다.',
          `
            <div class="metric-grid">
              ${metric('완료율 변화', result ? formatPercent(result.observed.plan_completion_delta) : 'N/A', 'self plan acceptance')}
              ${metric('지원 체감', result ? `${result.observed.perceived_support_score}/5` : 'N/A', 'short survey')}
              ${metric('이의제기', 'Meiwaku', `${paceCard.governance.appeal_control} control`)}
            </div>
            <div class="state-note ok">학생은 추천을 저장, 수정, 숨김 처리할 수 있고 추천 거절은 성적이나 교수자 평가에 반영되지 않습니다.</div>
          `,
        )}
      </div>
    </div>
  `;
}

function renderTask(task) {
  const done = state.completedTaskIds.has(task.id);
  return `
    <button class="task-row ${done ? 'done' : ''}" data-action="toggle-task" data-task-id="${esc(task.id)}" data-card-id="${esc(task.cardId)}">
      <span class="check">${done ? '✓' : ''}</span>
      <div>
        <b>${esc(task.title)}</b>
        <span>${esc(task.detail)}</span>
      </div>
      <span class="minutes">${esc(task.minutes)}분</span>
    </button>
  `;
}

function renderVideoSurface() {
  return `
    <div class="video-surface">
      <div class="video-main">
        <strong>Lecture 2 · Tree Split Criteria</strong>
        <span>18:12 지점에서 AI가 “엔트로피 정의 확인”을 제안합니다. 학생은 바로 수락하거나 숨기거나 근거를 열 수 있습니다.</span>
        <div class="action-row">
          <button class="primary-button" data-action="select-card" data-card-id="xai_s01_student_hint_001">AI 힌트 열기</button>
          <button class="ghost-button" data-action="challenge">숨기기</button>
        </div>
      </div>
      <div class="timeline" aria-label="강의 타임라인">
        <div class="segment">0:00</div>
        <div class="segment">12:40</div>
        <button class="segment hot" data-action="select-card" data-card-id="xai_s01_student_hint_001">18:12</button>
        <div class="segment">26:50</div>
        <div class="segment">34:10</div>
      </div>
    </div>
    <div class="checkpoint">
      <div>
        <b>다음 체크포인트</b>
        <span>“Entropy가 낮아졌다는 말은 무엇을 의미하나요?”에 한 문장으로 답합니다.</span>
      </div>
      <button class="secondary-button" data-action="ask-ai" data-prompt="quiz">AI 힌트</button>
    </div>
  `;
}

function renderInstructorStudio() {
  const interventionCard = cardById.xai_s01_instructor_intervention_001 || activeCard();
  const cocreationCard = cardById.xai_s11_cocreation_001 || activeCard();
  const result = resultFor('S01');
  const approval = approvalFor('S11');
  const variant = draftVariants[state.draftVariant];
  const approved = state.draftStatus === 'approved';

  return `
    <div class="layout-instructor">
      <div class="lesson-brief">
        ${panel(
          '수업 신호 요약',
          '개별 학생을 낙인찍지 않고 집계 신호로 교수자의 수업 개선 결정을 돕습니다.',
          `
            <div class="metric-grid">
              ${metric('멈춤 집중 구간', '22%', 'Lecture 2 timeline')}
              ${metric('확인 문제 기준선', '61%', 'checkpoint correct rate')}
              ${metric('AI 제안 신뢰도', confidenceLabel(interventionCard), interventionCard.model.name)}
            </div>
            <div class="heatmap">
              ${renderHeatRow('12:40 기본 개념', 38, false)}
              ${renderHeatRow('18:12 Gini / Entropy', 82, true)}
              ${renderHeatRow('26:50 예시 계산', 46, false)}
              ${renderHeatRow('34:10 과제 안내', 28, false)}
            </div>
            <div class="action-row">
              <button class="secondary-button" data-action="select-card" data-card-id="xai_s01_instructor_intervention_001">교수자 근거 보기</button>
              <button class="secondary-button" data-action="set-route" data-route="evidence">전체 xAI 카드</button>
            </div>
          `,
          tag('aggregate only', 'ok'),
        )}

        ${panel(
          '효과 측정',
          'AI 제안은 게시 후 실제 수업 지표로 다시 검증됩니다.',
          `
            <div class="measure-grid">
              <div class="result-tile">
                <strong>${result ? formatPercent(result.observed.segment_rewatch_rate_delta) : 'N/A'}</strong>
                <span>반복 재시청률 변화 · switchback measurement</span>
              </div>
              <div class="result-tile">
                <strong>${result ? formatPercent(result.observed.checkpoint_correct_rate_delta) : 'N/A'}</strong>
                <span>다음 확인 문제 정답률 변화 · limitation retained</span>
              </div>
            </div>
            <div class="state-note">측정 결과는 단일 강의 파일럿 기준이며 다른 학기나 과목으로 일반화하지 않습니다.</div>
          `,
          tag('measurement linked', 'ok'),
        )}
      </div>

      <div class="draft-box">
        ${panel(
          'AI Co-Creation Studio',
          '교수자가 수업 톤과 Teaching Profile을 유지하면서 AI 초안을 검토합니다.',
          `
            <div class="variant-tabs" aria-label="AI 초안 변형">
              ${Object.entries(draftVariants).map(([key, item]) => `
                <button class="${state.draftVariant === key ? 'active' : ''}" data-action="set-variant" data-variant="${key}">
                  ${esc(item.label)}
                </button>
              `).join('')}
            </div>
            <div class="draft-preview">
              <header>
                <div>
                  <h4>${esc(variant.title)}</h4>
                  <p>AI draft · source card ${esc(cocreationCard.card_id)}</p>
                </div>
                ${approved ? tag('승인됨', 'ok') : tag('교수자 검토 필요', 'warn')}
              </header>
              <div class="draft-body">
                <strong>보강 설명</strong>
                <span>${esc(variant.body)}</span>
                <strong>확인 문제</strong>
                <span>${esc(variant.checkpoint)}</span>
              </div>
            </div>
            <div class="state-note ${approved ? 'ok' : ''}">
              ${approved
                ? `게시 예약됨. 롤백 메모: ${esc(approval?.rollback_note || '원본 자료로 되돌릴 수 있습니다.')}`
                : '아직 게시되지 않았습니다. 교수자가 승인하기 전에는 학생 화면에 노출되지 않습니다.'}
            </div>
            <div class="action-row">
              <button class="primary-button" data-action="approve-draft">${approved ? '승인 상태 유지' : '승인하고 게시 예약'}</button>
              <button class="secondary-button" data-action="select-card" data-card-id="xai_s11_cocreation_001">초안 근거</button>
              <button class="ghost-button" data-action="ask-ai" data-prompt="draft">AI에게 대안 요청</button>
            </div>
          `,
          tag('approval gated', approved ? 'ok' : 'warn'),
        )}

        ${panel(
          '학생 경험 미리보기',
          '교수자가 승인한 보강 자료가 학습자 화면에서 어떻게 보이는지 함께 확인합니다.',
          `
            <div class="feed-list">
              <div class="feed-row">
                <span class="check">AI</span>
                <div>
                  <b>학생 카드 문구</b>
                  <span>${esc((cardById.xai_s01_student_hint_001 || interventionCard).judgment.summary)}</span>
                </div>
                <span class="minutes">G1</span>
              </div>
              <div class="feed-row">
                <span class="check">↺</span>
                <div>
                  <b>되돌리기 조건</b>
                  <span>혼란 지표가 상승하거나 교수자가 부적합하다고 판단하면 원본 Lecture 2 구성으로 복원합니다.</span>
                </div>
                <span class="minutes">rollback</span>
              </div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

function renderHeatRow(label, value, warn) {
  return `
    <div class="heat-row">
      <span>${esc(label)}</span>
      <div class="bar ${warn ? 'warn' : ''}" style="--value: ${value}%"><span></span></div>
      <b>${value}%</b>
    </div>
  `;
}

function renderEvidenceBoard() {
  const filtered = xaiCards.filter((card) => state.activeAudience === 'all' || card.audience === state.activeAudience);
  return `
    <div class="layout-evidence">
      ${panel(
        'AI 근거 보드',
        '학생과 교수자가 보는 모든 AI 판단은 같은 xAI 카드, 승인, 측정 계획에 연결됩니다.',
        `
          <div class="filter-row" aria-label="xAI 카드 필터">
            ${[
              ['all', '전체'],
              ['student', '학습자'],
              ['instructor', '교수자'],
            ].map(([key, label]) => `
              <button class="${state.activeAudience === key ? 'active' : ''}" data-action="set-filter" data-filter="${key}">
                ${label}
              </button>
            `).join('')}
          </div>
          <div class="evidence-card-grid">
            ${filtered.map(renderEvidenceCard).join('')}
          </div>
        `,
        tag('xAI registry', 'ok'),
      )}
    </div>
  `;
}

function renderEvidenceCard(card) {
  const active = card.card_id === state.activeCardId;
  return `
    <button class="evidence-card ${active ? 'active' : ''}" data-action="select-card" data-card-id="${esc(card.card_id)}">
      <div>
        <h4>${esc(card.scenario_id)} · ${esc(card.audience)} · ${esc(card.judgment.decision_type)}</h4>
        <p>${esc(card.judgment.summary)}</p>
      </div>
      <div class="confidence">
        <b>confidence ${confidenceLabel(card)}</b>
        <div class="confidence-meter" style="--confidence: ${confidenceLabel(card)}"><span></span></div>
      </div>
      <span class="mono-line">${esc(card.model.name)} · ${esc(card.model.version)}</span>
    </button>
  `;
}

function renderCourseSetup() {
  const s13 = scenarioFor('S13');
  const adapter = data.adapter?.spec || {};
  const gates = [...new Set(data.pilot_gates || [])].slice(0, 5);
  return `
    <div class="layout-course">
      ${panel(
        'LMS 안에 붙는 AI 수업 레이어',
        '별도 콘솔이 아니라 기존 LMS 강의, 과제, 퀴즈 화면에서 AI 보조 기능이 작동합니다.',
        `
          <div class="course-list">
            <div class="course-row">
              <span class="check">LTI</span>
              <div>
                <b>NetLearning / manaba 임베드</b>
                <span>강의 플레이어, 과제, 체크포인트 옆에 AI 코치와 근거 패널을 표시합니다.</span>
              </div>
              <span class="minutes">${esc(adapter.mode || 'fallback')}</span>
            </div>
            <div class="course-row">
              <span class="check">AI</span>
              <div>
                <b>학생별 지원은 학생 통제</b>
                <span>저장, 수정, 숨김, Meiwaku feedback을 학생이 직접 결정합니다.</span>
              </div>
              <span class="minutes">G1</span>
            </div>
            <div class="course-row">
              <span class="check">承</span>
              <div>
                <b>수업 변경은 교수자 승인</b>
                <span>AI 초안은 교수자가 승인해야 게시되고 롤백 조건을 함께 남깁니다.</span>
              </div>
              <span class="minutes">G2</span>
            </div>
          </div>
        `,
        tag('compose, not replace', 'ok'),
      )}

      ${panel(
        '파일럿 게이트',
        'AI 정책 자동 변경처럼 민감한 실행 경로는 실제 대학 승인 없이는 잠겨 있습니다.',
        `
          <div class="pilot-list">
            <div class="pilot-row">
              <span class="check">!</span>
              <div>
                <b>${esc(s13?.scenario_id || 'S13')} · ${esc(s13?.state || 'awaiting_approval')}</b>
                <span>${esc(s13?.reason || 'Academic admin and legal approval required.')}</span>
              </div>
              <span class="minutes">G4</span>
            </div>
            ${gates.map((gate) => `
              <div class="pilot-row">
                <span class="check">□</span>
                <div>
                  <b>${esc(gate)}</b>
                  <span>실제 대학 파일럿 전에 확인해야 하는 증거 항목입니다.</span>
                </div>
                <span class="minutes">pilot</span>
              </div>
            `).join('')}
          </div>
        `,
        tag('locked where needed', 'warn'),
      )}
    </div>
  `;
}

function renderAssistant() {
  const prompts = state.route === 'instructor'
    ? [
      ['draft', '대안 초안'],
      ['measurement', '효과 측정'],
      ['student-preview', '학생 미리보기'],
    ]
    : [
      ['why', '왜 추천했어?'],
      ['adjust', '20분으로 줄여줘'],
      ['quiz', '힌트만 줘'],
    ];

  return `
    <section class="assistant-panel">
      <div class="assistant-head">
        <div style="display: flex; gap: 10px;">
          <span class="ai-badge">AI</span>
          <div>
            <h3>AI 코치</h3>
            <p>현재 화면의 수업 맥락과 xAI 근거를 같이 보고 응답합니다.</p>
          </div>
        </div>
        ${tag('live UX', 'ok')}
      </div>
      <div class="assistant-body">
        <div class="chat-log">
          ${state.chat.slice(-6).map((message) => `
            <div class="chat ${message.role === 'user' ? 'user' : ''}">
              <b>${message.role === 'user' ? '사용자' : 'AI'}</b>
              ${esc(message.text)}
            </div>
          `).join('')}
        </div>
        <div class="prompt-row">
          ${prompts.map(([key, label]) => `<button data-action="ask-ai" data-prompt="${key}">${esc(label)}</button>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderEvidenceDrawer() {
  const card = activeCard();
  const approval = (data.approvals || []).find((item) => item.source_card_id === card.card_id);
  const result = resultFor(card.scenario_id);
  const evidenceRows = (card.evidence || []).map((item) => `
    <div class="evidence-item">
      <b>${esc(item.source_event)}</b>
      <span>${esc(item.claim)} · weight ${esc(item.weight)}</span>
    </div>
  `).join('');

  document.getElementById('evidenceDrawer').innerHTML = `
    ${renderAssistant()}
    <section class="evidence-panel">
      <div class="evidence-head">
        <div>
          <h3>근거 보기</h3>
          <p>${esc(card.scenario_id)} · ${esc(card.card_id)}</p>
        </div>
        ${tag(card.audience, card.audience === 'student' ? 'ok' : 'warn')}
      </div>
      <div class="evidence-body">
        <div>
          <strong>${esc(card.judgment.summary)}</strong>
        </div>
        <div class="confidence">
          <b>AI confidence ${confidenceLabel(card)}</b>
          <div class="confidence-meter" style="--confidence: ${confidenceLabel(card)}"><span></span></div>
        </div>
        <div class="evidence-list">${evidenceRows || '<div class="empty-state">연결된 근거가 없습니다.</div>'}</div>
        <div class="state-note">
          불확실성: ${esc(card.uncertainty.summary)} · ${esc(card.uncertainty.interval_or_reason)}
        </div>
        <div class="evidence-list">
          <div class="evidence-item">
            <b>권장 행동</b>
            <span>${esc(card.recommended_action.label)} · approval ${esc(card.governance.approval_gate)}</span>
          </div>
          <div class="evidence-item">
            <b>측정 계획</b>
            <span>${esc(card.measurement_plan.metric)} · ${esc(card.measurement_plan.method)} · ${esc(card.measurement_plan.reevaluate_at)}</span>
          </div>
          <div class="evidence-item">
            <b>승인 / 영향</b>
            <span>${esc(approval?.state || 'session action required')} · ${esc(result?.impact_decision || 'measurement pending')}</span>
          </div>
          <div class="evidence-item">
            <b>모델</b>
            <span>${esc(card.model.name)} ${esc(card.model.version)} · ${esc(card.model.run_id)}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStatusStrip() {
  const ready = (data.scenario_matrix || []).filter((item) => item.executable).length;
  const blocked = (data.scenario_matrix || []).length - ready;
  const progress = progressPercent();
  document.getElementById('statusStrip').innerHTML = [
    chip(`학습 ${progress}%`, progress > 70 ? 'ok' : ''),
    chip('AI 근거 연결', 'ok'),
    chip('교수자 승인 경로', 'warn'),
    chip(`${blocked} locked`, blocked ? 'warn' : 'ok'),
  ].join('');
}

function pushChat(role, text) {
  state.chat.push({ role, text });
  if (state.chat.length > 10) {
    state.chat = state.chat.slice(-10);
  }
}

function askAi(prompt) {
  const card = activeCard();
  if (prompt === 'adjust') {
    pushChat('user', '오늘은 20분만 가능해.');
    state.planMinutes = 20;
    pushChat('assistant', '20분 플랜으로 줄였습니다. 핵심 정의, 확인 문제 1개, 과제 시작점만 남기고 나머지는 다음 학습 블록으로 넘깁니다.');
    state.activeCardId = 'xai_s12_pace_agent_001';
    return;
  }
  if (prompt === 'quiz') {
    pushChat('user', '정답 말고 힌트만 줘.');
    pushChat('assistant', '힌트: Entropy가 낮아졌다는 것은 분할 뒤의 불확실성이 줄었다는 뜻입니다. 어느 쪽 노드가 더 한 클래스에 모였는지 먼저 보세요.');
    state.activeCardId = 'xai_s01_student_hint_001';
    return;
  }
  if (prompt === 'draft') {
    pushChat('user', '다른 보강 설명 방식도 제안해줘.');
    state.draftVariant = state.draftVariant === 'bridge' ? 'example' : 'bridge';
    pushChat('assistant', `초안을 ${draftVariants[state.draftVariant].label} 방식으로 바꿨습니다. 교수자 승인 전까지 학생 화면에는 게시하지 않습니다.`);
    state.activeCardId = 'xai_s11_cocreation_001';
    return;
  }
  if (prompt === 'measurement') {
    const result = resultFor('S01');
    pushChat('user', '이 초안이 효과 있었는지 어떻게 보지?');
    pushChat('assistant', `측정은 반복 재시청률 ${result ? formatPercent(result.observed.segment_rewatch_rate_delta) : 'N/A'}, 확인 문제 정답률 ${result ? formatPercent(result.observed.checkpoint_correct_rate_delta) : 'N/A'}를 함께 봅니다. 단일 강의 파일럿 한계도 같이 표시합니다.`);
    state.activeCardId = 'xai_s01_instructor_intervention_001';
    return;
  }
  if (prompt === 'student-preview') {
    pushChat('user', '학생에게 어떻게 보이는지 보여줘.');
    pushChat('assistant', '학생 화면에는 “낙오 위험” 같은 표현 없이 3분 복습, 힌트, 숨김, Meiwaku feedback 컨트롤로 표시됩니다.');
    setRoute('student');
    state.activeCardId = 'xai_s01_student_hint_001';
    return;
  }
  if (prompt === 'start') {
    pushChat('user', '오늘 플랜으로 시작할게.');
    pushChat('assistant', '좋습니다. 먼저 3분 복습을 완료 처리했습니다. 이해가 흔들리면 힌트 강도를 낮춰서 다시 설명하겠습니다.');
    state.completedTaskIds.add('warmup');
    return;
  }
  pushChat('user', '왜 이 추천을 했어?');
  pushChat('assistant', `${card.evidence?.[0]?.claim || '현재 선택된 xAI 카드의 근거'} 판단입니다. 다만 ${card.uncertainty?.summary || '불확실성이 있어 사용자가 조정할 수 있습니다.'}`);
}

function handleAction(button) {
  const action = button.dataset.action;
  if (action === 'set-route') {
    setRoute(button.dataset.route || 'student');
    return;
  }
  if (action === 'set-minutes') {
    state.planMinutes = Number(button.dataset.minutes) || 30;
    state.activeCardId = 'xai_s12_pace_agent_001';
    return;
  }
  if (action === 'toggle-task') {
    const taskId = button.dataset.taskId;
    if (state.completedTaskIds.has(taskId)) {
      state.completedTaskIds.delete(taskId);
    } else {
      state.completedTaskIds.add(taskId);
    }
    if (button.dataset.cardId) state.activeCardId = button.dataset.cardId;
    return;
  }
  if (action === 'select-card') {
    state.activeCardId = button.dataset.cardId || state.activeCardId;
    return;
  }
  if (action === 'set-filter') {
    state.activeAudience = button.dataset.filter || 'all';
    const visible = xaiCards.find((card) => state.activeAudience === 'all' || card.audience === state.activeAudience);
    if (visible) state.activeCardId = visible.card_id;
    return;
  }
  if (action === 'set-variant') {
    state.draftVariant = button.dataset.variant || 'bridge';
    state.activeCardId = 'xai_s11_cocreation_001';
    return;
  }
  if (action === 'approve-draft') {
    state.draftStatus = 'approved';
    state.activeCardId = 'xai_s11_cocreation_001';
    pushChat('assistant', '교수자 승인 상태로 전환했습니다. 게시 예약과 롤백 메모가 함께 남습니다.');
    return;
  }
  if (action === 'challenge') {
    state.meiwakuStatus = '추천을 숨김 처리했습니다. 이 선택은 성적이나 교수자 평가에 반영되지 않고, AI 추천 품질 개선 신호로만 저장됩니다.';
    state.activeCardId = 'xai_s12_pace_agent_001';
    return;
  }
  if (action === 'request-help') {
    state.meiwakuStatus = '교수자에게는 개인 식별 없이 “W7 18:12 구간 설명 보강 요청”으로 전달됩니다.';
    state.activeCardId = 'xai_s01_student_hint_001';
    return;
  }
  if (action === 'ask-ai') {
    askAi(button.dataset.prompt || 'why');
  }
}

function render() {
  if (!routes[state.route]) state.route = 'student';
  const route = routes[state.route];
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.route === state.route);
  });
  document.getElementById('routeTitle').textContent = route.title;
  document.getElementById('routeContext').textContent = route.context;
  document.getElementById('view').innerHTML = route.render();
  renderStatusStrip();
  renderEvidenceDrawer();
}

document.addEventListener('click', (event) => {
  const navItem = event.target.closest('.nav-item');
  if (navItem) {
    setRoute(navItem.dataset.route || 'student');
    if (state.route === 'student') state.activeCardId = 'xai_s12_pace_agent_001';
    if (state.route === 'instructor') state.activeCardId = 'xai_s01_instructor_intervention_001';
    render();
    return;
  }

  const button = event.target.closest('[data-action]');
  if (!button) return;
  handleAction(button);
  render();
});

function setRoute(route) {
  state.route = routes[route] ? route : 'student';
  window.history.replaceState(null, '', `#${state.route}`);
}

window.addEventListener('hashchange', () => {
  state.route = routeFromHash();
  render();
});

render();
