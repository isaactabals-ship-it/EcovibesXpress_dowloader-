import os
import re
import sys
import json
import yt_dlp

# Project root is one level above backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "downloads")
FFMPEG_DIR = os.path.join(BASE_DIR, "ffmpeg")

# Resolution → yt-dlp format selector (Flexible, letting FFmpeg handle MP4 conversion)
QUALITY_MAP = {
    "best":  "bestvideo+bestaudio/best",
    "4k":    "bestvideo[height<=2160]+bestaudio/best[height<=2160]",
    "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
    "720p":  "bestvideo[height<=720]+bestaudio/best[height<=720]",
    "480p":  "bestvideo[height<=480]+bestaudio/best[height<=480]",
    "360p":  "bestvideo[height<=360]+bestaudio/best[height<=360]",
}

AUDIO_FORMAT = "bestaudio/best"


class DownloadManager:
    def __init__(self):
        self.output_dir = OUTPUT_DIR
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        # task_id -> list of event dicts
        self._events: dict[str, list] = {}

    # ── Internal event helpers ──────────────────────────────────────────────

    def _push(self, task_id: str, event: dict):
        if task_id not in self._events:
            self._events[task_id] = []
        self._events[task_id].append(event)

    def get_events(self, task_id: str, from_idx: int = 0) -> list:
        return self._events.get(task_id, [])[from_idx:]

    # ── Metadata ────────────────────────────────────────────────────────────

    def get_info(self, url: str) -> dict:
        opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": "in_playlist",
            "skip_download": True,
        }
        if self._ffmpeg_path():
            opts["ffmpeg_location"] = self._ffmpeg_path()

        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)

        is_playlist = info.get("_type") == "playlist"
        entries = info.get("entries", [])

        return {
            "title":       info.get("title", "Unknown"),
            "uploader":    info.get("uploader", ""),
            "thumbnail":   info.get("thumbnail", ""),
            "duration":    info.get("duration"),
            "is_playlist": is_playlist,
            "count":       len(entries) if is_playlist else 1,
            "url":         url,
        }

    # ── Download ────────────────────────────────────────────────────────────

    def download(self, task_id: str, url: str, fmt: str, quality: str):
        try:
            info = self.get_info(url)
            is_playlist = info["is_playlist"]

            if is_playlist:
                safe_title = self._safe_name(info["title"])
                out_dir = os.path.join(self.output_dir, safe_title)
                os.makedirs(out_dir, exist_ok=True)
                outtmpl = os.path.join(out_dir, "%(playlist_index)s - %(title)s.%(ext)s")
            else:
                outtmpl = os.path.join(self.output_dir, "%(title)s.%(ext)s")

            if fmt == "audio":
                format_sel = AUDIO_FORMAT
                postprocessors = [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }]
                ext_note = "mp3"
            else:
                format_sel = QUALITY_MAP.get(quality, QUALITY_MAP["best"])
                postprocessors = [{
                    "key": "FFmpegVideoConvertor",
                    "preferedformat": "mp4",
                }]
                ext_note = "mp4"

            # Build yt-dlp options
            opts = {
                "format":          format_sel,
                "outtmpl":         outtmpl,
                "postprocessors":  postprocessors,
                "quiet":           True,
                "no_warnings":     True,
                "progress_hooks":  [self._make_hook(task_id, info)],
                "noplaylist":      not is_playlist,
            }

            if fmt == "video":
                opts["merge_output_format"] = "mp4"

            ffmpeg = self._ffmpeg_path()
            if ffmpeg:
                opts["ffmpeg_location"] = ffmpeg

            # Notify start
            self._push(task_id, {
                "status": "start",
                "title":  info["title"],
                "count":  info.get("count", 1),
                "format": fmt,
                "quality": quality,
            })

            with yt_dlp.YoutubeDL(opts) as ydl:
                ydl.download([url])

            self._push(task_id, {"status": "done", "title": info["title"]})

        except Exception as exc:
            self._push(task_id, {"status": "error", "message": str(exc)})

    # ── Progress hook ───────────────────────────────────────────────────────

    def _make_hook(self, task_id: str, meta: dict):
        def hook(d):
            if d["status"] == "downloading":
                total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
                downloaded = d.get("downloaded_bytes", 0)
                percent = round((downloaded / total * 100), 1) if total else 0
                self._push(task_id, {
                    "status":    "downloading",
                    "percent":   percent,
                    "speed":     d.get("speed"),
                    "eta":       d.get("eta"),
                    "filename":  d.get("filename", ""),
                })
            elif d["status"] == "finished":
                self._push(task_id, {
                    "status":   "processing",
                    "filename": d.get("filename", ""),
                })
        return hook

    # ── Helpers ─────────────────────────────────────────────────────────────

    def _ffmpeg_path(self) -> str | None:
        """Return path to FFmpeg binary if packaged locally."""
        candidate = os.path.join(FFMPEG_DIR, "ffmpeg.exe")
        if os.path.isfile(candidate):
            return FFMPEG_DIR
        # Fall back to system PATH
        return None

    @staticmethod
    def _safe_name(name: str) -> str:
        return re.sub(r'[\\/*?:"<>|]', "_", name).strip()
