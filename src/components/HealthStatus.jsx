import { useState, useEffect } from 'react'

const API = 'http://127.0.0.1:3000'
const POLL_INTERVAL_MS = 10_000

function Indicator({ label, state }) {
  const color = state === 'ok' ? '#10b981' : state === 'error' ? '#ef4444' : '#64748b'
  return (
    <div className="health-indicator">
      <span className="health-dot" style={{ background: color }} />
      <span className="health-label">{label}</span>
      <span className="health-state" style={{ color }}>{state ?? 'checking…'}</span>
    </div>
  )
}

export default function HealthStatus() {
  const [api, setApi] = useState(null)
  const [db, setDb]   = useState(null)

  async function check() {
    try {
      const res  = await fetch(`${API}/health`)
      const json = await res.json()
      setApi('ok')
      setDb(json.db === 'connected' ? 'ok' : 'error')
    } catch {
      setApi('error')
      setDb('error')
    }
  }

  useEffect(() => {
    check()
    const id = setInterval(check, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="health-bar">
      <Indicator label="API"      state={api} />
      <Indicator label="Database" state={db} />
    </div>
  )
}
