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
      text: '오늘은 30분 학습 흐름이 적합합니다. 강의 멈춤 구간, 체크포인트 흔들림, 이번 주 과제 마감을 같이 봤습니다.',
    },
  ],
};

const routes = {
  student: {
    title: '학습자 홈',
    context: 'Learner workspace · AI assisted study',
    render: renderLearnerHome,
  },
  instructor: {
    title: '교수자 스튜디오',
    context: 'Teaching workspace · aggregate signal · approval path',
    render: renderInstructorStudio,
  },
  evidence: {
    title: 'AI 근거',
    context: 'xAI cards · approval · measurement · impact',
    render: renderEvidenceBoard,
  },
  course: {
    title: '수업 설정',
    context: 'LMS embedding · privacy · pilot gates',
    render: renderCourseSetup,
  },
};

const planTemplates = {
  20: [
    ['warmup', '엔트로피 정의 확인', '18:12 구간 전에 핵심 정의와 예시 1개만 확인합니다.', 3, 'xai_s01_student_hint_001'],
    ['checkpoint', '확인 문제 1개', '정답보다 선택 이유를 남겨 AI가 다음 힌트 강도를 조절합니다.', 7, 'xai_s01_student_hint_001'],
    ['review', '과제 시작점 저장', '오늘 끝낼 수 있는 최소 단계를 일정에 저장합니다.', 10, 'xai_s12_pace_agent_001'],
  ],
  30: [
    ['warmup', '엔트로피 정의 3분 복습', '멈춤이 집중된 구간 전에 선행 개념을 짧게 맞춥니다.', 3, 'xai_s01_student_hint_001'],
    ['bridge', 'AI 브리지 설명 보기', 'Gini와 Entropy 비교를 교수자 톤에 맞춘 보강 설명으로 다시 봅니다.', 12, 'xai_s11_cocreation_001'],
    ['checkpoint', '확인 문제와 해설', '선택 이유를 남기면 AI가 다음 문제 난이도를 조정합니다.', 8, 'xai_s01_student_hint_001'],
    ['plan', '과제 계획 저장', '마감 전까지 남은 학습량을 오늘 이후 일정으로 자동 배치합니다.', 7, 'xai_s12_pace_agent_001'],
  ],
  45: [
    ['warmup', '선행 개념 정리', '엔트로피 정의, 불순도 비교, 예시 데이터를 한 번에 묶어 봅니다.', 8, 'xai_s01_student_hint_001'],
    ['lecture', 'Lecture 2 집중 시청', 'AI가 표시한 멈춤 구간을 기준으로 재시청합니다.', 15, 'xai_s01_student_hint_001'],
    ['practice', '적응형 확인 문제 3개', '응답 패턴에 따라 힌트 강도를 조절하지만 성적에는 반영하지 않습니다.', 12, 'xai_s12_pace_agent_001'],
    ['assignment', '과제 초안 구조 잡기', 'AI는 제출물을 대신 쓰지 않고 구조와 체크리스트만 제안합니다.', 10, 'xai_s12_pace_agent_001'],
  ],
};

const draftVariants = {
  bridge: {
    label: '3분 브리지',
    title: '엔트로피를 먼저 떠올리게 하는 짧은 도입',
    body: 'Gini는 한 노드가 한쪽 클래스로 얼마나 기울었는지 빠르게 보는 지표이고, Entropy는 선택지가 섞여 있을 때의 불확실성을 더 민감하게 봅니다.',
    checkpoint: '두 분할 후보 중 Entropy가 더 낮은 쪽을 고르고 이유를 1문장으로 남깁니다.',
  },
  example: {
    label: '예시 중심',
    title: '작은 표본으로 Gini와 Entropy를 나란히 계산',
    body: '출석/비출석 예시 6개를 사용해 분할 전후의 불순도 변화를 한 줄씩 계산합니다. 수식보다 비교 방향을 먼저 보여줍니다.',
    checkpoint: '같은 분할에서 Gini와 Entropy가 같은 방향으로 움직이는지 확인합니다.',
  },
  prompt: {
    label: '질문형',
    title: '학습자가 먼저 예측하게 하는 질문 흐름',
    body: '“두 그룹이 더 섞여 보이는 쪽은 어디인가요?”라는 질문으로 시작한 뒤 학생 답변에 맞춰 힌트 강도를 조정합니다.',
    checkpoint: '본인의 예측과 계산 결과가 달랐던 이유를 선택합니다.',
  },
};

function routeFromHash() {
  return window.location.hash.replace('#', '') || 'student';
}

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
    recommended_action: { label: '연결된 행동 없음' },
    measurement_plan: { metric: 'not_available', method: 'not_available', reevaluate_at: 'not_available' },
    governance: { approval_gate: 'none', appeal_control: 'none' },
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

function module(title, subtitle, body, action = '') {
  return `
    <section class="module">
      <div class="module-head">
        <div>
          <h3>${esc(title)}</h3>
          ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
        </div>
        ${action}
      </div>
      <div class="module-body">${body}</div>
    </section>
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
  return (planTemplates[state.planMinutes] || planTemplates[30]).map(([id, title, detail, minutes, cardId]) => ({
    id,
    title,
    detail,
    minutes,
    cardId,
  }));
}

function progressPercent() {
  const plan = currentPlan();
  const done = plan.filter((task) => state.completedTaskIds.has(task.id)).length;
  return Math.round((done / plan.length) * 100);
}

function renderLearnerHome() {
  const paceCard = cardById.xai_s12_pace_agent_001 || activeCard();
  const hintCard = cardById.xai_s01_student_hint_001 || activeCard();
  const result = resultFor('S12');
  const progress = progressPercent();

  return `
    <div class="learner-layout">
      <div class="plan-board">
        <section class="module hero-course">
          <div class="lesson-visual">
            <div class="lesson-copy">
              <span>Lecture 2 · Tree split criteria</span>
              <h3>Gini와 Entropy를 비교하기 전에 AI가 선행 개념을 짚어줍니다.</h3>
              <p>${esc(hintCard.judgment.summary)}</p>
            </div>
          </div>
          <div class="timeline" aria-label="Lecture timeline">
            <div class="segment">0:00</div>
            <div class="segment">12:40</div>
            <button class="segment hot" data-action="select-card" data-card-id="xai_s01_student_hint_001"><span>AI</span>18:12</button>
            <div class="segment">26:50</div>
            <div class="segment">34:10</div>
          </div>
        </section>

        <div class="course-strip">
          <div class="strip-item"><span>다음 활동</span><strong>확인 문제 1개</strong><small>힌트는 요청할 때만 표시됩니다.</small></div>
          <div class="strip-item"><span>AI 추천 신뢰도</span><strong>${confidenceLabel(paceCard)}</strong><small>학습자 요청과 이번 주 학습량 기준</small></div>
          <div class="strip-item"><span>학생 권한</span><strong>수정 / 숨김 / 이의제기</strong><small>Meiwaku feedback control</small></div>
        </div>

        ${module(
          'AI 튜터 세션',
          '정답을 대신 주기보다 학생이 자기 설명을 만들도록 힌트 강도를 조절합니다.',
          `
            <div class="insight-list">
              ${insightRow('AI', '왜 이 구간을 먼저 보나요?', hintCard.judgment.summary, '근거', 'ask-ai', 'why')}
              ${insightRow('?', '확인 문제를 한 개만 풀기', '선택 이유를 보고 다음 힌트를 조절합니다.', '7분', 'ask-ai', 'quiz')}
              ${insightRow('↗', '교수자에게 도움 요청', '개인 식별 없이 강의 구간 설명 보강 요청으로 전달됩니다.', '선택', 'request-help', '')}
            </div>
          `,
        )}
      </div>

      <div class="plan-board">
        ${module(
          '오늘의 학습 플랜',
          'AI 코치가 남은 시간에 맞춰 강의, 확인 문제, 과제를 다시 배열합니다.',
          `
            <div class="study-time" aria-label="학습 시간 선택">
              ${[20, 30, 45].map((minutes) => `
                <button class="${state.planMinutes === minutes ? 'active' : ''}" data-action="set-minutes" data-minutes="${minutes}">
                  ${minutes}분
                </button>
              `).join('')}
            </div>
            <div class="progress"><span style="--progress: ${progress}%"></span></div>
            <div class="task-list">${currentPlan().map(renderTask).join('')}</div>
            ${state.meiwakuStatus ? `<div class="state-note">${esc(state.meiwakuStatus)}</div>` : ''}
            <div class="action-row">
              <button class="action-button" data-action="ask-ai" data-prompt="start">AI 코치와 시작</button>
              <button class="subtle-button" data-action="select-card" data-card-id="xai_s12_pace_agent_001">추천 근거</button>
              <button class="danger-button" data-action="challenge">추천이 맞지 않음</button>
            </div>
          `,
          tag('student controlled', 'ok'),
        )}

        ${module(
          '학습자 안전 장치',
          'AI는 성적 판단자가 아니라 설명 가능한 보조자입니다.',
          `
            <div class="measure-grid">
              ${measureTile('완료율 변화', result ? formatPercent(result.observed.plan_completion_delta) : 'N/A', 'self plan acceptance')}
              ${measureTile('지원 체감', result ? `${result.observed.perceived_support_score}/5` : 'N/A', 'short survey')}
              ${measureTile('이의제기', 'Meiwaku', paceCard.governance.appeal_control)}
            </div>
            <div class="state-note ok">추천 거절은 성적이나 교수자 평가에 반영되지 않고, AI 추천 품질 개선 신호로만 저장됩니다.</div>
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

function insightRow(mark, title, detail, meta, action, prompt) {
  const promptAttr = prompt ? `data-prompt="${esc(prompt)}"` : '';
  return `
    <button class="insight-row" data-action="${esc(action)}" ${promptAttr}>
      <span class="check">${esc(mark)}</span>
      <div>
        <b>${esc(title)}</b>
        <span>${esc(detail)}</span>
      </div>
      <span class="minutes">${esc(meta)}</span>
    </button>
  `;
}

function measureTile(label, value, note) {
  return `
    <div class="measure">
      <span>${esc(label)}</span>
      <strong>${esc(value)}</strong>
      <small>${esc(note)}</small>
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
    <div class="studio-layout">
      <div class="signal-board">
        ${module(
          '수업 신호',
          '교수자는 학생 개인 목록이 아니라 수업 개선에 필요한 집계 신호를 봅니다.',
          `
            <div class="signal-grid">
              ${signalTile('멈춤 집중 구간', '22%', 'Lecture 2 timeline')}
              ${signalTile('확인 문제 기준선', '61%', 'checkpoint correct rate')}
              ${signalTile('AI 제안 신뢰도', confidenceLabel(interventionCard), interventionCard.model.name)}
            </div>
            <div class="heatmap">
              ${heatRow('12:40 기본 개념', 38, false)}
              ${heatRow('18:12 Gini / Entropy', 82, true)}
              ${heatRow('26:50 예시 계산', 46, false)}
              ${heatRow('34:10 과제 안내', 28, false)}
            </div>
            <div class="action-row">
              <button class="subtle-button" data-action="select-card" data-card-id="xai_s01_instructor_intervention_001">교수자 근거</button>
              <button class="subtle-button" data-action="set-route" data-route="evidence">전체 xAI 카드</button>
            </div>
          `,
          tag('aggregate only', 'ok'),
        )}

        ${module(
          '효과 측정',
          'AI 제안은 게시 후 실제 수업 지표로 다시 검증됩니다.',
          `
            <div class="measure-grid">
              ${measureTile('반복 재시청률', result ? formatPercent(result.observed.segment_rewatch_rate_delta) : 'N/A', 'switchback measurement')}
              ${measureTile('체크포인트 정답률', result ? formatPercent(result.observed.checkpoint_correct_rate_delta) : 'N/A', 'pre/post comparison')}
              ${measureTile('impact', result?.impact_decision || 'pending', result?.publish_status || 'measurement')}
            </div>
            <div class="state-note">측정 결과는 단일 강의 파일럿 기준이며 다른 학기나 과목으로 일반화하지 않습니다.</div>
          `,
          tag('measurement linked', 'ok'),
        )}
      </div>

      <div class="draft-board">
        ${module(
          'AI Co-Creation Studio',
          '교수자가 수업 톤과 Teaching Profile을 유지하면서 AI 초안을 검토합니다.',
          `
            <div class="variant-tabs" aria-label="AI 초안 변형">
              ${Object.entries(draftVariants).map(([key, item]) => `
                <button class="${state.draftVariant === key ? 'active' : ''}" data-action="set-variant" data-variant="${esc(key)}">${esc(item.label)}</button>
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
                <b>보강 설명</b>
                <span>${esc(variant.body)}</span>
                <b>확인 문제</b>
                <span>${esc(variant.checkpoint)}</span>
              </div>
            </div>
            <div class="state-note ${approved ? 'ok' : ''}">
              ${approved
                ? `게시 예약됨. 롤백 메모: ${esc(approval?.rollback_note || '원본 자료로 되돌릴 수 있습니다.')}`
                : '아직 게시되지 않았습니다. 교수자가 승인하기 전에는 학생 화면에 노출되지 않습니다.'}
            </div>
            <div class="action-row">
              <button class="action-button" data-action="approve-draft">${approved ? '승인 상태 유지' : '승인하고 게시 예약'}</button>
              <button class="subtle-button" data-action="select-card" data-card-id="xai_s11_cocreation_001">초안 근거</button>
              <button class="subtle-button" data-action="ask-ai" data-prompt="draft">대안 요청</button>
            </div>
          `,
          tag('approval gated', approved ? 'ok' : 'warn'),
        )}

        ${module(
          '학생 경험 미리보기',
          '교수자가 승인한 자료가 학습자 화면에서 어떤 톤으로 보이는지 확인합니다.',
          `
            <div class="feed-list">
              ${feedRow('AI', '학생 카드 문구', (cardById.xai_s01_student_hint_001 || interventionCard).judgment.summary, 'G1')}
              ${feedRow('↺', '되돌리기 조건', '혼란 지표가 상승하거나 교수자가 부적합하다고 판단하면 원본 Lecture 2 구성으로 복원합니다.', 'rollback')}
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

function signalTile(label, value, note) {
  return `
    <div class="signal">
      <span>${esc(label)}</span>
      <strong>${esc(value)}</strong>
      <small>${esc(note)}</small>
    </div>
  `;
}

function heatRow(label, value, warn) {
  return `
    <div class="heat-row">
      <span>${esc(label)}</span>
      <div class="heatbar ${warn ? 'warn' : ''}"><i style="--value: ${value}%"></i></div>
      <b>${value}%</b>
    </div>
  `;
}

function feedRow(mark, title, detail, meta) {
  return `
    <div class="feed-row">
      <span class="check">${esc(mark)}</span>
      <div>
        <b>${esc(title)}</b>
        <span>${esc(detail)}</span>
      </div>
      <span class="minutes">${esc(meta)}</span>
    </div>
  `;
}

function renderEvidenceBoard() {
  const filtered = xaiCards.filter((card) => state.activeAudience === 'all' || card.audience === state.activeAudience);
  return `
    <div class="evidence-layout">
      ${module(
        'AI 근거 보드',
        '학생과 교수자가 보는 모든 AI 판단은 xAI 카드, approval, measurement, impact에 연결됩니다.',
        `
          <div class="filter-row" aria-label="xAI 카드 필터">
            ${[
              ['all', '전체'],
              ['student', '학습자'],
              ['instructor', '교수자'],
            ].map(([key, label]) => `
              <button class="${state.activeAudience === key ? 'active' : ''}" data-action="set-filter" data-filter="${key}">${label}</button>
            `).join('')}
          </div>
          <div class="evidence-grid">${filtered.map(renderEvidenceTile).join('')}</div>
        `,
        tag('xAI registry', 'ok'),
      )}
    </div>
  `;
}

function renderEvidenceTile(card) {
  const active = card.card_id === state.activeCardId;
  return `
    <button class="evidence-tile ${active ? 'active' : ''}" data-action="select-card" data-card-id="${esc(card.card_id)}">
      <div>
        <h4>${esc(card.scenario_id)} · ${esc(card.audience)} · ${esc(card.judgment.decision_type)}</h4>
        <p>${esc(card.judgment.summary)}</p>
      </div>
      <div class="meter" style="--confidence: ${confidenceLabel(card)}"><span></span></div>
      <span class="mono-line">${esc(card.model.name)} ${esc(card.model.version)} · ${esc(card.model.run_id)}</span>
    </button>
  `;
}

function renderCourseSetup() {
  const s13 = scenarioFor('S13');
  const adapter = data.adapter?.spec || {};
  const gates = [...new Set(data.pilot_gates || [])].slice(0, 5);
  return `
    <div class="course-layout">
      ${module(
        'LMS 안에 붙는 AI 수업 레이어',
        '기존 NetLearning/manaba 화면을 대체하지 않고 강의, 과제, 퀴즈 옆에서 작동합니다.',
        `
          <div class="setup-list">
            ${setupRow('LTI', 'NetLearning / manaba 임베드', '강의 플레이어, 과제, 체크포인트 옆에 AI 코치와 근거 패널을 표시합니다.', adapter.mode || 'fallback')}
            ${setupRow('AI', '학생별 지원은 학생 통제', '저장, 수정, 숨김, Meiwaku feedback을 학생이 직접 결정합니다.', 'G1')}
            ${setupRow('承', '수업 변경은 교수자 승인', 'AI 초안은 교수자가 승인해야 게시되고 롤백 조건을 함께 남깁니다.', 'G2')}
          </div>
        `,
        tag('compose, not replace', 'ok'),
      )}

      ${module(
        '파일럿 게이트',
        'AI 정책 자동 변경처럼 민감한 실행 경로는 실제 대학 승인 없이는 잠겨 있습니다.',
        `
          <div class="gate-list">
            ${setupRow('!', `${s13?.scenario_id || 'S13'} · ${s13?.state || 'awaiting_approval'}`, s13?.reason || 'Academic admin and legal approval required.', 'G4')}
            ${gates.map((gate) => setupRow('□', gate, '실제 대학 파일럿 전에 확인해야 하는 증거 항목입니다.', 'pilot')).join('')}
          </div>
        `,
        tag('locked where needed', 'warn'),
      )}
    </div>
  `;
}

function setupRow(mark, title, detail, meta) {
  return `
    <div class="setup-row">
      <span class="check">${esc(mark)}</span>
      <div>
        <b>${esc(title)}</b>
        <span>${esc(detail)}</span>
      </div>
      <span class="minutes">${esc(meta)}</span>
    </div>
  `;
}

function renderAiDock() {
  const card = activeCard();
  const approval = (data.approvals || []).find((item) => item.source_card_id === card.card_id);
  const result = resultFor(card.scenario_id);
  const evidenceRows = (card.evidence || []).map((item) => `
    <div class="evidence-item">
      <b>${esc(item.source_event)}</b>
      <span>${esc(item.claim)} · weight ${esc(item.weight)}</span>
    </div>
  `).join('');
  const prompts = state.route === 'instructor'
    ? [['draft', '대안 초안'], ['measurement', '효과 측정'], ['student-preview', '학생 미리보기']]
    : [['why', '왜 추천했어?'], ['adjust', '20분으로 줄여줘'], ['quiz', '힌트만 줘']];

  document.getElementById('aiDock').innerHTML = `
    <section class="dock-card">
      <div class="dock-head">
        <div style="display: flex; gap: 10px;">
          <span class="ai-badge">AI</span>
          <div>
            <h3>AI 코치</h3>
            <p>현재 수업 맥락과 선택된 xAI 근거를 함께 봅니다.</p>
          </div>
        </div>
        ${tag('live UX', 'ok')}
      </div>
      <div class="dock-body">
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

    <section class="dock-card">
      <div class="dock-head">
        <div>
          <h3>근거 보기</h3>
          <p>${esc(card.scenario_id)} · ${esc(card.card_id)}</p>
        </div>
        ${tag(card.audience, card.audience === 'student' ? 'ok' : 'warn')}
      </div>
      <div class="dock-body">
        <div class="drawer-summary">
          <strong>${esc(card.judgment.summary)}</strong>
          <div class="meter" style="--confidence: ${confidenceLabel(card)}"><span></span></div>
          <span class="mono-line">AI confidence ${confidenceLabel(card)}</span>
        </div>
        <div class="evidence-list">${evidenceRows || '<div class="empty-state">연결된 근거가 없습니다.</div>'}</div>
        <div class="state-note">
          불확실성: ${esc(card.uncertainty.summary)} · ${esc(card.uncertainty.interval_or_reason)}
        </div>
        <div class="evidence-list">
          ${evidenceItem('권장 행동', `${card.recommended_action.label} · approval ${card.governance.approval_gate}`)}
          ${evidenceItem('측정 계획', `${card.measurement_plan.metric} · ${card.measurement_plan.method}`)}
          ${evidenceItem('승인 / 영향', `${approval?.state || 'session action required'} · ${result?.impact_decision || 'measurement pending'}`)}
          ${evidenceItem('모델', `${card.model.name} ${card.model.version} · ${card.model.run_id}`)}
        </div>
      </div>
    </section>
  `;
}

function evidenceItem(title, detail) {
  return `
    <div class="evidence-item">
      <b>${esc(title)}</b>
      <span>${esc(detail)}</span>
    </div>
  `;
}

function renderStatusStrip() {
  const blocked = (data.scenario_matrix || []).filter((item) => !item.executable).length;
  const progress = progressPercent();
  document.getElementById('statusStrip').innerHTML = [
    chip(`학습 ${progress}%`, progress > 70 ? 'ok' : ''),
    chip('AI 근거 연결', 'ok'),
    chip('교수자 approval', 'warn'),
    chip(`${blocked} pilot locked`, blocked ? 'warn' : 'ok'),
  ].join('');
}

function pushChat(role, text) {
  state.chat.push({ role, text });
  if (state.chat.length > 10) state.chat = state.chat.slice(-10);
}

function askAi(prompt) {
  const card = activeCard();
  if (prompt === 'adjust') {
    pushChat('user', '오늘은 20분만 가능해.');
    state.planMinutes = 20;
    state.activeCardId = 'xai_s12_pace_agent_001';
    pushChat('assistant', '20분 플랜으로 줄였습니다. 핵심 정의, 확인 문제 1개, 과제 시작점만 남깁니다.');
    return;
  }
  if (prompt === 'quiz') {
    pushChat('user', '정답 말고 힌트만 줘.');
    state.activeCardId = 'xai_s01_student_hint_001';
    pushChat('assistant', '힌트: Entropy가 낮아졌다는 것은 분할 뒤 불확실성이 줄었다는 뜻입니다. 어느 노드가 더 한 클래스에 모였는지 먼저 보세요.');
    return;
  }
  if (prompt === 'draft') {
    pushChat('user', '다른 보강 설명 방식도 제안해줘.');
    state.draftVariant = state.draftVariant === 'bridge' ? 'example' : 'bridge';
    state.activeCardId = 'xai_s11_cocreation_001';
    pushChat('assistant', `${draftVariants[state.draftVariant].label} 방식으로 바꿨습니다. 교수자 승인 전까지 학생 화면에는 게시하지 않습니다.`);
    return;
  }
  if (prompt === 'measurement') {
    const result = resultFor('S01');
    state.activeCardId = 'xai_s01_instructor_intervention_001';
    pushChat('user', '효과 측정을 보여줘.');
    pushChat('assistant', `반복 재시청률 ${result ? formatPercent(result.observed.segment_rewatch_rate_delta) : 'N/A'}, 확인 문제 정답률 ${result ? formatPercent(result.observed.checkpoint_correct_rate_delta) : 'N/A'}입니다. 단일 강의 파일럿 한계도 같이 표시합니다.`);
    return;
  }
  if (prompt === 'student-preview') {
    pushChat('user', '학생에게 어떻게 보이는지 보여줘.');
    pushChat('assistant', '학생 화면에는 위험 라벨 없이 복습, 힌트, 숨김, Meiwaku feedback 컨트롤로 표시됩니다.');
    setRoute('student');
    state.activeCardId = 'xai_s01_student_hint_001';
    return;
  }
  if (prompt === 'start') {
    state.completedTaskIds.add('warmup');
    pushChat('user', '오늘 플랜으로 시작할게.');
    pushChat('assistant', '먼저 3분 복습을 완료 처리했습니다. 이해가 흔들리면 힌트 강도를 낮춰 다시 설명하겠습니다.');
    return;
  }
  pushChat('user', '왜 이 추천을 했어?');
  pushChat('assistant', `${card.evidence?.[0]?.claim || '선택된 xAI 카드의 근거'} 판단입니다. 다만 ${card.uncertainty?.summary || '불확실성이 있어 사용자가 조정할 수 있습니다.'}`);
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
    if (state.completedTaskIds.has(taskId)) state.completedTaskIds.delete(taskId);
    else state.completedTaskIds.add(taskId);
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
    state.meiwakuStatus = '추천을 숨김 처리했습니다. 이 선택은 성적이나 교수자 평가에 반영되지 않고 AI 추천 품질 개선 신호로만 저장됩니다.';
    state.activeCardId = 'xai_s12_pace_agent_001';
    return;
  }
  if (action === 'request-help') {
    state.meiwakuStatus = '교수자에게는 개인 식별 없이 “W7 18:12 구간 설명 보강 요청”으로 전달됩니다.';
    state.activeCardId = 'xai_s01_student_hint_001';
    return;
  }
  if (action === 'ask-ai') askAi(button.dataset.prompt || 'why');
}

function setRoute(route) {
  state.route = routes[route] ? route : 'student';
  window.history.replaceState(null, '', `#${state.route}`);
}

function syncRouteControls() {
  document.querySelectorAll('[data-route]').forEach((button) => {
    if (!button.classList.contains('route-pill') && !button.classList.contains('nav-item')) return;
    button.classList.toggle('active', button.dataset.route === state.route);
  });
}

function render() {
  if (!routes[state.route]) state.route = 'student';
  const route = routes[state.route];
  syncRouteControls();
  document.getElementById('routeTitle').textContent = route.title;
  document.getElementById('routeContext').textContent = route.context;
  document.getElementById('view').innerHTML = route.render();
  renderStatusStrip();
  renderAiDock();
}

document.addEventListener('click', (event) => {
  const routeButton = event.target.closest('.route-pill, .nav-item');
  if (routeButton) {
    setRoute(routeButton.dataset.route || 'student');
    if (state.route === 'student') state.activeCardId = 'xai_s12_pace_agent_001';
    if (state.route === 'instructor') state.activeCardId = 'xai_s01_instructor_intervention_001';
    render();
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  handleAction(actionButton);
  render();
});

window.addEventListener('hashchange', () => {
  state.route = routeFromHash();
  render();
});

render();
