export default function ResponseLog({ log, onClear }) {
  return (
    <div className="output-panel">
      <div className="output-header">
        <h2 style={{ margin: 0 }}>Response Log</h2>
        <button className="btn btn-ghost" onClick={onClear} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
          Clear log
        </button>
      </div>
      <div className="output-log">
        {log.map(entry => (
          <div key={entry.id} className={`log-entry ${entry.type}`}>
            {entry.time && <div className="log-time">{entry.time}</div>}
            <div className={`log-label ${entry.type}`}>{entry.label}</div>
            <pre>{JSON.stringify(entry.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
