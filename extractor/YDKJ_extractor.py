#!/usr/bin/env python3
"""
YDKJ Resource Extractor (Python CLI version)
============================================

Converts "You Don't Know Jack" (.SRF) game archives from a source directory
or ISO image into web-ready assets (GIF sprite sheets, JS frame definitions,
OGG/MP3 audio files) and populates a SQLite database initialized from
`toolbox/ydkj<lang>_sta_res.sql`.

Replaces the legacy workflow:
  1. Delphi extractor (YDKJ.exe / Unit1.pas / YDKJUnit.pas)
  2. toolbox/import-csv.php (direct SQLite insertion with pure JSON strings)
  3. toolbox/convertwav.sh (WAV/AIFC to 64k OGG & MP3 conversion via FFmpeg)
  4. toolbox/scan-snd.php (audio resource verification and DB update)

Usage:
  python YDKJ_extractor.py <source_dir_or_iso> <target_dir> [lang] [--extra-source <dir_or_iso>]

Arguments:
  source_dir_or_iso : Path to the primary source directory or .iso file
  target_dir        : Path to the output directory
  lang              : Optional language code (de, fr, uk, us); auto-detected from QHEADERS.SRF MD5 if omitted
  --extra-source    : Optional secondary source directory or .iso file from which missing questions are imported into QFOLD99/<ID>
"""

from __future__ import annotations

import argparse
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from fractions import Fraction
import hashlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import sqlite3
import struct
import subprocess
import sys
import tempfile
from typing import BinaryIO, Iterator

try:
    import av  # type: ignore[import-not-found]
    av.logging.set_level(av.logging.ERROR)
except ImportError:
    av = None  # type: ignore[assignment]

# =============================================================================
# 1. Constants, Palette, and Character Encoding Tables
# =============================================================================

SCRIPT_DIR = Path(__file__).resolve().parent
SQL_DIR = SCRIPT_DIR / "toolbox"
SQL_FILENAME_TEMPLATE = "ydkj{lang}_sta_res.sql"

SUPPORTED_LANGUAGES = ("de", "fr", "uk", "us")

QHEADERS_MD5_TO_LANG: dict[str, str] = {
    "4779ff2519fdd14273a95b94e08e33f2": "fr",  # FR v1.1 (patched release, 737 questions)
    "e25763f3dba7348d34c02bc1315834c3": "fr",  # FR v1.0 (initial release, 743 questions)
    "7cebe3f97c8ab2d1652a5c5fca15169d": "de",
    "d213c0650c529da62a03241b338a9ff7": "uk",
    "6af4e419f0fed068386c0f68e28edf82": "us",
}

# Subdirectories ignored during .SRF discovery (e.g., 'Riviera' demo/staging assets on FR v1.1 CD)
IGNORED_SRF_DIRS: set[str] = {"RIVIERA"}

# Target virtual folder where questions imported from --extra-source are stored
EXTRA_QUESTIONS_FOLDER = "QFOLD99"
VERTICAL_GIF = True
TRANSPARENT_RGB = (255, 128, 255)  # 0xFF80FF in Delphi TColor

# 256-color RGB palette extracted from palette.bmp / PALETTE resource in YDKJ.res
DEFAULT_PALETTE_RGB: list[tuple[int, int, int]] = [
    (0, 0, 0), (128, 0, 0), (0, 128, 0), (128, 128, 0),
    (0, 0, 128), (128, 0, 128), (0, 128, 128), (192, 192, 192),
    (192, 220, 192), (166, 202, 240), (255, 255, 204), (255, 255, 153),
    (255, 255, 102), (255, 255, 51), (255, 255, 0), (255, 204, 255),
    (255, 204, 204), (255, 204, 153), (255, 204, 102), (255, 204, 51),
    (255, 204, 0), (255, 153, 255), (255, 153, 204), (255, 153, 153),
    (255, 153, 102), (255, 153, 51), (255, 153, 0), (255, 102, 255),
    (255, 102, 204), (255, 102, 153), (255, 102, 102), (255, 102, 51),
    (255, 102, 0), (255, 51, 255), (255, 51, 204), (255, 51, 153),
    (255, 51, 102), (255, 51, 51), (255, 51, 0), (255, 0, 204),
    (255, 0, 153), (255, 0, 102), (255, 0, 51), (204, 255, 255),
    (204, 255, 204), (204, 255, 153), (204, 255, 102), (204, 255, 51),
    (204, 255, 0), (204, 204, 255), (204, 204, 204), (204, 204, 153),
    (204, 204, 102), (204, 204, 51), (204, 204, 0), (204, 153, 255),
    (204, 153, 204), (204, 153, 153), (204, 153, 102), (204, 153, 51),
    (204, 153, 0), (204, 102, 255), (204, 102, 204), (204, 102, 153),
    (204, 102, 102), (204, 102, 51), (204, 102, 0), (204, 51, 255),
    (204, 51, 204), (204, 51, 153), (204, 51, 102), (204, 51, 51),
    (204, 51, 0), (204, 0, 255), (204, 0, 204), (204, 0, 153),
    (204, 0, 102), (204, 0, 51), (204, 0, 0), (153, 255, 255),
    (153, 255, 204), (153, 255, 153), (153, 255, 102), (153, 255, 51),
    (153, 255, 0), (153, 204, 255), (153, 204, 204), (153, 204, 153),
    (153, 204, 102), (153, 204, 51), (153, 204, 0), (153, 153, 255),
    (153, 153, 204), (153, 153, 153), (153, 153, 102), (153, 153, 51),
    (153, 153, 0), (153, 102, 255), (153, 102, 204), (153, 102, 153),
    (153, 102, 102), (153, 102, 51), (153, 102, 0), (153, 51, 255),
    (153, 51, 204), (153, 51, 153), (153, 51, 102), (153, 51, 51),
    (153, 51, 0), (153, 0, 255), (153, 0, 204), (153, 0, 153),
    (153, 0, 102), (153, 0, 51), (153, 0, 0), (102, 255, 255),
    (102, 255, 204), (102, 255, 153), (102, 255, 102), (102, 255, 51),
    (102, 255, 0), (102, 204, 255), (102, 204, 204), (102, 204, 153),
    (102, 204, 102), (102, 204, 51), (102, 204, 0), (102, 153, 255),
    (102, 153, 204), (102, 153, 153), (102, 153, 102), (102, 153, 51),
    (102, 153, 0), (102, 102, 255), (102, 102, 204), (102, 102, 153),
    (102, 102, 102), (102, 102, 51), (102, 102, 0), (102, 51, 255),
    (102, 51, 204), (102, 51, 153), (102, 51, 102), (102, 51, 51),
    (102, 51, 0), (102, 0, 255), (102, 0, 204), (102, 0, 153),
    (102, 0, 102), (102, 0, 51), (102, 0, 0), (51, 255, 255),
    (51, 255, 204), (51, 255, 153), (51, 255, 102), (51, 255, 51),
    (51, 255, 0), (51, 204, 255), (51, 204, 204), (51, 204, 153),
    (51, 204, 102), (51, 204, 51), (51, 204, 0), (51, 153, 255),
    (51, 153, 204), (51, 153, 153), (51, 153, 102), (51, 153, 51),
    (51, 153, 0), (51, 102, 255), (51, 102, 204), (51, 102, 153),
    (51, 102, 102), (51, 102, 51), (51, 102, 0), (51, 51, 255),
    (51, 51, 204), (51, 51, 153), (51, 51, 102), (51, 51, 51),
    (51, 51, 0), (51, 0, 255), (51, 0, 204), (51, 0, 153),
    (51, 0, 102), (51, 0, 51), (51, 0, 0), (0, 255, 204),
    (0, 255, 153), (0, 255, 102), (0, 255, 51), (0, 204, 255),
    (0, 204, 204), (0, 204, 153), (0, 204, 102), (0, 204, 51),
    (0, 204, 0), (0, 153, 255), (0, 153, 204), (0, 153, 153),
    (0, 153, 102), (0, 153, 51), (0, 153, 0), (0, 102, 255),
    (0, 102, 204), (0, 102, 153), (0, 102, 102), (0, 102, 51),
    (0, 102, 0), (0, 51, 255), (0, 51, 204), (0, 51, 153),
    (0, 51, 102), (0, 51, 51), (0, 51, 0), (0, 0, 204),
    (0, 0, 153), (0, 0, 102), (0, 0, 51), (238, 0, 0),
    (221, 0, 0), (187, 0, 0), (170, 0, 0), (119, 0, 0),
    (68, 0, 0), (0, 238, 0), (0, 221, 0), (0, 187, 0),
    (0, 170, 0), (0, 119, 0), (0, 68, 0), (0, 0, 238),
    (0, 0, 221), (0, 0, 187), (0, 0, 170), (0, 0, 119),
    (0, 0, 68), (238, 238, 238), (221, 221, 221), (187, 187, 187),
    (170, 170, 170), (136, 136, 136), (119, 119, 119), (85, 85, 85),
    (68, 68, 68), (34, 34, 34), (0, 0, 1), (255, 251, 240),
    (160, 160, 164), (128, 128, 128), (255, 0, 0), (0, 255, 0),
    (255, 255, 0), (0, 0, 255), (255, 0, 255), (0, 255, 255),
    (255, 255, 255),
]

# MacRoman to UTF-8 character table (matching MactoUTF8 in YDKJUnit.pas)
MAC_TO_UTF8: dict[int, str] = {
    0x7B: "\u00a0",  # Non-breaking space in YDKJ
    0x80: "Ä", 0x81: "Å", 0x82: "Ç", 0x83: "É", 0x84: "Ñ", 0x85: "Ö", 0x86: "Ü", 0x87: "á",
    0x88: "à", 0x89: "â", 0x8A: "ä", 0x8B: "ã", 0x8C: "å", 0x8D: "ç", 0x8E: "é", 0x8F: "è",
    0x90: "ê", 0x91: "ë", 0x92: "í", 0x93: "ì", 0x94: "î", 0x95: "ï", 0x96: "ñ", 0x97: "ó",
    0x98: "ò", 0x99: "ô", 0x9A: "ö", 0x9B: "õ", 0x9C: "ú", 0x9D: "ù", 0x9E: "û", 0x9F: "ü",
    0xA0: "†", 0xA1: "°", 0xA2: "®", 0xA3: "£", 0xA4: "§", 0xA5: "•", 0xA6: "¶", 0xA7: "ß",
    0xA8: "®", 0xA9: "©", 0xAA: "™", 0xAB: "´", 0xAC: "¨", 0xAD: "≠", 0xAE: "Æ", 0xAF: "Ø",
    0xB0: "∞", 0xB1: "±", 0xB2: "≤", 0xB3: "≥", 0xB4: "¥", 0xB5: "µ", 0xB6: "∂", 0xB7: "ß",
    0xB8: "∏", 0xB9: "π", 0xBA: "∫", 0xBB: "ª", 0xBC: "º", 0xBD: "Ω", 0xBE: "æ", 0xBF: "ø",
    0xC0: "¿", 0xC1: "¡", 0xC2: "¬", 0xC3: "√", 0xC4: "ƒ", 0xC5: "≈", 0xC6: "∆", 0xC7: "«",
    0xC8: "»", 0xC9: "…", 0xCA: "\u00a0", 0xCB: "À", 0xCC: "Ã", 0xCD: "Õ", 0xCE: "Œ", 0xCF: "œ",
    0xD0: "–", 0xD1: "—", 0xD2: "“", 0xD3: "”", 0xD4: "‘", 0xD5: "’", 0xD6: "÷", 0xD7: "◊",
    0xD8: "ÿ", 0xD9: "Ÿ", 0xDA: "⁄", 0xDB: "€", 0xDC: "‹", 0xDD: "›", 0xDE: "ﬁ", 0xDF: "ﬂ",
    0xE0: "‡", 0xE1: "·", 0xE2: "‚", 0xE3: "„", 0xE4: "‰", 0xE5: "Â", 0xE6: "Ê", 0xE7: "Á",
    0xE8: "Ë", 0xE9: "È", 0xEA: "Í", 0xEB: "Î", 0xEC: "Ï", 0xED: "Ì", 0xEE: "Ó", 0xEF: "Ô",
    0xF0: "\ue01e", 0xF1: "Ò", 0xF2: "Ú", 0xF3: "Û", 0xF4: "Ù", 0xF5: "ı", 0xF6: "ˆ", 0xF7: "˜",
    0xF8: "¯", 0xF9: "˘", 0xFA: "˙", 0xFB: "˚", 0xFC: "¸", 0xFD: "˝", 0xFE: "˛", 0xFF: "ˇ",
}

QTYPE_MAP: dict[int, str] = {
    0: "Question",
    2: "Gibberish",
    3: "DisOrDat",
    4: "JackAttack",
    5: "Fiber",
}

QSUBTYPE_MAP: dict[int, str] = {
    1: "Normal",
    2: "Blank",
    3: "Who",
    4: "Eyes",
}

SCAN_SND_EXCLUDED_SUFFIXES = (
    "Mb84", "Mb85", "Mc85", "Mh23", "Md42", "Md70", "Md71", "Md72",
    "Me13", "Me21", "Me22", "Me23", "Mf21", "Mg40", "Mh42",
)


def load_palette(script_dir: Path) -> list[tuple[int, int, int]]:
    """Load the 256-color palette from palette.bmp if present, else use embedded palette."""
    bmp_path = script_dir / "palette.bmp"
    if bmp_path.is_file():
        data = bmp_path.read_bytes()
        if len(data) >= 54 + 256 * 3 and data[:2] == b"BM":
            colors: list[tuple[int, int, int]] = []
            for i in range(256):
                b, g, r = data[54 + i * 3 : 54 + (i + 1) * 3]
                colors.append((r, g, b))
            return colors
    return list(DEFAULT_PALETTE_RGB)


def mac_to_utf8_char(byte: int) -> str:
    """Convert a single MacRoman byte to its UTF-8 character."""
    if byte in MAC_TO_UTF8:
        return MAC_TO_UTF8[byte]
    return chr(byte)


def decode_mac_string(data: bytes | memoryview, stop_at_null: bool = False) -> str:
    """
    Decode MacRoman bytes to a Python UTF-8 string.
    Normalizes Mac CR (0x0D) line breaks to LF ('\\n') and ignores LF (0x0A),
    matching import-csv.php behavior.
    """
    chars: list[str] = []
    for b in data:
        if b == 0:
            if stop_at_null:
                break
            continue
        if b == 10:  # Ignore raw LF
            continue
        if b == 13:  # Convert Mac CR to LF
            chars.append("\n")
        elif b in MAC_TO_UTF8:
            chars.append(MAC_TO_UTF8[b])
        else:
            chars.append(chr(b))
    return "".join(chars)


def remove_spaces_and_hash(s: str) -> str:
    """Replicate Delphi removespaces(): strip spaces and replace '#' with '0'."""
    return s.replace(" ", "").replace("#", "0")


# =============================================================================
# 2. Progress Reporting
# =============================================================================

class ProgressReporter:
    """Displays clean CLI progress updates across conversion stages."""

    def __init__(self) -> None:
        self.is_tty = sys.stdout.isatty()
        self._last_line_len = 0

    def stage(self, step: int, total_steps: int, message: str) -> None:
        self.clear_line()
        print(f"[{step}/{total_steps}] {message}", flush=True)

    def update(self, current: int, total: int, label: str = "") -> None:
        if total <= 0:
            return
        pct = (current * 100.0) / total
        bar_len = 28
        filled = int(round(bar_len * current / total))
        bar = "#" * filled + "-" * (bar_len - filled)
        line = f"  [{bar}] {current}/{total} ({pct:5.1f}%)"
        if label:
            line += f" - {label}"

        if self.is_tty:
            padded = line.ljust(self._last_line_len)
            sys.stdout.write("\r" + padded)
            sys.stdout.flush()
            self._last_line_len = len(line)
        else:
            print(line, flush=True)

    def clear_line(self) -> None:
        if self.is_tty and self._last_line_len > 0:
            sys.stdout.write("\r" + (" " * self._last_line_len) + "\r")
            sys.stdout.flush()
            self._last_line_len = 0

    def info(self, message: str) -> None:
        self.clear_line()
        print(f"  -> {message}", flush=True)

    def warn(self, message: str) -> None:
        self.clear_line()
        print(f"  [WARNING] {message}", file=sys.stderr, flush=True)

    def error(self, message: str) -> None:
        self.clear_line()
        print(f"  [ERROR] {message}", file=sys.stderr, flush=True)


# =============================================================================
# 3. Source Abstraction (Directory or ISO 9660 Image)
# =============================================================================

@dataclass
class SrfEntry:
    """Represents a single .SRF archive located in a directory or ISO image."""
    rel_path: str  # Relative path using forward slashes, e.g. "TITLE.SRF" or "Questions/B01.SRF"
    loader: callable  # Callable returning raw bytes of the .SRF file

    @property
    def rel_folder(self) -> str:
        """Relative path without extension, matching Delphi RemoveExt(RemoveBaseDir(...))."""
        p = self.rel_path.replace("\\", "/").strip("/")
        dot_idx = p.rfind(".")
        if dot_idx > 0:
            return p[:dot_idx]
        return p


class Iso9660Reader:
    """
    Pure-Python ISO 9660 (PVD + Joliet + Rock Ridge) reader.
    Allows reading .SRF files directly from an .iso image on Windows and Linux
    without mounting or external dependencies.
    """

    SECTOR_SIZE = 2048

    def __init__(self, iso_path: Path) -> None:
        self.iso_path = iso_path
        self._fp: BinaryIO = open(iso_path, "rb")

    def close(self) -> None:
        if self._fp and not self._fp.closed:
            self._fp.close()

    def __enter__(self) -> Iso9660Reader:
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        self.close()

    def list_srf_entries(self) -> list[SrfEntry]:
        """Scan the ISO filesystem and return all .SRF files."""
        pvd_root: bytes | None = None
        joliet_root: bytes | None = None

        # Read Volume Descriptors starting at sector 16
        for sector in range(16, 64):
            self._fp.seek(sector * self.SECTOR_SIZE)
            vd = self._fp.read(self.SECTOR_SIZE)
            if len(vd) < self.SECTOR_SIZE or vd[1:6] != b"CD001":
                break
            vd_type = vd[0]
            if vd_type == 255:  # Terminator
                break
            elif vd_type == 1 and pvd_root is None:
                pvd_root = vd[156:190]
            elif vd_type == 2:
                escape_seq = vd[88:120]
                if any(seq in escape_seq for seq in (b"%/@", b"%/C", b"%/E")):
                    joliet_root = vd[156:190]

        if joliet_root is not None:
            root_record = joliet_root
            is_joliet = True
        elif pvd_root is not None:
            root_record = pvd_root
            is_joliet = False
        else:
            raise ValueError(f"'{self.iso_path}' is not a valid ISO 9660 image.")

        root_lba, = struct.unpack("<I", root_record[2:6])
        root_size, = struct.unpack("<I", root_record[10:14])

        raw_files: list[tuple[str, int, int]] = []
        visited_dirs: set[int] = set()
        self._walk_dir(root_lba, root_size, "", is_joliet, raw_files, visited_dirs)

        # If PVD/Joliet found no .SRF files, try alternate descriptor if available
        if not raw_files and is_joliet and pvd_root is not None:
            root_lba, = struct.unpack("<I", pvd_root[2:6])
            root_size, = struct.unpack("<I", pvd_root[10:14])
            visited_dirs.clear()
            self._walk_dir(root_lba, root_size, "", False, raw_files, visited_dirs)

        # Normalize common prefix if the entire game sits in a subfolder inside the ISO (e.g. "YDKJ/")
        srf_files = [(path, lba, size) for path, lba, size in raw_files if path.upper().endswith(".SRF")]
        srf_files = self._strip_common_iso_prefix(srf_files)

        entries: list[SrfEntry] = []
        for rel_path, lba, size in srf_files:
            offset = lba * self.SECTOR_SIZE
            entries.append(
                SrfEntry(
                    rel_path=rel_path,
                    loader=lambda off=offset, sz=size: self.read_extent(off, sz),
                )
            )
        return entries

    def read_extent(self, offset: int, size: int) -> bytes:
        self._fp.seek(offset)
        return self._fp.read(size)

    def _walk_dir(
        self,
        dir_lba: int,
        dir_size: int,
        prefix: str,
        is_joliet: bool,
        out_files: list[tuple[str, int, int]],
        visited: set[int],
    ) -> None:
        if dir_lba in visited:
            return
        visited.add(dir_lba)

        self._fp.seek(dir_lba * self.SECTOR_SIZE)
        dir_data = self._fp.read(dir_size)
        pos = 0
        limit = len(dir_data)

        while pos < limit:
            rec_len = dir_data[pos]
            if rec_len == 0:
                # Advance to next sector boundary
                next_sector = ((pos // self.SECTOR_SIZE) + 1) * self.SECTOR_SIZE
                if next_sector <= pos:
                    break
                pos = next_sector
                continue

            rec = dir_data[pos : pos + rec_len]
            if len(rec) < 34:
                break

            extent_lba, = struct.unpack("<I", rec[2:6])
            data_len, = struct.unpack("<I", rec[10:14])
            flags = rec[25]
            name_len = rec[32]
            raw_name = rec[33 : 33 + name_len]

            pos += rec_len

            if raw_name in (b"\x00", b"\x01"):
                continue

            # Decode filename (check Rock Ridge NM first, then Joliet/ISO)
            name = self._parse_rock_ridge_name(rec, 33 + name_len)
            if not name:
                if is_joliet:
                    name = raw_name.decode("utf-16-be", errors="replace")
                else:
                    name = raw_name.decode("latin1", errors="replace")

            # Strip ISO version number (e.g. ";1")
            if ";" in name:
                name = name.split(";", 1)[0]
            # Strip trailing dot if no extension
            if name.endswith(".") and "." not in name[:-1]:
                name = name[:-1]

            if not name:
                continue

            rel_path = f"{prefix}/{name}" if prefix else name
            is_dir = bool(flags & 0x02)

            if is_dir:
                if name.upper() in IGNORED_SRF_DIRS:
                    continue
                self._walk_dir(extent_lba, data_len, rel_path, is_joliet, out_files, visited)
            else:
                out_files.append((rel_path, extent_lba, data_len))

    @staticmethod
    def _parse_rock_ridge_name(rec: bytes, su_start: int) -> str | None:
        if su_start % 2 == 1:
            su_start += 1
        su = rec[su_start:]
        pos = 0
        parts: list[str] = []
        while pos + 4 <= len(su):
            sig = su[pos : pos + 2]
            length = su[pos + 2]
            if length < 4 or pos + length > len(su):
                break
            if sig == b"NM" and length > 5:
                parts.append(su[pos + 5 : pos + length].decode("utf-8", errors="replace"))
            pos += length
        return "".join(parts) if parts else None

    @staticmethod
    def _strip_common_iso_prefix(
        srf_files: list[tuple[str, int, int]]
    ) -> list[tuple[str, int, int]]:
        """
        If all .SRF files in an ISO live inside a single top-level directory
        (e.g., 'YDKJ/TITLE.SRF', 'YDKJ/JACKART.SRF'), strip that top-level
        folder prefix so paths match the database expectations ('TITLE', 'JACKART').
        """
        if not srf_files:
            return srf_files
        while True:
            top_parts = {p.split("/", 1)[0].upper() for p, _, _ in srf_files if "/" in p}
            has_root_srf = any("/" not in p for p, _, _ in srf_files)
            if not has_root_srf and len(top_parts) == 1:
                srf_files = [(p.split("/", 1)[1], lba, sz) for p, lba, sz in srf_files]
            else:
                break
        return srf_files


def collect_directory_srf_entries(source_dir: Path) -> list[SrfEntry]:
    """Recursively find all .SRF files in a directory, matching Delphi convertRecursive."""
    all_srf_paths: list[Path] = []
    for root, dirs, files in os.walk(source_dir):
        dirs[:] = sorted(d for d in dirs if d.upper() not in IGNORED_SRF_DIRS)
        for fname in sorted(files):
            if fname.upper().endswith(".SRF"):
                all_srf_paths.append(Path(root) / fname)

    # Check if the user pointed to a parent directory where all .SRF files are inside
    # a single subdirectory (e.g. ISO root folder containing "YDKJ/") and no core .SRF
    # exists at the top level.
    base_dir = source_dir
    while all_srf_paths:
        rel_parts = [p.relative_to(base_dir).parts for p in all_srf_paths]
        has_top_srf = any(len(parts) == 1 for parts in rel_parts)
        first_dirs = {parts[0].upper() for parts in rel_parts if len(parts) > 1}
        if not has_top_srf and len(first_dirs) == 1:
            single_subdir_name = next(parts[0] for parts in rel_parts if len(parts) > 1)
            # Only descend if the subfolder isn't a known SRF sub-package like QUESTIONS or GROOVES
            if single_subdir_name.upper() not in ("QUESTIONS", "GROOVES"):
                base_dir = base_dir / single_subdir_name
                continue
        break

    entries: list[SrfEntry] = []
    for full_path in all_srf_paths:
        rel_path = full_path.relative_to(base_dir).as_posix()
        entries.append(
            SrfEntry(
                rel_path=rel_path,
                loader=lambda p=full_path: p.read_bytes(),
            )
        )
    return entries


# =============================================================================
# 4. GIF89a Encoder (Pure Python, LZW Compressed with Compact Palette)
# =============================================================================

def encode_gif89a(
    width: int,
    height: int,
    pixels: bytes | bytearray,
    palette_rgb: list[tuple[int, int, int]],
    transparent_index: int | None = None,
) -> bytes:
    """
    Encode an 8-bit indexed image into a GIF89a byte stream with lossless LZW
    compression, compact 2^B Global Color Table, adaptive dictionary reset,
    and optional Graphic Control Extension for transparency.
    """
    # 1. Build a compact 2^B palette containing only the colors actually used
    used_set = set(pixels)
    if transparent_index is not None and 0 <= transparent_index <= 255:
        used_set.discard(transparent_index)
        used = [transparent_index] + sorted(used_set)
        has_trans = True
    else:
        used = sorted(used_set) if used_set else [0]
        has_trans = False

    n_colors = len(used)
    bits = max(1, (max(2, n_colors) - 1).bit_length())
    table_size = 1 << bits
    min_code_size = max(2, bits)

    remap = bytearray(256)
    gct = bytearray(table_size * 3)
    for new_idx, old_idx in enumerate(used):
        remap[old_idx] = new_idx
        r, g, b = palette_rgb[old_idx] if old_idx < len(palette_rgb) else (0, 0, 0)
        base = new_idx * 3
        gct[base] = r
        gct[base + 1] = g
        gct[base + 2] = b

    remapped = pixels.translate(remap)

    out = bytearray(b"GIF89a")
    # Packed byte: Global Color Table flag (0x80) | Color Resolution ((bits-1)<<4) | GCT size (bits-1)
    packed = 0x80 | ((bits - 1) << 4) | (bits - 1)
    out += struct.pack("<HHBBB", width, height, packed, 0, 0)
    out += gct

    # Graphic Control Extension (transparent color is placed at index 0 of compact table)
    if has_trans:
        out += struct.pack("<BBBBHB", 0x21, 0xF9, 4, 0x01, 0, 0) + b"\x00"

    # Image Descriptor
    out += struct.pack("<BHHHHB", 0x2C, 0, 0, width, height, 0)
    out.append(min_code_size)

    clear_code = 1 << min_code_size
    eoi_code = clear_code + 1
    first_free = eoi_code + 1
    init_code_size = min_code_size + 1
    init_max_code = 1 << init_code_size

    next_code = first_free
    code_size = init_code_size
    max_code = init_max_code

    table: dict[int, int] = {}
    table_get = table.get
    table_clear = table.clear
    bit_buf = clear_code
    bit_cnt = code_size
    mask_2040 = (1 << 2040) - 1
    use_adaptive = min_code_size >= 5

    if len(remapped) > 0:
        it = iter(remapped)
        prefix = next(it)
        win_in = 0
        win_codes = 0
        best_rate = 0.0
        for k in it:
            key = (prefix << 8) | k
            code = table_get(key)
            if code is not None:
                prefix = code
                if use_adaptive and next_code == 4096:
                    win_in += 1
            else:
                bit_buf |= prefix << bit_cnt
                bit_cnt += code_size
                if next_code < 4096:
                    table[key] = next_code
                    if next_code == max_code and code_size < 12:
                        code_size += 1
                        max_code <<= 1
                    next_code += 1
                elif not use_adaptive:
                    bit_buf |= clear_code << bit_cnt
                    bit_cnt += code_size
                    table_clear()
                    next_code = first_free
                    code_size = init_code_size
                    max_code = init_max_code
                else:
                    win_in += 1
                    win_codes += 1
                    if win_codes >= 256:
                        if win_in < best_rate * 0.85 or win_in < 512:
                            bit_buf |= clear_code << bit_cnt
                            bit_cnt += code_size
                            table_clear()
                            next_code = first_free
                            code_size = init_code_size
                            max_code = init_max_code
                            best_rate = 0.0
                        elif win_in > best_rate:
                            best_rate = win_in
                        win_in = 0
                        win_codes = 0
                if bit_cnt >= 2040:
                    out.append(255)
                    out += (bit_buf & mask_2040).to_bytes(255, "little")
                    bit_buf >>= 2040
                    bit_cnt -= 2040
                prefix = k
        bit_buf |= prefix << bit_cnt
        bit_cnt += code_size

    bit_buf |= eoi_code << bit_cnt
    bit_cnt += code_size
    while bit_cnt >= 2040:
        out.append(255)
        out += (bit_buf & mask_2040).to_bytes(255, "little")
        bit_buf >>= 2040
        bit_cnt -= 2040

    while bit_cnt > 0:
        rem_bytes = min(255, (bit_cnt + 7) // 8)
        rem_bits = rem_bytes * 8
        out.append(rem_bytes)
        out += (bit_buf & ((1 << rem_bits) - 1)).to_bytes(rem_bytes, "little")
        bit_buf >>= rem_bits
        bit_cnt -= rem_bits

    out.append(0)     # Block terminator
    out.append(0x3B)  # GIF Trailer
    return bytes(out)


# =============================================================================
# 5. SRF Data Structures & Parser (Equivalent to YDKJUnit.pas)
# =============================================================================

class TooManyImagesError(ValueError):
    """Raised when an 'off4' chunk header declares more than 1000 images (expected on CCCRSRC.SRF)."""

@dataclass
class FrameSprite:
    val: int
    left: int
    top: int
    right: int
    bottom: int
    imgindex: int


@dataclass
class AnimationFrame:
    nbimages: int
    images: list[FrameSprite] = field(default_factory=list)


@dataclass
class SubImageDef:
    offset: int
    width: int
    height: int


@dataclass
class SubImagesData:
    fps1: int
    fps2: int
    nbframes: int
    frames: list[AnimationFrame]
    nbimages: int
    images: list[SubImageDef]


@dataclass
class SubSoundData:
    aifc: bool
    offset: int
    size: int
    samples: int
    bitrate: int
    frames: int
    rate: int


@dataclass
class SubSubFile:
    subname: int
    fileoffset: int
    filesize: int
    data: SubImagesData | SubSoundData | None = None


@dataclass
class SubFileGroup:
    ftype: str
    subfiles: list[SubSubFile]


@dataclass
class QhdrRecord:
    id: str
    title: str
    folder: str
    qtype: str
    qsubtype: str | None
    value: int
    answer: int | None
    forcenext: str | None


class YdkjSrfExtractor:
    """
    Parses and extracts resources from YDKJ .SRF archive files.
    Faithfully reproduces TYDKJSRF from YDKJUnit.pas.
    """

    def __init__(self, palette_rgb: list[tuple[int, int, int]]) -> None:
        self.palette_rgb = palette_rgb
        self._bitmap_buf = bytearray(307500)
        self._tile_buf = bytearray(307500)
        self._trans_buf = bytes([246]) * 307500
        self._pal8_bgra_246 = self._build_pal8_bgra(palette_rgb, 246)

    @staticmethod
    def _build_pal8_bgra(
        palette_rgb: list[tuple[int, int, int]],
        transparent_idx: int,
    ) -> bytes:
        """Build 256x4 byte BGRA palette buffer for PyAV pal8 GIF encoding."""
        pal = bytearray(1024)
        for idx in range(256):
            if idx == transparent_idx:
                # Alpha = 0 marks the transparent palette entry for FFmpeg's gif encoder
                pal[idx * 4 : idx * 4 + 4] = bytes(
                    (TRANSPARENT_RGB[2], TRANSPARENT_RGB[1], TRANSPARENT_RGB[0], 0)
                )
            elif idx < len(palette_rgb):
                r, g, b = palette_rgb[idx]
                pal[idx * 4 : idx * 4 + 4] = bytes((b, g, r, 255))
            else:
                pal[idx * 4 : idx * 4 + 4] = b"\x00\x00\x00\xff"
        return bytes(pal)

    @staticmethod
    def filetype(ftype: str) -> str:
        """Map 4-character SRF resource type to internal category (YDKJUnit.pas filetype)."""
        if ftype == "off4":
            return "subimages"
        if ftype == "snd":
            return "subsound"
        if ftype.startswith("M") and ftype != "Mtch":
            return "subsound"
        if ftype in ("STR", "Ansr", "Gibr", "Gory", "Hnt1", "Hnt2", "Hnt3"):
            return "string"
        if ftype in ("STRL", "Dcoy", "Mtch", "Root"):
            return "stringlist"
        if ftype == "Wrds":
            return "stringlist1"
        if ftype == "ANS#":
            return "answers"
        if ftype == "STR#":
            return "stringlist2"
        if ftype == "qhdr":
            return "qheaders"
        return ""

    def parse_srf(self, raw: bytes) -> list[SubFileGroup]:
        """Parse SRF header and subfile metadata (YDKJUnit.pas openSRF)."""
        if len(raw) < 12 or raw[:4] != b"srf1":
            raise ValueError("Invalid SRF header (expected 'srf1').")

        _archive_size, header_size = struct.unpack(">II", raw[4:12])
        header_limit = min(header_size, len(raw))
        pos = 12
        groups: list[SubFileGroup] = []

        while pos + 8 <= header_limit:
            ftype = raw[pos : pos + 4].decode("latin1").rstrip(" ")
            subcount, = struct.unpack(">I", raw[pos + 4 : pos + 8])
            pos += 8

            if subcount > 1000:
                raise ValueError(f"Too many subfiles ({subcount}) in chunk '{ftype}'.")

            category = self.filetype(ftype)
            subfiles: list[SubSubFile] = []

            for _ in range(subcount):
                if pos + 12 > len(raw):
                    break
                subname, fileoffset, filesize = struct.unpack(">iII", raw[pos : pos + 12])
                pos += 12

                parsed_data: SubImagesData | SubSoundData | None = None
                if category == "subimages":
                    parsed_data = self._open_subimages(raw, fileoffset, filesize)
                elif category == "subsound":
                    parsed_data = self._open_subsound(raw, fileoffset, filesize)

                subfiles.append(
                    SubSubFile(
                        subname=subname,
                        fileoffset=fileoffset,
                        filesize=filesize,
                        data=parsed_data,
                    )
                )

            groups.append(SubFileGroup(ftype=ftype, subfiles=subfiles))
            if len(groups) > 255:
                raise ValueError("Too many file groups in SRF header.")

        return groups

    def _open_subimages(self, raw: bytes, fileoffset: int, filesize: int) -> SubImagesData:
        """Parse 'off4' animation and sprite header (YDKJUnit.pas openSubimages)."""
        end_of_subfile = min(len(raw), fileoffset + filesize) if filesize > 0 else len(raw)
        if fileoffset + 4 > end_of_subfile:
            return SubImagesData(fps1=0, fps2=0, nbframes=0, frames=[], nbimages=0, images=[])

        imagestartpointer, = struct.unpack(">I", raw[fileoffset : fileoffset + 4])
        img_list_pos = fileoffset + imagestartpointer
        frames: list[AnimationFrame] = []
        fps1 = 0
        fps2 = 0
        nbframes = 0

        # Parse animation frame definitions if present before imagestartpointer
        if imagestartpointer >= 10 and fileoffset + 10 <= end_of_subfile:
            fps1, fps2, nbframes = struct.unpack(">HHH", raw[fileoffset + 4 : fileoffset + 10])
            pos = fileoffset + 10
            base_def_offset = fileoffset + 10 + nbframes * 2

            if base_def_offset <= img_list_pos and base_def_offset <= end_of_subfile:
                for _ in range(nbframes):
                    if pos + 2 > end_of_subfile:
                        break
                    frameoffset, = struct.unpack(">H", raw[pos : pos + 2])
                    pos += 2
                    if frameoffset == 0:
                        frames.append(AnimationFrame(nbimages=0))
                    else:
                        def_pos = base_def_offset + (frameoffset - 1) * 12
                        if def_pos + 12 > end_of_subfile:
                            frames.append(AnimationFrame(nbimages=0))
                            continue
                        sameoffset, left, top, right, bottom, nbframeimages = struct.unpack(
                            ">H4hH", raw[def_pos : def_pos + 12]
                        )
                        frame_sprites: list[FrameSprite] = [
                            FrameSprite(
                                val=0,
                                left=left,
                                top=top,
                                right=right,
                                bottom=bottom,
                                imgindex=0,
                            )
                        ]
                        sprite_pos = (
                            base_def_offset + sameoffset * 12
                            if sameoffset != 0
                            else def_pos + 12
                        )
                        for _ in range(nbframeimages):
                            if sprite_pos + 12 > end_of_subfile:
                                break
                            _imgnum, val, s_left, s_top, s_right, s_bottom, imgindex = struct.unpack(
                                ">BB4hH", raw[sprite_pos : sprite_pos + 12]
                            )
                            sprite_pos += 12
                            frame_sprites.append(
                                FrameSprite(
                                    val=val,
                                    left=s_left,
                                    top=s_top,
                                    right=s_right,
                                    bottom=s_bottom,
                                    imgindex=imgindex,
                                )
                            )
                        frames.append(AnimationFrame(nbimages=len(frame_sprites) - 1, images=frame_sprites))
            else:
                nbframes = 0

        if img_list_pos + 4 > end_of_subfile:
            return SubImagesData(
                fps1=fps1,
                fps2=fps2,
                nbframes=len(frames),
                frames=frames,
                nbimages=0,
                images=[],
            )

        nbimages, _nbimages_dup = struct.unpack(">HH", raw[img_list_pos : img_list_pos + 4])
        img_list_pos += 4

        if nbimages > 1000:
            raise TooManyImagesError(f"Too many images ({nbimages}) in off4 subfile.")

        images: list[SubImageDef] = []
        for _ in range(nbimages):
            if img_list_pos + 8 > end_of_subfile:
                break
            rel_off, width, height = struct.unpack(">IHH", raw[img_list_pos : img_list_pos + 8])
            img_list_pos += 8
            images.append(
                SubImageDef(
                    offset=fileoffset + rel_off,
                    width=width,
                    height=height,
                )
            )

        return SubImagesData(
            fps1=fps1,
            fps2=fps2,
            nbframes=len(frames),
            frames=frames,
            nbimages=len(images),
            images=images,
        )

    def _open_subsound(self, raw: bytes, fileoffset: int, filesize: int) -> SubSoundData:
        """Parse 'snd' / 'M*xx' audio header (YDKJUnit.pas openSubsound)."""
        if filesize < 64 or fileoffset + 64 > len(raw):
            return SubSoundData(
                aifc=False,
                offset=fileoffset,
                size=0,
                samples=0,
                bitrate=22254,
                frames=0,
                rate=0,
            )
        bitrate, = struct.unpack(">H", raw[fileoffset + 28 : fileoffset + 30])
        samples, frames, rate = struct.unpack(">IHH", raw[fileoffset + 42 : fileoffset + 50])
        compression = raw[fileoffset + 60 : fileoffset + 64]
        is_aifc = compression == b"ima4"

        return SubSoundData(
            aifc=is_aifc,
            offset=fileoffset + 84,
            size=max(0, filesize - 84),
            samples=samples,
            bitrate=bitrate,
            frames=frames,
            rate=rate,
        )

    def decode_image_buffer(
        self,
        raw_slice: memoryview | bytes,
        buflen: int,
        transparent_index: int,
    ) -> tuple[memoryview, set[int]]:
        """
        Decompress an RLE/LZ-compressed sprite buffer into palette indices
        (reproducing decodeImageBuffer in YDKJUnit.pas with slice-based optimization).
        """
        if len(raw_slice) < 307204:
            buf = bytearray(raw_slice) + bytearray(307204 - len(raw_slice))
        else:
            buf = raw_slice

        bitmap = self._bitmap_buf
        tile_out = self._tile_buf

        bitmap[0] = buf[0]
        bitmap[1] = buf[1]
        bitmap[2] = buf[2]
        l = 3
        pos = 3
        extrapixels = buf[0] - 2
        next_bg_idx = 2 + buf[1]

        while (l + extrapixels < buflen) and (l < 307200):
            flags = buf[pos]
            pos += 1
            if flags == 0 and l + 8 < 307500:
                bitmap[l : l + 8] = buf[pos : pos + 8]
                pos += 8
                l += 8
            else:
                for bit in range(7, -1, -1):
                    if not ((flags >> bit) & 1):
                        if l < 307500:
                            bitmap[l] = buf[pos]
                        pos += 1
                        l += 1
                    else:
                        info0 = buf[pos]
                        info1 = buf[pos + 1]
                        pos += 2
                        if (info1 & 0xF0) == 0:
                            count = buf[pos] + 18
                            pos += 1
                        else:
                            count = ((info1 & 0xF0) >> 4) + 2
                        dist = info0 + ((info1 & 0x0F) << 8)
                        offset = l - dist
                        if offset >= 0 and dist >= count and l + count <= 307500:
                            bitmap[l : l + count] = bitmap[offset : offset + count]
                            l += count
                        elif offset >= 0 and dist == 1 and l + count <= 307500:
                            bitmap[l : l + count] = bytes([bitmap[offset]]) * count
                            l += count
                        else:
                            for _ in range(count):
                                if l < 307500:
                                    bitmap[l] = bitmap[offset] if 0 <= offset < 307500 else 0
                                offset += 1
                                l += 1

            while next_bg_idx + 1 < l:
                extrapixels += bitmap[next_bg_idx] - 2
                next_bg_idx += 2 + bitmap[next_bg_idx + 1]

        limit = min(l, 307200)
        if transparent_index == 246 and buflen <= 307500:
            tile_out[:buflen] = self._trans_buf[:buflen]
        else:
            tile_out[:buflen] = bytes([transparent_index]) * buflen

        i = 0
        out_pos = 0
        while i < limit and out_pos < buflen:
            out_pos += bitmap[i]
            i += 1
            if i >= limit or out_pos >= buflen:
                break
            fg_len = bitmap[i]
            i += 1
            if fg_len > 0:
                copy_len = min(fg_len, limit - i, buflen - out_pos)
                tile_out[out_pos : out_pos + copy_len] = bitmap[i : i + copy_len]
                i += fg_len
                out_pos += fg_len

        return memoryview(tile_out)[:buflen], set()

    def export_subimages_to_gif(
        self,
        raw: bytes,
        ssf: SubSubFile,
        target_base_path: Path,
    ) -> None:
        """
        Export an 'off4' subfile into a sprite sheet (.gif) and animation definition (.js)
        (reproducing exportSubimagesToGif in YDKJUnit.pas).
        """
        si = ssf.data
        if si is None:
            si = self._open_subimages(raw, ssf.fileoffset, ssf.filesize)

        js_parts: list[str] = []

        if si.nbimages > 0:
            maxwidth = 0
            maxheight = 0
            for img in si.images:
                if VERTICAL_GIF:
                    if img.width > maxwidth:
                        maxwidth = img.width
                    maxheight += img.height
                else:
                    if img.height > maxheight:
                        maxheight = img.height
                    maxwidth += img.width

            if VERTICAL_GIF:
                maxheight += si.nbimages
            else:
                maxwidth += si.nbimages

            transparent_idx = 246
            sheet = bytearray([transparent_idx]) * (maxwidth * maxheight)

            js_parts.append("res['tiles']=new Array();")
            realx = 0
            realy = 0
            mv = memoryview(raw)

            for off4pos, img in enumerate(si.images):
                w = img.width
                h = img.height
                buflen = w * h
                raw_slice = mv[img.offset : img.offset + 307204]
                decoded_pixels, _ = self.decode_image_buffer(raw_slice, buflen, transparent_idx)

                js_parts.append(
                    f"res['tiles'][{off4pos}]={{x:{realx},y:{realy},w:{w},h:{h}}};"
                )

                # Copy tile into the sprite sheet canvas
                if VERTICAL_GIF and w == maxwidth and realx == 0:
                    dst_start = realy * maxwidth
                    sheet[dst_start : dst_start + buflen] = decoded_pixels
                else:
                    for row in range(h):
                        src_start = row * w
                        dst_start = (realy + row) * maxwidth + realx
                        sheet[dst_start : dst_start + w] = decoded_pixels[src_start : src_start + w]

                if VERTICAL_GIF:
                    realy += h + 1
                else:
                    realx += w + 1

            gif_out_path = target_base_path.with_suffix(".gif")
            gif_palette = list(self.palette_rgb)
            gif_palette[transparent_idx] = TRANSPARENT_RGB
            gif_bytes = encode_gif89a(
                width=maxwidth,
                height=maxheight,
                pixels=sheet,
                palette_rgb=gif_palette,
                transparent_index=transparent_idx,
            )
            gif_out_path.write_bytes(gif_bytes)

        # Build frame definitions JS
        frame_strs: list[str] = []
        for frame in si.frames:
            if frame.nbimages > 0:
                sprites_js = "".join(
                    f"{{v:{sp.val},l:{sp.left},t:{sp.top},r:{sp.right},b:{sp.bottom},i:{sp.imgindex}}},"
                    for sp in frame.images
                )
                frame_strs.append(
                    f"{{n:{frame.nbimages},f:{si.fps1},g:{si.fps2},l:[{sprites_js}]}},"
                )
            else:
                frame_strs.append(f"{{n:{frame.nbimages}}},")

        js_content = "".join(js_parts) + "\r\nres['frames']=[" + "".join(frame_strs) + "];\n"
        target_base_path.with_suffix(".js").write_text(js_content, encoding="utf-8")

    @staticmethod
    def build_subsound_bytes(raw: bytes, ssf: SubSubFile) -> tuple[bytes, str]:
        """
        Build an in-memory .aifc or .wav byte stream from an audio subfile
        (reproducing exportSubsoundToFile in YDKJUnit.pas).
        Returns (audio_bytes, extension).
        """
        ss = ssf.data
        assert isinstance(ss, SubSoundData)

        payload = raw[ss.offset : ss.offset + ss.size]
        size = len(payload)

        if ss.aifc:
            header = struct.pack(
                ">4sI8s8s4sIHIHHH6s8sI8s",
                b"FORM",
                size + 92,
                b"AIFCFVER",
                b"\x00\x00\x00\x04\xA2\x80\x51\x40",
                b"COMM",
                0x16,
                1,
                ss.samples,
                16,
                ss.frames,
                ss.rate,
                b"\x00" * 6,
                b"ima4SSND",
                size + 38,
                b"\x00" * 8,
            )
            return header + payload, ".aifc"
        else:
            header = struct.pack(
                "<4sI8sIHHH6sHH4sI",
                b"RIFF",
                size + 120,
                b"WAVEfmt ",
                16,
                1,
                1,
                ss.bitrate,
                b"\x00\x00\xC8\xAF\x00\x00",
                2,
                16,
                b"data",
                size,
            )
            swapped = bytearray(payload)
            even_len = size & ~1
            swapped[0:even_len:2], swapped[1:even_len:2] = (
                swapped[1:even_len:2],
                swapped[0:even_len:2],
            )
            return header + bytes(swapped), ".wav"

    @classmethod
    def export_subsound_to_file(
        cls,
        raw: bytes,
        ssf: SubSubFile,
        target_base_path: Path,
    ) -> Path:
        """
        Export an audio subfile to .aifc or .wav on disk (used when falling back to ffmpeg/avconv CLI).
        Returns the path to the written audio file.
        """
        audio_bytes, ext = cls.build_subsound_bytes(raw, ssf)
        out_path = target_base_path.with_suffix(ext)
        out_path.write_bytes(audio_bytes)
        return out_path

    @staticmethod
    def read_string(raw: bytes, ssf: SubSubFile) -> str:
        """Read a single MacRoman string (YDKJUnit.pas readString)."""
        chunk = memoryview(raw)[ssf.fileoffset : ssf.fileoffset + ssf.filesize]
        return decode_mac_string(chunk, stop_at_null=False)

    @staticmethod
    def export_stringlist(raw: bytes, ssf: SubSubFile) -> list[str]:
        """Read a null-separated string list (YDKJUnit.pas exportStringlist)."""
        chunk = raw[ssf.fileoffset : ssf.fileoffset + ssf.filesize]
        result: list[str] = []
        current: list[str] = []
        for b in chunk:
            if b != 0:
                if b == 10:
                    continue
                elif b == 13:
                    current.append("\n")
                else:
                    current.append(mac_to_utf8_char(b))
            else:
                if current:
                    result.append("".join(current))
                    current.clear()
        return result

    @staticmethod
    def export_stringlist1(raw: bytes, ssf: SubSubFile) -> list[list[str]]:
        """Read grouped null-separated word lists (YDKJUnit.pas exportStringlist1)."""
        chunk = raw[ssf.fileoffset : ssf.fileoffset + ssf.filesize]
        filesize = len(chunk)
        total: list[list[str]] = []
        current: list[str] = []
        i = 1
        while i < filesize:
            nbw = chunk[i]
            i += 1
            group: list[str] = []
            while i < filesize and nbw > 0:
                b = chunk[i]
                if b != 0:
                    if b == 10:
                        pass
                    elif b == 13:
                        current.append("\n")
                    else:
                        current.append(mac_to_utf8_char(b))
                else:
                    if current:
                        group.append("".join(current))
                        current.clear()
                        nbw -= 1
                i += 1
            total.append(group)
        return total

    @staticmethod
    def export_stringlist2(raw: bytes, ssf: SubSubFile) -> list[str]:
        """Read length-prefixed string list (YDKJUnit.pas exportStringlist2)."""
        chunk = raw[ssf.fileoffset : ssf.fileoffset + ssf.filesize]
        if len(chunk) < 2:
            return []
        nbstr = chunk[0] * 0xFF + chunk[1]
        i = 2
        result: list[str] = []
        while nbstr > 0 and i < len(chunk):
            strlength = chunk[i]
            i += 1
            part = decode_mac_string(chunk[i : i + strlength], stop_at_null=False)
            i += strlength
            result.append(part)
            nbstr -= 1
        return result

    @staticmethod
    def export_answers(raw: bytes, ssf: SubSubFile) -> list[int]:
        """Read answer index array (YDKJUnit.pas exportAnswers)."""
        chunk = raw[ssf.fileoffset : ssf.fileoffset + ssf.filesize]
        if len(chunk) < 4:
            return []
        nbans = (
            chunk[0] * 0xFFFFFF
            + chunk[1] * 0xFFFF
            + chunk[2] * 0xFF
            + chunk[3]
        )
        return [int(b) for b in chunk[4 : 4 + nbans]]

    @staticmethod
    def parse_qheader(raw: bytes, ssf: SubSubFile) -> QhdrRecord:
        """
        Parse question header subfile (combining YDKJUnit.pas exportQHeadersToFile
        and toolbox/import-csv.php transformation rules).
        """
        chunk = raw[ssf.fileoffset : ssf.fileoffset + ssf.filesize]

        q_id = decode_mac_string(chunk[2:6], stop_at_null=True).upper()
        value = int(chunk[8])
        qtype_num = int(chunk[9])
        qsubtype_num = int(chunk[11])
        title = decode_mac_string(chunk[16:81], stop_at_null=True)
        raw_filename = decode_mac_string(chunk[81:146], stop_at_null=True)
        answer_num = int(chunk[146])

        force = ""
        if ssf.filesize >= 152:
            force = decode_mac_string(chunk[150:153], stop_at_null=True)

        # Apply import-csv.php transformations
        folder = raw_filename.upper().replace(":", "/").replace(".SRF", "")
        qtype = QTYPE_MAP.get(qtype_num, "")
        qsubtype = QSUBTYPE_MAP.get(qsubtype_num, None)
        answer = None if answer_num == 0 else answer_num
        forcenext = force if force != "" else None

        return QhdrRecord(
            id=q_id,
            title=title,
            folder=folder,
            qtype=qtype,
            qsubtype=qsubtype,
            value=value,
            answer=answer,
            forcenext=forcenext,
        )


# =============================================================================
# 6. SQLite Database Initialization & Operations
# =============================================================================

def mariadb_dump_to_sqlite(sql: str) -> str:
    """
    Convert a phpMyAdmin MariaDB SQL dump (toolbox/ydkj<lang>_sta_res.sql)
    into SQLite-compatible SQL statements.
    """
    # 1. Extract PRIMARY KEY definitions from ALTER TABLE statements
    pks: dict[str, str] = {}
    for match in re.finditer(
        r"ALTER\s+TABLE\s+`?(\w+)`?\s+ADD\s+PRIMARY\s+KEY\s*\(([^)]+)\)\s*;",
        sql,
        re.IGNORECASE,
    ):
        pks[match.group(1)] = match.group(2)

    # 2. Remove ALTER TABLE ... ADD PRIMARY KEY statements
    sql = re.sub(
        r"ALTER\s+TABLE\s+`?\w+`?\s+ADD\s+PRIMARY\s+KEY\s*\([^)]+\)\s*;",
        "",
        sql,
        flags=re.IGNORECASE,
    )

    # 3. Remove MariaDB SET statements
    sql = re.sub(
        r"^\s*SET\s+.*?;\s*$",
        "",
        sql,
        flags=re.IGNORECASE | re.MULTILINE,
    )

    # 4. Replace START TRANSACTION with BEGIN TRANSACTION
    sql = re.sub(
        r"\bSTART\s+TRANSACTION\s*;",
        "BEGIN TRANSACTION;",
        sql,
        flags=re.IGNORECASE,
    )

    # 5. Replace MariaDB set(...) column types with TEXT
    sql = re.sub(r"\bset\s*\([^)]+\)", "TEXT", sql, flags=re.IGNORECASE)

    # 6. Inject PRIMARY KEY into CREATE TABLE and strip ENGINE=... suffix
    def _rewrite_create_table(m: re.Match) -> str:
        tbl_name = m.group(1)
        body = m.group(2).rstrip()
        if tbl_name in pks:
            body += f",\n  PRIMARY KEY ({pks[tbl_name]})"
        return f"CREATE TABLE `{tbl_name}` (\n{body}\n);"

    sql = re.sub(
        r"CREATE\s+TABLE\s+`?(\w+)`?\s*\((.*?)\)\s*ENGINE\s*=[^;]+;",
        _rewrite_create_table,
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    )
    return sql


def init_sqlite_database(db_path: Path, sql_template_path: Path) -> sqlite3.Connection:
    """Create and initialize the SQLite database from the MariaDB .sql file."""
    if not sql_template_path.is_file():
        raise FileNotFoundError(f"SQL template file not found: {sql_template_path}")

    if db_path.exists():
        db_path.unlink()

    raw_sql = sql_template_path.read_text(encoding="utf-8")
    sqlite_sql = mariadb_dump_to_sqlite(raw_sql)

    conn = sqlite3.connect(db_path)
    conn.executescript(sqlite_sql)
    conn.commit()
    return conn


# =============================================================================
# 7. Audio Conversion (PyAV In-Memory / convertwav.sh CLI) & Sound Scanning (scan-snd.php)
# =============================================================================

MP3_SUPPORTED_RATES = (8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000)


def is_pyav_available() -> bool:
    """Return True if PyAV ('av') is installed and provides libvorbis and libmp3lame encoders."""
    if av is None:
        return False
    try:
        codecs = getattr(av, "codecs_available", set())
        if codecs and not ({"libvorbis", "libmp3lame"} <= codecs):
            return False
        return True
    except Exception:
        return False


def find_audio_converter() -> str | None:
    """Locate external ffmpeg or avconv executable in PATH."""
    return shutil.which("ffmpeg") or shutil.which("avconv")


def detect_audio_backend() -> tuple[bool, str | None]:
    """
    Detect available audio conversion backends, prioritizing PyAV in-memory
    encoding with fallback to external ffmpeg/avconv CLI.
    Returns (use_pyav, cli_converter_path).
    """
    use_pyav = is_pyav_available()
    cli_bin = find_audio_converter()
    return use_pyav, cli_bin


def _normalize_resampled_frames(resampled: object) -> list:
    """Normalize the return value of AudioResampler.resample() across PyAV versions."""
    if resampled is None:
        return []
    if isinstance(resampled, list):
        return resampled
    return [resampled]


def _decode_subsound_to_full_frame(raw: bytes, ssf: SubSubFile) -> tuple[object, int]:
    """
    Decode an audio subfile ('snd ' or 'M*xx') into a single contiguous s16 mono
    PyAV AudioFrame covering the entire clip.
    Coalescing into a single frame avoids calling AudioResampler.resample() and
    raising internal EAGAIN exceptions thousands of times per file on 64-sample
    IMA4 ADPCM blocks.
    Returns (full_audio_frame, sample_rate).
    """
    ss = ssf.data
    assert isinstance(ss, SubSoundData)

    if not ss.aifc:
        # Uncompressed 16-bit big-endian Mac PCM: build the AudioFrame directly
        # without any container demuxer or codec decoder.
        payload = raw[ss.offset : ss.offset + ss.size]
        even_len = len(payload) & ~1
        if even_len == 0:
            pcm_le = b"\x00\x00"
            num_samples = 1
        else:
            swapped = bytearray(payload[:even_len])
            swapped[0:even_len:2], swapped[1:even_len:2] = (
                swapped[1:even_len:2],
                swapped[0:even_len:2],
            )
            pcm_le = bytes(swapped)
            num_samples = even_len // 2
        in_rate = int(ss.bitrate or 22050)
    else:
        # Apple QuickTime IMA4 ADPCM (.aifc): decode once into contiguous s16 PCM.
        aifc_bytes, _ = YdkjSrfExtractor.build_subsound_bytes(raw, ssf)
        with av.open(io.BytesIO(aifc_bytes), mode="r", format="aiff") as in_container:
            if not in_container.streams.audio:
                raise RuntimeError("No audio stream found in AIFC buffer.")
            in_stream = in_container.streams.audio[0]
            in_rate = int(in_stream.rate or 22050)
            pcm_chunks: list[bytes] = []
            total_samples = 0
            for frame in in_container.decode(in_stream):
                n = frame.samples
                if n > 0:
                    pcm_chunks.append(bytes(frame.planes[0])[: n * 2])
                    total_samples += n

        if total_samples == 0:
            pcm_le = b"\x00\x00"
            num_samples = 1
        else:
            pcm_le = b"".join(pcm_chunks)
            num_samples = total_samples

    full_frame = av.AudioFrame(format="s16", layout="mono", samples=num_samples)
    full_frame.sample_rate = in_rate
    full_frame.planes[0].update(pcm_le)
    return full_frame, in_rate


def _encode_full_frame_pyav(
    full_frame: object,
    in_rate: int,
    out_path: Path,
    container_fmt: str,
    codec_name: str,
    bitrate: int = 64000,
) -> None:
    """
    Resample a full-clip AudioFrame in a single pass and encode it directly
    to out_path (OGG/libvorbis or MP3/libmp3lame) using native C file I/O.
    """
    if codec_name == "libmp3lame":
        target_rate = min(MP3_SUPPORTED_RATES, key=lambda r: abs(r - in_rate))
    else:
        # libvorbis at 64 kbps mono requires sample rate >= 22050 Hz
        target_rate = in_rate if in_rate >= 22050 else 22050

    time_base = Fraction(1, target_rate)

    with av.open(str(out_path), mode="w", format=container_fmt) as out_container:
        out_stream = out_container.add_stream(codec_name, rate=target_rate)
        out_stream.layout = "mono"
        out_stream.bit_rate = bitrate
        out_stream.time_base = time_base
        out_stream.codec_context.time_base = time_base

        fmt_name = out_stream.format.name if out_stream.format else "fltp"
        layout_name = out_stream.layout.name if out_stream.layout else "mono"

        # Note: libvorbisenc sets codec_context.frame_size = 64 as a minimum block stub;
        # use 1024-sample frames for Vorbis so resampling and encoding run in normal chunks.
        enc_frame_size = out_stream.codec_context.frame_size
        if not enc_frame_size or enc_frame_size < 256:
            enc_frame_size = 1024

        try:
            resampler = av.AudioResampler(
                format=fmt_name,
                layout=layout_name,
                rate=target_rate,
                frame_size=enc_frame_size,
            )
        except TypeError:
            resampler = av.AudioResampler(
                format=fmt_name,
                layout=layout_name,
                rate=target_rate,
            )

        # Assign contiguous sample PTS and time_base so libvorbisenc's AudioFrameQueue
        # outputs exact Vorbis packet PTS/durations and the Ogg muxer writes the true
        # total sample count into the Ogg page granule_pos (instead of 64 * num_packets).
        full_frame.pts = 0  # type: ignore[attr-defined]
        full_frame.time_base = Fraction(1, in_rate)  # type: ignore[attr-defined]
        pts = 0

        for r_frame in _normalize_resampled_frames(resampler.resample(full_frame)):
            r_frame.pts = pts
            r_frame.time_base = time_base
            pts += r_frame.samples
            for packet in out_stream.encode(r_frame):
                out_container.mux(packet)

        # Flush resampler
        for r_frame in _normalize_resampled_frames(resampler.resample(None)):
            r_frame.pts = pts
            r_frame.time_base = time_base
            pts += r_frame.samples
            for packet in out_stream.encode(r_frame):
                out_container.mux(packet)

        # Flush encoder
        for packet in out_stream.encode(None):
            out_container.mux(packet)


def convert_subsound_pyav(
    raw: bytes,
    ssf: SubSubFile,
    out_base: Path,
    fallback_cli: str | None = None,
) -> None:
    """
    Extract and encode a subsound directly from the .SRF buffer in memory to
    64k Vorbis (.ogg) and 64k MP3 (.mp3) using PyAV, with fallback to external
    ffmpeg/avconv CLI if available.
    """
    ogg_path = out_base.with_suffix(".ogg")
    mp3_path = out_base.with_suffix(".mp3")

    try:
        full_frame, in_rate = _decode_subsound_to_full_frame(raw, ssf)
        _encode_full_frame_pyav(full_frame, in_rate, ogg_path, "ogg", "libvorbis", bitrate=64000)
        _encode_full_frame_pyav(full_frame, in_rate, mp3_path, "mp3", "libmp3lame", bitrate=64000)
    except Exception as exc:
        if fallback_cli is not None:
            extract_and_convert_subsound_cli(raw, ssf, out_base, fallback_cli)
        else:
            raise RuntimeError(
                f"PyAV audio conversion failed for '{out_base.name}': {exc}"
            ) from exc


_WORKER_EXTRACTOR: YdkjSrfExtractor | None = None


def export_subimages_worker(
    subchunk: bytes,
    subname: int,
    out_base: Path,
    palette_rgb: list[tuple[int, int, int]],
) -> None:
    """
    Multiprocessing worker entry point for 'off4' image extraction and GIF encoding.
    Receives only the sliced 'off4' subfile bytes and reuses a process-local
    YdkjSrfExtractor instance across calls.
    """
    global _WORKER_EXTRACTOR
    if _WORKER_EXTRACTOR is None:
        _WORKER_EXTRACTOR = YdkjSrfExtractor(palette_rgb)
    size = len(subchunk)
    si = _WORKER_EXTRACTOR._open_subimages(subchunk, 0, size)
    ssf_zero = SubSubFile(subname=subname, fileoffset=0, filesize=size, data=si)
    _WORKER_EXTRACTOR.export_subimages_to_gif(subchunk, ssf_zero, out_base)


def convert_subsound_pyav_worker(
    payload_bytes: bytes,
    subname: int,
    aifc: bool,
    samples: int,
    bitrate: int,
    frames: int,
    rate: int,
    out_base: Path,
    fallback_cli: str | None = None,
) -> None:
    """
    Multiprocessing worker entry point for PyAV audio conversion.
    Receives only the sliced audio payload (rather than the entire .SRF archive)
    and runs in its own process with an independent GIL.
    """
    size = len(payload_bytes)
    ss_zero = SubSoundData(
        aifc=aifc,
        offset=0,
        size=size,
        samples=samples,
        bitrate=bitrate,
        frames=frames,
        rate=rate,
    )
    ssf_zero = SubSubFile(
        subname=subname,
        fileoffset=0,
        filesize=size,
        data=ss_zero,
    )
    convert_subsound_pyav(payload_bytes, ssf_zero, out_base, fallback_cli)


def convert_subsound_cli_worker(
    payload_bytes: bytes,
    subname: int,
    aifc: bool,
    samples: int,
    bitrate: int,
    frames: int,
    rate: int,
    out_base: Path,
    converter_bin: str,
) -> None:
    """
    Multiprocessing worker entry point for external CLI (ffmpeg/avconv) audio conversion.
    """
    size = len(payload_bytes)
    ss_zero = SubSoundData(
        aifc=aifc,
        offset=0,
        size=size,
        samples=samples,
        bitrate=bitrate,
        frames=frames,
        rate=rate,
    )
    ssf_zero = SubSubFile(
        subname=subname,
        fileoffset=0,
        filesize=size,
        data=ss_zero,
    )
    extract_and_convert_subsound_cli(payload_bytes, ssf_zero, out_base, converter_bin)


def extract_and_convert_subsound_cli(
    raw: bytes,
    ssf: SubSubFile,
    out_base: Path,
    converter_bin: str,
) -> None:
    """
    Write temporary .wav/.aifc file, convert it to .ogg and .mp3 via external
    ffmpeg/avconv CLI, and immediately remove the temporary file.
    """
    tmp_src = YdkjSrfExtractor.export_subsound_to_file(raw, ssf, out_base)
    convert_single_audio_file(converter_bin, tmp_src)


def convert_single_audio_file(converter_bin: str, src_file: Path) -> None:
    """
    Convert a single .wav or .aifc file on disk to 64k Vorbis (.ogg) and 64k MP3 (.mp3),
    then delete the original .wav/.aifc file (matching toolbox/convertwav.sh).
    """
    ogg_path = src_file.with_suffix(".ogg")
    mp3_path = src_file.with_suffix(".mp3")

    cmd = [
        converter_bin,
        "-y",
        "-loglevel", "error",
        "-i", str(src_file),
        "-b:a", "64k",
        "-f", "ogg",
        "-acodec", "libvorbis",
        str(ogg_path),
        "-b:a", "64k",
        "-f", "mp3",
        "-acodec", "libmp3lame",
        str(mp3_path),
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        raise RuntimeError(
            f"Audio conversion failed for '{src_file.name}': {res.stderr.strip()}"
        )
    src_file.unlink(missing_ok=True)


def resolve_case_insensitive_path(base_dir: Path, rel_folder: str) -> Path | None:
    """
    Resolve a relative path under base_dir, falling back to case-insensitive
    matching so scan-snd works identically on Linux (case-sensitive) and Windows.
    """
    direct = base_dir / rel_folder
    if direct.is_dir():
        return direct

    current = base_dir
    for part in rel_folder.strip("/").split("/"):
        if not current.is_dir():
            return None
        part_upper = part.upper()
        match = next(
            (child for child in current.iterdir() if child.name.upper() == part_upper),
            None,
        )
        if match is None:
            return None
        current = match

    return current if current.is_dir() else None


def scan_sound_files(
    conn: sqlite3.Connection,
    target_dir: Path,
    progress: ProgressReporter,
) -> None:
    """
    Scan generated .ogg files and update the `ressnd` table in SQLite
    (reproducing toolbox/scan-snd.php).
    """
    cur = conn.cursor()
    conditions = [
        "resfolder NOT LIKE '5QDemo/%'",
        "resfolder NOT LIKE 'GROOVES/GROOVE%/%'",
    ] + [
        f"resfolder NOT LIKE '%{suffix}'" for suffix in SCAN_SND_EXCLUDED_SUFFIXES
    ]
    query = f"SELECT grp, name, variantType, variantValue, resfolder FROM ressnd WHERE {' AND '.join(conditions)}"
    rows = cur.fetchall() if cur.execute(query) else []

    total = len(rows)
    updated_count = 0
    missing_folders: list[str] = []

    for idx, (grp, name, variant_type, variant_value, resfolder) in enumerate(rows, 1):
        progress.update(idx, total, f"Checking {resfolder}")
        folder_path = resolve_case_insensitive_path(target_dir, resfolder)

        if folder_path is None:
            missing_folders.append(resfolder)
            continue

        entries = list(folder_path.iterdir())
        if not entries:
            missing_folders.append(resfolder)
            continue

        ids: list[int] = []
        for entry in entries:
            if entry.is_file() and entry.name.lower().endswith(".ogg"):
                stem = entry.name[:-4]
                try:
                    file_id = int(stem)
                except ValueError:
                    continue
                if file_id < 1000:
                    ids.append(file_id)

        if ids:
            ids_sorted = sorted(set(ids))
            id_list_str = ",".join(str(i) for i in ids_sorted)
            cur.execute(
                """
                UPDATE ressnd
                   SET val = ?
                 WHERE grp = ?
                   AND name = ?
                   AND variantType = ?
                   AND variantValue = ?
                """,
                (id_list_str, grp, name, variant_type, variant_value),
            )
            updated_count += 1

    conn.commit()
    progress.info(f"Sound check complete: {updated_count}/{total} ressnd entries updated.")
    if missing_folders:
        unique_missing = sorted(set(missing_folders))
        progress.warn(
            f"{len(unique_missing)} sound folder(s) not found during scan: "
            + ", ".join(unique_missing)
        )


# =============================================================================
# 8. Main Conversion Pipeline
# =============================================================================

def detect_language_from_entries(srf_entries: list[SrfEntry]) -> tuple[str | None, str | None]:
    """
    Auto-detect game language from the MD5 hash of QHEADERS.SRF.
    Returns (detected_lang, md5_hex).
    """
    qheader_entries = [
        e for e in srf_entries if Path(e.rel_path).name.upper() == "QHEADERS.SRF"
    ]
    # Prefer root-level QHEADERS.SRF first
    qheader_entries.sort(key=lambda e: ("/" in e.rel_path, e.rel_path))

    first_md5: str | None = None
    for entry in qheader_entries:
        try:
            raw = entry.loader()
        except Exception:
            continue
        md5_hex = hashlib.md5(raw).hexdigest().lower()
        if first_md5 is None:
            first_md5 = md5_hex
        if md5_hex in QHEADERS_MD5_TO_LANG:
            return QHEADERS_MD5_TO_LANG[md5_hex], md5_hex

    return None, first_md5


def parse_qheaders_from_entries(
    srf_entries: list[SrfEntry],
    extractor: YdkjSrfExtractor,
) -> dict[str, QhdrRecord]:
    """
    Locate QHEADERS.SRF in srf_entries and parse all question header records,
    returning a mapping of uppercase question ID -> QhdrRecord.
    """
    qheader_entries = [
        e for e in srf_entries if Path(e.rel_path).name.upper() == "QHEADERS.SRF"
    ]
    qheader_entries.sort(key=lambda e: ("/" in e.rel_path, e.rel_path))

    records: dict[str, QhdrRecord] = {}
    for entry in qheader_entries:
        try:
            raw = entry.loader()
            groups = extractor.parse_srf(raw)
        except Exception:
            continue
        for group in groups:
            if extractor.filetype(group.ftype) == "qheaders":
                for ssf in group.subfiles:
                    rec = extractor.parse_qheader(raw, ssf)
                    uid = rec.id.upper()
                    if uid not in records:
                        records[uid] = rec
        if records:
            break

    return records


def merge_extra_question_entries(
    primary_entries: list[SrfEntry],
    extra_entries: list[SrfEntry],
    extractor: YdkjSrfExtractor,
    extra_source_label: str,
    progress: ProgressReporter,
) -> tuple[list[SrfEntry], list[QhdrRecord]]:
    """
    Compare QHEADERS.SRF between primary_entries and extra_entries (in either
    direction). Any question present in extra_entries whose ID does not exist
    in primary_entries is remapped to EXTRA_QUESTIONS_FOLDER/<ID> (e.g. QFOLD99/<ID>)
    for both asset/string extraction and qhdr database insertion.
    """
    primary_qheaders = parse_qheaders_from_entries(primary_entries, extractor)
    extra_qheaders = parse_qheaders_from_entries(extra_entries, extractor)

    if not extra_qheaders:
        progress.warn(
            f"No valid 'QHEADERS.SRF' records found in extra source '{extra_source_label}'."
        )
        return primary_entries, []

    extra_by_folder: dict[str, SrfEntry] = {}
    extra_by_qfold_stem: dict[str, SrfEntry] = {}
    for entry in extra_entries:
        norm_folder = entry.rel_folder.replace("\\", "/").strip("/").upper()
        extra_by_folder[norm_folder] = entry
        if norm_folder.startswith("QFOLD"):
            stem = Path(entry.rel_path).stem.upper()
            extra_by_qfold_stem.setdefault(stem, entry)

    added_srf_entries: list[SrfEntry] = []
    added_qhdr_records: list[QhdrRecord] = []

    for qid, qrec in extra_qheaders.items():
        if qid in primary_qheaders:
            continue

        orig_folder = qrec.folder.replace("\\", "/").strip("/").upper()
        src_entry = extra_by_folder.get(orig_folder) or extra_by_qfold_stem.get(qid)
        if src_entry is None:
            progress.warn(
                f"Extra question '{qid}' ('{qrec.folder}') not found in '{extra_source_label}'; skipping."
            )
            continue

        new_folder = f"{EXTRA_QUESTIONS_FOLDER}/{qid}"
        added_srf_entries.append(
            SrfEntry(
                rel_path=f"{new_folder}.SRF",
                loader=src_entry.loader,
            )
        )
        added_qhdr_records.append(
            QhdrRecord(
                id=qid,
                title=qrec.title,
                folder=new_folder,
                qtype=qrec.qtype,
                qsubtype=qrec.qsubtype,
                value=qrec.value,
                answer=qrec.answer,
                forcenext=qrec.forcenext,
            )
        )

    if added_qhdr_records:
        ids_preview = ", ".join(r.id for r in added_qhdr_records)
        progress.info(
            f"Found {len(added_qhdr_records)} additional question(s) in '{extra_source_label}' "
            f"-> mapped to '{EXTRA_QUESTIONS_FOLDER}/' ({ids_preview})."
        )
    else:
        progress.info(
            f"No additional questions found in '{extra_source_label}' (all question IDs already exist in primary source)."
        )

    return primary_entries + added_srf_entries, added_qhdr_records


def run_extraction(
    source_path: Path,
    target_dir: Path,
    lang: str | None = None,
    extra_source_path: Path | None = None,
) -> int:
    progress = ProgressReporter()

    # Check audio conversion backend availability right at the start of the script
    # (prioritizing PyAV in-memory encoding, with fallback to external ffmpeg/avconv CLI).
    use_pyav, converter_bin = detect_audio_backend()
    if not use_pyav and converter_bin is None:
        print(
            "Error: No audio conversion backend available. "
            "Please install PyAV ('pip install av', preferred for in-memory encoding) "
            "or install 'ffmpeg' / 'avconv' and ensure it is in your PATH.",
            file=sys.stderr,
        )
        return 1

    if use_pyav:
        progress.info("Audio backend: PyAV (direct in-memory encoding).")
    else:
        progress.info(f"Audio backend: external CLI ('{converter_bin}').")

    iso_reader: Iso9660Reader | None = None
    extra_iso_reader: Iso9660Reader | None = None
    conn: sqlite3.Connection | None = None

    try:
        if source_path.is_file():
            iso_reader = Iso9660Reader(source_path)
            srf_entries = iso_reader.list_srf_entries()
        elif source_path.is_dir():
            srf_entries = collect_directory_srf_entries(source_path)
        else:
            print(f"Error: Source path '{source_path}' does not exist.", file=sys.stderr)
            return 1

        if not srf_entries:
            progress.warn("No .SRF files found in the specified source.")
            return 1

        extra_srf_entries: list[SrfEntry] = []
        if extra_source_path is not None:
            if extra_source_path.is_file():
                extra_iso_reader = Iso9660Reader(extra_source_path)
                extra_srf_entries = extra_iso_reader.list_srf_entries()
            elif extra_source_path.is_dir():
                extra_srf_entries = collect_directory_srf_entries(extra_source_path)
            else:
                print(
                    f"Error: Extra source path '{extra_source_path}' does not exist.",
                    file=sys.stderr,
                )
                return 1

            if not extra_srf_entries:
                progress.warn(f"No .SRF files found in extra source '{extra_source_path}'.")
                return 1

        # Auto-detect language from QHEADERS.SRF MD5 if not specified on CLI
        if not lang:
            detected_lang, md5_hex = detect_language_from_entries(srf_entries)
            if detected_lang is None:
                if md5_hex is None:
                    progress.error(
                        "Language was not specified and 'QHEADERS.SRF' was not found for auto-detection."
                    )
                else:
                    progress.error(
                        f"Language was not specified and 'QHEADERS.SRF' MD5 ({md5_hex}) is unknown."
                    )
                return 1
            lang = detected_lang
            progress.info(f"Auto-detected language '{lang}' from QHEADERS.SRF (MD5: {md5_hex}).")

        # Locate SQL initialization file using top-level configuration constants
        sql_filename = SQL_FILENAME_TEMPLATE.format(lang=lang)
        sql_path = SQL_DIR / sql_filename
        if not sql_path.is_file():
            sql_path = Path.cwd() / "toolbox" / sql_filename
        if not sql_path.is_file():
            print(f"Error: SQL schema file not found at '{sql_path}'.", file=sys.stderr)
            return 1

        target_dir.mkdir(parents=True, exist_ok=True)
        db_path = target_dir / "ydkj_sta.sqlite"

        # Stage 1: Database initialization
        progress.stage(1, 3, f"Initializing SQLite database '{db_path.name}' from '{sql_path.name}'...")
        conn = init_sqlite_database(db_path, sql_path)
        cur = conn.cursor()
        cur.execute("DELETE FROM qhdr")
        cur.execute("DELETE FROM strings")
        conn.commit()

        # Stage 2: Extract .SRF files (including on-the-fly parallel image & audio conversion)
        mode_desc = "in-memory PyAV" if use_pyav else f"CLI ({Path(converter_bin).name})"
        progress.stage(2, 3, f"Extracting .SRF archives and converting images & audio ({mode_desc})...")
        qhdr_rows: list[QhdrRecord] = []
        strings_rows: list[tuple[str, str]] = []
        total_images_converted = 0
        total_audio_converted = 0
        task_errors: list[str] = []

        palette_rgb = load_palette(SCRIPT_DIR)
        extractor = YdkjSrfExtractor(palette_rgb)

        extra_qhdr_rows: list[QhdrRecord] = []
        if extra_source_path is not None and extra_srf_entries:
            srf_entries, extra_qhdr_rows = merge_extra_question_entries(
                srf_entries,
                extra_srf_entries,
                extractor,
                extra_source_path.name,
                progress,
            )

        progress.info(f"Found {len(srf_entries)} .SRF archive(s) to extract.")

        max_workers = min(16, (os.cpu_count() or 4))
        total_srf = len(srf_entries)

        with ProcessPoolExecutor(max_workers=max_workers) as pool:
            for idx, entry in enumerate(srf_entries, 1):
                progress.update(idx, total_srf, entry.rel_path)
                srf_strings: list[dict[str, object]] = []
                srf_task_futures: dict = {}

                try:
                    raw_bytes = entry.loader()
                    groups = extractor.parse_srf(raw_bytes)

                    for group in groups:
                        ftype = group.ftype
                        category = extractor.filetype(ftype)
                        if not category:
                            continue

                        for ssf in group.subfiles:
                            if category == "string":
                                srf_strings.append({
                                    "id": ssf.subname,
                                    "type": ftype,
                                    "data": extractor.read_string(raw_bytes, ssf),
                                })
                            elif category == "stringlist":
                                srf_strings.append({
                                    "id": ssf.subname,
                                    "type": ftype,
                                    "data": extractor.export_stringlist(raw_bytes, ssf),
                                })
                            elif category == "stringlist1":
                                srf_strings.append({
                                    "id": ssf.subname,
                                    "type": ftype,
                                    "data": extractor.export_stringlist1(raw_bytes, ssf),
                                })
                            elif category == "stringlist2":
                                srf_strings.append({
                                    "id": ssf.subname,
                                    "type": ftype,
                                    "data": extractor.export_stringlist2(raw_bytes, ssf),
                                })
                            elif category == "answers":
                                srf_strings.append({
                                    "id": ssf.subname,
                                    "type": ftype,
                                    "data": extractor.export_answers(raw_bytes, ssf),
                                })
                            elif category == "qheaders":
                                qhdr_rows.append(extractor.parse_qheader(raw_bytes, ssf))
                            elif category in ("subimages", "subsound"):
                                out_folder = (
                                    target_dir
                                    / entry.rel_folder
                                    / remove_spaces_and_hash(ftype)
                                )
                                out_folder.mkdir(parents=True, exist_ok=True)
                                out_base = out_folder / str(ssf.subname)

                                if category == "subimages":
                                    subchunk = raw_bytes[
                                        ssf.fileoffset : ssf.fileoffset + ssf.filesize
                                    ]
                                    fut = pool.submit(
                                        export_subimages_worker,
                                        subchunk,
                                        ssf.subname,
                                        out_base,
                                        palette_rgb,
                                    )
                                    srf_task_futures[fut] = "image"
                                elif category == "subsound":
                                    ss = ssf.data
                                    assert isinstance(ss, SubSoundData)
                                    payload_slice = raw_bytes[ss.offset : ss.offset + ss.size]
                                    if use_pyav:
                                        fut = pool.submit(
                                            convert_subsound_pyav_worker,
                                            payload_slice,
                                            ssf.subname,
                                            ss.aifc,
                                            ss.samples,
                                            ss.bitrate,
                                            ss.frames,
                                            ss.rate,
                                            out_base,
                                            converter_bin,
                                        )
                                    else:
                                        assert converter_bin is not None
                                        fut = pool.submit(
                                            convert_subsound_cli_worker,
                                            payload_slice,
                                            ssf.subname,
                                            ss.aifc,
                                            ss.samples,
                                            ss.bitrate,
                                            ss.frames,
                                            ss.rate,
                                            out_base,
                                            converter_bin,
                                        )
                                    srf_task_futures[fut] = "audio"

                    # Wait for all image and audio tasks of the current .SRF file to complete
                    # before moving on to the next .SRF file, freeing memory/disk immediately.
                    if srf_task_futures:
                        total_srf_tasks = len(srf_task_futures)
                        done_srf_tasks = 0
                        progress.update(
                            idx,
                            total_srf,
                            f"{entry.rel_path} (0/{total_srf_tasks})",
                        )
                        for fut in as_completed(srf_task_futures):
                            kind = srf_task_futures[fut]
                            done_srf_tasks += 1
                            if kind == "audio":
                                total_audio_converted += 1
                            else:
                                total_images_converted += 1
                            progress.update(
                                idx,
                                total_srf,
                                f"{entry.rel_path} ({done_srf_tasks}/{total_srf_tasks})",
                            )
                            exc = fut.exception()
                            if exc is not None:
                                task_errors.append(f"{entry.rel_path}: {exc}")
                        srf_task_futures.clear()

                except TooManyImagesError:
                    pass
                except Exception as exc:
                    progress.warn(f"Could not process '{entry.rel_path}' ({type(exc).__name__}: {exc})")

                if srf_strings:
                    folder_key = entry.rel_folder.replace("\\", "/").strip("/")
                    json_payload = json.dumps(srf_strings, ensure_ascii=False)
                    strings_rows.append((folder_key, json_payload))

        if task_errors:
            for err in task_errors[:10]:
                progress.error(err)
            if len(task_errors) > 10:
                progress.error(f"... and {len(task_errors) - 10} more conversion errors.")
            conn.close()
            return 1

        # Write qhdr and strings rows to SQLite (deduplicating qhdr by uppercase ID)
        if extra_qhdr_rows:
            qhdr_rows.extend(extra_qhdr_rows)

        unique_qhdr: dict[str, QhdrRecord] = {}
        for r in qhdr_rows:
            uid = r.id.upper()
            if uid not in unique_qhdr:
                unique_qhdr[uid] = r

        if unique_qhdr:
            cur.executemany(
                """
                INSERT OR IGNORE INTO qhdr
                    (id, title, folder, qtype, qsubtype, value, answer, forcenext)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        uid,
                        r.title,
                        r.folder,
                        r.qtype,
                        r.qsubtype,
                        r.value,
                        r.answer,
                        r.forcenext,
                    )
                    for uid, r in unique_qhdr.items()
                ],
            )
        if strings_rows:
            cur.executemany(
                "INSERT OR REPLACE INTO strings (folder, strings) VALUES (?, ?)",
                strings_rows,
            )
        conn.commit()
        progress.info(
            f"Extracted {total_srf} .SRF archive(s), converted {total_images_converted} image sheet(s) to GIF "
            f"and {total_audio_converted} audio stream(s) to OGG & MP3, "
            f"and inserted {len(unique_qhdr)} question header(s) and {len(strings_rows)} string archive(s) into SQLite."
        )

    finally:
        if iso_reader is not None:
            iso_reader.close()
        if extra_iso_reader is not None:
            extra_iso_reader.close()

    # Stage 3: Scan OGG files and update ressnd table
    progress.stage(3, 3, "Scanning generated .ogg files and updating 'ressnd' table...")
    scan_sound_files(conn, target_dir, progress)

    conn.close()
    progress.clear_line()
    print(f"Conversion completed successfully. Database saved to: {db_path}", flush=True)
    return 0


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="YDKJ_extractor.py",
        description="Extract YDKJ (.SRF) resources from a directory or ISO image into web assets and a SQLite database.",
    )
    parser.add_argument(
        "source",
        type=Path,
        help="Source directory containing .SRF files, or path to a .iso image file",
    )
    parser.add_argument(
        "target",
        type=Path,
        help="Target directory where extracted assets and the SQLite database will be written",
    )
    parser.add_argument(
        "lang",
        nargs="?",
        default=None,
        type=str.lower,
        choices=SUPPORTED_LANGUAGES,
        help="Optional game language code (de, fr, uk, us); auto-detected from QHEADERS.SRF MD5 if omitted",
    )
    parser.add_argument(
        "--extra-source",
        type=Path,
        default=None,
        dest="extra_source",
        help=(
            "Optional secondary source directory or .iso image from which questions "
            f"absent in the primary source will be extracted into '{EXTRA_QUESTIONS_FOLDER}/<ID>'"
        ),
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    return run_extraction(args.source, args.target, args.lang, args.extra_source)


if __name__ == "__main__":
    sys.exit(main())
