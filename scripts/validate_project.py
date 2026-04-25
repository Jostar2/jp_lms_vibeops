from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "docs/00-product-brief.md",
    "docs/01-system-architecture.md",
    "docs/02-domain-model.md",
    "docs/03-demo-and-pilot-plan.md",
    "docs/04-governance-and-risk.md",
    "docs/05-build-roadmap.md",
    "docs/decisions/ADR-0001-project-reset.md",
    "ops/approval-gates.md",
    "ops/worktree-sandbox.md",
    "references/README.md",
    "references/reference-manifest.md",
    "specs/event-catalog.yaml",
    "specs/scenarios.yaml",
    "specs/xai-card.schema.yaml",
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


def main() -> None:
    check_required_files()
    check_local_markdown_links()
    check_yaml_seed_files()
    check_no_large_legacy_artifacts()
    print("JP LMS VibeOps project validation passed.")


if __name__ == "__main__":
    main()
