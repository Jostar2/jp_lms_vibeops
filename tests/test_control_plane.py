from __future__ import annotations

import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from jp_lms_vibeops.approval import ApprovalRouter
from jp_lms_vibeops.control_plane import ControlPlane
from jp_lms_vibeops.event_ledger import EventLedger
from jp_lms_vibeops.fixtures import load_fixture_store
from jp_lms_vibeops.policy import PolicyGate


class ControlPlaneTests(unittest.TestCase):
    def test_s01_closed_loop_runs(self) -> None:
        result = ControlPlane().run_s01_closed_loop()
        self.assertEqual(result.operation_id, "op_s01_closed_loop_001")
        self.assertEqual(result.event_count, 3)
        self.assertTrue(result.execution_allowed)
        self.assertEqual(result.measurement_id, "measure_s01_intervention_effect_001")

    def test_event_ledger_blocks_duplicate_event(self) -> None:
        store = load_fixture_store()
        event = store.events["evt_s01_video_pause_001"]
        ledger = EventLedger()
        ledger.append(event)
        with self.assertRaises(ValueError):
            ledger.append(event)

    def test_policy_blocks_student_forbidden_language(self) -> None:
        store = load_fixture_store()
        card = dict(store.cards["xai_s01_student_hint_001"])
        card["judgment"] = dict(card["judgment"])
        card["judgment"]["summary"] = "중도 이탈 위험이 있어 조치가 필요합니다."
        decision = PolicyGate().check_card(card)
        self.assertFalse(decision.allowed)
        self.assertIn("forbidden student-facing term", decision.reason)

    def test_approval_router_blocks_requested_state(self) -> None:
        store = load_fixture_store()
        approval = dict(store.approvals["approval_s01_entropy_bridge_001"])
        approval["state"] = "requested"
        approvals = {approval["approval_id"]: approval}
        decision = ApprovalRouter().require_approved_action("act_s01_entropy_bridge_publish", approvals)
        self.assertFalse(decision.allowed)
        self.assertEqual(decision.reason, "approval is not approved: requested")

    def test_scenario_matrix_covers_s11_s12_s13(self) -> None:
        matrix = ControlPlane().summarize_operations()
        by_scenario = {item.scenario_id: item for item in matrix}
        self.assertIn("S11", by_scenario)
        self.assertIn("S12", by_scenario)
        self.assertIn("S13", by_scenario)
        self.assertTrue(by_scenario["S11"].executable)
        self.assertTrue(by_scenario["S12"].executable)
        self.assertFalse(by_scenario["S13"].executable)
        self.assertEqual(by_scenario["S13"].approval_state, "requested")


if __name__ == "__main__":
    unittest.main()
