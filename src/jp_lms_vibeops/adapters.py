from __future__ import annotations

import csv
from pathlib import Path
from typing import Any


class CsvFallbackAdapter:
    def __init__(self, adapter_spec: dict[str, Any]) -> None:
        self.adapter_spec = adapter_spec
        self.source_system = adapter_spec["source_system"]
        self.supported_event_types = set(adapter_spec["supported_event_types"])
        self.field_map = adapter_spec["field_map"]

    def read_events(self, csv_path: Path, event_id_prefix: str) -> list[dict[str, Any]]:
        events: list[dict[str, Any]] = []
        with csv_path.open(encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            self._validate_columns(reader.fieldnames or [])
            for index, row in enumerate(reader, start=1):
                event_type = row[self.field_map["event_type"]]
                if event_type not in self.supported_event_types:
                    raise ValueError(f"unsupported event_type: {event_type}")
                event = {
                    "event_id": f"{event_id_prefix}_{index:03d}",
                    "tenant_id": row[self.field_map["tenant_id"]],
                    "actor_role": row[self.field_map["actor_role"]],
                    "occurred_at": row[self.field_map["occurred_at"]],
                    "event_type": event_type,
                    "purpose": row[self.field_map["purpose"]],
                    "privacy_level": row.get(self.field_map["privacy_level"]) or self.adapter_spec["privacy_default"],
                    "source_system": self.source_system,
                    "payload_ref": row[self.field_map["payload_ref"]],
                    "retention_policy": "pilot_duration_plus_90_days",
                }
                events.append(event)
        if not events:
            raise ValueError("adapter emitted no events")
        return events

    def _validate_columns(self, columns: list[str]) -> None:
        missing = sorted(set(self.field_map.values()) - set(columns))
        if missing:
            raise ValueError(f"CSV missing required adapter columns: {', '.join(missing)}")
