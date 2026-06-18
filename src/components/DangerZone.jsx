import { request } from '../api.js'

export default function DangerZone({ addLog }) {
  async function handleClear() {
    if (!confirm('Delete all events?')) return
    try {
      const data = await request('DELETE', '/events')
      addLog('Cleared', data, 'success')
    } catch (e) {
      addLog('DELETE /events failed', e.data ?? { error: e.message }, 'error')
    }
  }

  return (
    <div className="card">
      <h2>Danger Zone</h2>
      <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleClear}>
        &#10006; Clear All Events
      </button>
    </div>
  )
}
