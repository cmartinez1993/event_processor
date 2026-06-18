const API = 'http://127.0.0.1:3000'

export async function request(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(API + path, opts)
  const json = await res.json()
  if (!res.ok) throw Object.assign(new Error(json.error), { data: json })
  return json
}
