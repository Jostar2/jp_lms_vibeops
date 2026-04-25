const data = window.JP_LMS_VIBEOPS_DATA;

const routes = {
  home: {
    title: 'Operations Home',
    render: renderHome,
  },
  s01: {
    title: 'S01 Closed Loop',
    render: renderS01,
  },
  evidence: {
    title: 'Evidence Detail',
    render: renderEvidence,
  },
  integration: {
    title: 'Integration Readiness',
    render: renderIntegration,
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

function routeTo(route) {
  const selected = routes[route] ? route : 'home';
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.route === selected);
  });
  document.getElementById('routeTitle').textContent = routes[selected].title;
  document.getElementById('view').innerHTML = routes[selected].render();
}

function section(title, description, body, tag = '') {
  return `
    <section class="band">
      <div class="band-head">
        <div>
          <h3>${esc(title)}</h3>
          ${description ? `<p>${esc(description)}</p>` : ''}
        </div>
        ${tag}
      </div>
      ${body}
    </section>
  `;
}

function metric(label, value, note = '') {
  return `
    <div class="metric">
      <div class="metric-label">${esc(label)}</div>
      <div class="metric-value">${esc(value)}</div>
      ${note ? `<p>${esc(note)}</p>` : ''}
    </div>
  `;
}

function renderHome() {
  const run = data.control_plane_run;
  const blockers = data.pilot_gates.slice(0, 4).map((gate) => `<li>${esc(gate)}</li>`).join('');
  const matrixRows = data.scenario_matrix
    .map(
      (item) => `
      <tr>
        <td>${esc(item.scenario_id)}</td>
        <td>${esc(item.state)}</td>
        <td>${esc(item.approval_state)}</td>
        <td>${item.executable ? '<span class="tag ok">ready</span>' : '<span class="tag warn">blocked</span>'}</td>
        <td>${esc(item.reason)}</td>
      </tr>
    `,
    )
    .join('');
  return `
    ${section(
      'Current Operation',
      'Runtime state is generated from control-plane fixtures, not handwritten UI copy.',
      `<div class="grid-3">
        ${metric('Operation', run.operation_id)}
        ${metric('Scenario', run.scenario_id)}
        ${metric('Execution', run.execution_allowed ? 'allowed' : 'blocked', run.execution_reason)}
      </div>`,
      '<span class="tag ok">control plane passed</span>',
    )}
    ${section(
      'AI Learning Operations Chain',
      'Every step is tied to evidence, approval, or measurement.',
      `<div class="chain">
        <div class="chain-step"><strong>1. Event</strong><span>${run.event_count} learning events in ledger</span></div>
        <div class="chain-step"><strong>2. Evidence</strong><span>${run.card_count} xAI cards rendered</span></div>
        <div class="chain-step"><strong>3. Approval</strong><span>${run.approval_count} instructor approval record</span></div>
        <div class="chain-step"><strong>4. Measure</strong><span>${esc(run.measurement_id)}</span></div>
        <div class="chain-step"><strong>5. Ledger</strong><span>${esc(run.impact_ledger_id)}</span></div>
      </div>`,
    )}
    ${section(
      'Pilot Blockers',
      'These remain gates, not completed approvals.',
      `<ul>${blockers}</ul>`,
      '<span class="tag warn">external review required</span>',
    )}
    ${section(
      'Scenario Matrix',
      'S11 and S12 can execute in controlled form; S13 remains blocked until G4 review.',
      `<table class="table">
        <thead><tr><th>Scenario</th><th>State</th><th>Approval</th><th>Runtime</th><th>Reason</th></tr></thead>
        <tbody>${matrixRows}</tbody>
      </table>`,
    )}
  `;
}

function renderS01() {
  const eventRows = data.events
    .map(
      (event) => `
      <tr>
        <td>${esc(event.occurred_at)}</td>
        <td>${esc(event.event_type)}</td>
        <td>${esc(event.privacy_level)}</td>
        <td>${esc(event.payload_ref)}</td>
      </tr>
    `,
    )
    .join('');
  const approval = data.approvals[0];
  const result = data.measurement_results[0];
  const ledger = data.impact_ledgers[0];
  return `
    ${section(
      'Event Timeline',
      'S01 starts from aggregate or pseudonymous learning events.',
      `<table class="table">
        <thead><tr><th>Time</th><th>Event</th><th>Privacy</th><th>Payload</th></tr></thead>
        <tbody>${eventRows}</tbody>
      </table>`,
    )}
    <div class="grid-2">
      ${section(
        'Approval Record',
        'Instructor approval is required before content action.',
        `<div class="metric">
          <div class="metric-label">Gate</div>
          <div class="metric-value">${esc(approval.gate)} · ${esc(approval.state)}</div>
          <p>${esc(approval.rollback_note)}</p>
        </div>`,
      )}
      ${section(
        'Measured Result',
        'Effect claim includes uncertainty and limitation note.',
        `<div class="metric">
          <div class="metric-label">Decision</div>
          <div class="metric-value">${esc(result.impact_decision)}</div>
          <p>${esc(result.limitation_note)}</p>
        </div>`,
      )}
    </div>
    ${section(
      'Impact Ledger',
      'The retained decision remains tied to action, approval, measurement, and result ids.',
      `<div class="mono">${esc(JSON.stringify(ledger, null, 2))}</div>`,
    )}
  `;
}

function renderEvidence() {
  const cards = data.xai_cards
    .map((card) => {
      const evidence = card.evidence
        .map(
          (item) => `
          <div class="evidence-item">
            <strong>${esc(item.source_event)}</strong>
            <span>${esc(item.claim)} · weight ${esc(item.weight)}</span>
          </div>
        `,
        )
        .join('');
      return `
        <section class="band">
          <div class="band-head">
            <div>
              <h3>${esc(card.card_id)}</h3>
              <p>${esc(card.judgment.summary)}</p>
            </div>
            <span class="tag">${esc(card.audience)}</span>
          </div>
          <div class="split">
            <div class="evidence-list">${evidence}</div>
            <div class="mono">${esc(JSON.stringify({
              model: card.model,
              uncertainty: card.uncertainty,
              recommended_action: card.recommended_action,
              measurement_plan: card.measurement_plan,
              governance: card.governance,
            }, null, 2))}</div>
          </div>
        </section>
      `;
    })
    .join('');
  return cards;
}

function renderIntegration() {
  const adapter = data.adapter.spec;
  const rows = data.adapter.sample_events
    .map(
      (event) => `
      <tr>
        <td>${esc(event.event_id)}</td>
        <td>${esc(event.event_type)}</td>
        <td>${esc(event.source_system)}</td>
        <td>${esc(event.privacy_level)}</td>
      </tr>
    `,
    )
    .join('');
  return `
    ${section(
      'Adapter Path',
      'CSV fallback keeps the first pilot from being blocked by full LMS integration.',
      `<div class="grid-3">
        ${metric('Adapter', adapter.adapter_id)}
        ${metric('Mode', adapter.mode)}
        ${metric('Failure', adapter.failure_mode)}
      </div>`,
      '<span class="tag ok">sample mapped</span>',
    )}
    ${section(
      'Mapped Events',
      'Adapter output uses the same internal event catalog as the control plane.',
      `<table class="table">
        <thead><tr><th>Event id</th><th>Type</th><th>Source</th><th>Privacy</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`,
    )}
    ${section(
      'Pilot Gates',
      'These evidence docs must remain reviewable before a real pilot.',
      `<div class="mono">${esc(JSON.stringify(data.pilot_gates, null, 2))}</div>`,
    )}
  `;
}

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => routeTo(button.dataset.route));
});

document.getElementById('operationState').textContent = data.control_plane_run.execution_reason;
document.getElementById('operationState').classList.add('ok');
routeTo('home');
