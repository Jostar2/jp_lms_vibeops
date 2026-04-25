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
  "scenario_matrix": [
    {
      "operation_id": "op_s01_closed_loop_001",
      "scenario_id": "S01",
      "state": "approved",
      "action_id": "act_s01_entropy_bridge_publish",
      "approval_state": "approved",
      "executable": true,
      "reason": "approved action may execute"
    },
    {
      "operation_id": "op_s11_cocreation_001",
      "scenario_id": "S11",
      "state": "approved",
      "action_id": "act_s11_publish_bridge_variant",
      "approval_state": "approved",
      "executable": true,
      "reason": "approved action may execute"
    },
    {
      "operation_id": "op_s12_pace_agent_001",
      "scenario_id": "S12",
      "state": "approved",
      "action_id": "act_s12_accept_pace_plan",
      "approval_state": "approved",
      "executable": true,
      "reason": "approved action may execute"
    },
    {
      "operation_id": "op_s13_counterfactual_001",
      "scenario_id": "S13",
      "state": "awaiting_approval",
      "action_id": "act_s13_select_support_policy",
      "approval_state": "requested",
      "executable": false,
      "reason": "awaiting approval: requested"
    }
  ],
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
    },
    {
      "event_id": "evt_s11_content_gap_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "system",
      "occurred_at": "2026-04-11T09:00:00+09:00",
      "event_type": "content.gap.detect",
      "purpose": "course_content_improvement",
      "privacy_level": "aggregate",
      "source_system": "jp_lms_vibeops_ai_kernel",
      "payload_ref": "aggregate:course_dm_w7_entropy_bridge_gap",
      "retention_policy": "pilot_duration_plus_1_year"
    },
    {
      "event_id": "evt_s11_draft_generate_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "system",
      "occurred_at": "2026-04-11T09:03:00+09:00",
      "event_type": "content.draft.generate",
      "purpose": "instructor_content_drafting",
      "privacy_level": "aggregate",
      "source_system": "jp_lms_vibeops_ai_kernel",
      "payload_ref": "draft:entropy_bridge_variant_a",
      "retention_policy": "pilot_duration_plus_1_year"
    },
    {
      "event_id": "evt_s12_pace_signal_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "student",
      "occurred_at": "2026-04-12T08:40:00+09:00",
      "event_type": "pace.plan.request",
      "purpose": "personal_learning_planning",
      "privacy_level": "pseudonymous",
      "source_system": "evidence_ux",
      "payload_ref": "student_opt_in:pace_plan_week8",
      "retention_policy": "pilot_duration_plus_90_days"
    },
    {
      "event_id": "evt_s12_plan_generate_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "system",
      "occurred_at": "2026-04-12T08:41:00+09:00",
      "event_type": "inference.pace_plan.generate",
      "purpose": "personal_learning_planning",
      "privacy_level": "pseudonymous",
      "source_system": "jp_lms_vibeops_ai_kernel",
      "payload_ref": "ai_run:run_s12_pace_plan_001",
      "retention_policy": "pilot_duration_plus_90_days"
    },
    {
      "event_id": "evt_s13_policy_candidates_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "system",
      "occurred_at": "2026-04-13T14:00:00+09:00",
      "event_type": "intervention.candidates.rank",
      "purpose": "academic_support_policy_review",
      "privacy_level": "aggregate",
      "source_system": "jp_lms_vibeops_ai_kernel",
      "payload_ref": "aggregate:support_policy_candidates_week8",
      "retention_policy": "pilot_duration_plus_1_year"
    },
    {
      "event_id": "evt_s13_fairness_review_001",
      "tenant_id": "tenant_demo_university",
      "actor_role": "system",
      "occurred_at": "2026-04-13T14:05:00+09:00",
      "event_type": "fairness.review.prepare",
      "purpose": "academic_support_policy_review",
      "privacy_level": "aggregate",
      "source_system": "jp_lms_vibeops_ai_kernel",
      "payload_ref": "audit:support_policy_fairness_week8",
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
    },
    {
      "card_id": "xai_s11_cocreation_001",
      "scenario_id": "S11",
      "audience": "instructor",
      "judgment": {
        "summary": "W7의 엔트로피 브리지 설명은 기존 강의 흐름을 보존하면서 3분 보강 자료와 확인 문제를 추가하는 방식이 가장 안전합니다.",
        "decision_type": "draft",
        "confidence": 0.79
      },
      "evidence": [
        {
          "source_event": "evt_s11_content_gap_001",
          "claim": "집계 기준으로 선행 개념 공백이 반복됩니다.",
          "weight": 0.55
        },
        {
          "source_event": "evt_s11_draft_generate_001",
          "claim": "Teaching Profile 제약을 반영한 초안이 생성되었습니다.",
          "weight": 0.45
        }
      ],
      "model": {
        "name": "course_cocreation_policy",
        "version": "0.1.0",
        "run_id": "run_s11_cocreation_001"
      },
      "uncertainty": {
        "summary": "효과는 S01 측정과 연결해 확인해야 하며, 다른 강의로 일반화하지 않습니다.",
        "interval_or_reason": "draft_quality_review_required"
      },
      "recommended_action": {
        "action_id": "act_s11_publish_bridge_variant",
        "label": "Teaching Profile에 맞춘 엔트로피 브리지 초안을 검토 후 게시합니다.",
        "owner": "instructor",
        "requires_approval": true
      },
      "measurement_plan": {
        "measurement_id": "measure_s11_draft_effect_001",
        "metric": "checkpoint_correct_rate_delta",
        "method": "pre_post",
        "reevaluate_at": "2026-04-25T09:00:00+09:00"
      },
      "governance": {
        "data_scope": [
          "content.gap.detect",
          "content.draft.generate"
        ],
        "privacy_level": "aggregate",
        "approval_gate": "G2",
        "appeal_control": "instructor_override"
      }
    },
    {
      "card_id": "xai_s12_pace_agent_001",
      "scenario_id": "S12",
      "audience": "student",
      "judgment": {
        "summary": "오늘은 복습 20분, 확인 문제 1개, 과제 계획 10분으로 나누면 부담을 줄이면서 학습 흐름을 유지할 수 있습니다.",
        "decision_type": "recommend",
        "confidence": 0.68
      },
      "evidence": [
        {
          "source_event": "evt_s12_pace_signal_001",
          "claim": "학생이 개인 학습 계획 생성을 명시적으로 요청했습니다.",
          "weight": 0.5
        },
        {
          "source_event": "evt_s12_plan_generate_001",
          "claim": "현재 주차 학습량과 마감 시간을 기준으로 계획을 생성했습니다.",
          "weight": 0.5
        }
      ],
      "model": {
        "name": "pace_agent_policy",
        "version": "0.1.0",
        "run_id": "run_s12_pace_plan_001"
      },
      "uncertainty": {
        "summary": "외부 일정과 컨디션은 직접 관측하지 않으므로 학생이 언제든 조정할 수 있어야 합니다.",
        "interval_or_reason": "plan_fit_estimate=0.58-0.76"
      },
      "recommended_action": {
        "action_id": "act_s12_accept_pace_plan",
        "label": "오늘의 30분 학습 계획을 저장합니다.",
        "owner": "student",
        "requires_approval": true
      },
      "measurement_plan": {
        "measurement_id": "measure_s12_plan_completion_001",
        "metric": "plan_completion_and_perceived_support",
        "method": "qualitative_survey",
        "reevaluate_at": "2026-04-12T22:00:00+09:00"
      },
      "governance": {
        "data_scope": [
          "pace.plan.request",
          "inference.pace_plan.generate"
        ],
        "privacy_level": "pseudonymous",
        "approval_gate": "G1",
        "appeal_control": "meiwaku_feedback"
      }
    },
    {
      "card_id": "xai_s13_counterfactual_001",
      "scenario_id": "S13",
      "audience": "academic_admin",
      "judgment": {
        "summary": "이번 주에는 전체 공지보다 특정 개념 보강 자료 배포가 기대 효과와 공정성 검토 측면에서 더 안정적입니다.",
        "decision_type": "prioritize",
        "confidence": 0.74
      },
      "evidence": [
        {
          "source_event": "evt_s13_policy_candidates_001",
          "claim": "후보 개입의 기대 효과와 후회 비용을 비교했습니다.",
          "weight": 0.52
        },
        {
          "source_event": "evt_s13_fairness_review_001",
          "claim": "집계 기준 공정성 검토 준비가 완료되었습니다.",
          "weight": 0.48
        }
      ],
      "model": {
        "name": "counterfactual_intervention_policy",
        "version": "0.1.0",
        "run_id": "run_s13_counterfactual_001"
      },
      "uncertainty": {
        "summary": "정책 후보 비교는 파일럿 전 검토 단계이며, 실제 적용 전 대학 정책 승인과 측정 계획이 필요합니다.",
        "interval_or_reason": "uplift_delta_estimate=0.04-0.11"
      },
      "recommended_action": {
        "action_id": "act_s13_select_support_policy",
        "label": "개념 보강 자료 배포 정책을 파일럿 후보로 선택합니다.",
        "owner": "academic_admin",
        "requires_approval": true
      },
      "measurement_plan": {
        "measurement_id": "measure_s13_policy_uplift_001",
        "metric": "uplift_ppv_calibration_perceived_surveillance",
        "method": "calibration_review",
        "reevaluate_at": "2026-05-01T14:00:00+09:00"
      },
      "governance": {
        "data_scope": [
          "intervention.candidates.rank",
          "fairness.review.prepare"
        ],
        "privacy_level": "aggregate",
        "approval_gate": "G4",
        "appeal_control": "policy_review_board"
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
    },
    {
      "approval_id": "approval_s11_bridge_variant_001",
      "scenario_id": "S11",
      "gate": "G2",
      "state": "approved",
      "requested_action": {
        "action_id": "act_s11_publish_bridge_variant",
        "label": "Teaching Profile에 맞춘 엔트로피 브리지 초안을 검토 후 게시합니다."
      },
      "source_card_id": "xai_s11_cocreation_001",
      "approver_role": "instructor",
      "requested_at": "2026-04-11T09:05:00+09:00",
      "approved_at": "2026-04-11T09:16:00+09:00",
      "rollback_note": "학생 혼란 지표 또는 교수자 판단에 따라 초안을 비공개 처리하고 기존 자료로 되돌립니다."
    },
    {
      "approval_id": "approval_s12_pace_plan_001",
      "scenario_id": "S12",
      "gate": "G1",
      "state": "approved",
      "requested_action": {
        "action_id": "act_s12_accept_pace_plan",
        "label": "오늘의 30분 학습 계획을 저장합니다."
      },
      "source_card_id": "xai_s12_pace_agent_001",
      "approver_role": "student",
      "requested_at": "2026-04-12T08:42:00+09:00",
      "approved_at": "2026-04-12T08:43:00+09:00"
    },
    {
      "approval_id": "approval_s13_support_policy_001",
      "scenario_id": "S13",
      "gate": "G4",
      "state": "requested",
      "requested_action": {
        "action_id": "act_s13_select_support_policy",
        "label": "개념 보강 자료 배포 정책을 파일럿 후보로 선택합니다."
      },
      "source_card_id": "xai_s13_counterfactual_001",
      "approver_role": "academic_admin",
      "requested_at": "2026-04-13T14:08:00+09:00"
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
    },
    {
      "measurement_id": "measure_s11_draft_effect_001",
      "scenario_id": "S11",
      "linked_action_id": "act_s11_publish_bridge_variant",
      "metric": "checkpoint_correct_rate_delta",
      "method": "pre_post",
      "baseline": {
        "checkpoint_correct_rate": 0.61
      },
      "target": {
        "checkpoint_correct_rate_delta": 0.06
      },
      "reevaluate_at": "2026-04-25T09:00:00+09:00",
      "owner": "course_instructor",
      "publish_rule": "Publish only as aggregate course-level effect with limitation note."
    },
    {
      "measurement_id": "measure_s12_plan_completion_001",
      "scenario_id": "S12",
      "linked_action_id": "act_s12_accept_pace_plan",
      "metric": "plan_completion_and_perceived_support",
      "method": "qualitative_survey",
      "baseline": {
        "previous_plan_completion": 0.54
      },
      "target": {
        "plan_completion_delta": 0.08,
        "perceived_support_score": 3.8
      },
      "reevaluate_at": "2026-04-12T22:00:00+09:00",
      "owner": "student",
      "publish_rule": "Keep student-level result private; aggregate only for pilot review."
    },
    {
      "measurement_id": "measure_s13_policy_uplift_001",
      "scenario_id": "S13",
      "linked_action_id": "act_s13_select_support_policy",
      "metric": "uplift_ppv_calibration_perceived_surveillance",
      "method": "calibration_review",
      "baseline": {
        "prior_ppv": 0.42,
        "perceived_surveillance_score": 2.1
      },
      "target": {
        "ppv_min": 0.45,
        "calibration_error_max": 0.08,
        "perceived_surveillance_score_max": 2.4
      },
      "reevaluate_at": "2026-05-01T14:00:00+09:00",
      "owner": "academic_admin",
      "publish_rule": "Withhold until policy approval and APPI/IRB gates are complete."
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
    },
    {
      "result_id": "result_s11_draft_effect_001",
      "measurement_id": "measure_s11_draft_effect_001",
      "scenario_id": "S11",
      "observed": {
        "checkpoint_correct_rate_delta": 0.07
      },
      "uncertainty": {
        "summary": "초안 효과는 단일 강의 자료 기준의 초기 신호입니다.",
        "interval": {
          "checkpoint_correct_rate_delta": [
            0.02,
            0.12
          ]
        }
      },
      "limitation_note": "Teaching Profile 초안 품질과 강의 맥락의 영향을 분리하려면 추가 반복 측정이 필요합니다.",
      "publish_status": "publishable",
      "impact_decision": "retain"
    },
    {
      "result_id": "result_s12_plan_completion_001",
      "measurement_id": "measure_s12_plan_completion_001",
      "scenario_id": "S12",
      "observed": {
        "plan_completion_delta": 0.09,
        "perceived_support_score": 4.0
      },
      "uncertainty": {
        "summary": "개인 계획 수락 이후 단기 자기보고와 실행 로그를 함께 봅니다.",
        "interval": {
          "plan_completion_delta": [
            0.03,
            0.14
          ]
        }
      },
      "limitation_note": "학생 자기보고 편향이 있을 수 있어 장기 효과로 일반화하지 않습니다.",
      "publish_status": "publishable",
      "impact_decision": "retain"
    },
    {
      "result_id": "result_s13_policy_uplift_001",
      "measurement_id": "measure_s13_policy_uplift_001",
      "scenario_id": "S13",
      "observed": {
        "expected_uplift": 0.07,
        "calibration_error": 0.09
      },
      "uncertainty": {
        "summary": "정책 적용 전 후보 비교 결과이며, 승인 전에는 실행 결과로 공개하지 않습니다.",
        "interval": {
          "expected_uplift": [
            0.04,
            0.11
          ]
        }
      },
      "limitation_note": "G4 정책 승인과 파일럿 측정 프로토콜 확정 전까지 외부 효과 주장으로 사용할 수 없습니다.",
      "publish_status": "withheld",
      "impact_decision": "insufficient_evidence"
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
    },
    {
      "ledger_id": "impact_s11_bridge_variant_001",
      "scenario_id": "S11",
      "action_id": "act_s11_publish_bridge_variant",
      "approval_id": "approval_s11_bridge_variant_001",
      "measurement_id": "measure_s11_draft_effect_001",
      "result_id": "result_s11_draft_effect_001",
      "decision": "retained",
      "summary": "Co-Creation 초안은 집계 기준 확인 문제 정답률 개선 신호를 보여 유지합니다.",
      "next_review_at": "2026-05-09T09:00:00+09:00"
    },
    {
      "ledger_id": "impact_s12_pace_plan_001",
      "scenario_id": "S12",
      "action_id": "act_s12_accept_pace_plan",
      "approval_id": "approval_s12_pace_plan_001",
      "measurement_id": "measure_s12_plan_completion_001",
      "result_id": "result_s12_plan_completion_001",
      "decision": "retained",
      "summary": "학습 계획 에이전트는 학생 수락 기반의 단기 실행률과 지원감에서 긍정 신호를 보여 유지합니다.",
      "next_review_at": "2026-04-19T22:00:00+09:00"
    },
    {
      "ledger_id": "impact_s13_support_policy_001",
      "scenario_id": "S13",
      "action_id": "act_s13_select_support_policy",
      "approval_id": "approval_s13_support_policy_001",
      "measurement_id": "measure_s13_policy_uplift_001",
      "result_id": "result_s13_policy_uplift_001",
      "decision": "inconclusive",
      "summary": "Counterfactual policy 후보는 G4 승인과 APPI/IRB 검토 전이므로 실행 효과로 유지하지 않습니다.",
      "next_review_at": "2026-05-01T14:00:00+09:00"
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
