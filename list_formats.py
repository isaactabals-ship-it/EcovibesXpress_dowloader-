import yt_dlp

url = "https://www.youtube.com/watch?v=uxZuSVSdomA"
with yt_dlp.YoutubeDL() as ydl:
    info = ydl.extract_info(url, download=False)
    formats = info.get('formats', [])
    for f in formats:
        print(f"ID: {f['format_id']}, Ext: {f['ext']}, Res: {f.get('resolution')}, VCodec: {f.get('vcodec')}, ACodec: {f.get('acodec')}")
