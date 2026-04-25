"use client";

import { useMemo, useState } from "react";
import type { LearningObject, LearningSession } from "./types";

type Props = {
  session: LearningSession;
};

function pct(value: number | undefined): string {
  if (typeof value !== "number") return "N/A";
  return `${Math.round(value * 100)}%`;
}

function kindLabel(kind: LearningObject["kind"]): string {
  if (kind === "micro_lesson") return "Micro Lesson";
  if (kind === "checkpoint") return "Checkpoint";
  return "Assignment Scaffold";
}

export function AIFlowShell({ session }: Props) {
  const [selectedObjectId, setSelectedObjectId] = useState(session.generatedObjects[0]?.id ?? "");
  const [acceptedObjects, setAcceptedObjects] = useState<string[]>([]);
  const [professorApproved, setProfessorApproved] = useState(false);

  const selectedObject = useMemo(
    () => session.generatedObjects.find((item) => item.id === selectedObjectId) ?? session.generatedObjects[0],
    [selectedObjectId, session.generatedObjects]
  );
  const accepted = acceptedObjects.includes(selectedObject.id);
  const sessionProgress = Math.min(100, session.learnerPlan.progressPercent + acceptedObjects.length * 20);

  function acceptSelectedObject() {
    setAcceptedObjects((current) =>
      current.includes(selectedObject.id) ? current : [...current, selectedObject.id]
    );
  }

  return (
    <main className="product-shell">
      <header className="topbar">
        <div className="brand-mark">C</div>
        <div>
          <strong>Claritas</strong>
          <span>Production AI LMS Session</span>
        </div>
        <div className="agent-pill">
          <span />
          Agent Mesh · {session.agentRun.filter((step) => step.status !== "waiting").length} active
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">{session.courseTitle}</span>
          <h1>AI가 강의 병목에서 학습 세션을 생성합니다.</h1>
          <p>
            {session.lessonTitle}의 {session.incident.timestamp} 구간에서 감지된 병목을 바탕으로
            학습 객체, xAI 근거, 승인 경계, 측정 계획을 한 화면에서 연결합니다.
          </p>
        </div>
        <div className="hero-card">
          <span>Incident Heat</span>
          <strong>{session.incident.heat}</strong>
          <small>{session.incident.label}</small>
        </div>
      </section>

      <section className="workspace">
        <div className="learning-column">
          <section className="panel session-card">
            <div className="panel-head">
              <div>
                <span className="eyebrow">Learner Session</span>
                <h2>{session.learnerPlan.nextAction}</h2>
              </div>
              <div className="progress-ring" style={{ "--p": sessionProgress } as React.CSSProperties}>
                <span>{sessionProgress}%</span>
              </div>
            </div>
            <div className="generated-grid">
              {session.generatedObjects.map((item) => (
                <button
                  className={item.id === selectedObject.id ? "generated-card selected" : "generated-card"}
                  key={item.id}
                  onClick={() => setSelectedObjectId(item.id)}
                >
                  <span>{kindLabel(item.kind)}</span>
                  <strong>{item.title}</strong>
                  <small>{item.guardrail}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel object-preview">
            <div>
              <span className="eyebrow">{kindLabel(selectedObject.kind)}</span>
              <h2>{selectedObject.title}</h2>
              <p>{selectedObject.body}</p>
              <div className="guardrail">{selectedObject.guardrail}</div>
            </div>
            <div className="action-row">
              <button className="primary" onClick={acceptSelectedObject}>
                {accepted ? "플랜 반영됨" : "학습 플랜에 반영"}
              </button>
              <button onClick={() => setSelectedObjectId("entropy-checkpoint")}>확인 문제 생성</button>
            </div>
          </section>
        </div>

        <aside className="ai-dock">
          <section className="panel">
            <span className="eyebrow">Agent Run</span>
            <div className="run-list">
              {session.agentRun.map((step) => (
                <div className={`run-step ${step.status}`} key={step.id}>
                  <span />
                  <div>
                    <strong>{step.label}</strong>
                    <small>{step.detail}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel xai-card">
            <div className="panel-head compact">
              <div>
                <span className="eyebrow">xAI Card</span>
                <h2>{session.activeCard.scenario_id}</h2>
              </div>
              <b>{pct(session.activeCard.judgment.confidence)}</b>
            </div>
            <p>{session.activeCard.judgment.summary}</p>
            <div className="evidence-list">
              {session.activeCard.evidence.map((evidence) => (
                <div key={evidence.source_event}>
                  <strong>{evidence.source_event}</strong>
                  <span>{evidence.claim}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel approval-card">
            <span className="eyebrow">Instructor Boundary</span>
            <h2>{professorApproved ? "승인 완료" : session.approval?.state ?? "승인 대기"}</h2>
            <p>{session.instructorCard.recommended_action.label}</p>
            <button className="primary" onClick={() => setProfessorApproved(true)}>
              {professorApproved ? "승인 상태 유지" : "교수자 승인"}
            </button>
          </section>
        </aside>
      </section>

      <section className="measurement-strip">
        <div>
          <span>Measurement</span>
          <strong>{session.measurement?.metric ?? "pending"}</strong>
          <small>{session.measurement?.method ?? "not scheduled"}</small>
        </div>
        <div>
          <span>Impact</span>
          <strong>{session.result?.impact_decision ?? "pending"}</strong>
          <small>{session.impact?.summary ?? "No impact ledger yet"}</small>
        </div>
        <div>
          <span>Safety</span>
          <strong>student control</strong>
          <small>{session.safety.learnerControl}</small>
        </div>
      </section>
    </main>
  );
}
