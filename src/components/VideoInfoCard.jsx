export default function VideoInfoCard({ info }) {
  if (!info) return null

  const fmtDuration = (s) => {
    if (!s) return ''
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return h > 0
      ? `${h}h ${m}m ${sec}s`
      : `${m}m ${sec}s`
  }

  return (
    <div className="glass fade-in-up" style={{ padding: '18px 22px', animationDelay: '0.1s' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {info.thumbnail && (
          <img
            src={info.thumbnail}
            alt="thumbnail"
            style={{ width: 96, height: 54, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}
          />
        )}
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3, marginBottom: 4 }}>
            {info.is_playlist ? '📋' : '▶️'} {info.title}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            {info.uploader && <span>👤 {info.uploader}</span>}
            {info.is_playlist
              ? <span>🎬 {info.count} vídeos en playlist</span>
              : info.duration && <span>⏱ {fmtDuration(info.duration)}</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
