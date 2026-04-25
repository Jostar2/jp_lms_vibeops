from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_EVENT_FIELDS = {
    "event_id",
    "tenant_id",
    "actor_role",
    "occurred_at",
    "event_type",
    "purpose",
    "privacy_level",
    "source_system",
    "payload_ref",
    "retention_policy",
}

REQUIRED_XAI_FIELDS = {
    "card_id",
    "scenario_id",
    "audience",
    "judgment",
    "evidence",
    "model",
    "uncertainty",
    "recommended_action",
    "measurement_plan",
    "governance",
}

REQUIRED_APPROVAL_FIELDS = {
    "approval_id",
    "scenario_id",
    "gate",
    "state",
    "requested_action",
    "source_card_id",
    "approver_role",
    "requested_at",
}

REQUIRED_MEASUREMENT_FIELDS = {
    "measurement_id",
    "scenario_id",
    "linked_action_id",
    "metric",
    "method",
    "baseline",
    "target",
    "reevaluate_at",
    "owner",
    "publish_rule",
}

REQUIRED_OPERATION_FIELDS = {
    "operation_id",
    "scenario_id",
    "current_state",
    "event_ids",
    "xai_card_ids",
    "approval_ids",
    "measurement_plan_id",
    "transitions",
}

REQUIRED_MEASUREMENT_RESULT_FIELDS = {
    "result_id",
    "measurement_id",
    "scenario_id",
    "observed",
    "uncertainty",
    "limitation_note",
    "publish_status",
    "impact_decision",
}

REQUIRED_IMPACT_LEDGER_FIELDS = {
    "ledger_id",
    "scenario_id",
    "action_id",
    "approval_id",
    "measurement_id",
    "result_id",
    "decision",
    "summary",
    "next_review_at",
}

AUDIENCES = {"student", "instructor", "academic_admin", "legal_it", "platform_operator"}
PRIVACY_LEVELS = {"aggregate", "pseudonymous", "identified_sensitive"}
APPROVAL_STATES = {"requested", "approved", "rejected", "expired", "revoked"}
APPROVAL_GATES = {"G0", "G1", "G2", "G3", "G4"}
MEASUREMENT_METHODS = {"cluster_rct", "switchback", "pre_post", "calibration_review", "qualitative_survey", "audit_review"}
MEASUREMENT_PUBLISH_STATUSES = {"draft", "publishable", "withheld", "withdrawn"}
IMPACT_DECISIONS = {"retain", "revise", "rollback", "insufficient_evidence"}
LEDGER_DECISIONS = {"retained", "revised", "rolled_back", "inconclusive"}
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


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def add_missing(errors: list[str], path: Path, obj: dict[str, Any], required: set[str]) -> None:
    missing = sorted(required - set(obj))
    if missing:
        errors.append(f"{path.relative_to(ROOT)} missing fields: {', '.join(missing)}")


def as_text(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def validate_events(errors: list[str]) -> dict[str, dict[str, Any]]:
    events: dict[str, dict[str, Any]] = {}
    for path in (ROOT / "specs" / "examples" / "events").glob("*.json"):
        doc = load_json(path)
        for event in doc.get("events", []):
            add_missing(errors, path, event, REQUIRED_EVENT_FIELDS)
            event_id = event.get("event_id")
            if event_id in events:
                errors.append(f"duplicate event_id: {event_id}")
            if event.get("privacy_level") not in PRIVACY_LEVELS:
                errors.append(f"{path.relative_to(ROOT)} invalid privacy_level for {event_id}")
            events[event_id] = event
    if not events:
        errors.append("no event examples found")
    return events


def validate_xai_cards(errors: list[str], events: dict[str, dict[str, Any]]) -> dict[str, dict[str, Any]]:
    cards: dict[str, dict[str, Any]] = {}
    for path in (ROOT / "specs" / "examples" / "xai-cards").glob("*.json"):
        card = load_json(path)
        add_missing(errors, path, card, REQUIRED_XAI_FIELDS)
        card_id = card.get("card_id")
        if card_id in cards:
            errors.append(f"duplicate card_id: {card_id}")
        cards[card_id] = card

        if card.get("audience") not in AUDIENCES:
            errors.append(f"{path.relative_to(ROOT)} invalid audience: {card.get('audience')}")

        judgment = card.get("judgment", {})
        for field in ("summary", "decision_type", "confidence"):
            if field not in judgment:
                errors.append(f"{path.relative_to(ROOT)} judgment missing {field}")
        confidence = judgment.get("confidence")
        if not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
            errors.append(f"{path.relative_to(ROOT)} judgment.confidence must be 0..1")

        evidence = card.get("evidence", [])
        if not isinstance(evidence, list) or not evidence:
            errors.append(f"{path.relative_to(ROOT)} evidence must be a non-empty list")
        for item in evidence:
            for field in ("source_event", "claim", "weight"):
                if field not in item:
                    errors.append(f"{path.relative_to(ROOT)} evidence item missing {field}")
            if item.get("source_event") not in events:
                errors.append(f"{path.relative_to(ROOT)} unknown evidence source_event: {item.get('source_event')}")

        model = card.get("model", {})
        for field in ("name", "version", "run_id"):
            if not model.get(field):
                errors.append(f"{path.relative_to(ROOT)} model missing {field}")

        uncertainty = card.get("uncertainty", {})
        for field in ("summary", "interval_or_reason"):
            if not uncertainty.get(field):
                errors.append(f"{path.relative_to(ROOT)} uncertainty missing {field}")

        action = card.get("recommended_action", {})
        for field in ("action_id", "label", "owner", "requires_approval"):
            if field not in action:
                errors.append(f"{path.relative_to(ROOT)} recommended_action missing {field}")

        measurement = card.get("measurement_plan", {})
        for field in ("measurement_id", "metric", "method", "reevaluate_at"):
            if not measurement.get(field):
                errors.append(f"{path.relative_to(ROOT)} measurement_plan missing {field}")
        if measurement.get("method") not in MEASUREMENT_METHODS:
            errors.append(f"{path.relative_to(ROOT)} invalid measurement method: {measurement.get('method')}")

        governance = card.get("governance", {})
        if governance.get("privacy_level") not in PRIVACY_LEVELS:
            errors.append(f"{path.relative_to(ROOT)} invalid governance privacy_level")
        if governance.get("approval_gate") not in APPROVAL_GATES:
            errors.append(f"{path.relative_to(ROOT)} invalid approval_gate: {governance.get('approval_gate')}")
        if action.get("requires_approval") and not governance.get("approval_gate"):
            errors.append(f"{path.relative_to(ROOT)} approval required but no approval_gate")

        if card.get("audience") == "student":
            text = as_text(card).lower()
            for term in STUDENT_FORBIDDEN_TERMS:
                if term.lower() in text:
                    errors.append(f"{path.relative_to(ROOT)} student-facing card contains forbidden term: {term}")

    if not cards:
        errors.append("no xAI card examples found")
    return cards


def validate_xai_card_object(errors: list[str], label: str, card: dict[str, Any], events: dict[str, dict[str, Any]]) -> None:
    path_label = label
    missing = sorted(REQUIRED_XAI_FIELDS - set(card))
    if missing:
        errors.append(f"{path_label} missing fields: {', '.join(missing)}")

    if card.get("audience") not in AUDIENCES:
        errors.append(f"{path_label} invalid audience: {card.get('audience')}")

    evidence = card.get("evidence", [])
    if not isinstance(evidence, list) or not evidence:
        errors.append(f"{path_label} evidence must be a non-empty list")
    for item in evidence:
        if item.get("source_event") not in events:
            errors.append(f"{path_label} unknown evidence source_event: {item.get('source_event')}")

    governance = card.get("governance", {})
    if governance.get("privacy_level") not in PRIVACY_LEVELS:
        errors.append(f"{path_label} invalid governance privacy_level")
    if governance.get("approval_gate") not in APPROVAL_GATES:
        errors.append(f"{path_label} invalid approval_gate: {governance.get('approval_gate')}")

    if card.get("audience") == "student":
        text = as_text(card).lower()
        for term in STUDENT_FORBIDDEN_TERMS:
            if term.lower() in text:
                errors.append(f"{path_label} student-facing card contains forbidden term: {term}")


def validate_approvals(errors: list[str], cards: dict[str, dict[str, Any]]) -> dict[str, dict[str, Any]]:
    approvals: dict[str, dict[str, Any]] = {}
    for path in (ROOT / "specs" / "examples" / "approvals").glob("*.json"):
        approval = load_json(path)
        add_missing(errors, path, approval, REQUIRED_APPROVAL_FIELDS)
        approval_id = approval.get("approval_id")
        if approval_id in approvals:
            errors.append(f"duplicate approval_id: {approval_id}")
        approvals[approval_id] = approval

        if approval.get("gate") not in APPROVAL_GATES:
            errors.append(f"{path.relative_to(ROOT)} invalid gate: {approval.get('gate')}")
        if approval.get("state") not in APPROVAL_STATES:
            errors.append(f"{path.relative_to(ROOT)} invalid state: {approval.get('state')}")
        if approval.get("source_card_id") not in cards:
            errors.append(f"{path.relative_to(ROOT)} unknown source_card_id: {approval.get('source_card_id')}")
        if approval.get("state") == "approved" and not approval.get("approved_at"):
            errors.append(f"{path.relative_to(ROOT)} approved state requires approved_at")
        if approval.get("gate") == "G2" and approval.get("state") == "approved" and not approval.get("rollback_note"):
            errors.append(f"{path.relative_to(ROOT)} approved G2 action requires rollback_note")

        source_card = cards.get(approval.get("source_card_id"), {})
        source_action = source_card.get("recommended_action", {})
        if source_action and approval.get("requested_action", {}).get("action_id") != source_action.get("action_id"):
            errors.append(f"{path.relative_to(ROOT)} requested_action does not match source card action_id")

    if not approvals:
        errors.append("no approval examples found")
    return approvals


def validate_approval_object(errors: list[str], label: str, approval: dict[str, Any], cards: dict[str, dict[str, Any]]) -> None:
    missing = sorted(REQUIRED_APPROVAL_FIELDS - set(approval))
    if missing:
        errors.append(f"{label} missing fields: {', '.join(missing)}")
    if approval.get("gate") not in APPROVAL_GATES:
        errors.append(f"{label} invalid gate: {approval.get('gate')}")
    if approval.get("state") not in APPROVAL_STATES:
        errors.append(f"{label} invalid state: {approval.get('state')}")
    if approval.get("source_card_id") not in cards:
        errors.append(f"{label} unknown source_card_id: {approval.get('source_card_id')}")


def validate_measurements(errors: list[str], cards: dict[str, dict[str, Any]]) -> dict[str, dict[str, Any]]:
    measurements: dict[str, dict[str, Any]] = {}
    action_ids = {card.get("recommended_action", {}).get("action_id") for card in cards.values()}
    for path in (ROOT / "specs" / "examples" / "measurements").glob("*.json"):
        measurement = load_json(path)
        add_missing(errors, path, measurement, REQUIRED_MEASUREMENT_FIELDS)
        measurement_id = measurement.get("measurement_id")
        if measurement_id in measurements:
            errors.append(f"duplicate measurement_id: {measurement_id}")
        measurements[measurement_id] = measurement

        if measurement.get("method") not in MEASUREMENT_METHODS:
            errors.append(f"{path.relative_to(ROOT)} invalid method: {measurement.get('method')}")
        if measurement.get("linked_action_id") not in action_ids:
            errors.append(f"{path.relative_to(ROOT)} unknown linked_action_id: {measurement.get('linked_action_id')}")

    if not measurements:
        errors.append("no measurement examples found")
    return measurements


def validate_measurement_results(
    errors: list[str], measurements: dict[str, dict[str, Any]]
) -> dict[str, dict[str, Any]]:
    results: dict[str, dict[str, Any]] = {}
    for path in (ROOT / "specs" / "examples" / "measurement-results").glob("*.json"):
        result = load_json(path)
        add_missing(errors, path, result, REQUIRED_MEASUREMENT_RESULT_FIELDS)
        result_id = result.get("result_id")
        if result_id in results:
            errors.append(f"duplicate result_id: {result_id}")
        results[result_id] = result
        if result.get("measurement_id") not in measurements:
            errors.append(f"{path.relative_to(ROOT)} unknown measurement_id: {result.get('measurement_id')}")
        if result.get("publish_status") not in MEASUREMENT_PUBLISH_STATUSES:
            errors.append(f"{path.relative_to(ROOT)} invalid publish_status: {result.get('publish_status')}")
        if result.get("impact_decision") not in IMPACT_DECISIONS:
            errors.append(f"{path.relative_to(ROOT)} invalid impact_decision: {result.get('impact_decision')}")
        if result.get("publish_status") == "publishable" and not result.get("limitation_note"):
            errors.append(f"{path.relative_to(ROOT)} publishable result requires limitation_note")

    if not results:
        errors.append("no measurement result examples found")
    return results


def validate_impact_ledgers(
    errors: list[str],
    approvals: dict[str, dict[str, Any]],
    measurements: dict[str, dict[str, Any]],
    results: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    ledgers: dict[str, dict[str, Any]] = {}
    approved_action_ids = {
        approval.get("requested_action", {}).get("action_id")
        for approval in approvals.values()
        if approval.get("state") == "approved"
    }
    for path in (ROOT / "specs" / "examples" / "impact-ledgers").glob("*.json"):
        ledger = load_json(path)
        add_missing(errors, path, ledger, REQUIRED_IMPACT_LEDGER_FIELDS)
        ledger_id = ledger.get("ledger_id")
        if ledger_id in ledgers:
            errors.append(f"duplicate ledger_id: {ledger_id}")
        ledgers[ledger_id] = ledger
        if ledger.get("decision") not in LEDGER_DECISIONS:
            errors.append(f"{path.relative_to(ROOT)} invalid decision: {ledger.get('decision')}")
        if ledger.get("approval_id") not in approvals:
            errors.append(f"{path.relative_to(ROOT)} unknown approval_id: {ledger.get('approval_id')}")
        if ledger.get("measurement_id") not in measurements:
            errors.append(f"{path.relative_to(ROOT)} unknown measurement_id: {ledger.get('measurement_id')}")
        if ledger.get("result_id") not in results:
            errors.append(f"{path.relative_to(ROOT)} unknown result_id: {ledger.get('result_id')}")
        if ledger.get("action_id") not in approved_action_ids and ledger.get("decision") != "inconclusive":
            errors.append(f"{path.relative_to(ROOT)} action_id is not approved: {ledger.get('action_id')}")

    if not ledgers:
        errors.append("no impact ledger examples found")
    return ledgers


def validate_operations(
    errors: list[str],
    events: dict[str, dict[str, Any]],
    cards: dict[str, dict[str, Any]],
    approvals: dict[str, dict[str, Any]],
    measurements: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    operations: dict[str, dict[str, Any]] = {}
    for path in (ROOT / "specs" / "examples" / "ai-operations").glob("*.json"):
        operation = load_json(path)
        add_missing(errors, path, operation, REQUIRED_OPERATION_FIELDS)
        operation_id = operation.get("operation_id")
        operations[operation_id] = operation

        if operation.get("current_state") not in ALLOWED_OPERATION_STATES:
            errors.append(f"{path.relative_to(ROOT)} invalid current_state: {operation.get('current_state')}")
        for event_id in operation.get("event_ids", []):
            if event_id not in events:
                errors.append(f"{path.relative_to(ROOT)} unknown operation event_id: {event_id}")
        for card_id in operation.get("xai_card_ids", []):
            if card_id not in cards:
                errors.append(f"{path.relative_to(ROOT)} unknown operation xai_card_id: {card_id}")
        for approval_id in operation.get("approval_ids", []):
            if approval_id not in approvals:
                errors.append(f"{path.relative_to(ROOT)} unknown operation approval_id: {approval_id}")
        if operation.get("measurement_plan_id") not in measurements:
            errors.append(f"{path.relative_to(ROOT)} unknown measurement_plan_id: {operation.get('measurement_plan_id')}")
        if operation.get("current_state") in {"approved", "executed", "measuring", "measured", "retained"}:
            approved = any(approvals.get(approval_id, {}).get("state") == "approved" for approval_id in operation.get("approval_ids", []))
            if not approved:
                errors.append(f"{path.relative_to(ROOT)} execution requires an approved approval")

        previous_to = None
        for transition in operation.get("transitions", []):
            if transition.get("from") not in ALLOWED_OPERATION_STATES or transition.get("to") not in ALLOWED_OPERATION_STATES:
                errors.append(f"{path.relative_to(ROOT)} invalid transition: {transition}")
            if previous_to and transition.get("from") != previous_to:
                errors.append(f"{path.relative_to(ROOT)} transition chain breaks at {transition}")
            previous_to = transition.get("to")
        if previous_to and previous_to != operation.get("current_state"):
            errors.append(f"{path.relative_to(ROOT)} current_state does not match final transition")

    if not operations:
        errors.append("no AI operation examples found")
    return operations


def validate_operation_object(
    errors: list[str],
    label: str,
    operation: dict[str, Any],
    events: dict[str, dict[str, Any]],
    cards: dict[str, dict[str, Any]],
    approvals: dict[str, dict[str, Any]],
    measurements: dict[str, dict[str, Any]],
) -> None:
    missing = sorted(REQUIRED_OPERATION_FIELDS - set(operation))
    if missing:
        errors.append(f"{label} missing fields: {', '.join(missing)}")
    if operation.get("current_state") not in ALLOWED_OPERATION_STATES:
        errors.append(f"{label} invalid current_state: {operation.get('current_state')}")
    for event_id in operation.get("event_ids", []):
        if event_id not in events:
            errors.append(f"{label} unknown operation event_id: {event_id}")
    for card_id in operation.get("xai_card_ids", []):
        if card_id not in cards:
            errors.append(f"{label} unknown operation xai_card_id: {card_id}")
    for approval_id in operation.get("approval_ids", []):
        if approval_id not in approvals:
            errors.append(f"{label} unknown operation approval_id: {approval_id}")
    if operation.get("measurement_plan_id") not in measurements:
        errors.append(f"{label} unknown measurement_plan_id: {operation.get('measurement_plan_id')}")
    if operation.get("current_state") in {"approved", "executed", "measuring", "measured", "retained"}:
        approved = any(approvals.get(approval_id, {}).get("state") == "approved" for approval_id in operation.get("approval_ids", []))
        if not approved:
            errors.append(f"{label} execution requires an approved approval")


def validate_negative_examples(
    errors: list[str],
    events: dict[str, dict[str, Any]],
    cards: dict[str, dict[str, Any]],
    approvals: dict[str, dict[str, Any]],
    measurements: dict[str, dict[str, Any]],
) -> None:
    negative_paths = list((ROOT / "specs" / "examples" / "negative").glob("*.json"))
    if not negative_paths:
        errors.append("no negative guardrail examples found")
        return

    for path in negative_paths:
        case = load_json(path)
        expected = case.get("expected_errors", [])
        local_errors: list[str] = []
        fixture_type = case.get("fixture_type")
        fixture = case.get("fixture", {})
        label = f"{path.relative_to(ROOT)}"
        if fixture_type == "xai_card":
            validate_xai_card_object(local_errors, label, fixture, events)
        elif fixture_type == "ai_operation_bundle":
            local_approvals = dict(approvals)
            for approval in fixture.get("approvals", []):
                validate_approval_object(local_errors, label, approval, cards)
                local_approvals[approval.get("approval_id")] = approval
            validate_operation_object(local_errors, label, fixture.get("operation", {}), events, cards, local_approvals, measurements)
        else:
            local_errors.append(f"{label} unknown negative fixture_type: {fixture_type}")

        if not local_errors:
            errors.append(f"{label} negative example unexpectedly passed")
            continue
        for expected_fragment in expected:
            if not any(expected_fragment in error for error in local_errors):
                errors.append(f"{label} did not produce expected error fragment: {expected_fragment}")


def run_checks(root: Path = ROOT) -> list[str]:
    del root
    errors: list[str] = []
    events = validate_events(errors)
    cards = validate_xai_cards(errors, events)
    approvals = validate_approvals(errors, cards)
    measurements = validate_measurements(errors, cards)
    results = validate_measurement_results(errors, measurements)
    validate_impact_ledgers(errors, approvals, measurements, results)
    validate_operations(errors, events, cards, approvals, measurements)
    validate_negative_examples(errors, events, cards, approvals, measurements)
    return errors


def main() -> None:
    errors = run_checks()
    if errors:
        print("Contract validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
    print("JP LMS VibeOps contract validation passed.")


if __name__ == "__main__":
    main()
