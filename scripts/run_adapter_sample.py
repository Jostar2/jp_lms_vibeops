from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from jp_lms_vibeops.adapters import CsvFallbackAdapter  # noqa: E402
from jp_lms_vibeops.fixtures import load_json  # noqa: E402


def main() -> None:
    spec = load_json(ROOT / "specs" / "examples" / "adapters" / "netlearning-csv-s01-map.json")
    adapter = CsvFallbackAdapter(spec)
    events = adapter.read_events(ROOT / "fixtures" / "adapters" / "s01_lms_activity.csv", "evt_adapter_s01")
    print(json.dumps({"events": events}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
