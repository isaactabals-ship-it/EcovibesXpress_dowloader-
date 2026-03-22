const QUALITIES = [
  { value: 'best',  label: '⭐ Mejor calidad' },
  { value: '4k',    label: '🔷 4K (2160p)' },
  { value: '1080p', label: '🟣 1080p Full HD' },
  { value: '720p',  label: '🔵 720p HD' },
  { value: '480p',  label: '⚪ 480p' },
  { value: '360p',  label: '⚫ 360p' },
]

export default function QualitySelector({ quality, onChange, disabled }) {
  if (disabled) return null

  return (
    <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
        Resolución
      </label>
      <select
        className="quality-select"
        value={quality}
        onChange={e => onChange(e.target.value)}
      >
        {QUALITIES.map(q => (
          <option key={q.value} value={q.value}>{q.label}</option>
        ))}
      </select>
    </div>
  )
}
