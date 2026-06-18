import { useState, useCallback } from 'react'
import PostEvent from './components/PostEvent.jsx'
import QuickPost from './components/QuickPost.jsx'
import FetchEvents from './components/FetchEvents.jsx'
import GetById from './components/GetById.jsx'
import DangerZone from './components/DangerZone.jsx'
import ResponseLog from './components/ResponseLog.jsx'
import HealthStatus from './components/HealthStatus.jsx'
import AnalyticsDaily from './components/AnalyticsDaily.jsx'

const INITIAL_LOG = [{
  id: 0,
  type: 'info',
  label: 'Ready',
  data: { api: 'http://127.0.0.1:3000' },
  time: '',
}]

export default function App() {
  const [log, setLog] = useState(INITIAL_LOG)

  const addLog = useCallback((label, data, type = 'success') => {
    const time = new Date().toLocaleTimeString([], { hour12: false })
    setLog(prev => [{ id: Date.now(), label, data, type, time }, ...prev])
  }, [])

  const clearLog = useCallback(() => setLog([]), [])

  return (
    <>
      <div className="header">
        <h1>Events Processor</h1>
        <HealthStatus />
      </div>
      <div className="layout">
        <div>
          <PostEvent addLog={addLog} />
          <QuickPost addLog={addLog} />
          <FetchEvents addLog={addLog} />
          <GetById addLog={addLog} />
          <DangerZone addLog={addLog} />
          <AnalyticsDaily />
        </div>
        <ResponseLog log={log} onClear={clearLog} />
      </div>
    </>
  )
}
