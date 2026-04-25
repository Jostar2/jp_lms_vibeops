from __future__ import annotations

from typing import Any


class MeasurementPlanner:
    def plan_for_card(self, card: dict[str, Any], measurements: dict[str, dict[str, Any]]) -> dict[str, Any]:
        action_id = card.get("recommended_action", {}).get("action_id")
        inline_plan = card.get("measurement_plan", {})
        measurement_id = inline_plan.get("measurement_id")
        if measurement_id in measurements:
            plan = measurements[measurement_id]
            if plan.get("linked_action_id") != action_id:
                raise ValueError("measurement plan linked_action_id does not match card action_id")
            return plan

        for plan in measurements.values():
            if plan.get("linked_action_id") == action_id:
                return plan

        raise ValueError(f"no measurement plan for action: {action_id}")


class ImpactLedgerBuilder:
    def build(
        self,
        action_id: str,
        approval: dict[str, Any],
        measurement: dict[str, Any],
        result: dict[str, Any],
    ) -> dict[str, Any]:
        decision_map = {
            "retain": "retained",
            "revise": "revised",
            "rollback": "rolled_back",
            "insufficient_evidence": "inconclusive",
        }
        decision = decision_map.get(result.get("impact_decision"), "inconclusive")
        return {
            "ledger_id": f"impact_{action_id}",
            "scenario_id": measurement["scenario_id"],
            "action_id": action_id,
            "approval_id": approval["approval_id"],
            "measurement_id": measurement["measurement_id"],
            "result_id": result["result_id"],
            "decision": decision,
            "summary": "Runtime-generated impact ledger entry.",
            "next_review_at": measurement["reevaluate_at"],
        }
