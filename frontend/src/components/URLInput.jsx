import { useState, useRef } from 'react'

export default function URLInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const text = e.dataTransfer.getData('text')
    if (text) setUrl(text)
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text')
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      setTimeout(() => inputRef.current?.select(), 50)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim()) onSubmit(url.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div style={{ position: 'relative' }}>
        {/* YouTube icon */}
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          fontSize: '1.2rem', opacity: 0.6, pointerEvents: 'none'
        }}>▶️</span>

        <input
          ref={inputRef}
          type="url"
          className={`url-input ${dragging ? 'drag-over' : ''}`}
          style={{ paddingLeft: 44, paddingRight: 135 }}
          placeholder="Pega o arrastra el enlace de YouTube aquí…"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          disabled={loading}
          required
        />

        {/* Clear button */}
        {url && !loading && (
          <button
            type="button"
            onClick={() => setUrl('')}
            style={{
              position: 'absolute', right: 118, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: '1rem', padding: '4px 8px',
              transition: 'color 0.15s'
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >✕</button>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !url.trim()}
          style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            padding: '9px 18px', fontSize: '0.88rem'
          }}
        >
          {loading ? <span className="spin" style={{ display: 'inline-block' }}>⟳</span> : '✓ Analizar'}
        </button>
      </div>

      <p style={{ marginTop: 8, fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        Soporta vídeos individuales y playlists completas · Drag &amp; Drop compatible
      </p>
    </form>
  )
}
