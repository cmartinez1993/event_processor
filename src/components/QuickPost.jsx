import { request } from '../api.js'

const PRESETS = [
  { event_type: 'user.signup',   user_id: 'u1' },
  { event_type: 'user.login',    user_id: 'u1' },
  { event_type: 'user.logout',   user_id: 'u1' },
  { event_type: 'order.placed',  user_id: 'u2' },
  { event_type: 'order.shipped', user_id: 'u2' },
  { event_type: 'error.crash',   user_id: 'u3' },
]

export default function QuickPost({ addLog }) {
  async function handleQuickPost(preset) {
    try {
      const data = await request('POST', '/events', preset)
      addLog(`Quick post · ${preset.event_type}`, data, 'success')
    } catch (e) {
      addLog('POST /events failed', e.data ?? { error: e.message }, 'error')
    }
  }

  return (
    <div className="card">
      <h2>Quick Post</h2>
      <div className="quick-btns">
        {PRESETS.map(p => (
          <button key={p.event_type} className="btn btn-ghost" onClick={() => handleQuickPost(p)}>
            {p.event_type}
          </button>
        ))}
      </div>
    </div>
  )
}
