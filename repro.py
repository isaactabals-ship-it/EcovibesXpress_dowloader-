import yt_dlp
import os

url = "https://www.youtube.com/watch?v=uxZuSVSdomA"
# Mimic QUALITY_MAP['best'] since I don't know what user selected but the error happened
format_sel = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best"

opts = {
    "format":          format_sel,
    "quiet":           False,
    "no_warnings":     False,
}

try:
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.extract_info(url, download=False)
        print("Succeeded in extracting info with format selector.")
except Exception as e:
    print(f"Error as expected: {e}")
