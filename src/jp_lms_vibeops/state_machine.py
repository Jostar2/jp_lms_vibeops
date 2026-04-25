from __future__ import annotations

from typing import Any


ALLOWED_OPERATION_STATES = {
    "drafted",
    "evidence_attached",
    "policy_checked",
    "awaiting_approval",
    "approved",
    "executed",
    "measuring",
    "measured",
    "retained",
    "revised",
    "rolled_back",
}


class OperationStateMachine:
    def validate(self, operation: dict[str, Any]) -> list[str]:
        errors: list[str] = []
        current_state = operation.get("current_state")
        if current_state not in ALLOWED_OPERATION_STATES:
            errors.append(f"invalid current_state: {current_state}")

        previous_to = None
        for transition in operation.get("transitions", []):
            from_state = transition.get("from")
            to_state = transition.get("to")
            if from_state not in ALLOWED_OPERATION_STATES or to_state not in ALLOWED_OPERATION_STATES:
                errors.append(f"invalid transition: {from_state}->{to_state}")
            if previous_to and from_state != previous_to:
                errors.append(f"transition chain breaks at {from_state}->{to_state}")
            previous_to = to_state

        if previous_to and previous_to != current_state:
            errors.append("current_state does not match final transition")
        return errors
