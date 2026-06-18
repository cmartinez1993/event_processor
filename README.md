# Events Processor

A local event ingestion system with a Fastify REST API and a React/Vite UI.

## Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  Vite  (port 3001)          │        │  server.js  (port 3000)      │
│  React UI                   │──HTTP──▶  Fastify — events REST API   │
└─────────────────────────────┘        └──────────────┬───────────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │   PostgreSQL     │
                                              └─────────────────┘
```

- **`server.js`** — REST API that accepts, stores, and retrieves events in PostgreSQL via Prisma
- **`src/`** — React frontend served by Vite dev server on port 3001

## Getting Started

### Prerequisites

- Node.js 20+
- A running PostgreSQL instance

### Install

```bash
npm install
```

### Configure the database

Edit `.env` and set your connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/events_processor?schema=public"
```

Then apply the schema:

```bash
npx prisma migrate dev
```

### Run

Open two terminals:

```bash
# Terminal 1 — API server
npm run server

# Terminal 2 — UI
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
| `user_id` | string | yes | ID of the user who triggered the event |
| `event_type` | string | yes | Event type, e.g. `user.signup` |
| `event_timestamp` | string | no | ISO 8601 timestamp (defaults to now) |

**Response `201`**

```json
{
  "success": true,
  "event": {
    "id": "42",
    "user_id": "u1",
    "event_type": "user.signup",
    "event_timestamp": "2026-06-08T19:00:00.000Z",
    "created_at": "2026-06-08T19:00:00.123Z"
  }
}
```

---

### GET /events

List all events, ordered by `created_at` descending. Optionally filter by type.

**Query params**

| Param | Description |
|---|---|
| `event_type` | Filter to events matching this type |

**Response `200`**

```json
{ "count": 2, "events": [ ... ] }
```

---

### GET /events/:id

Fetch a single event by ID.

**Response `200`** — the event object  
**Response `404`** — `{ "error": "Event not found" }`

---

### DELETE /events

Clear all stored events.

**Response `200`**

```json
{ "success": true, "message": "All events cleared" }
```

## UI

| Section | Action |
|---|---|
| **Post Event** | Submit a custom event with `user_id`, `event_type`, and optional timestamp |
| **Quick Post** | One-click buttons for 6 preset event types |
| **Get All Events** | Fetch and display every stored event |
| **Filter** | Fetch events matching a specific `event_type` |
| **Get Event by ID** | Look up a single event by its ID |
| **Clear All Events** | Delete all events (prompts for confirmation) |

All responses appear in the **Response Log** panel on the right.
