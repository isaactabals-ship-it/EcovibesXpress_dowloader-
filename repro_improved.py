import yt_dlp

url = "https://www.youtube.com/watch?v=uxZuSVSdomA"
# Improved format selector
format_sel = "bestvideo[height<=1080]+bestaudio/best[height<=1080]"

opts = {
    "format":          format_sel,
    "quiet":           False,
    "no_warnings":     False,
    "merge_output_format": "mp4"
}

try:
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.extract_info(url, download=False)
        print("Succeeded in extracting info with IMPROVED format selector.")
except Exception as e:
    print(f"Error even with improved format: {e}")
