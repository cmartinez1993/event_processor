# Events Processor

A local event ingestion system with a Fastify REST API and a browser-based UI client.

## Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  client.js  (port 3001)     │        │  server.js  (port 3000)      │
│  Fastify — serves HTML UI   │──HTTP──▶  Fastify — events REST API   │
└─────────────────────────────┘        └──────────────────────────────┘
```

- **`server.js`** — REST API that accepts, stores, and retrieves events (in-memory)
- **`client.js`** — Fastify server that serves the HTML control panel on port 3001

## Getting Started

### Install

```bash
npm install
```

### Run

Open two terminals:

```bash
# Terminal 1 — API server
npm run server

# Terminal 2 — UI client
npm run client
```

Then open **http://127.0.0.1:3001** in your browser.

## API Reference

All requests go to `http://127.0.0.1:3000`.

### POST /events

Create a new event.

**Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | yes | Event type, e.g. `user.signup` |
| `payload` | object | no | Arbitrary data (defaults to `{}`) |
| `timestamp` | string | no | ISO 8601 timestamp (defaults to now) |

**Response `201`**

```json
{
  "success": true,
  "event": {
    "id": "527f5674-53a3-4528-ad91-e7a24d83fa26",
    "type": "user.signup",
    "payload": { "userId": "u1", "email": "alice@example.com" },
    "timestamp": "2026-06-08T19:00:00.000Z",
    "receivedAt": "2026-06-08T19:00:00.123Z"
  }
}
```

---

### GET /events

List all events. Optionally filter by type.

**Query params**

| Param | Description |
|---|---|
| `type` | Filter to events matching this type |

**Response `200`**

```json
{ "count": 2, "events": [ ... ] }
```

---

### GET /events/:id

Fetch a single event by UUID.

**Response `200`** — the event object  
**Response `404`** — `{ "error": "Event not found" }`

---

### DELETE /events

Clear all stored events.

**Response `200`**

```json
{ "success": true, "message": "All events cleared" }
```

## UI Buttons

| Section | Action |
|---|---|
| **Post Event** | Submit a custom event type and JSON payload |
| **Quick Post** | One-click buttons for 6 preset event types |
| **Get All Events** | Fetch and display every stored event |
| **Filter** | Fetch events matching a specific type |
| **Get Event by ID** | Look up a single event by its UUID |
| **Clear All Events** | Delete all events (prompts for confirmation) |

All responses appear in the **Response Log** panel on the right.

## Notes

- Events are stored in memory — they are lost when the server restarts.
- CORS is configured with `origin: true`, which reflects the request origin back, allowing the UI on any local port to communicate with the API.
