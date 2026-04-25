from __future__ import annotations

from dataclasses import dataclass
from typing import Any


JsonObject = dict[str, Any]

APPROVED_STATE = "approved"
EXECUTABLE_STATES = {"approved", "executed", "measuring", "measured", "retained"}

STUDENT_FORBIDDEN_TERMS = [
    "dropout risk",
    "low ability",
    "problem student",
    "탈락 위험",
    "중도 이탈 위험",
    "문제 학생",
    "저능",
    "退学リスク",
    "問題学生",
    "落第リスク",
]


@dataclass(frozen=True)
class GateDecision:
    gate: str
    allowed: bool
    reason: str
    approval_required: bool


@dataclass(frozen=True)
class ExecutionDecision:
    allowed: bool
    reason: str


@dataclass(frozen=True)
class ControlPlaneRun:
    operation_id: str
    scenario_id: str
    event_count: int
    card_count: int
    approval_count: int
    measurement_id: str
    result_id: str
    impact_ledger_id: str
    execution_allowed: bool
    execution_reason: str


@dataclass(frozen=True)
class OperationSummary:
    operation_id: str
    scenario_id: str
    state: str
    action_id: str
    approval_state: str
    executable: bool
    reason: str
