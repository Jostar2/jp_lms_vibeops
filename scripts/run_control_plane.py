from __future__ import annotations

import argparse
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
    parser = argparse.ArgumentParser(description="Run the JP LMS VibeOps control plane skeleton.")
    parser.add_argument("--json", action="store_true", help="Emit JSON output.")
    args = parser.parse_args()

    result = ControlPlane().run_s01_closed_loop()
    if args.json:
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
        return

    print("JP LMS VibeOps control plane run passed.")
    print(f"operation={result.operation_id}")
    print(f"events={result.event_count}")
    print(f"cards={result.card_count}")
    print(f"approval={result.execution_reason}")
    print(f"measurement={result.measurement_id}")
    print(f"impact_ledger={result.impact_ledger_id}")


if __name__ == "__main__":
    main()
