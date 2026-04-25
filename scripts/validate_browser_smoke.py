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
    smoke_targets = [
        (file_url, ["Claritas", "Agent Mesh", "AI Operating Layer", "AI 생성 학습 객체", "Provenance Trace", "데이터 마이닝"]),
        (file_url + "#lecture", ["구간별 학습 신호", "Transcript + Checkpoint", "교수자 큐에서 보기"]),
        (file_url + "#instructor", ["교수자", "AI Operating Layer", "Decision Queue", "AI Co-Creation Studio", "수업 신호"]),
        (file_url + "#studio", ["교수자", "AI Co-Creation Studio", "approval · measurement · impact", "LMS에 게시"]),
    ]
    for target_url, required_text in smoke_targets:
        command = [
            str(browser),
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--disable-extensions",
            "--dump-dom",
            target_url,
        ]
        result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            print(result.stdout)
            print(result.stderr, file=sys.stderr)
            raise SystemExit(result.returncode)
        dom = result.stdout
        for required in required_text:
            if required not in dom:
                print(dom[:2000])
                raise SystemExit(f"browser smoke missing rendered text: {required}")
    print("JP LMS VibeOps browser smoke passed.")


if __name__ == "__main__":
    main()
