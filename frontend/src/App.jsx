import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import './index.css'

import URLInput       from './components/URLInput'
import FormatSelector from './components/FormatSelector'
import QualitySelector from './components/QualitySelector'
import DownloadProgress from './components/DownloadProgress'
import DownloadHistory from './components/DownloadHistory'
import VideoInfoCard  from './components/VideoInfoCard'

export default function App() {
  const [format, setFormat]       = useState('video')
  const [quality, setQuality]     = useState('best')
  const [videoInfo, setVideoInfo] = useState(null)
  const [events, setEvents]       = useState([])
  const [files, setFiles]         = useState([])
  const [loadingInfo, setLoadingInfo]     = useState(false)
  const [loadingFiles, setLoadingFiles]   = useState(false)
  const [downloading, setDownloading]     = useState(false)
  const [error, setError]         = useState('')

  // ── Load download history ────────────────────────────────────────────────
  const fetchFiles = useCallback(async () => {
    setLoadingFiles(true)
    try {
      const { data } = await axios.get('/api/downloads')
      setFiles(data.files || [])
    } catch {
      // silently ignore
    } finally {
      setLoadingFiles(false)
    }
  }, [])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  // ── Step 1: Fetch video info ──────────────────────────────────────────────
  const handleURLSubmit = async (url) => {
    setError('')
    setVideoInfo(null)
    setEvents([])
    setLoadingInfo(true)
    try {
      const { data } = await axios.get(`/api/info?url=${encodeURIComponent(url)}`)
      setVideoInfo({ ...data, url })
    } catch (e) {
      setError(e.response?.data?.detail || 'No se pudo obtener información del vídeo. ¿Es una URL de YouTube válida?')
    } finally {
      setLoadingInfo(false)
    }
  }

  // ── Step 2: Start download + listen SSE ──────────────────────────────────
  const handleDownload = async () => {
    if (!videoInfo) return
    setError('')
    setEvents([])
    setDownloading(true)

    try {
      const { data } = await axios.post('/api/download', {
        url: videoInfo.url,
        format,
        quality,
      })
      const taskId = data.task_id

      // Open SSE connection
      const es = new EventSource(`/api/progress/${taskId}`)
      es.onmessage = (e) => {
        const evt = JSON.parse(e.data)
        setEvents(prev => [...prev, evt])
        if (evt.status === 'done') {
          es.close()
          setDownloading(false)
          fetchFiles()
        }
        if (evt.status === 'error') {
          es.close()
          setDownloading(false)
          setError(evt.message || 'Error durante la descarga.')
        }
      }
      es.onerror = () => {
        es.close()
        setDownloading(false)
        setError('Se perdió la conexión con el servidor.')
      }
    } catch (e) {
      setDownloading(false)
      setError(e.response?.data?.detail || 'No se pudo iniciar la descarga.')
    }
  }

  const canDownload = videoInfo && !downloading && !loadingInfo

  return (
    <>
      {/* Animated background */}
      <div className="bg-gradient" />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '40px 20px 60px' }}>
        {/* ── Header ── */}
        <header className="fade-in-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 8 }}>⚡</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, background: 'linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            EcovibesXpress
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6, fontSize: '0.95rem' }}>
            Descargador de YouTube — vídeos, playlists, MP3
          </p>
        </header>

        {/* ── Main card ── */}
        <main style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* URL Input */}
          <div className="glass" style={{ padding: '24px 24px 20px' }}>
            <URLInput onSubmit={handleURLSubmit} loading={loadingInfo} />

            {/* Error text */}
            {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Video info card */}
          {videoInfo && <VideoInfoCard info={videoInfo} />}

          {/* Options + Download button */}
          {videoInfo && (
            <div className="glass fade-in-up" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <FormatSelector format={format} onChange={setFormat} />
                <QualitySelector quality={quality} onChange={setQuality} disabled={format === 'audio'} />
              </div>

              <button
                className="btn-primary"
                onClick={handleDownload}
                disabled={!canDownload}
                style={{ width: '100%', padding: '15px', fontSize: '1.05rem' }}
              >
                {downloading
                  ? <span>⟳ Descargando…</span>
                  : <span>⬇ Descargar {format === 'audio' ? 'MP3' : `MP4 (${quality})`}</span>
                }
              </button>
            </div>
          )}

          {/* Download progress */}
          {events.length > 0 && <DownloadProgress events={events} />}

          {/* Download history */}
          <DownloadHistory files={files} onRefresh={fetchFiles} loading={loadingFiles} />
        </main>

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: 48, color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
          EcovibesXpress · Powered by yt-dlp &amp; FastAPI · Todo corre localmente en tu equipo
        </footer>
      </div>
    </>
  )
}
