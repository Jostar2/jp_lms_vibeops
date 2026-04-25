from __future__ import annotations

import json
import sys
from dataclasses import asdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from jp_lms_vibeops import ControlPlane  # noqa: E402


def main() -> None:
    matrix = [asdict(summary) for summary in ControlPlane().summarize_operations()]
    print(json.dumps({"operations": matrix}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
