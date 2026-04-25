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
from jp_lms_vibeops.adapters import CsvFallbackAdapter  # noqa: E402
from jp_lms_vibeops.fixtures import load_fixture_store, load_json  # noqa: E402


def build_payload() -> dict[str, object]:
    store = load_fixture_store()
    control_plane_run = asdict(ControlPlane(store).run_s01_closed_loop())
    adapter_spec = load_json(ROOT / "specs" / "examples" / "adapters" / "netlearning-csv-s01-map.json")
    adapter_events = CsvFallbackAdapter(adapter_spec).read_events(
        ROOT / "fixtures" / "adapters" / "s01_lms_activity.csv",
        "evt_adapter_s01",
    )
    pilot_gates_text = (ROOT / "specs" / "governance" / "pilot-gates.yaml").read_text(encoding="utf-8")
    pilot_gates = [
        line.split('"', 2)[1]
        for line in pilot_gates_text.splitlines()
        if "evidence_doc:" in line and '"' in line
    ]
    return {
        "generated_from": "JP LMS VibeOps control plane fixtures",
        "control_plane_run": control_plane_run,
        "events": list(store.events.values()),
        "xai_cards": list(store.cards.values()),
        "approvals": list(store.approvals.values()),
        "measurements": list(store.measurements.values()),
        "measurement_results": list(store.measurement_results.values()),
        "impact_ledgers": list(store.impact_ledgers.values()),
        "adapter": {
            "spec": adapter_spec,
            "sample_events": adapter_events,
        },
        "pilot_gates": pilot_gates,
    }


def main() -> None:
    out = ROOT / "app" / "evidence-ux" / "data" / "runtime.js"
    payload = build_payload()
    out.write_text(
        "window.JP_LMS_VIBEOPS_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
