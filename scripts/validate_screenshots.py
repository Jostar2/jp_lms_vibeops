from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "docs" / "evidence-ux" / "snapshots" / "operations-home.png"
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def main() -> None:
    if not SNAPSHOT.is_file():
        fail("missing Evidence UX snapshot")
    data = SNAPSHOT.read_bytes()
    if not data.startswith(PNG_SIGNATURE):
        fail("Evidence UX snapshot is not a PNG")
    if len(data) < 20_000:
        fail("Evidence UX snapshot is unexpectedly small")
    print("JP LMS VibeOps screenshot snapshot validation passed.")


if __name__ == "__main__":
    main()
