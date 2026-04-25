from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

from validate_contracts import run_checks as run_contract_checks


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "PROJECT.md",
    "docs/00-product-brief.md",
    "docs/01-system-architecture.md",
    "docs/02-domain-model.md",
    "docs/03-demo-and-pilot-plan.md",
    "docs/04-governance-and-risk.md",
    "docs/05-build-roadmap.md",
    "docs/06-control-plane-first-implementation.md",
    "docs/decisions/ADR-0001-project-reset.md",
    "docs/decisions/ADR-0002-control-plane-first.md",
    "ops/approval-gates.md",
    "ops/backlog.yaml",
    "ops/milestones.yaml",
    "ops/status.md",
    "ops/worktree-sandbox.md",
    "references/README.md",
    "references/reference-manifest.md",
    "specs/event-catalog.yaml",
    "specs/scenarios.yaml",
    "specs/xai-card.schema.yaml",
    "specs/approval.schema.yaml",
    "specs/measurement-plan.schema.yaml",
    "specs/measurement-result.schema.yaml",
    "specs/impact-ledger.schema.yaml",
    "specs/ai-operation-state-machine.yaml",
    "specs/examples/events/s01-lecture-struggle-events.json",
    "specs/examples/xai-cards/s01-student-hint-card.json",
    "specs/examples/xai-cards/s01-instructor-intervention-card.json",
    "specs/examples/approvals/s01-instructor-content-approval.json",
    "specs/examples/measurements/s01-two-week-effect-plan.json",
    "specs/examples/measurement-results/s01-two-week-effect-result.json",
    "specs/examples/impact-ledgers/s01-impact-ledger-entry.json",
    "specs/examples/ai-operations/s01-closed-loop-operation.json",
    "specs/examples/negative/student-card-forbidden-language.json",
    "specs/examples/negative/operation-executes-without-approval.json",
    "scripts/validate_contracts.py",
    "scripts/validate_governance.py",
    "scripts/validate_evidence_ux.py",
    "scripts/run_control_plane.py",
    "scripts/run_adapter_sample.py",
    "src/jp_lms_vibeops/__init__.py",
    "src/jp_lms_vibeops/adapters.py",
    "src/jp_lms_vibeops/models.py",
    "src/jp_lms_vibeops/fixtures.py",
    "src/jp_lms_vibeops/event_ledger.py",
    "src/jp_lms_vibeops/policy.py",
    "src/jp_lms_vibeops/approval.py",
    "src/jp_lms_vibeops/state_machine.py",
    "src/jp_lms_vibeops/measurement.py",
    "src/jp_lms_vibeops/control_plane.py",
    "tests/test_control_plane.py",
    "tests/test_adapter.py",
    "docs/pilot/decision-brief.md",
    "docs/pilot/appi-readiness-checklist.md",
    "docs/pilot/irb-preregistration-draft.md",
    "docs/pilot/integration-fit-brief.md",
    "docs/pilot/ninety-day-measurement-protocol.md",
    "docs/pilot/pilot-risk-register.md",
    "docs/pilot/term-sheet-outline.md",
    "specs/governance/pilot-gates.yaml",
    "specs/lms-adapter.schema.yaml",
    "specs/examples/adapters/netlearning-csv-s01-map.json",
    "fixtures/adapters/s01_lms_activity.csv",
    "docs/evidence-ux/readiness-review.md",
    "docs/evidence-ux/information-architecture.md",
    "specs/evidence-ux/routes.yaml",
]

LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def check_required_files() -> None:
    missing = [path for path in REQUIRED_FILES if not (ROOT / path).is_file()]
    if missing:
        fail("missing required files: " + ", ".join(missing))


def check_local_markdown_links() -> None:
    checked_roots = [
        ROOT / "README.md",
        ROOT / "AGENTS.md",
        ROOT / "PROJECT.md",
        ROOT / "docs",
        ROOT / "ops",
        ROOT / "references" / "README.md",
        ROOT / "references" / "reference-manifest.md",
    ]
    md_files: list[Path] = []
    for root in checked_roots:
        if root.is_file():
            md_files.append(root)
        elif root.is_dir():
            md_files.extend(root.rglob("*.md"))

    broken: list[str] = []
    for md in md_files:
        text = md.read_text(encoding="utf-8")
        for match in LINK_RE.finditer(text):
            target = match.group(1)
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            target = target.split("#", 1)[0]
            if not target:
                continue
            resolved = (md.parent / target).resolve()
            try:
                resolved.relative_to(ROOT)
            except ValueError:
                continue
            if not resolved.exists():
                broken.append(f"{md.relative_to(ROOT)} -> {target}")
    if broken:
        fail("broken local links: " + "; ".join(broken))


def check_yaml_seed_files() -> None:
    for path in (ROOT / "specs").glob("*.yaml"):
        text = path.read_text(encoding="utf-8").strip()
        if not text:
            fail(f"empty YAML file: {path.relative_to(ROOT)}")
        first_line = text.splitlines()[0]
        if not re.match(r"^[A-Za-z0-9_-]+:\s*$", first_line):
            fail(f"YAML seed must start with a top-level mapping: {path.relative_to(ROOT)}")


def check_no_large_legacy_artifacts() -> None:
    blocked_suffixes = {".pptx", ".docx", ".xlsx", ".mp4", ".mov"}
    blocked = [str(p.relative_to(ROOT)) for p in ROOT.rglob("*") if p.is_file() and p.suffix.lower() in blocked_suffixes]
    if blocked:
        fail("large binary legacy artifacts should not be committed: " + ", ".join(blocked))


def run_runtime_checks() -> None:
    commands = [
        [sys.executable, "scripts/run_control_plane.py", "--json"],
        [sys.executable, "scripts/run_adapter_sample.py"],
        [sys.executable, "scripts/validate_governance.py"],
        [sys.executable, "scripts/validate_evidence_ux.py"],
        [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
    ]
    for command in commands:
        result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
        if result.returncode != 0:
            output = (result.stdout + result.stderr).strip()
            fail(f"runtime check failed: {' '.join(command)}\n{output}")


def main() -> None:
    check_required_files()
    check_local_markdown_links()
    check_yaml_seed_files()
    check_no_large_legacy_artifacts()
    contract_errors = run_contract_checks()
    if contract_errors:
        fail("contract validation failed: " + "; ".join(contract_errors))
    run_runtime_checks()
    print("JP LMS VibeOps project validation passed.")


if __name__ == "__main__":
    main()
