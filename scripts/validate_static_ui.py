from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app" / "evidence-ux"

REQUIRED_FILES = [
    "index.html",
    "styles.css",
    "app.js",
    "data/runtime.js",
]

REQUIRED_ROUTES = [
    "학습자 홈",
    "교수자 스튜디오",
    "AI 근거",
    "수업 설정",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def runtime_payload() -> dict[str, object]:
    text = (APP / "data" / "runtime.js").read_text(encoding="utf-8")
    prefix = "window.JP_LMS_VIBEOPS_DATA = "
    if not text.startswith(prefix):
        fail("runtime.js does not assign window.JP_LMS_VIBEOPS_DATA")
    return json.loads(text[len(prefix) :].strip().removesuffix(";"))


def main() -> None:
    missing = [path for path in REQUIRED_FILES if not (APP / path).is_file()]
    if missing:
        fail("missing Evidence UX files: " + ", ".join(missing))

    html = (APP / "index.html").read_text(encoding="utf-8")
    js = (APP / "app.js").read_text(encoding="utf-8")
    css = (APP / "styles.css").read_text(encoding="utf-8")
    for route in REQUIRED_ROUTES:
        if route not in html + js:
            fail(f"Evidence UX missing route label: {route}")
    required_concepts = [
        "AI 코치",
        "오늘의 학습 플랜",
        "교수자",
        "xAI",
        "Meiwaku",
        "approval",
        "measurement",
        "impact",
        "pilot",
        "set-minutes",
        "toggle-task",
        "approve-draft",
        "set-variant",
        "challenge",
        "routeFromHash",
    ]
    for required in required_concepts:
        if not re.search(required, js, flags=re.IGNORECASE):
            fail(f"Evidence UX JS missing required concept: {required}")
    if "letter-spacing: 0;" not in css:
        fail("styles.css must keep body-facing letter spacing stable")

    payload = runtime_payload()
    for key in ["control_plane_run", "scenario_matrix", "events", "xai_cards", "approvals", "measurements", "measurement_results", "impact_ledgers", "adapter", "pilot_gates"]:
        if key not in payload:
            fail(f"runtime payload missing key: {key}")
    if not payload["events"] or not payload["xai_cards"]:
        fail("runtime payload lacks events or xAI cards")
    print("JP LMS VibeOps static Evidence UX validation passed.")


if __name__ == "__main__":
    main()
