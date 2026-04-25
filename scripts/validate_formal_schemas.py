from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "specs" / "json-schema"

SCHEMA_FIXTURE_MAP = {
    "event.schema.json": ("specs/examples/events", "events"),
    "xai-card.schema.json": ("specs/examples/xai-cards", None),
    "approval.schema.json": ("specs/examples/approvals", None),
    "measurement-plan.schema.json": ("specs/examples/measurements", None),
    "measurement-result.schema.json": ("specs/examples/measurement-results", None),
    "impact-ledger.schema.json": ("specs/examples/impact-ledgers", None),
    "ai-operation.schema.json": ("specs/examples/ai-operations", None),
    "lms-adapter.schema.json": ("specs/examples/adapters", None),
}


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def type_matches(value: Any, expected: str) -> bool:
    if expected == "string":
        return isinstance(value, str)
    if expected == "number":
        return isinstance(value, (int, float)) and not isinstance(value, bool)
    if expected == "boolean":
        return isinstance(value, bool)
    if expected == "array":
        return isinstance(value, list)
    if expected == "object":
        return isinstance(value, dict)
    return True


def validate_object(schema: dict[str, Any], obj: dict[str, Any], label: str) -> list[str]:
    errors: list[str] = []
    for field in schema.get("required", []):
        if field not in obj:
            errors.append(f"{label} missing required field: {field}")
    properties = schema.get("properties", {})
    for field, rules in properties.items():
        if field not in obj:
            continue
        expected_type = rules.get("type")
        if expected_type and not type_matches(obj[field], expected_type):
            errors.append(f"{label}.{field} expected {expected_type}")
        if "enum" in rules and obj[field] not in rules["enum"]:
            errors.append(f"{label}.{field} not in enum")
        if expected_type == "object" and isinstance(obj[field], dict):
            errors.extend(validate_object(rules, obj[field], f"{label}.{field}"))
        if expected_type == "array" and isinstance(obj[field], list):
            item_rules = rules.get("items", {})
            item_type = item_rules.get("type")
            for index, item in enumerate(obj[field]):
                if item_type and not type_matches(item, item_type):
                    errors.append(f"{label}.{field}[{index}] expected {item_type}")
                if item_type == "object" and isinstance(item, dict):
                    errors.extend(validate_object(item_rules, item, f"{label}.{field}[{index}]"))
    return errors


def fixture_objects(path: Path, container_key: str | None) -> list[dict[str, Any]]:
    docs = [load_json(item) for item in sorted(path.glob("*.json"))]
    if container_key is None:
        return docs
    objects: list[dict[str, Any]] = []
    for doc in docs:
        objects.extend(doc.get(container_key, []))
    return objects


def main() -> None:
    errors: list[str] = []
    for schema_name, (fixture_dir, container_key) in SCHEMA_FIXTURE_MAP.items():
        schema_path = SCHEMA_DIR / schema_name
        if not schema_path.is_file():
            errors.append(f"missing schema: {schema_name}")
            continue
        schema = load_json(schema_path)
        for required_schema_field in ["$schema", "$id", "title", "type", "required", "properties"]:
            if required_schema_field not in schema:
                errors.append(f"{schema_name} missing schema field: {required_schema_field}")
        objects = fixture_objects(ROOT / fixture_dir, container_key)
        if not objects:
            errors.append(f"{schema_name} has no fixtures")
            continue
        for index, obj in enumerate(objects):
            errors.extend(validate_object(schema, obj, f"{schema_name} fixture[{index}]"))
    if errors:
        fail("; ".join(errors))
    print("JP LMS VibeOps formal schema validation passed.")


if __name__ == "__main__":
    main()
