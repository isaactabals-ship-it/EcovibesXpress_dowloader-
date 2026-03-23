function formatSize(bytes) {
  if (!bytes) return '?'
  if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

export default function DownloadHistory({ files, onRefresh, onOpenFolder, loading }) {
  const hasFiles = files && files.length > 0
  const ext = (name) => name.split('.').pop().toUpperCase()
  const icon = (name) => {
    const e = name.split('.').pop().toLowerCase()
    if (['mp4', 'mkv', 'webm', 'avi'].includes(e)) return '🎬'
    if (['mp3', 'wav', 'm4a', 'ogg'].includes(e)) return '🎵'
    return '📄'
  }

  return (
    <div className="glass fade-in-up" style={{ padding: '20px 24px', animationDelay: '0.1s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
          📂 Descargas recientes
        </h3>
        <div style={{ display: 'flex', gap: 14 }}>
          <button
            onClick={onOpenFolder}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >
            📂 Abrir carpeta
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >
            {loading ? '⟳' : '↻ Actualizar'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
        {!hasFiles ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
            <p>Aún no hay descargas registradas.</p>
            <p style={{ fontSize: '0.75rem', marginTop: 4 }}>Tus vídeos aparecerán aquí una vez que los descargues.</p>
          </div>
        ) : (
          files.map((f, i) => (
            <div key={i} className="history-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon(f.name)}</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '34vw' }}>
                    {f.name}
                  </p>
                  <p style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                    {f.path !== f.name ? `📋 ${f.path.split(/[\\/]/)[0]}  ·  ` : ''}{formatSize(f.size)}
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginLeft: 10 }}>
                {ext(f.name)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
