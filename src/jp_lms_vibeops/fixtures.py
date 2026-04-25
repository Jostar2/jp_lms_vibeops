from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]


def load_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def load_json_dir(path: Path) -> list[dict[str, Any]]:
    return [load_json(item) for item in sorted(path.glob("*.json"))]


@dataclass(frozen=True)
class FixtureStore:
    events: dict[str, dict[str, Any]]
    cards: dict[str, dict[str, Any]]
    approvals: dict[str, dict[str, Any]]
    measurements: dict[str, dict[str, Any]]
    measurement_results: dict[str, dict[str, Any]]
    impact_ledgers: dict[str, dict[str, Any]]
    operations: dict[str, dict[str, Any]]


def load_fixture_store(root: Path = ROOT) -> FixtureStore:
    base = root / "specs" / "examples"
    events: dict[str, dict[str, Any]] = {}
    for doc in load_json_dir(base / "events"):
        for event in doc.get("events", []):
            events[event["event_id"]] = event

    cards = {doc["card_id"]: doc for doc in load_json_dir(base / "xai-cards")}
    approvals = {doc["approval_id"]: doc for doc in load_json_dir(base / "approvals")}
    measurements = {doc["measurement_id"]: doc for doc in load_json_dir(base / "measurements")}
    measurement_results = {doc["result_id"]: doc for doc in load_json_dir(base / "measurement-results")}
    impact_ledgers = {doc["ledger_id"]: doc for doc in load_json_dir(base / "impact-ledgers")}
    operations = {doc["operation_id"]: doc for doc in load_json_dir(base / "ai-operations")}

    return FixtureStore(
        events=events,
        cards=cards,
        approvals=approvals,
        measurements=measurements,
        measurement_results=measurement_results,
        impact_ledgers=impact_ledgers,
        operations=operations,
    )
