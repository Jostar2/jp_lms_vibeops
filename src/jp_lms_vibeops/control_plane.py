from __future__ import annotations

from .approval import ApprovalRouter
from .event_ledger import EventLedger
from .fixtures import FixtureStore, load_fixture_store
from .measurement import ImpactLedgerBuilder, MeasurementPlanner
from .models import ControlPlaneRun, OperationSummary
from .policy import PolicyGate
from .state_machine import OperationStateMachine


class ControlPlane:
    def __init__(self, fixtures: FixtureStore | None = None) -> None:
        self.fixtures = fixtures or load_fixture_store()
        self.event_ledger = EventLedger()
        self.policy_gate = PolicyGate()
        self.approval_router = ApprovalRouter()
        self.measurement_planner = MeasurementPlanner()
        self.impact_ledger_builder = ImpactLedgerBuilder()
        self.state_machine = OperationStateMachine()

    def run_s01_closed_loop(self) -> ControlPlaneRun:
        operation = self.fixtures.operations["op_s01_closed_loop_001"]
        self.event_ledger.append_many([self.fixtures.events[event_id] for event_id in operation["event_ids"]])

        state_errors = self.state_machine.validate(operation)
        if state_errors:
            raise ValueError("; ".join(state_errors))
        if not self.event_ledger.contains_all(operation["event_ids"]):
            raise ValueError("operation references events missing from ledger")

        cards = [self.fixtures.cards[card_id] for card_id in operation["xai_card_ids"]]
        for card in cards:
            gate = self.policy_gate.check_card(card)
            if not gate.allowed:
                raise ValueError(f"policy gate blocked card {card['card_id']}: {gate.reason}")

        instructor_card = self.fixtures.cards["xai_s01_instructor_intervention_001"]
        action_id = instructor_card["recommended_action"]["action_id"]
        execution = self.approval_router.require_approved_action(action_id, self.fixtures.approvals)
        if not execution.allowed:
            raise ValueError(execution.reason)

        measurement = self.measurement_planner.plan_for_card(instructor_card, self.fixtures.measurements)
        result = self.fixtures.measurement_results["result_s01_intervention_effect_001"]
        approval = self.approval_router.approval_for_action(action_id, self.fixtures.approvals)
        if approval is None:
            raise ValueError("missing approval after execution decision")
        runtime_ledger = self.impact_ledger_builder.build(action_id, approval, measurement, result)

        return ControlPlaneRun(
            operation_id=operation["operation_id"],
            scenario_id=operation["scenario_id"],
            event_count=len(self.event_ledger.list()),
            card_count=len(cards),
            approval_count=len(operation["approval_ids"]),
            measurement_id=measurement["measurement_id"],
            result_id=result["result_id"],
            impact_ledger_id=runtime_ledger["ledger_id"],
            execution_allowed=execution.allowed,
            execution_reason=execution.reason,
        )

    def summarize_operations(self) -> list[OperationSummary]:
        summaries: list[OperationSummary] = []
        for operation_id in sorted(self.fixtures.operations):
            operation = self.fixtures.operations[operation_id]
            state_errors = self.state_machine.validate(operation)
            if state_errors:
                summaries.append(
                    OperationSummary(
                        operation_id=operation_id,
                        scenario_id=operation.get("scenario_id", "unknown"),
                        state=operation.get("current_state", "unknown"),
                        action_id="unknown",
                        approval_state="invalid",
                        executable=False,
                        reason="; ".join(state_errors),
                    )
                )
                continue

            cards = [self.fixtures.cards[card_id] for card_id in operation["xai_card_ids"]]
            card = self._primary_action_card(cards)
            gate = self.policy_gate.check_card(card)
            action_id = card["recommended_action"]["action_id"]
            approval = self.approval_router.approval_for_action(action_id, self.fixtures.approvals)
            approval_state = approval.get("state") if approval else "missing"

            if not gate.allowed:
                executable = False
                reason = gate.reason
            elif operation["current_state"] == "awaiting_approval":
                executable = False
                reason = f"awaiting approval: {approval_state}"
            else:
                execution = self.approval_router.require_approved_action(action_id, self.fixtures.approvals)
                executable = execution.allowed
                reason = execution.reason

            summaries.append(
                OperationSummary(
                    operation_id=operation_id,
                    scenario_id=operation["scenario_id"],
                    state=operation["current_state"],
                    action_id=action_id,
                    approval_state=approval_state,
                    executable=executable,
                    reason=reason,
                )
            )
        return summaries

    def _primary_action_card(self, cards: list[dict[str, object]]) -> dict[str, object]:
        for card in cards:
            action_id = card.get("recommended_action", {}).get("action_id")  # type: ignore[union-attr]
            if action_id and self.approval_router.approval_for_action(str(action_id), self.fixtures.approvals):
                return card
        return cards[0]
