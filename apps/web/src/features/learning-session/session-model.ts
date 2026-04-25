import type {
  AgentRunStep,
  Approval,
  ImpactLedger,
  LearningObject,
  LearningSession,
  Measurement,
  MeasurementResult,
  RuntimePayload,
  XaiCard
} from "./types";

function findCard(payload: RuntimePayload, cardId: string): XaiCard {
  const card = payload.xai_cards.find((item) => item.card_id === cardId);
  if (!card) {
    throw new Error(`Missing xAI card: ${cardId}`);
  }
  return card;
}

function findByScenario<T extends { scenario_id: string }>(
  collection: T[],
  scenarioId: string
): T | null {
  return collection.find((item) => item.scenario_id === scenarioId) ?? null;
}

function generatedObjects(): LearningObject[] {
  return [
    {
      id: "entropy-micro-lesson",
      kind: "micro_lesson",
      title: "Entropy 3분 마이크로 레슨",
      body: "분할 전후의 불확실성이 어떻게 줄어드는지 작은 표본으로 비교합니다.",
      guardrail: "정답을 대신 쓰지 않고 개념 설명과 예시만 제공합니다.",
      xaiCardId: "xai_s01_student_hint_001"
    },
    {
      id: "entropy-checkpoint",
      kind: "checkpoint",
      title: "Gini vs Entropy 확인 문제",
      body: "두 분할 중 Entropy 감소가 더 큰 쪽을 고르고 이유를 한 문장으로 남깁니다.",
      guardrail: "형성평가용이며 성적 산출에는 직접 연결하지 않습니다.",
      xaiCardId: "xai_s01_student_hint_001"
    },
    {
      id: "titanic-scaffold",
      kind: "assignment_scaffold",
      title: "Titanic 과제 시작 스캐폴드",
      body: "결측치 확인, 기준 모델, 평가 지표 선택 순서로 과제 시작점을 잡습니다.",
      guardrail: "제출문 생성 대신 계획과 체크리스트만 제공합니다.",
      xaiCardId: "xai_s12_pace_agent_001"
    }
  ];
}

function agentRun(payload: RuntimePayload): AgentRunStep[] {
  const allowed = payload.control_plane_run.execution_allowed;
  return [
    {
      id: "observe",
      label: "Observe",
      detail: "video.pause, checkpoint.answer, pace.request 이벤트를 읽습니다.",
      status: "complete"
    },
    {
      id: "reason",
      label: "Reason",
      detail: "xAI 카드의 evidence weight와 불확실성을 계산합니다.",
      status: "complete"
    },
    {
      id: "generate",
      label: "Generate",
      detail: "마이크로 레슨, 확인 문제, 과제 스캐폴드를 생성합니다.",
      status: "active"
    },
    {
      id: "gate",
      label: "Gate",
      detail: allowed ? "학생 수락 또는 교수자 승인 뒤 실행 가능합니다." : payload.control_plane_run.execution_reason,
      status: allowed ? "complete" : "waiting"
    },
    {
      id: "measure",
      label: "Measure",
      detail: "세션 완료 후 measurement result와 impact ledger로 효과를 기록합니다.",
      status: "waiting"
    }
  ];
}

export function buildLearningSession(payload: RuntimePayload): LearningSession {
  const activeCard = findCard(payload, "xai_s01_student_hint_001");
  const instructorCard = findCard(payload, "xai_s01_instructor_intervention_001");
  const scenarioId = instructorCard.scenario_id;
  const approval = findByScenario<Approval>(payload.approvals, scenarioId);
  const measurement = findByScenario<Measurement>(payload.measurements, scenarioId);
  const result = findByScenario<MeasurementResult>(payload.measurement_results, scenarioId);
  const impact = findByScenario<ImpactLedger>(payload.impact_ledgers, scenarioId);

  return {
    courseTitle: "Data Mining · W7",
    lessonTitle: "Lecture 2 · Tree Split Criteria",
    learnerPlan: {
      totalMinutes: 30,
      progressPercent: 25,
      nextAction: "Entropy 정의를 1문장으로 설명하고 확인 문제 1개를 풉니다."
    },
    incident: {
      label: "Gini / Entropy 병목",
      timestamp: "18:12",
      heat: 82
    },
    activeCard,
    instructorCard,
    approval,
    measurement,
    result,
    impact,
    generatedObjects: generatedObjects(),
    agentRun: agentRun(payload),
    safety: {
      learnerControl: "학생은 추천을 수락, 숨김, 이의제기할 수 있습니다.",
      instructorControl: "교수자는 집계 신호와 AI 초안을 승인하기 전까지 학생에게 공개하지 않습니다.",
      privacyScope: "학습자 UI는 pseudonymous 신호, 교수자 UI는 aggregate 신호만 사용합니다."
    }
  };
}
