export default function FormatSelector({ format, onChange }) {
  return (
    <div className="fade-in-up" style={{ animationDelay: '0.15s' }}>
      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
        Formato de salida
      </label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className={`btn-toggle ${format === 'video' ? 'active' : ''}`}
          onClick={() => onChange('video')}
          type="button"
        >
          🎬 Vídeo
        </button>
        <button
          className={`btn-toggle ${format === 'audio' ? 'active' : ''}`}
          onClick={() => onChange('audio')}
          type="button"
        >
          🎵 Audio (MP3)
        </button>
      </div>
    </div>
  )
}
