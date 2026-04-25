window.JP_LMS_VIBEOPS_DATA = {
  "generated_from": "JP LMS VibeOps control plane fixtures",
  "control_plane_run": {
    "operation_id": "op_s01_closed_loop_001",
    "scenario_id": "S01",
    "event_count": 3,
    "card_count": 2,
    "approval_count": 1,
    "measurement_id": "measure_s01_intervention_effect_001",
    "result_id": "result_s01_intervention_effect_001",
    "impact_ledger_id": "impact_act_s01_entropy_bridge_publish",
    "execution_allowed": true,
    "execution_reason": "approved action may execute"
  },
  "events": [
    {
      "event_id": "evt_s01_video_pause_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "student",
      "occurred_at": "2026-04-10T10:18:12+09:00",
      "event_type": "video.segment.pause",
      "purpose": "learning_support_signal",
      "privacy_level": "pseudonymous",
      "source_system": "lms_video_player",
      "payload_ref": "aggregate:course_dm_w7_segment_22",
      "retention_policy": "pilot_duration_plus_90_days"
    },
    {
      "event_id": "evt_s01_checkpoint_submit_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "student",
      "occurred_at": "2026-04-10T10:23:40+09:00",
      "event_type": "checkpoint.answer.submit",
      "purpose": "learning_support_signal",
      "privacy_level": "pseudonymous",
      "source_system": "lms_quiz",
      "payload_ref": "aggregate:entropy_definition_checkpoint",
      "retention_policy": "pilot_duration_plus_90_days"
    },
    {
      "event_id": "evt_s01_inference_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "system",
      "occurred_at": "2026-04-10T10:25:00+09:00",
      "event_type": "inference.struggle.detect",
      "purpose": "course_improvement_recommendation",
      "privacy_level": "aggregate",
      "source_system": "jp_lms_vibeops_ai_kernel",
      "payload_ref": "ai_run:run_s01_struggle_detect_001",
      "retention_policy": "pilot_duration_plus_1_year"
    }
  ],
  "xai_cards": [
    {
      "card_id": "xai_s01_instructor_intervention_001",
      "scenario_id": "S01",
      "audience": "instructor",
      "judgment": {
        "summary": "W7 Lecture 2의 22% 구간은 Gini와 Entropy 비교 설명 직후 확인 문제 흔들림이 반복되어, 짧은 선행 개념 보강 자료를 추가할 가치가 있습니다.",
        "decision_type": "draft",
        "confidence": 0.81
      },
      "evidence": [
        {
          "source_event": "evt_s01_video_pause_001",
          "claim": "22% 구간의 멈춤/재시청이 같은 강의 평균보다 높습니다.",
          "weight": 0.36
        },
        {
          "source_event": "evt_s01_checkpoint_submit_001",
          "claim": "엔트로피 정의 확인 문제에서 오답 선택이 집중되었습니다.",
          "weight": 0.34
        },
        {
          "source_event": "evt_s01_inference_001",
          "claim": "집계 기준 선행 개념 보강이 가장 낮은 후회 비용을 보였습니다.",
          "weight": 0.3
        }
      ],
      "model": {
        "name": "course_intervention_policy",
        "version": "0.1.0",
        "run_id": "run_s01_intervention_001"
      },
      "uncertainty": {
        "summary": "표본은 강의 집계 단위이며, 학생 개인별 원인을 단정하지 않습니다.",
        "interval_or_reason": "expected_rewatch_delta=-12% to -28%"
      },
      "recommended_action": {
        "action_id": "act_s01_entropy_bridge_publish",
        "label": "엔트로피 정의 브리지 설명과 확인 문제 1개를 W7 Lecture 2 앞에 추가합니다.",
        "owner": "instructor",
        "requires_approval": true
      },
      "measurement_plan": {
        "measurement_id": "measure_s01_intervention_effect_001",
        "metric": "segment_rewatch_rate_and_checkpoint_delta",
        "method": "switchback",
        "reevaluate_at": "2026-04-24T10:00:00+09:00"
      },
      "governance": {
        "data_scope": [
          "video.segment.pause",
          "checkpoint.answer.submit",
          "inference.struggle.detect"
        ],
        "privacy_level": "aggregate",
        "approval_gate": "G2",
        "appeal_control": "instructor_override"
      }
    },
    {
      "card_id": "xai_s01_student_hint_001",
      "scenario_id": "S01",
      "audience": "student",
      "judgment": {
        "summary": "이 구간은 지니 불순도와 엔트로피를 비교하는 부분이라, 먼저 엔트로피 정의를 짧게 확인하면 다음 설명이 더 잘 이어집니다.",
        "decision_type": "recommend",
        "confidence": 0.72
      },
      "evidence": [
        {
          "source_event": "evt_s01_video_pause_001",
          "claim": "같은 구간에서 멈춤과 재시청이 집중되었습니다.",
          "weight": 0.42
        },
        {
          "source_event": "evt_s01_checkpoint_submit_001",
          "claim": "확인 문제에서 엔트로피 정의 선택지가 흔들렸습니다.",
          "weight": 0.31
        }
      ],
      "model": {
        "name": "segment_support_policy",
        "version": "0.1.0",
        "run_id": "run_s01_student_hint_001"
      },
      "uncertainty": {
        "summary": "현재 판단은 학습 행동 신호만 사용하며, 컨디션이나 외부 일정은 알지 못합니다.",
        "interval_or_reason": "support_fit_estimate=0.64-0.78"
      },
      "recommended_action": {
        "action_id": "act_s01_student_hint_pack",
        "label": "엔트로피 정의 3분 복습과 예시 문제 1개를 먼저 봅니다.",
        "owner": "student",
        "requires_approval": true
      },
      "measurement_plan": {
        "measurement_id": "measure_s01_hint_effect_001",
        "metric": "next_checkpoint_correctness",
        "method": "pre_post",
        "reevaluate_at": "2026-04-10T10:35:00+09:00"
      },
      "governance": {
        "data_scope": [
          "video.segment.pause",
          "checkpoint.answer.submit"
        ],
        "privacy_level": "pseudonymous",
        "approval_gate": "G1",
        "appeal_control": "meiwaku_feedback"
      }
    }
  ],
  "approvals": [
    {
      "approval_id": "approval_s01_entropy_bridge_001",
      "scenario_id": "S01",
      "gate": "G2",
      "state": "approved",
      "requested_action": {
        "action_id": "act_s01_entropy_bridge_publish",
        "label": "엔트로피 정의 브리지 설명과 확인 문제 1개를 W7 Lecture 2 앞에 추가합니다."
      },
      "source_card_id": "xai_s01_instructor_intervention_001",
      "approver_role": "instructor",
      "requested_at": "2026-04-10T11:00:00+09:00",
      "approved_at": "2026-04-10T11:08:00+09:00",
      "rollback_note": "게시 후 학생 혼란 지표가 상승하거나 교수자가 부적합하다고 판단하면 원본 Lecture 2 구성으로 되돌립니다."
    }
  ],
  "measurements": [
    {
      "measurement_id": "measure_s01_intervention_effect_001",
      "scenario_id": "S01",
      "linked_action_id": "act_s01_entropy_bridge_publish",
      "metric": "segment_rewatch_rate_and_checkpoint_delta",
      "method": "switchback",
      "baseline": {
        "segment_rewatch_rate": 0.42,
        "checkpoint_correct_rate": 0.61
      },
      "target": {
        "segment_rewatch_rate_delta": -0.15,
        "checkpoint_correct_rate_delta": 0.08
      },
      "reevaluate_at": "2026-04-24T10:00:00+09:00",
      "owner": "course_instructor",
      "publish_rule": "Publish only as aggregate course-level effect with uncertainty or limitation note."
    }
  ],
  "measurement_results": [
    {
      "result_id": "result_s01_intervention_effect_001",
      "measurement_id": "measure_s01_intervention_effect_001",
      "scenario_id": "S01",
      "observed": {
        "segment_rewatch_rate_delta": -0.22,
        "checkpoint_correct_rate_delta": 0.1
      },
      "uncertainty": {
        "summary": "효과 방향은 일관되지만 표본은 단일 강의 단위입니다.",
        "interval": {
          "segment_rewatch_rate_delta": [
            -0.32,
            -0.12
          ],
          "checkpoint_correct_rate_delta": [
            0.05,
            0.15
          ]
        }
      },
      "limitation_note": "파일럿 중간 측정 결과이며, 다른 강의와 학기에는 재검증이 필요합니다.",
      "publish_status": "publishable",
      "impact_decision": "retain"
    }
  ],
  "impact_ledgers": [
    {
      "ledger_id": "impact_s01_entropy_bridge_001",
      "scenario_id": "S01",
      "action_id": "act_s01_entropy_bridge_publish",
      "approval_id": "approval_s01_entropy_bridge_001",
      "measurement_id": "measure_s01_intervention_effect_001",
      "result_id": "result_s01_intervention_effect_001",
      "decision": "retained",
      "summary": "W7 Lecture 2 앞에 추가한 엔트로피 브리지 설명은 집계 기준 재시청률을 낮추고 확인 문제 정답률을 올린 것으로 측정되어 유지합니다.",
      "next_review_at": "2026-05-08T10:00:00+09:00"
    }
  ],
  "adapter": {
    "spec": {
      "adapter_id": "adapter_netlearning_csv_s01",
      "source_system": "netlearning_csv_export",
      "mode": "csv_fallback",
      "supported_event_types": [
        "video.segment.pause",
        "checkpoint.answer.submit"
      ],
      "field_map": {
        "tenant_id": "tenant_id",
        "actor_role": "actor_role",
        "occurred_at": "occurred_at",
        "event_type": "event_type",
        "purpose": "purpose",
        "privacy_level": "privacy_level",
        "payload_ref": "payload_ref"
      },
      "privacy_default": "pseudonymous",
      "failure_mode": "block_ai_operation_creation"
    },
    "sample_events": [
      {
        "event_id": "evt_adapter_s01_001",
        "tenant_id": "tenant_demo_university",
        "actor_role": "student",
        "occurred_at": "2026-04-10T10:18:12+09:00",
        "event_type": "video.segment.pause",
        "purpose": "learning_support_signal",
        "privacy_level": "pseudonymous",
        "source_system": "netlearning_csv_export",
        "payload_ref": "aggregate:course_dm_w7_segment_22",
        "retention_policy": "pilot_duration_plus_90_days"
      },
      {
        "event_id": "evt_adapter_s01_002",
        "tenant_id": "tenant_demo_university",
        "actor_role": "student",
        "occurred_at": "2026-04-10T10:23:40+09:00",
        "event_type": "checkpoint.answer.submit",
        "purpose": "learning_support_signal",
        "privacy_level": "pseudonymous",
        "source_system": "netlearning_csv_export",
        "payload_ref": "aggregate:entropy_definition_checkpoint",
        "retention_policy": "pilot_duration_plus_90_days"
      }
    ]
  },
  "pilot_gates": [
    "docs/pilot/appi-readiness-checklist.md",
    "docs/pilot/appi-readiness-checklist.md",
    "docs/pilot/irb-preregistration-draft.md",
    "docs/pilot/integration-fit-brief.md",
    "docs/pilot/ninety-day-measurement-protocol.md",
    "docs/pilot/pilot-risk-register.md",
    "docs/pilot/term-sheet-outline.md"
  ]
};
