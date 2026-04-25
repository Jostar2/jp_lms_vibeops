const data = window.JP_LMS_VIBEOPS_DATA || {};
const xaiCards = data.xai_cards || [];
const cardById = Object.fromEntries(xaiCards.map((card) => [card.card_id, card]));
const initialRoute = routeFromHash();

const state = {
  persona: personaFromRoute(initialRoute),
  route: initialRoute,
  activeCardId: 'xai_s12_pace_agent_001',
  planMinutes: 30,
  completedTaskIds: new Set(['warmup']),
  draftVariant: 'bridge',
  draftApproved: false,
  activeAudience: 'all',
  navCollapsed: false,
  meiwakuStatus: '',
  chat: [
    {
      who: 'Claritas',
      text: '오늘은 30분 학습 흐름이 적합합니다. 강의 멈춤 구간, 이번 주 과제 마감, 체크포인트 흔들림을 함께 봤습니다.',
      cite: 'xai_s12_pace_agent_001',
    },
  ],
};

const routeLabels = {
  student: '대시보드',
  learning: '오늘의 학습',
  lecture: '강의',
  evidence: 'AI 근거',
  course: '수업 설정',
  instructor: '교수자 홈',
  studio: 'Co-Creation',
  policy: '정책·승인',
};

const studyPlans = {
  20: [
    ['warmup', '18:12 엔트로피 정의 확인', '핵심 정의와 예시 1개만 확인합니다.', 3, 'xai_s01_student_hint_001'],
    ['checkpoint', '확인 문제 1개', '정답보다 선택 이유를 남겨 AI가 다음 힌트 강도를 조절합니다.', 7, 'xai_s01_student_hint_001'],
    ['plan', '과제 시작점 저장', 'Titanic 분류 모델 과제의 첫 단계만 일정에 저장합니다.', 10, 'xai_s12_pace_agent_001'],
  ],
  30: [
    ['warmup', '엔트로피 정의 3분 복습', '멈춤이 집중된 구간 전에 선행 개념을 짧게 맞춥니다.', 3, 'xai_s01_student_hint_001'],
    ['lecture', '데이터 마이닝 W7 · Lec 2 이어보기', 'Gini와 Entropy 비교 구간에서 AI 힌트를 열 수 있습니다.', 12, 'xai_s01_student_hint_001'],
    ['checkpoint', '확인 문제와 해설', '선택 이유를 남기면 AI가 다음 문제 난이도를 조정합니다.', 8, 'xai_s12_pace_agent_001'],
    ['assignment', '과제 계획 저장', '마감 전까지 남은 학습량을 오늘 이후 일정으로 자동 배치합니다.', 7, 'xai_s12_pace_agent_001'],
  ],
  45: [
    ['warmup', '선수 개념 묶음 복습', '엔트로피 정의, 불순도 비교, 예시 데이터를 한 번에 묶어 봅니다.', 8, 'xai_s01_student_hint_001'],
    ['lecture', 'Lecture 2 집중 시청', 'AI가 표시한 22% 구간을 기준으로 재시청합니다.', 15, 'xai_s01_student_hint_001'],
    ['practice', '적응형 확인 문제 3개', '응답 패턴에 따라 힌트 강도를 조절하지만 성적에는 반영하지 않습니다.', 12, 'xai_s12_pace_agent_001'],
    ['assignment', '과제 초안 구조 잡기', 'AI는 제출물을 대신 쓰지 않고 구조와 체크리스트만 제안합니다.', 10, 'xai_s12_pace_agent_001'],
  ],
};

const draftVariants = {
  bridge: {
    title: 'Variant B · 3분 브리지',
    label: '브리지',
    body: 'Gini는 한 노드가 한쪽 클래스로 얼마나 기울었는지 빠르게 보는 지표이고, Entropy는 선택지가 섞여 있을 때의 불확실성을 더 민감하게 봅니다.',
    uplift: '-22%',
    confidence: '81%',
    burden: '낮음',
    rollback: '가능',
  },
  example: {
    title: 'Variant A · 예시 계산',
    label: '예시',
    body: '출석/비출석 예시 6개를 사용해 분할 전후의 불순도 변화를 한 줄씩 계산합니다. 수식보다 비교 방향을 먼저 보여줍니다.',
    uplift: '-16%',
    confidence: '73%',
    burden: '중간',
    rollback: '가능',
  },
  prompt: {
    title: 'Variant C · 질문형',
    label: '질문',
    body: '“두 그룹이 더 섞여 보이는 쪽은 어디인가요?”라는 질문으로 시작한 뒤 학생 답변에 맞춰 힌트 강도를 조정합니다.',
    uplift: '-19%',
    confidence: '76%',
    burden: '중간',
    rollback: '가능',
  },
};

function routeFromHash() {
  return window.location.hash.replace('#', '') || 'student';
}

function personaFromRoute(route) {
  return ['instructor', 'studio', 'policy'].includes(route) ? 'instructor' : 'student';
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function card(id) {
  return cardById[id] || xaiCards[0] || {
    card_id: 'empty',
    scenario_id: 'N/A',
    audience: 'student',
    judgment: { summary: '연결된 AI 판단이 없습니다.', confidence: 0 },
    evidence: [],
    model: { name: 'not_available', version: '0.0.0', run_id: 'not_available' },
    uncertainty: { summary: '근거 없음', interval_or_reason: 'not_available' },
    recommended_action: { label: '연결된 행동 없음' },
    measurement_plan: { metric: 'not_available', method: 'not_available' },
    governance: { approval_gate: 'none', appeal_control: 'none' },
  };
}

function activeCard() {
  return card(state.activeCardId);
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

function confidenceLabel(item) {
  return `${Math.round((item.judgment?.confidence || 0) * 100)}%`;
}

function formatPercent(value) {
  if (typeof value !== 'number') return 'N/A';
  const percent = Math.round(value * 100);
  return `${percent > 0 ? '+' : ''}${percent}%`;
}

function currentPlan() {
  return (studyPlans[state.planMinutes] || studyPlans[30]).map(([id, title, detail, minutes, cardId]) => ({
    id,
    title,
    detail,
    minutes,
    cardId,
  }));
}

function progressPercent() {
  const plan = currentPlan();
  return Math.round((plan.filter((task) => state.completedTaskIds.has(task.id)).length / plan.length) * 100);
}

function tag(text, tone = '') {
  return `<span class="tag ${tone}">${esc(text)}</span>`;
}

function button(label, action, extra = '', tone = '') {
  return `<button class="btn ${tone}" data-action="${esc(action)}" ${extra}>${label}</button>`;
}

function renderNav() {
  const isInstructor = state.persona === 'instructor';
  const groups = isInstructor
    ? [
      ['Teaching', [
        ['instructor', '⌂', '대시보드', '6'],
        ['studio', '✦', 'Co-Creation', '3'],
        ['policy', '⚑', '정책·승인', '1'],
        ['evidence', '◈', 'AI 근거', '5'],
      ]],
      ['Course Ops', [
        ['course', '◷', '수업 설정', '4'],
      ]],
    ]
    : [
      ['오늘', [
        ['student', '⌂', '대시보드', '2'],
        ['learning', '↯', '오늘의 학습', '3'],
        ['lecture', '▷', '강의', '4'],
      ]],
      ['Claritas AI', [
        ['evidence', '◈', 'AI 근거', '5'],
        ['course', '◷', '수업 설정', '4'],
      ]],
    ];

  const steps = isInstructor
    ? [['done', '강의 신호 확인'], ['now', '초안 검토'], ['', '승인·게시'], ['', '효과 측정']]
    : [['done', '프로그래밍 기초'], ['done', '통계·확률'], ['now', '데이터 마이닝'], ['', '머신러닝 응용']];

  document.getElementById('leftNav').innerHTML = `
    <div class="snb-head">
      <div class="snb-title">Navigation</div>
      <button class="btn" data-action="toggle-focus" aria-label="${state.navCollapsed ? 'expand navigation' : 'collapse navigation'}">${state.navCollapsed ? '›' : '‹'}</button>
    </div>
    ${groups.map(([label, items]) => `
      <div class="nav-section">
        <div class="nav-group-label">${esc(label)} <span class="nav-count">${items.length}</span></div>
        ${items.map(([route, icon, text, count]) => `
          <button class="nav-item ${state.route === route ? 'active' : ''}" data-action="set-route" data-route="${route}">
            <span class="ico">${icon}</span>
            <span>${esc(text)}</span>
            <span class="nav-count">${esc(count)}</span>
          </button>
        `).join('')}
      </div>
    `).join('')}
    <div class="path-card">
      <div class="path-card-title">${isInstructor ? '이번 주 수업 개선' : '추천 경로 · 데이터 마이닝'}</div>
      <div class="path-steps">
        ${steps.map(([status, text]) => `
          <div class="path-step ${status}">
            <span class="chip-dot"></span>
            <span>${esc(text)}</span>
          </div>
        `).join('')}
      </div>
      <div class="progress-mini"><div class="progress-mini-fill" style="width:${isInstructor ? 48 : 61}%"></div></div>
    </div>
  `;
}

function renderStudentDashboard() {
  const pace = card('xai_s12_pace_agent_001');
  const hint = card('xai_s01_student_hint_001');
  const result = resultFor('S12');
  return `
    <section class="dash-hero">
      <div class="hero-tags">
        ${tag(`신뢰도 ${confidenceLabel(pace)}`, 'tag-xai')}
        ${tag('2026 봄학기 · 수요일', 'tag-line')}
      </div>
      <h1 class="page-title">안녕하세요. 오늘은 <em>집중 학습에 유리한 시간</em>입니다.</h1>
      <p class="page-sub">지난 2주간의 학습 패턴을 분석한 결과, 수요일 14-17시에 이해도가 가장 높습니다. Claritas가 오늘 할 일 3가지를 추려두었습니다.</p>
      <div class="hero-tags">
        ${tag('집중 윈도우 2시간 10분', 'tag-claude')}
        ${tag('과제 0건 연체', 'tag-student')}
        ${tag('데이터 마이닝 6주차 개념 이해도 낮음', 'tag-warn')}
      </div>
    </section>

    <div class="stats-grid">
      ${stat('오늘 AI가 남긴 실행', '3개', '강의 · 과제 · 복습')}
      ${stat('가장 큰 병목', 'W6', '조건부 확률 → 트리')}
      ${stat('판단 신뢰 구간', '68-78%', '퀴즈·과제 기반')}
      ${stat('부담 리스크', '낮음', '112분 계획 기준')}
    </div>

    <div class="section-head">
      <h3>오늘의 학습 경로</h3>
      ${button('재계획', 'ask-ai', 'data-prompt="adjust"', 'btn-ghost')}
    </div>
    <div class="path-list">
      ${learningPathCard('▷', '데이터 마이닝 · 7주차 · Lec 2 — 의사결정 트리의 불순도 지표', '52분 · 이속현 교수 · 30% 시청 완료', '이 강의는 AI가 근거를 열고 순서를 다시 계산할 수 있습니다', '이어서보기', 'xai_s01_student_hint_001', 'active')}
      ${learningPathCard('✎', '머신러닝 기초 · 과제 3 — Titanic 데이터셋 분류 모델', '마감 2일 · 제출률 62% · 평균 4시간 소요', '과제 전에 W6 조건부 확률을 먼저 보는 편이 안전합니다', '열기', 'xai_s12_pace_agent_001')}
      ${learningPathCard('✦', '맞춤 복습 · 통계 기초 — 조건부 확률 (5분)', '지난주 퀴즈 오답 3문항을 바탕으로 자동 생성된 간격 반복', '복습 큐는 예상 학습효과와 부담 리스크를 함께 봅니다', '시작', 'xai_s12_pace_agent_001')}
    </div>

    <div class="split-2" style="margin-top:22px">
      <section class="card">
        <div class="card-head"><div><div class="card-title">AI 튜터 세션</div><div class="card-sub">정답을 주기보다 자기 설명을 만들도록 유도합니다.</div></div>${tag('AI 코치', 'tag-claude')}</div>
        <div class="stack">
          ${paceBlock('14:00', '엔트로피 정의를 1문장으로 설명', hint.judgment.summary, 'xai_s01_student_hint_001')}
          ${paceBlock('14:12', '확인 문제 1개', '선택 이유를 먼저 남기면 Claritas가 다음 힌트 강도를 조절합니다.', 'xai_s12_pace_agent_001')}
        </div>
      </section>
      <section class="card">
        <div class="card-head"><div><div class="card-title">학습자 안전 장치</div><div class="card-sub">AI 판단은 통제 가능하고 성적 판단에 직접 쓰이지 않습니다.</div></div>${tag('Meiwaku', 'tag-warn')}</div>
        <div class="metric-grid">
          ${metric('완료율 변화', result ? formatPercent(result.observed.plan_completion_delta) : 'N/A', 'self plan acceptance')}
          ${metric('지원 체감', result ? `${result.observed.perceived_support_score}/5` : 'N/A', 'short survey')}
        </div>
        <div class="xai-panel" style="margin-top:12px">
          <div class="xai-panel-head"><span class="spark">!</span> Meiwaku feedback</div>
          <div class="xai-panel-body">추천을 숨기거나 “맞지 않음”으로 표시해도 성적이나 교수자 평가에 반영되지 않습니다.</div>
          <div class="xai-meta"><button class="tag-mini meiwaku" data-action="challenge">추천이 맞지 않음</button></div>
        </div>
      </section>
    </div>
  `;
}

function renderLearning() {
  const progress = progressPercent();
  return `
    <div class="section-head"><h3>오늘의 학습 플랜</h3>${tag(`학습 ${progress}%`, 'tag-student')}</div>
    <section class="card">
      <div class="card-head">
        <div><div class="card-title">남은 시간에 맞춘 계획</div><div class="card-sub">set-minutes · toggle-task · challenge 흐름이 실제 상태를 바꿉니다.</div></div>
        <div class="hero-tags">
          ${[20, 30, 45].map((minutes) => `<button class="tag ${state.planMinutes === minutes ? 'tag-student' : 'tag-line'}" data-action="set-minutes" data-minutes="${minutes}">${minutes}분</button>`).join('')}
        </div>
      </div>
      <div class="progress-mini"><div class="progress-mini-fill" style="width:${progress}%"></div></div>
      <div class="stack" style="margin-top:14px">
        ${currentPlan().map((task) => `
          <button class="pace-block" data-action="toggle-task" data-task-id="${esc(task.id)}" data-card-id="${esc(task.cardId)}">
            <div class="pace-time">${task.minutes}분</div>
            <div>
              <div class="pace-title">${state.completedTaskIds.has(task.id) ? '✓ ' : ''}${esc(task.title)}</div>
              <div class="pace-sub">${esc(task.detail)}</div>
              <div class="pace-reason">Claritas가 이 단계의 근거를 오른쪽 근거 패널에 연결합니다.</div>
            </div>
          </button>
        `).join('')}
      </div>
      <div class="hero-tags" style="margin-top:16px">
        ${button('AI 코치와 시작', 'ask-ai', 'data-prompt="start"', 'btn-student')}
        ${button('20분으로 줄여줘', 'ask-ai', 'data-prompt="adjust"', 'btn-ghost')}
        ${button('추천이 맞지 않음', 'challenge', '', 'btn-ghost')}
      </div>
      ${state.meiwakuStatus ? `<div class="xai-panel" style="margin-top:14px"><div class="xai-panel-body">${esc(state.meiwakuStatus)}</div></div>` : ''}
    </section>
  `;
}

function renderLecture() {
  return `
    <section class="card">
      <div class="card-head">
        <div><div class="card-title">Lecture 2 · Tree Split Criteria</div><div class="card-sub">18:12 / 52:08 — 지니와 엔트로피 정의</div></div>
        ${tag('동료 정지/반복 42%', 'tag-claude')}
      </div>
      <div class="lecture-player">
        <div class="lecture-canvas">
          <div class="play-button">▶</div>
          <div>
            <div class="page-eyebrow">AI marker · 22%</div>
            <h2 class="page-title" style="font-size:24px">이 구간에서 학생들이 멈췄습니다.</h2>
            <p class="page-sub">Claritas는 개인을 낙인찍지 않고, 집계된 멈춤/반복과 확인 문제 흔들림을 근거로 선수 개념 힌트를 제안합니다.</p>
          </div>
        </div>
        <div class="chapter-line">
          <button data-action="select-card" data-card-id="xai_s01_student_hint_001">0%</button>
          <button data-action="select-card" data-card-id="xai_s01_student_hint_001" class="hot">22% · AI</button>
          <button data-action="select-card" data-card-id="xai_s12_pace_agent_001">48%</button>
          <button data-action="select-card" data-card-id="xai_s11_cocreation_001">73%</button>
        </div>
      </div>
    </section>
    <section class="card" style="margin-top:14px">
      <div class="card-head"><div><div class="card-title">Transcript + Checkpoint</div><div class="card-sub">힌트는 요청할 때만 열립니다.</div></div>${button('힌트만 줘', 'ask-ai', 'data-prompt="quiz"', 'btn-ghost')}</div>
      <div class="xai-panel"><div class="xai-panel-head"><span class="spark">AI</span> 왜 이 추천인가요?</div><div class="xai-panel-body">${esc(card('xai_s01_student_hint_001').judgment.summary)}</div></div>
    </section>
  `;
}

function renderInstructorDashboard() {
  const result = resultFor('S01');
  return `
    <section class="dash-hero">
      <div class="hero-tags">${tag('교수자', 'tag-instructor')}${tag('09:02 생성 · 최신 동기화 2분 전', 'tag-line')}</div>
      <h1 class="page-title">이번 주 수업에서 <em>18:12 구간</em>이 가장 큰 병목입니다.</h1>
      <p class="page-sub">집계 신호 기준으로 학생 개인 목록 없이 수업 개선 결정을 돕습니다. AI 초안은 승인 전까지 학생에게 공개되지 않습니다.</p>
    </section>
    <div class="stats-grid">
      ${stat('평균 진도율', '67%', '4% vs 지난 학기')}
      ${stat('미채점', '24', '마감 72h 내')}
      ${stat('개입 필요', '6', '집계 신호 기반')}
      ${stat('효과 측정', result ? formatPercent(result.observed.segment_rewatch_rate_delta) : 'N/A', '재시청률')}
    </div>
    <div class="split-2">
      <section class="card">
        <div class="card-head"><div><div class="card-title">수업 신호</div><div class="card-sub">같은 incident를 교수자 화면에서는 반 단위로 봅니다.</div></div>${tag('aggregate only', 'tag-ok')}</div>
        <div class="source-list">
          ${source('18:12 Gini / Entropy', '82%', 'var(--warn)')}
          ${source('26:50 예시 계산', '46%', 'var(--student)')}
          ${source('34:10 과제 안내', '28%', 'var(--ink-4)')}
        </div>
      </section>
      <section class="card">
        <div class="card-head"><div><div class="card-title">승인 대기</div><div class="card-sub">학생에게 공개되기 전 교수자 승인과 롤백 메모가 필요합니다.</div></div>${tag('G2', 'tag-instructor')}</div>
        <div class="xai-panel"><div class="xai-panel-head"><span class="spark">AI</span> 추천 행동</div><div class="xai-panel-body">${esc(card('xai_s01_instructor_intervention_001').recommended_action.label)}</div></div>
      </section>
    </div>
    ${renderStudio()}
  `;
}

function renderStudio() {
  const selected = draftVariants[state.draftVariant];
  const approval = approvalFor('S11');
  return `
    <div class="section-head"><h3>AI Co-Creation Studio</h3>${tag(state.draftApproved ? '승인됨' : '승인 전 비공개', state.draftApproved ? 'tag-ok' : 'tag-warn')}</div>
    <div class="stack">
      ${Object.entries(draftVariants).map(([key, item]) => `
        <button class="co-variant ${state.draftVariant === key ? 'selected' : ''}" data-action="set-variant" data-variant="${key}">
          <div class="co-variant-head"><div class="card-title">${esc(item.title)}</div>${tag(item.label, key === 'bridge' ? 'tag-instructor' : 'tag-line')}</div>
          <div class="co-variant-body">${esc(item.body)}</div>
          <div class="co-variant-meta">
            <div><div class="co-meta-k">예상 재시청</div><div class="co-meta-v">${esc(item.uplift)}</div></div>
            <div><div class="co-meta-k">신뢰도</div><div class="co-meta-v">${esc(item.confidence)}</div></div>
            <div><div class="co-meta-k">부담</div><div class="co-meta-v">${esc(item.burden)}</div></div>
            <div><div class="co-meta-k">롤백</div><div class="co-meta-v">${esc(item.rollback)}</div></div>
          </div>
        </button>
      `).join('')}
      <section class="card">
        <div class="card-head"><div><div class="card-title">선택된 초안</div><div class="card-sub">${esc(selected.title)}</div></div>${tag('approval · measurement · impact', 'tag-xai')}</div>
        <div class="xai-panel"><div class="xai-panel-head"><span class="spark">AI</span> 학생 반응 예측</div><div class="xai-panel-body">Variant 적용 시 반복 재시청률 ${esc(selected.uplift)} 예상. 승인 후 2주 내 측정하며, 부적합하면 원본 Lecture 2 구성으로 되돌립니다.</div></div>
        <div class="hero-tags">
          ${button(state.draftApproved ? '승인 상태 유지' : '승인하고 게시 예약', 'approve-draft', '', 'btn-instructor')}
          ${button('대안 초안', 'ask-ai', 'data-prompt="draft"', 'btn-ghost')}
          ${button('초안 근거', 'select-card', 'data-card-id="xai_s11_cocreation_001"', 'btn-ghost')}
        </div>
        ${state.draftApproved ? `<div class="xai-panel" style="margin-top:12px"><div class="xai-panel-body">게시 예약됨. 롤백 메모: ${esc(approval?.rollback_note || '원본 자료로 되돌릴 수 있습니다.')}</div></div>` : ''}
      </section>
    </div>
  `;
}

function renderEvidenceBoard() {
  const visible = xaiCards.filter((item) => state.activeAudience === 'all' || item.audience === state.activeAudience);
  return `
    <div class="section-head"><h3>AI 근거 보드</h3><div class="hero-tags">${['all', 'student', 'instructor'].map((audience) => `<button class="tag ${state.activeAudience === audience ? 'tag-xai' : 'tag-line'}" data-action="set-filter" data-filter="${audience}">${audience === 'all' ? '전체' : audience}</button>`).join('')}</div></div>
    <div class="evidence-card-grid">
      ${visible.map((item) => `
        <button class="card" data-action="select-card" data-card-id="${esc(item.card_id)}" style="text-align:left;border-color:${item.card_id === state.activeCardId ? 'rgba(109,77,189,.36)' : 'var(--line)'}">
          <div class="card-head"><div><div class="card-title">${esc(item.scenario_id)} · ${esc(item.audience)} · ${esc(item.judgment.decision_type)}</div><div class="card-sub">${esc(item.model.name)} ${esc(item.model.version)}</div></div>${tag(confidenceLabel(item), 'tag-xai')}</div>
          <div class="xai-panel-body">${esc(item.judgment.summary)}</div>
          <div class="xai-meta">${item.evidence.map((evidence) => `<span class="tag-mini">${esc(evidence.source_event)}</span>`).join('')}</div>
        </button>
      `).join('')}
    </div>
  `;
}

function renderCourseSetup() {
  const s13 = scenarioFor('S13');
  return `
    <section class="card">
      <div class="card-head"><div><div class="card-title">LMS 안에 붙는 AI 수업 레이어</div><div class="card-sub">NetLearning/manaba 화면을 대체하지 않고 강의·과제·퀴즈 옆에서 작동합니다.</div></div>${tag('compose, not replace', 'tag-ok')}</div>
      <div class="source-list">
        ${source('LTI launch · course room embed', 'ready', 'var(--student)')}
        ${source('CSV fallback · NetLearning adapter', data.adapter?.spec?.mode || 'fallback', 'var(--claude)')}
        ${source('pilot gates · 승인 전 점검', `${(data.pilot_gates || []).length} checks`, 'var(--xai)')}
        ${source('학생별 지원은 학생 통제', 'G1', 'var(--student)')}
        ${source('수업 변경은 교수자 승인', 'G2', 'var(--instructor)')}
        ${source(`${s13?.scenario_id || 'S13'} · ${s13?.state || 'awaiting_approval'}`, 'G4 locked', 'var(--warn)')}
      </div>
    </section>
  `;
}

function renderMain() {
  if (state.route === 'learning') return renderLearning();
  if (state.route === 'lecture') return renderLecture();
  if (state.route === 'instructor') return renderInstructorDashboard();
  if (state.route === 'studio') return renderStudio();
  if (state.route === 'policy') return renderCourseSetup();
  if (state.route === 'evidence') return renderEvidenceBoard();
  if (state.route === 'course') return renderCourseSetup();
  return renderStudentDashboard();
}

function stat(label, value, sub) {
  return `<div class="stat"><div class="stat-label">${esc(label)}</div><div class="stat-value">${esc(value)}</div><div class="stat-sub">${esc(sub)}</div></div>`;
}

function learningPathCard(icon, title, sub, rationale, actionLabel, cardId, active = '') {
  return `
    <div class="path-item ${active}">
      <div class="path-item-main">
        <div class="course-thumb ${active ? '' : 'claude'}">${esc(icon)}</div>
        <div><div class="path-title">${esc(title)}</div><div class="path-sub">${esc(sub)}</div></div>
        <div class="path-actions">
          ${tag(`+ 이해도 ${cardId === 'xai_s01_student_hint_001' ? '61%' : '74%'}`, 'tag-xai')}
          ${button(actionLabel, 'select-card', `data-card-id="${esc(cardId)}"`, active ? 'btn-student' : 'btn-ghost')}
        </div>
      </div>
      <div class="path-rationale"><span class="ai-dot"></span>${esc(rationale)}</div>
    </div>
  `;
}

function paceBlock(time, title, sub, cardId) {
  return `
    <button class="pace-block" data-action="select-card" data-card-id="${esc(cardId)}" style="text-align:left">
      <div class="pace-time">${esc(time)}</div>
      <div><div class="pace-title">${esc(title)}</div><div class="pace-sub">${esc(sub)}</div><div class="pace-reason">근거 보기 · ${esc(cardId)}</div></div>
    </button>
  `;
}

function metric(label, value, sub) {
  return `<div class="metric-tile"><small>${esc(label)}</small><strong>${esc(value)}</strong><span>${esc(sub)}</span></div>`;
}

function source(label, value, color) {
  return `<div class="source-item"><span class="mini-dot" style="background:${color}"></span><span>${esc(label)}</span><span class="source-weight">${esc(value)}</span></div>`;
}

function renderAside() {
  const item = activeCard();
  const result = resultFor(item.scenario_id);
  const approval = (data.approvals || []).find((entry) => entry.source_card_id === item.card_id);
  const companionTitle = state.persona === 'instructor' ? '설계 어시스턴트' : '학습 동반자';
  const companionSub = state.persona === 'instructor' ? '교수자 승인 전까지 비공개' : '소크라틱 튜터 · 오늘 14:20 대화';
  document.getElementById('rightAside').innerHTML = `
    <div class="aside-head">
      <div><div class="aside-title">근거 패널</div><div class="aside-sub">${esc(item.scenario_id)} · ${esc(item.card_id)}</div></div>
      ${tag('xAI', 'tag-xai')}
    </div>
    <div class="xai-panel">
      <div class="xai-panel-head"><span class="spark">✦</span> 왜 이 판단인가</div>
      <div class="xai-panel-body">${esc(item.judgment.summary)}</div>
      <div class="xai-meta">
        <span class="tag-mini">신뢰도 ${confidenceLabel(item)}</span>
        <span class="tag-mini">model ${esc(item.model.version)}</span>
        <button class="tag-mini meiwaku" data-action="challenge">판단이 불편함</button>
      </div>
    </div>
    <div class="source-list">
      ${item.evidence.map((evidence) => source(evidence.claim, `w ${evidence.weight}`, 'var(--xai)')).join('')}
    </div>
    <div class="aside-head">
      <div><div class="aside-title">${companionTitle}</div><div class="aside-sub">${companionSub}</div></div>
      ${tag('Claritas', 'tag-claude')}
    </div>
    <div class="chat-card">
      ${state.chat.slice(-4).map((message) => `
        <div class="message">
          <div class="msg-avatar ${message.who === 'Student' || message.who === 'Professor' ? 'user' : ''}">${message.who === 'Claritas' ? 'C' : 'S'}</div>
          <div class="msg-content"><span class="who">${esc(message.who)}</span>${esc(message.text)}<br><span class="cite">↗ ${esc(message.cite || item.card_id)}</span></div>
        </div>
      `).join('')}
      <div class="hero-tags">
        ${state.persona === 'instructor'
          ? `${button('대안 초안', 'ask-ai', 'data-prompt="draft"', 'btn-ghost')}${button('효과 측정', 'ask-ai', 'data-prompt="measurement"', 'btn-ghost')}`
          : `${button('왜 추천했어?', 'ask-ai', 'data-prompt="why"', 'btn-ghost')}${button('힌트만 줘', 'ask-ai', 'data-prompt="quiz"', 'btn-ghost')}`}
      </div>
    </div>
    <div class="xai-panel">
      <div class="xai-panel-head"><span class="spark">M</span> measurement · impact</div>
      <div class="xai-panel-body">권장 행동: <strong>${esc(item.recommended_action.label)}</strong><br>측정: ${esc(item.measurement_plan.metric)} · ${esc(item.measurement_plan.method)}<br>승인/영향: ${esc(approval?.state || 'session action required')} · ${esc(result?.impact_decision || 'measurement pending')}</div>
    </div>
  `;
}

function setPersona(persona) {
  state.persona = persona;
  if (persona === 'student' && ['instructor', 'studio', 'policy'].includes(state.route)) state.route = 'student';
  if (persona === 'instructor' && ['student', 'learning', 'lecture'].includes(state.route)) state.route = 'instructor';
  document.body.classList.toggle('s-mode', persona === 'student');
  document.body.classList.toggle('i-mode', persona === 'instructor');
  document.getElementById('avatarInitial').textContent = persona === 'student' ? 'S' : 'P';
  document.querySelectorAll('[data-persona]').forEach((button) => button.classList.toggle('active', button.dataset.persona === persona));
}

function setRoute(route) {
  state.route = route || 'student';
  window.history.replaceState(null, '', `#${state.route}`);
}

function pushChat(who, text, cite = '') {
  state.chat.push({ who, text, cite });
  if (state.chat.length > 8) state.chat = state.chat.slice(-8);
}

function askAi(prompt) {
  const item = activeCard();
  if (prompt === 'adjust') {
    state.planMinutes = 20;
    state.activeCardId = 'xai_s12_pace_agent_001';
    pushChat('Student', '오늘은 20분만 가능해.', 'pace request');
    pushChat('Claritas', '20분 플랜으로 줄였습니다. 핵심 정의, 확인 문제 1개, 과제 시작점만 남깁니다.', 'xai_s12_pace_agent_001');
    return;
  }
  if (prompt === 'quiz') {
    state.activeCardId = 'xai_s01_student_hint_001';
    pushChat('Student', '정답 말고 힌트만 줘.', 'checkpoint');
    pushChat('Claritas', '힌트: Entropy가 낮아졌다는 것은 분할 뒤 불확실성이 줄었다는 뜻입니다. 어느 노드가 더 한 클래스에 모였는지 먼저 보세요.', 'xai_s01_student_hint_001');
    return;
  }
  if (prompt === 'draft') {
    state.draftVariant = state.draftVariant === 'bridge' ? 'example' : 'bridge';
    state.activeCardId = 'xai_s11_cocreation_001';
    pushChat('Professor', '다른 보강 설명 방식도 제안해줘.', 'draft request');
    pushChat('Claritas', `${draftVariants[state.draftVariant].label} 방식으로 전환했습니다. 승인 전까지 학생에게 공개되지 않습니다.`, 'xai_s11_cocreation_001');
    return;
  }
  if (prompt === 'measurement') {
    const result = resultFor('S01');
    state.activeCardId = 'xai_s01_instructor_intervention_001';
    pushChat('Professor', '효과 측정을 보여줘.', 'measurement');
    pushChat('Claritas', `반복 재시청률 ${result ? formatPercent(result.observed.segment_rewatch_rate_delta) : 'N/A'}, 확인 문제 정답률 ${result ? formatPercent(result.observed.checkpoint_correct_rate_delta) : 'N/A'}입니다.`, 'result_s01_intervention_effect_001');
    return;
  }
  pushChat(state.persona === 'instructor' ? 'Professor' : 'Student', '왜 이 추천을 했어?', item.card_id);
  pushChat('Claritas', `${item.evidence?.[0]?.claim || '선택된 xAI 카드의 근거'} 판단입니다. 다만 ${item.uncertainty?.summary || '불확실성이 있어 조정할 수 있습니다.'}`, item.card_id);
}

function handleAction(buttonEl) {
  const action = buttonEl.dataset.action;
  if (action === 'set-persona') {
    setPersona(buttonEl.dataset.persona || 'student');
  } else if (action === 'set-route') {
    setRoute(buttonEl.dataset.route || 'student');
  } else if (action === 'toggle-focus') {
    state.navCollapsed = !state.navCollapsed;
  } else if (action === 'select-card') {
    state.activeCardId = buttonEl.dataset.cardId || state.activeCardId;
  } else if (action === 'set-minutes') {
    state.planMinutes = Number(buttonEl.dataset.minutes) || 30;
    state.activeCardId = 'xai_s12_pace_agent_001';
  } else if (action === 'toggle-task') {
    const id = buttonEl.dataset.taskId;
    if (state.completedTaskIds.has(id)) state.completedTaskIds.delete(id);
    else state.completedTaskIds.add(id);
    state.activeCardId = buttonEl.dataset.cardId || state.activeCardId;
  } else if (action === 'set-variant') {
    state.draftVariant = buttonEl.dataset.variant || 'bridge';
    state.activeCardId = 'xai_s11_cocreation_001';
  } else if (action === 'approve-draft') {
    state.draftApproved = true;
    state.activeCardId = 'xai_s11_cocreation_001';
    pushChat('Claritas', '교수자 승인 상태로 전환했습니다. 게시 예약과 롤백 메모가 함께 남습니다.', 'approval_s11_bridge_variant_001');
  } else if (action === 'set-filter') {
    state.activeAudience = buttonEl.dataset.filter || 'all';
    const visible = xaiCards.find((item) => state.activeAudience === 'all' || item.audience === state.activeAudience);
    if (visible) state.activeCardId = visible.card_id;
  } else if (action === 'challenge') {
    state.meiwakuStatus = '추천을 숨김 처리했습니다. 이 선택은 성적이나 교수자 평가에 반영되지 않고 AI 추천 품질 개선 신호로만 저장됩니다.';
    pushChat('Student', '이 추천은 지금 상황과 맞지 않아요.', 'meiwaku feedback');
  } else if (action === 'ask-ai') {
    askAi(buttonEl.dataset.prompt || 'why');
  }
}

function render() {
  document.getElementById('app').classList.toggle('nav-collapsed', state.navCollapsed);
  setPersona(state.persona);
  renderNav();
  document.getElementById('mainContent').innerHTML = renderMain();
  renderAside();
}

document.addEventListener('click', (event) => {
  const buttonEl = event.target.closest('[data-action]');
  if (!buttonEl) return;
  handleAction(buttonEl);
  render();
});

window.addEventListener('hashchange', () => {
  state.route = routeFromHash();
  state.persona = personaFromRoute(state.route);
  render();
});

render();
