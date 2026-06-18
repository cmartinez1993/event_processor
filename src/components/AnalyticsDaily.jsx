import { useState, useEffect } from 'react'
import { request } from '../api.js'

const POLL_INTERVAL_MS = 30_000

export default function AnalyticsDaily() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const res = await request('GET', '/analytics/daily')
      setData(res)
    } catch (e) {
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="card">
      <div className="analytics-header">
        <h2>Today&apos;s Events{data ? ` — ${data.date}` : ''}</h2>
        <button className="btn btn-ghost" onClick={fetch} style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
          &#8635;
        </button>
      </div>

      {loading && !data && <p className="analytics-empty">Loading…</p>}
      {error   && <p className="analytics-empty analytics-error">{error}</p>}

      {data && data.breakdown.length === 0 && (
        <p className="analytics-empty">No events today</p>
      )}

      {data && data.breakdown.length > 0 && (
        <>
          <div className="analytics-rows">
            {data.breakdown.map(({ event_type, count }) => (
              <div key={event_type} className="analytics-row">
                <span className="analytics-type">{event_type}</span>
                <span className="analytics-count">{count}</span>
              </div>
            ))}
          </div>
          <div className="analytics-total">
            <span>Total</span>
            <span>{data.total}</span>
          </div>
        </>
      )}
    </div>
  )
}
