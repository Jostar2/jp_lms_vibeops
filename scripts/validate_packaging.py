from __future__ import annotations

import subprocess
import sys
import tomllib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def check_pyproject() -> None:
    path = ROOT / "pyproject.toml"
    if not path.is_file():
        fail("missing pyproject.toml")
    data = tomllib.loads(path.read_text(encoding="utf-8"))
    project = data.get("project", {})
    if project.get("name") != "jp-lms-vibeops":
        fail("project.name must be jp-lms-vibeops")
    if "jp-lms-vibeops" not in project.get("scripts", {}):
        fail("project.scripts must expose jp-lms-vibeops")


def check_module_cli() -> None:
    command = [sys.executable, "-m", "jp_lms_vibeops", "run-s01", "--json"]
    env = {"PYTHONPATH": str(ROOT / "src")}
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, env=env)
    if result.returncode != 0:
        fail("module CLI failed: " + (result.stdout + result.stderr).strip())
    if "op_s01_closed_loop_001" not in result.stdout:
        fail("module CLI output missing operation id")


def main() -> None:
    check_pyproject()
    check_module_cli()
    print("JP LMS VibeOps packaging validation passed.")


if __name__ == "__main__":
    main()
