from __future__ import annotations

from typing import Any

from .models import APPROVED_STATE, ExecutionDecision


class ApprovalRouter:
    def approval_for_action(self, action_id: str, approvals: dict[str, dict[str, Any]]) -> dict[str, Any] | None:
        for approval in approvals.values():
            if approval.get("requested_action", {}).get("action_id") == action_id:
                return approval
        return None

    def require_approved_action(self, action_id: str, approvals: dict[str, dict[str, Any]]) -> ExecutionDecision:
        approval = self.approval_for_action(action_id, approvals)
        if not approval:
            return ExecutionDecision(False, f"no approval found for action: {action_id}")
        if approval.get("state") != APPROVED_STATE:
            return ExecutionDecision(False, f"approval is not approved: {approval.get('state')}")
        if approval.get("gate") == "G2" and not approval.get("rollback_note"):
            return ExecutionDecision(False, "approved G2 action missing rollback note")
        return ExecutionDecision(True, "approved action may execute")
