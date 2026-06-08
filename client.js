import Fastify from 'fastify'

const fastify = Fastify({ logger: false })

const html = /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Events Processor</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, sans-serif;
      background: #0f1117;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 2rem;
    }

    h1 { font-size: 1.5rem; font-weight: 700; color: #f8fafc; margin-bottom: 2rem; }
    h2 { font-size: 0.85rem; font-weight: 600; text-transform: uppercase;
         letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 0.75rem; }

    .layout { display: grid; grid-template-columns: 380px 1fr; gap: 1.5rem; }

    .card {
      background: #1e2433;
      border: 1px solid #2d3748;
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }

    label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.35rem; }

    input, textarea, select {
      width: 100%;
      background: #0f1117;
      border: 1px solid #374151;
      border-radius: 6px;
      color: #e2e8f0;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      font-family: inherit;
      margin-bottom: 0.75rem;
      outline: none;
    }
    input:focus, textarea:focus { border-color: #6366f1; }
    textarea { resize: vertical; min-height: 80px; }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.15s;
      white-space: nowrap;
    }
    .btn:hover { opacity: 0.85; }
    .btn:active { opacity: 0.7; }

    .btn-primary  { background: #6366f1; color: #fff; }
    .btn-success  { background: #10b981; color: #fff; }
    .btn-info     { background: #0ea5e9; color: #fff; }
    .btn-warning  { background: #f59e0b; color: #000; }
    .btn-danger   { background: #ef4444; color: #fff; }
    .btn-ghost    { background: #2d3748; color: #e2e8f0; }

    .quick-btns { display: flex; flex-wrap: wrap; gap: 0.5rem; }

    .filter-row { display: flex; gap: 0.5rem; }
    .filter-row input { margin-bottom: 0; flex: 1; }

    .output-panel {
      background: #1e2433;
      border: 1px solid #2d3748;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 600px;
    }

    .output-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 1.25rem;
      border-bottom: 1px solid #2d3748;
    }

    .output-log {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.25rem;
      font-family: 'Menlo', 'Monaco', monospace;
      font-size: 0.78rem;
      line-height: 1.6;
    }

    .log-entry {
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      border-left: 3px solid transparent;
    }
    .log-entry.success { background: #0d2b1a; border-color: #10b981; }
    .log-entry.error   { background: #2b0d0d; border-color: #ef4444; }
    .log-entry.info    { background: #0d1b2b; border-color: #0ea5e9; }

    .log-time { color: #64748b; font-size: 0.7rem; margin-bottom: 0.25rem; }
    .log-label { font-weight: 700; margin-bottom: 0.3rem; }
    .log-label.success { color: #10b981; }
    .log-label.error   { color: #ef4444; }
    .log-label.info    { color: #0ea5e9; }

    pre { white-space: pre-wrap; word-break: break-all; color: #cbd5e1; }

    .badge {
      display: inline-block;
      background: #374151;
      color: #94a3b8;
      border-radius: 999px;
      font-size: 0.7rem;
      padding: 0.1rem 0.55rem;
      margin-left: 0.4rem;
    }
  </style>
</head>
<body>
  <h1>Events Processor</h1>
  <div class="layout">
    <!-- LEFT: controls -->
    <div>
      <!-- Post event -->
      <div class="card">
        <h2>Post Event</h2>
        <label for="eventType">Type</label>
        <input id="eventType" placeholder="e.g. user.signup" />
        <label for="eventPayload">Payload (JSON)</label>
        <textarea id="eventPayload" placeholder='{"key": "value"}'></textarea>
        <button class="btn btn-primary" onclick="postEvent()">&#9654; Post Event</button>
      </div>

      <!-- Quick-post presets -->
      <div class="card">
        <h2>Quick Post</h2>
        <div class="quick-btns">
          <button class="btn btn-ghost" onclick="quickPost('user.signup',   {userId:'u1', email:'alice@example.com'})">user.signup</button>
          <button class="btn btn-ghost" onclick="quickPost('user.login',    {userId:'u1', ip:'10.0.0.1'})">user.login</button>
          <button class="btn btn-ghost" onclick="quickPost('user.logout',   {userId:'u1'})">user.logout</button>
          <button class="btn btn-ghost" onclick="quickPost('order.placed',  {orderId:'o42', amount:99.95})">order.placed</button>
          <button class="btn btn-ghost" onclick="quickPost('order.shipped', {orderId:'o42', carrier:'UPS'})">order.shipped</button>
          <button class="btn btn-ghost" onclick="quickPost('error.crash',   {code:500, msg:'Internal error'})">error.crash</button>
        </div>
      </div>

      <!-- Fetch events -->
      <div class="card">
        <h2>Fetch Events</h2>
        <button class="btn btn-info" style="margin-bottom:0.75rem; width:100%" onclick="getEvents()">
          &#8635; Get All Events
        </button>
        <div class="filter-row">
          <input id="filterType" placeholder="Filter by type..." />
          <button class="btn btn-info" onclick="getFiltered()">Filter</button>
        </div>
      </div>

      <!-- Single event -->
      <div class="card">
        <h2>Get Event by ID</h2>
        <div class="filter-row">
          <input id="eventId" placeholder="Paste event UUID..." />
          <button class="btn btn-success" onclick="getById()">Fetch</button>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="card">
        <h2>Danger Zone</h2>
        <button class="btn btn-danger" style="width:100%" onclick="clearEvents()">
          &#10006; Clear All Events
        </button>
      </div>
    </div>

    <!-- RIGHT: output -->
    <div class="output-panel">
      <div class="output-header">
        <h2 style="margin:0">Response Log</h2>
        <button class="btn btn-ghost" onclick="clearLog()" style="padding:0.3rem 0.7rem; font-size:0.75rem">Clear log</button>
      </div>
      <div class="output-log" id="log">
        <div class="log-entry info">
          <div class="log-label info">Ready</div>
          <pre>API → http://127.0.0.1:3000</pre>
        </div>
      </div>
    </div>
  </div>

  <script>
    const API = 'http://127.0.0.1:3000'

    function now() {
      return new Date().toLocaleTimeString([], { hour12: false })
    }

    function log(label, data, type = 'success') {
      const el = document.getElementById('log')
      const entry = document.createElement('div')
      entry.className = \`log-entry \${type}\`
      entry.innerHTML = \`
        <div class="log-time">\${now()}</div>
        <div class="log-label \${type}">\${label}</div>
        <pre>\${JSON.stringify(data, null, 2)}</pre>
      \`
      el.prepend(entry)
    }

    function clearLog() {
      document.getElementById('log').innerHTML = ''
    }

    async function request(method, path, body) {
      const opts = { method, headers: { 'Content-Type': 'application/json' } }
      if (body !== undefined) opts.body = JSON.stringify(body)
      const res = await fetch(API + path, opts)
      const json = await res.json()
      if (!res.ok) throw Object.assign(new Error(json.error), { data: json })
      return json
    }

    async function postEvent() {
      const type = document.getElementById('eventType').value.trim()
      if (!type) { log('Validation error', { error: 'Type is required' }, 'error'); return }
      let payload = {}
      const raw = document.getElementById('eventPayload').value.trim()
      if (raw) {
        try { payload = JSON.parse(raw) }
        catch { log('JSON parse error', { error: 'Invalid JSON in payload' }, 'error'); return }
      }
      try {
        const data = await request('POST', '/events', { type, payload })
        log(\`Posted · \${type}\`, data, 'success')
      } catch (e) {
        log('POST /events failed', e.data ?? { error: e.message }, 'error')
      }
    }

    async function quickPost(type, payload) {
      try {
        const data = await request('POST', '/events', { type, payload })
        log(\`Quick post · \${type}\`, data, 'success')
      } catch (e) {
        log('POST /events failed', e.data ?? { error: e.message }, 'error')
      }
    }

    async function getEvents() {
      try {
        const data = await request('GET', '/events')
        log(\`All events (\${data.count})\`, data, 'info')
      } catch (e) {
        log('GET /events failed', e.data ?? { error: e.message }, 'error')
      }
    }

    async function getFiltered() {
      const type = document.getElementById('filterType').value.trim()
      const path = type ? \`/events?type=\${encodeURIComponent(type)}\` : '/events'
      try {
        const data = await request('GET', path)
        log(\`Filtered "\${type || '*'}" (\${data.count})\`, data, 'info')
      } catch (e) {
        log('GET /events failed', e.data ?? { error: e.message }, 'error')
      }
    }

    async function getById() {
      const id = document.getElementById('eventId').value.trim()
      if (!id) { log('Validation error', { error: 'Event ID is required' }, 'error'); return }
      try {
        const data = await request('GET', \`/events/\${id}\`)
        log(\`Event \${id.slice(0,8)}…\`, data, 'info')
      } catch (e) {
        log('GET /events/:id failed', e.data ?? { error: e.message }, 'error')
      }
    }

    async function clearEvents() {
      if (!confirm('Delete all events?')) return
      try {
        const data = await request('DELETE', '/events')
        log('Cleared', data, 'success')
      } catch (e) {
        log('DELETE /events failed', e.data ?? { error: e.message }, 'error')
      }
    }
  </script>
</body>
</html>`

fastify.get('/', async (request, reply) => {
  return reply.type('text/html').send(html)
})

try {
  await fastify.listen({ port: 3001, host: '127.0.0.1' })
  console.log('Client running → http://127.0.0.1:3001')
} catch (err) {
  console.error(err)
  process.exit(1)
}
