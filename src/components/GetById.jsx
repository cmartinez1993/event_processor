import { useState } from 'react'
import { request } from '../api.js'

export default function GetById({ addLog }) {
  const [id, setId] = useState('')

  async function handleFetch() {
    if (!id) { addLog('Validation error', { error: 'Event ID is required' }, 'error'); return }
    try {
      const data = await request('GET', `/events/${id}`)
      addLog(`Event ${id}`, data, 'info')
    } catch (e) {
      addLog('GET /events/:id failed', e.data ?? { error: e.message }, 'error')
    }
  }

  return (
    <div className="card">
      <h2>Get Event by ID</h2>
      <div className="filter-row">
        <input value={id} onChange={e => setId(e.target.value)} placeholder="Enter event ID..." />
        <button className="btn btn-success" onClick={handleFetch}>Fetch</button>
      </div>
    </div>
  )
}
