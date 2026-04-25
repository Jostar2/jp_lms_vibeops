from __future__ import annotations

import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from jp_lms_vibeops.adapters import CsvFallbackAdapter
from jp_lms_vibeops.fixtures import load_json


class AdapterTests(unittest.TestCase):
    def test_csv_adapter_emits_internal_events(self) -> None:
        spec = load_json(ROOT / "specs" / "examples" / "adapters" / "netlearning-csv-s01-map.json")
        adapter = CsvFallbackAdapter(spec)
        events = adapter.read_events(ROOT / "fixtures" / "adapters" / "s01_lms_activity.csv", "evt_adapter_s01")
        self.assertEqual(len(events), 2)
        self.assertEqual(events[0]["source_system"], "netlearning_csv_export")
        self.assertEqual(events[0]["event_type"], "video.segment.pause")
        self.assertIn("retention_policy", events[0])


if __name__ == "__main__":
    unittest.main()
