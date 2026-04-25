from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app" / "evidence-ux" / "index.html"

BROWSER_CANDIDATES = [
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
]


def browser_path() -> Path | None:
    for candidate in BROWSER_CANDIDATES:
        if candidate.is_file():
            return candidate
    return None


def main() -> None:
    browser = browser_path()
    if browser is None:
        print("JP LMS VibeOps browser smoke skipped: no Edge/Chrome binary found.")
        return
    file_url = APP.resolve().as_uri()
    command = [
        str(browser),
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--disable-extensions",
        "--dump-dom",
        file_url,
    ]
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        raise SystemExit(result.returncode)
    dom = result.stdout
    for required in ["Operations", "Control Plane State", "Operation Queue", "Pilot Gate Evidence"]:
        if required not in dom:
            print(dom[:2000])
            raise SystemExit(f"browser smoke missing rendered text: {required}")
    print("JP LMS VibeOps browser smoke passed.")


if __name__ == "__main__":
    main()
