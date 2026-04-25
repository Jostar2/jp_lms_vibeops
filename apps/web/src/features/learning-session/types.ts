export type RuntimePayload = {
  control_plane_run: {
    operation_id: string;
    scenario_id: string;
    execution_allowed: boolean;
    execution_reason: string;
  };
  events: RuntimeEvent[];
  xai_cards: XaiCard[];
  approvals: Approval[];
  measurements: Measurement[];
  measurement_results: MeasurementResult[];
  impact_ledgers: ImpactLedger[];
  scenario_matrix: ScenarioSummary[];
  adapter: {
    spec: Record<string, unknown>;
    sample_events: RuntimeEvent[];
  };
  pilot_gates: string[];
};

export type RuntimeEvent = {
  event_id: string;
  actor_role: string;
  occurred_at: string;
  event_type: string;
  purpose: string;
  privacy_level: string;
  source_system?: string;
  payload_ref: string;
};

export type XaiCard = {
  card_id: string;
  scenario_id: string;
  audience: "student" | "instructor" | string;
  judgment: {
    summary: string;
    decision_type?: string;
    confidence: number;
  };
  evidence: Array<{
    source_event: string;
    claim: string;
    weight: number;
  }>;
  model: {
    name: string;
    version: string;
    run_id: string;
  };
  uncertainty: {
    summary: string;
    interval_or_reason?: string;
  };
  recommended_action: {
    action_id?: string;
    label: string;
    owner?: string;
    requires_approval?: boolean;
  };
  measurement_plan: {
    measurement_id?: string;
    metric: string;
    method: string;
    reevaluate_at?: string;
  };
  governance: {
    privacy_level: string;
    approval_gate: string;
    appeal_control?: string;
  };
};

export type Approval = {
  approval_id: string;
  scenario_id: string;
  gate: string;
  state: "approved" | "requested" | string;
  source_card_id: string;
  requested_action: {
    action_id: string;
    label: string;
  };
  rollback_note?: string;
};

export type Measurement = {
  measurement_id: string;
  scenario_id: string;
  metric: string;
  method: string;
  owner: string;
  reevaluate_at: string;
};

export type MeasurementResult = {
  result_id: string;
  scenario_id: string;
  publish_status: string;
  impact_decision: string;
  observed: Record<string, number | undefined>;
  uncertainty: {
    summary: string;
  };
};

export type ImpactLedger = {
  ledger_id: string;
  scenario_id: string;
  decision: string;
  summary: string;
  next_review_at: string;
};

export type ScenarioSummary = {
  scenario_id: string;
  state: string;
  action_id: string;
  approval_state: string;
  executable: boolean;
  reason: string;
};

export type LearningObject = {
  id: string;
  kind: "micro_lesson" | "checkpoint" | "assignment_scaffold";
  title: string;
  body: string;
  guardrail: string;
  xaiCardId: string;
};

export type AgentRunStep = {
  id: string;
  label: string;
  detail: string;
  status: "complete" | "active" | "waiting";
};

export type LearningSession = {
  courseTitle: string;
  lessonTitle: string;
  learnerPlan: {
    totalMinutes: number;
    progressPercent: number;
    nextAction: string;
  };
  incident: {
    label: string;
    timestamp: string;
    heat: number;
  };
  activeCard: XaiCard;
  instructorCard: XaiCard;
  approval: Approval | null;
  measurement: Measurement | null;
  result: MeasurementResult | null;
  impact: ImpactLedger | null;
  generatedObjects: LearningObject[];
  agentRun: AgentRunStep[];
  safety: {
    learnerControl: string;
    instructorControl: string;
    privacyScope: string;
  };
};
