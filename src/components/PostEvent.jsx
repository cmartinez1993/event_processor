import { useState } from 'react'
import { request } from '../api.js'

export default function PostEvent({ addLog }) {
  const [userId, setUserId] = useState('')
  const [eventType, setEventType] = useState('')
  const [eventTimestamp, setEventTimestamp] = useState('')

  async function handlePost() {
    if (!userId)    { addLog('Validation error', { error: 'user_id is required' }, 'error'); return }
    if (!eventType) { addLog('Validation error', { error: 'event_type is required' }, 'error'); return }

    const body = { user_id: userId, event_type: eventType }
    if (eventTimestamp) body.event_timestamp = eventTimestamp

    try {
      const data = await request('POST', '/events', body)
      addLog(`Posted · ${eventType}`, data, 'success')
    } catch (e) {
      addLog('POST /events failed', e.data ?? { error: e.message }, 'error')
    }
  }

  return (
    <div className="card">
      <h2>Post Event</h2>
      <label>User ID</label>
      <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="e.g. u1" />
      <label>Event Type</label>
      <input value={eventType} onChange={e => setEventType(e.target.value)} placeholder="e.g. user.signup" />
      <label>Event Timestamp (optional)</label>
      <input value={eventTimestamp} onChange={e => setEventTimestamp(e.target.value)} placeholder="ISO 8601, defaults to now" />
      <button className="btn btn-primary" onClick={handlePost}>&#9654; Post Event</button>
    </div>
  )
}
