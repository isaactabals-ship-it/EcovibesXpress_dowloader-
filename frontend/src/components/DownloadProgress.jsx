function formatBytes(bytes) {
  if (!bytes) return ''
  const mb = bytes / 1024 / 1024
  return mb > 1 ? `${mb.toFixed(1)} MB/s` : `${(bytes / 1024).toFixed(0)} KB/s`
}

function formatETA(seconds) {
  if (!seconds) return ''
  if (seconds < 60) return `${Math.round(seconds)}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

export default function DownloadProgress({ events }) {
  if (!events || events.length === 0) return null

  const last = events[events.length - 1]
  const start = events.find(e => e.status === 'start')

  const percent = last.percent ?? (last.status === 'done' ? 100 : 0)
  const statusMap = {
    start:       { label: 'Iniciando…', cls: 'badge-downloading' },
    downloading: { label: 'Descargando', cls: 'badge-downloading' },
    processing:  { label: 'Procesando', cls: 'badge-processing' },
    done:        { label: '¡Listo!', cls: 'badge-done' },
    error:       { label: 'Error', cls: 'badge-error' },
  }
  const current = statusMap[last.status] || statusMap['start']

  return (
    <div className="glass fade-in-up" style={{ padding: '20px 24px', animationDelay: '0.05s' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {start?.title || 'Descargando…'}
          </p>
          {last.current_title && last.current_title !== start?.title && (
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: 2, fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ▶ {last.current_title}
            </p>
          )}
          {start?.count > 1 && (
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              📋 Playlist · {start.count} vídeos
            </p>
          )}
        </div>
        <span className={`badge ${current.cls}`}>
          {last.status === 'downloading' && <span className="spin" style={{ display: 'inline-block', fontSize: '0.7rem' }}>⟳</span>}
          {current.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom: 10 }}>
        <div
          className={`progress-fill ${last.status === 'done' ? 'pulse-glow' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
        <span>{percent.toFixed(1)}%</span>
        <span style={{ display: 'flex', gap: 16 }}>
          {last.speed && <span>⚡ {formatBytes(last.speed)}</span>}
          {last.eta && <span>⏱ {formatETA(last.eta)}</span>}
        </span>
      </div>

      {/* Error message */}
      {last.status === 'error' && (
        <p style={{ marginTop: 10, fontSize: '0.83rem', color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8 }}>
          ⚠️ {last.message}
        </p>
      )}

      {/* Done message */}
      {last.status === 'done' && (
        <p style={{ marginTop: 10, fontSize: '0.83rem', color: '#4ade80', textAlign: 'center' }}>
          ✅ Archivo guardado en la carpeta <strong>downloads/</strong>
        </p>
      )}
    </div>
  )
}
