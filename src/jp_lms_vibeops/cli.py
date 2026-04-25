from __future__ import annotations

import argparse
import json
from dataclasses import asdict

from .control_plane import ControlPlane


def main() -> None:
    parser = argparse.ArgumentParser(prog="jp-lms-vibeops")
    subcommands = parser.add_subparsers(dest="command", required=True)
    run_s01 = subcommands.add_parser("run-s01", help="Run the S01 control-plane loop.")
    run_s01.add_argument("--json", action="store_true", help="Emit JSON output.")
    args = parser.parse_args()

    if args.command == "run-s01":
        result = ControlPlane().run_s01_closed_loop()
        if args.json:
            print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
        else:
            print(f"{result.operation_id}: {result.execution_reason}")
