#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Frontend Full Markdown Doc Generator
------------------------------------
Mendokumentasikan *SELURUH ISI KODE* untuk folder frontend (React + TS/TSX):
- src/api/**
- src/types/**
- src/components/**
- src/pages/**
- src/store/**
- src/App.tsx
- src/main.tsx

Fitur:
- Otomatis deteksi file .ts, .tsx, .js, .jsx di folder target.
- Embed isi file lengkap pada Markdown (code fence) dengan language hint sesuai ekstensi.
- Header setiap file: path relatif, SHA singkat, ukuran file.
- Tanpa dependency eksternal (stdlib saja).
- Opsi --no-collapse untuk menampilkan kode tanpa <details>.

Contoh:
    python frontend_md_full_docgen.py --root . --out docs/Frontend_FullDocs.md
    python frontend_md_full_docgen.py --root . --out docs/Frontend_FullDocs.md --no-collapse
    python frontend_md_full_docgen.py --root . --title "Dok Frontend POS Prime" --out docs/FE.md
"""

from pathlib import Path
from typing import List, Dict
import hashlib
import argparse
import re
from datetime import datetime
import sys

TARGETS: Dict[str, str] = {
    "API (src/api)": "src/api",
    "Store (src/store)": "src/store",
    "layouts (src/layouts)": "src/layouts",
    "router (src/reouter)": "src/router",
    "Types (src/types)": "src/types",
    "Components (src/components)": "src/components",
    "Pages (src/pages)": "src/pages",
    "Pages (src/utils)": "src/utils",
}

ENTRY_FILES = [
    "src/App.tsx",
    "src/main.tsx",
]

EXTS = (".ts", ".tsx", ".js", ".jsx")

# ---------- Utils ----------

def sha1_of_file(path: Path) -> str:
    h = hashlib.sha1()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()[:12]

def human_size(n: int) -> str:
    for unit in ['B','KB','MB','GB']:
        if n < 1024.0:
            return f"{n:.0f} {unit}"
        n /= 1024.0
    return f"{n:.0f} TB"

def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return path.read_text(errors="replace")

def guess_lang_by_ext(path: Path) -> str:
    ext = path.suffix.lower()
    if ext == ".tsx":
        return "tsx"
    if ext == ".ts":
        return "ts"
    if ext == ".jsx":
        return "jsx"
    if ext == ".js":
        return "javascript"
    return ""

def collect_files(root: Path, rel: str) -> List[Path]:
    base = root / rel
    if not base.exists():
        return []
    files: List[Path] = []
    for p in base.rglob("*"):
        if p.is_file() and p.suffix.lower() in EXTS:
            files.append(p)
    # deterministic ordering
    return sorted(files, key=lambda p: str(p).lower())

def summarize(path: Path) -> Dict:
    text = read_text(path)
    sha = sha1_of_file(path)
    size = path.stat().st_size if path.exists() else 0
    return {
        "path": str(path),
        "sha": sha,
        "size": size,
        "text": text,
        "lang": guess_lang_by_ext(path),
    }

def anchorize(title: str) -> str:
    a = title.lower().strip()
    a = re.sub(r'[^a-z0-9\s-]', '', a)
    a = re.sub(r'\s+', '-', a)
    a = re.sub(r'-+', '-', a)
    return a

# ---------- Doc Gen ----------

def make_markdown(sections: Dict[str, List[Dict]], entries: List[Dict],
                  title: str, root: Path, collapse: bool) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    md: List[str] = []
    md.append(f"# {title}\n")
    md.append(f"_Dihasilkan otomatis: {now}_  \n**Root:** `{root}`\n")
    # TOC
    md.append("\n## Daftar Isi")
    for label, files in sections.items():
        if not files:
            continue
        anc = anchorize(label)
        md.append(f"\n- [{label}](#{anc})")
        for meta in files:
            rel = Path(meta["path"])
            try:
                rel = rel.relative_to(root)
            except Exception:
                pass
            md.append(f"  - [{rel}](#file-{anchorize(str(rel))})")
    if entries:
        md.append("\n- [Entry Files](#entry-files)")
        for meta in entries:
            rel = Path(meta["path"])
            try:
                rel = rel.relative_to(root)
            except Exception:
                pass
            md.append(f"  - [{rel}](#file-{anchorize(str(rel))})")
    md.append("")

    # Sections
    for label, files in sections.items():
        if not files:
            continue
        md.append(f"\n\n## {label}\n")
        for meta in files:
            p = Path(meta["path"])
            try:
                rel = p.relative_to(root)
            except Exception:
                rel = p
            md.append(f"### {rel}\n")
            md.append(f"- SHA: `{meta['sha']}`  \n- Ukuran: {human_size(meta['size'])}")
            code_block = f"```{meta['lang']}\n" + meta["text"] + "\n```\n"
            if collapse:
                md.append("<details><summary><strong>Lihat Kode Lengkap</strong></summary>\n\n" + code_block + "</details>\n")
            else:
                md.append(code_block)

    # Entry files
    if entries:
        md.append("\n\n## Entry Files\n")
        for meta in entries:
            p = Path(meta["path"])
            try:
                rel = p.relative_to(root)
            except Exception:
                rel = p
            md.append(f"### {rel}\n")
            md.append(f"- SHA: `{meta['sha']}`  \n- Ukuran: {human_size(meta['size'])}")
            code_block = f"```{meta['lang']}\n" + meta["text"] + "\n```\n"
            if collapse:
                md.append("<details><summary><strong>Lihat Kode Lengkap</strong></summary>\n\n" + code_block + "</details>\n")
            else:
                md.append(code_block)

    return "\n".join(md)

# ---------- Main ----------

def run():
    ap = argparse.ArgumentParser(description="Generate FULL Markdown docs for a React/TS frontend (embed all sources).")
    ap.add_argument("--root", required=True, help="Path ke root frontend (berisi src/)")
    ap.add_argument("--out", default="docs/Frontend_FullDocs.md", help="Output file Markdown")
    ap.add_argument("--title", default="Dokumentasi Frontend (FULL Source)", help="Judul dokumen")
    ap.add_argument("--no-collapse", action="store_true", help="Tampilkan kode langsung (tanpa <details>)")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print(f"[ERR] root tidak ditemukan: {root}", file=sys.stderr)
        return 2

    sections: Dict[str, List[Dict]] = {}
    for label, rel in TARGETS.items():
        files = collect_files(root, rel)
        sections[label] = [summarize(p) for p in files]

    entries: List[Dict] = []
    for ef in ENTRY_FILES:
        p = root / ef
        if p.exists():
            entries.append(summarize(p))

    collapse = not args.no_collapse
    md = make_markdown(sections, entries, args.title, root, collapse)

    out_path = Path(args.out)
    if not out_path.is_absolute():
        out_path = (Path.cwd() / out_path).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(md, encoding="utf-8")

    print(f"[OK] Markdown generated -> {out_path} ({len(md.splitlines())} lines)")
    return 0

if __name__ == "__main__":
    raise SystemExit(run())
