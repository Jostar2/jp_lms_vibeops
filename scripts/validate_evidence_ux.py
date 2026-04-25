from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_DOCS = {
    "docs/evidence-ux/readiness-review.md": ["## Verdict", "## UI Must Render These Objects", "## Go Criteria"],
    "docs/evidence-ux/information-architecture.md": ["## Primary Views", "## First Screen", "## Interaction Model"],
}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def check_docs() -> None:
    errors: list[str] = []
    for rel_path, fragments in REQUIRED_DOCS.items():
        path = ROOT / rel_path
        if not path.is_file():
            errors.append(f"missing Evidence UX doc: {rel_path}")
            continue
        text = path.read_text(encoding="utf-8")
        for fragment in fragments:
            if fragment not in text:
                errors.append(f"{rel_path} missing required fragment: {fragment}")
    if errors:
        fail("; ".join(errors))


def check_routes() -> None:
    path = ROOT / "specs" / "evidence-ux" / "routes.yaml"
    if not path.is_file():
        fail("missing specs/evidence-ux/routes.yaml")
    text = path.read_text(encoding="utf-8")
    route_count = len(re.findall(r"^\s+- id:\s+", text, flags=re.MULTILINE))
    if route_count < 4:
        fail("Evidence UX route spec must define at least 4 routes")
    for required in ["source_objects:", "required_panels:", "pilot_gates", "impact_ledger"]:
        if required not in text:
            fail(f"Evidence UX route spec missing {required}")


def main() -> None:
    check_docs()
    check_routes()
    print("JP LMS VibeOps Evidence UX validation passed.")


if __name__ == "__main__":
    main()
