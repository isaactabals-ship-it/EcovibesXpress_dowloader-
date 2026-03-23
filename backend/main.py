import uuid
import asyncio
import os
import json
import subprocess
from threading import Thread
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from downloader import DownloadManager

app = FastAPI(title="EcovibesXpress API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:322"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global download manager
manager = DownloadManager()


# ── Models ────────────────────────────────────────────────────────────────────

class DownloadRequest(BaseModel):
    url: str
    format: str = "video"   # "video" | "audio"
    quality: str = "best"   # "best" | "4k" | "1080p" | "720p" | "480p" | "360p"


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


# ── Metadata ──────────────────────────────────────────────────────────────────

@app.get("/api/info")
async def get_info(url: str):
    """Fetch video/playlist metadata without downloading."""
    try:
        info = await asyncio.to_thread(manager.get_info, url)
        return info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Download ──────────────────────────────────────────────────────────────────

@app.post("/api/download")
async def start_download(req: DownloadRequest):
    """Start a download task. Returns task_id for progress tracking."""
    task_id = str(uuid.uuid4())
    thread = Thread(
        target=manager.download,
        args=(task_id, req.url, req.format, req.quality),
        daemon=True,
    )
    thread.start()
    return {"task_id": task_id}


# ── SSE Progress ──────────────────────────────────────────────────────────────

@app.get("/api/progress/{task_id}")
async def progress(task_id: str):
    """Server-Sent Events stream for real-time download progress."""

    async def event_generator():
        last_idx = 0
        while True:
            events = manager.get_events(task_id, last_idx)
            for i, event in enumerate(events):
                last_idx += 1
                data = json.dumps(event)
                yield f"data: {data}\n\n"
                if event.get("status") in ("done", "error"):
                    return
            await asyncio.sleep(0.3)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ── Downloads list ─────────────────────────────────────────────────────────────

@app.get("/api/downloads")
def list_downloads():
    """Return list of completed downloads from the downloads folder."""
    downloads_dir = manager.output_dir
    files = []
    try:
        for root, dirs, filenames in os.walk(downloads_dir):
            for fname in filenames:
                if fname.startswith("."):
                    continue
                full = os.path.join(root, fname)
                rel = os.path.relpath(full, downloads_dir)
                size = os.path.getsize(full)
                files.append({
                    "name": fname,
                    "path": rel,
                    "size": size,
                    "modified": os.path.getmtime(full),
                })
        files.sort(key=lambda x: x["modified"], reverse=True)
    except Exception:
        pass
    return {"files": files[:50]}

# ── Open local folder ────────────────────────────────────────────────────────
@app.post("/api/open-folder")
def open_folder():
    """Open the local downloads directory in the system's file explorer."""
    try:
        # Using subprocess for better focus handling on Windows
        path = os.path.abspath(manager.output_dir)
        subprocess.Popen(["explorer", path])
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
