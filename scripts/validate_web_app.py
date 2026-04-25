from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "apps" / "web"


REQUIRED_FILES = [
    "package.json",
    "package-lock.json",
    "apps/web/package.json",
    "apps/web/next.config.mjs",
    "apps/web/tsconfig.json",
    "apps/web/src/app/layout.tsx",
    "apps/web/src/app/page.tsx",
    "apps/web/src/app/api/learning-session/route.ts",
    "apps/web/src/app/globals.css",
    "apps/web/src/features/learning-session/types.ts",
    "apps/web/src/features/learning-session/session-model.ts",
    "apps/web/src/features/learning-session/AIFlowShell.tsx",
    "apps/web/src/data/runtime.json",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def check_files() -> None:
    missing = [path for path in REQUIRED_FILES if not (ROOT / path).is_file()]
    if missing:
        fail("missing web app files: " + ", ".join(missing))


def check_package_contract() -> None:
    root_pkg = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    web_pkg = json.loads((WEB / "package.json").read_text(encoding="utf-8"))
    for script in ["web:typecheck", "web:build", "web:validate"]:
        if script not in root_pkg.get("scripts", {}):
            fail(f"root package.json missing script: {script}")
    for dep in ["next", "react", "react-dom"]:
        if dep not in web_pkg.get("dependencies", {}):
            fail(f"apps/web package missing dependency: {dep}")
    for dev_dep in ["typescript", "@types/react", "@types/node"]:
        if dev_dep not in web_pkg.get("devDependencies", {}):
            fail(f"apps/web package missing devDependency: {dev_dep}")


def check_runtime_payload() -> None:
    payload = json.loads((WEB / "src" / "data" / "runtime.json").read_text(encoding="utf-8"))
    for key in ["control_plane_run", "events", "xai_cards", "approvals", "measurements", "measurement_results", "impact_ledgers"]:
        if key not in payload:
            fail(f"apps/web runtime payload missing key: {key}")
    if not payload["xai_cards"] or not payload["events"]:
        fail("apps/web runtime payload lacks xAI cards or events")


def run_npm_validation() -> None:
    npm = shutil.which("npm.cmd") or shutil.which("npm")
    if npm is None:
        fail("npm is required for apps/web validation")
    if not (ROOT / "node_modules").exists():
        fail("node_modules missing; run `npm ci` before validate_web_app.py")
    result = subprocess.run([npm, "run", "web:validate"], cwd=ROOT, capture_output=True, text=True)
    if result.returncode != 0:
        output = (result.stdout + result.stderr).strip()
        fail("web app validation failed\n" + output)


def main() -> None:
    check_files()
    check_package_contract()
    check_runtime_payload()
    run_npm_validation()
    print("JP LMS VibeOps web app validation passed.")


if __name__ == "__main__":
    main()
