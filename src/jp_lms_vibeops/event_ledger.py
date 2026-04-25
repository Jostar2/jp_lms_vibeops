from __future__ import annotations

from collections import defaultdict
from typing import Any


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


class EventLedger:
    def __init__(self) -> None:
        self._events: dict[str, dict[str, Any]] = {}
        self._by_type: dict[str, list[str]] = defaultdict(list)

    def append(self, event: dict[str, Any]) -> None:
        missing = REQUIRED_EVENT_FIELDS - set(event)
        if missing:
            raise ValueError(f"event missing required fields: {', '.join(sorted(missing))}")
        event_id = event["event_id"]
        if event_id in self._events:
            raise ValueError(f"duplicate event_id: {event_id}")
        self._events[event_id] = event
        self._by_type[event["event_type"]].append(event_id)

    def append_many(self, events: list[dict[str, Any]]) -> None:
        for event in events:
            self.append(event)

    def get(self, event_id: str) -> dict[str, Any]:
        return self._events[event_id]

    def list(self) -> list[dict[str, Any]]:
        return list(self._events.values())

    def by_type(self, event_type: str) -> list[dict[str, Any]]:
        return [self._events[event_id] for event_id in self._by_type.get(event_type, [])]

    def contains_all(self, event_ids: list[str]) -> bool:
        return all(event_id in self._events for event_id in event_ids)
