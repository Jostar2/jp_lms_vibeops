from __future__ import annotations

import json
from typing import Any

from .models import GateDecision, STUDENT_FORBIDDEN_TERMS


class PolicyGate:
    def check_card(self, card: dict[str, Any]) -> GateDecision:
        action = card.get("recommended_action", {})
        governance = card.get("governance", {})
        gate = governance.get("approval_gate", "G0")

        if card.get("audience") == "student":
            text = json.dumps(card, ensure_ascii=False).lower()
            for term in STUDENT_FORBIDDEN_TERMS:
                if term.lower() in text:
                    return GateDecision(gate=gate, allowed=False, reason=f"forbidden student-facing term: {term}", approval_required=True)

        measurement_plan = card.get("measurement_plan", {})
        if action.get("requires_approval") and not gate:
            return GateDecision(gate="UNKNOWN", allowed=False, reason="approval required but no approval gate", approval_required=True)
        if action and not measurement_plan:
            return GateDecision(gate=gate, allowed=False, reason="action card missing measurement plan", approval_required=True)
        if not card.get("model", {}).get("version"):
            return GateDecision(gate=gate, allowed=False, reason="model version missing", approval_required=bool(action.get("requires_approval")))

        return GateDecision(
            gate=gate,
            allowed=True,
            reason="policy checks passed",
            approval_required=bool(action.get("requires_approval")),
        )
