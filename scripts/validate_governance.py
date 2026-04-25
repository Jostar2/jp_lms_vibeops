from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_DOCS = {
    "docs/pilot/decision-brief.md": ["## Ask", "## Decision Items", "## Required Follow-Up Packet"],
    "docs/pilot/appi-readiness-checklist.md": ["## Readiness Checklist", "## Blockers", "purpose", "retention"],
    "docs/pilot/irb-preregistration-draft.md": ["## Study Question", "## Primary Outcome", "## Pre-Registered Decision Rule"],
    "docs/pilot/integration-fit-brief.md": ["## Integration Options", "## Adapter Boundary", "## Integration Blockers"],
    "docs/pilot/ninety-day-measurement-protocol.md": ["## Timeline", "## Metrics", "## Go/No-Go Criteria"],
    "docs/pilot/pilot-risk-register.md": ["APPI", "Rollback", "yes"],
    "docs/pilot/term-sheet-outline.md": ["## Parties", "## Pilot Scope", "## Exit"],
}

GATE_DOC_RE = re.compile(r'evidence_doc:\s+"([^"]+)"')


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def check_required_docs() -> None:
    errors: list[str] = []
    for rel_path, required_fragments in REQUIRED_DOCS.items():
        path = ROOT / rel_path
        if not path.is_file():
            errors.append(f"missing governance doc: {rel_path}")
            continue
        text = path.read_text(encoding="utf-8")
        for fragment in required_fragments:
            if fragment not in text:
                errors.append(f"{rel_path} missing required fragment: {fragment}")
    if errors:
        fail("; ".join(errors))


def check_gate_docs() -> None:
    gate_path = ROOT / "specs" / "governance" / "pilot-gates.yaml"
    if not gate_path.is_file():
        fail("missing specs/governance/pilot-gates.yaml")
    text = gate_path.read_text(encoding="utf-8")
    docs = GATE_DOC_RE.findall(text)
    if not docs:
        fail("pilot-gates.yaml contains no evidence_doc entries")
    missing = [doc for doc in docs if not (ROOT / doc).is_file()]
    if missing:
        fail("pilot gate references missing docs: " + ", ".join(missing))
    if "blocks_if_missing: true" not in text:
        fail("pilot-gates.yaml must contain blocking gates")


def main() -> None:
    check_required_docs()
    check_gate_docs()
    print("JP LMS VibeOps governance validation passed.")


if __name__ == "__main__":
    main()
