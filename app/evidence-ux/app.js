const data = window.JP_LMS_VIBEOPS_DATA;

const routes = {
  home: { title: 'Operations', render: renderHome },
  s01: { title: 'Closed Loop', render: renderClosedLoop },
  evidence: { title: 'Evidence', render: renderEvidence },
  integration: { title: 'Integration', render: renderIntegration },
};

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

function scenarioTone(item) {
  if (item.executable) return 'ok';
  if (item.state === 'awaiting_approval') return 'warn';
  return 'block';
}

function scenarioRows() {
  return data.scenario_matrix
    .map((item) => `
      <tr>
        <td class="id">${esc(item.scenario_id)}</td>
        <td>${esc(item.state)}</td>
        <td>${esc(item.approval_state)}</td>
        <td>${tag(item.executable ? 'ready' : 'blocked', scenarioTone(item))}</td>
        <td>${esc(item.reason)}</td>
      </tr>
    `)
    .join('');
}

function renderHome() {
  const run = data.control_plane_run;
  const s13 = data.scenario_matrix.find((item) => item.scenario_id === 'S13');
  const firstGates = [...new Set(data.pilot_gates)].slice(0, 5);

  return `
    <div class="layout-ops">
      <div class="dock">
        ${panel(
          'Control Plane State',
          'Runtime output, approval state, and measurement linkage generated from fixtures.',
          `<div class="metrics">
            ${metric('Primary operation', 'S01 closed loop', run.operation_id)}
            ${metric('Event ledger', `${run.event_count} events`, 'append/read path verified')}
            ${metric('Approval', run.execution_allowed ? 'allowed' : 'blocked', run.execution_reason)}
            ${metric('Impact ledger', 'retained', run.impact_ledger_id)}
          </div>`,
          tag('runtime passed', 'ok'),
        )}

        ${panel(
          'Operation Queue',
          'S13 remains blocked because G4 approval is still external.',
          `<table class="queue">
            <thead><tr><th>Scenario</th><th>State</th><th>Approval</th><th>Runtime</th><th>Reason</th></tr></thead>
            <tbody>${scenarioRows()}</tbody>
          </table>`,
        )}

        ${panel(
          'Learning Operations Spine',
          'The UI is forced to follow the operating model instead of inventing its own story.',
          `<div class="spine">
            <div class="spine-step"><b>Event</b><span>video, checkpoint, draft, policy and adapter events enter the ledger.</span></div>
            <div class="spine-step"><b>Evidence</b><span>xAI cards bind judgment to source events and model versions.</span></div>
            <div class="spine-step"><b>Approval</b><span>G1/G2/G4 actions cannot execute without the matching approval state.</span></div>
            <div class="spine-step"><b>Measurement</b><span>plans and results carry baseline, target, uncertainty and limits.</span></div>
            <div class="spine-step"><b>Ledger</b><span>impact entries connect action, approval, measurement and result.</span></div>
          </div>`,
        )}
      </div>

      <aside class="dock">
        ${panel(
          'Blocked Work',
          'These are not hidden. They remain visible until human review clears them.',
          `<div class="dock">
            <div class="dock-item block"><b>${esc(s13.scenario_id)} · ${esc(s13.state)}</b><span>${esc(s13.reason)}</span></div>
            <div class="dock-item warn"><b>APPI / IRB</b><span>Readiness documents exist, but external approval is not claimed.</span></div>
            <div class="dock-item warn"><b>Native copy</b><span>Student-facing Japanese/Korean text remains draft until review.</span></div>
          </div>`,
          tag('gates visible', 'warn'),
        )}

        ${panel(
          'Pilot Gate Evidence',
          'Gate list is deduplicated from pilot-gates.yaml evidence docs.',
          `<div class="dock">${firstGates.map((gate) => `<div class="dock-item"><b>${esc(gate)}</b><span>Required before real pilot execution.</span></div>`).join('')}</div>`,
        )}
      </aside>
    </div>
  `;
}

function renderClosedLoop() {
  const events = data.events
    .filter((event) => event.scenario_id === undefined || event.event_id.startsWith('evt_s01'))
    .slice(0, 3);
  const rows = events.map((event) => `
    <tr>
      <td>${esc(event.occurred_at)}</td>
      <td>${esc(event.event_type)}</td>
      <td>${esc(event.privacy_level)}</td>
      <td>${esc(event.payload_ref)}</td>
    </tr>
  `).join('');
  const approval = data.approvals.find((item) => item.scenario_id === 'S01');
  const result = data.measurement_results.find((item) => item.scenario_id === 'S01');
  const ledger = data.impact_ledgers.find((item) => item.scenario_id === 'S01');

  return `
    ${panel(
      'Event Timeline',
      'A complete chain from lecture signal to retained impact ledger entry.',
      `<table class="queue">
        <thead><tr><th>Time</th><th>Event</th><th>Privacy</th><th>Payload</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`,
      tag('aggregate / pseudonymous', 'ok'),
    )}
    <div class="grid-2">
      ${panel('Approval Record', 'G2 instructor approval with rollback note.', `<pre class="mono">${esc(JSON.stringify(approval, null, 2))}</pre>`)}
      ${panel('Measured Result', 'Effect claim includes uncertainty and limitation note.', `<pre class="mono">${esc(JSON.stringify(result, null, 2))}</pre>`)}
    </div>
    ${panel('Impact Ledger', 'Retained decision remains connected to action, approval, measurement and result.', `<pre class="mono">${esc(JSON.stringify(ledger, null, 2))}</pre>`)}
  `;
}

function renderEvidence() {
  const cards = data.xai_cards.map((card) => {
    const evidence = card.evidence.map((item) => `
      <div class="evidence-item">
        <b>${esc(item.source_event)}</b>
        <span>${esc(item.claim)} · weight ${esc(item.weight)}</span>
      </div>
    `).join('');
    const detail = {
      model: card.model,
      uncertainty: card.uncertainty,
      action: card.recommended_action,
      measurement: card.measurement_plan,
      governance: card.governance,
    };
    return `
      <div class="evidence-card">
        <div>
          <h4>${esc(card.scenario_id)} · ${esc(card.card_id)}</h4>
          <p>${esc(card.judgment.summary)}</p>
        </div>
        <div class="grid-2">
          <div class="evidence-list">${evidence}</div>
          <pre class="mono">${esc(JSON.stringify(detail, null, 2))}</pre>
        </div>
      </div>
    `;
  }).join('');
  return panel('xAI Card Registry', 'Every visible AI judgment is backed by evidence, model, uncertainty, action and measurement.', cards);
}

function renderIntegration() {
  const adapter = data.adapter.spec;
  const rows = data.adapter.sample_events.map((event) => `
    <tr>
      <td class="id">${esc(event.event_id)}</td>
      <td>${esc(event.event_type)}</td>
      <td>${esc(event.source_system)}</td>
      <td>${esc(event.privacy_level)}</td>
    </tr>
  `).join('');
  return `
    ${panel(
      'Adapter Boundary',
      'CSV fallback maps NetLearning-style exports into the internal event catalog.',
      `<div class="metrics">
        ${metric('Adapter', adapter.adapter_id)}
        ${metric('Mode', adapter.mode)}
        ${metric('Privacy default', adapter.privacy_default)}
        ${metric('Failure mode', adapter.failure_mode)}
      </div>`,
      tag('fallback ready', 'ok'),
    )}
    ${panel(
      'Mapped Sample Events',
      'Adapter output is not UI-specific; it feeds the same event ledger.',
      `<table class="queue">
        <thead><tr><th>Event</th><th>Type</th><th>Source</th><th>Privacy</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`,
    )}
  `;
}

function renderStatusStrip() {
  const ready = data.scenario_matrix.filter((item) => item.executable).length;
  const blocked = data.scenario_matrix.length - ready;
  document.getElementById('statusStrip').innerHTML = [
    chip(`${ready} executable`, 'ok'),
    chip(`${blocked} blocked`, blocked ? 'warn' : 'ok'),
    chip('APPI/IRB pending', 'warn'),
    chip('runtime data'),
  ].join('');
}

function routeTo(route) {
  const key = routes[route] ? route : 'home';
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.route === key);
  });
  document.getElementById('routeTitle').textContent = routes[key].title;
  document.getElementById('view').innerHTML = routes[key].render();
}

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => routeTo(button.dataset.route));
});

renderStatusStrip();
routeTo('home');
