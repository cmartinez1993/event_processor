import { useState } from 'react'
import { request } from '../api.js'

export default function FetchEvents({ addLog }) {
  const [filterType, setFilterType] = useState('')

  async function getAll() {
    try {
      const data = await request('GET', '/events')
      addLog(`All events (${data.count})`, data, 'info')
    } catch (e) {
      addLog('GET /events failed', e.data ?? { error: e.message }, 'error')
    }
  }

  async function getFiltered() {
    const path = filterType ? `/events?event_type=${encodeURIComponent(filterType)}` : '/events'
    try {
      const data = await request('GET', path)
      addLog(`Filtered "${filterType || '*'}" (${data.count})`, data, 'info')
    } catch (e) {
      addLog('GET /events failed', e.data ?? { error: e.message }, 'error')
    }
  }

  return (
    <div className="card">
      <h2>Fetch Events</h2>
      <button className="btn btn-info" style={{ marginBottom: '0.75rem', width: '100%' }} onClick={getAll}>
        &#8635; Get All Events
      </button>
      <div className="filter-row">
        <input value={filterType} onChange={e => setFilterType(e.target.value)} placeholder="Filter by event_type..." />
        <button className="btn btn-info" onClick={getFiltered}>Filter</button>
      </div>
    </div>
  )
}
