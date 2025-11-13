'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function RealTimeMonitor() {
  const [stats, setStats] = useState({
    activeConsultations: 12,
    patientsToday: 47,
    filesProcessed: 128,
    aiResponses: 324
  })

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: 'info', message: 'System operating normally', timestamp: new Date() },
    { id: 2, type: 'warning', message: 'High load on AI processing', timestamp: new Date(Date.now() - 300000) }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeConsultations: prev.activeConsultations + Math.floor(Math.random() * 3) - 1,
        patientsToday: prev.patientsToday + Math.floor(Math.random() * 2),
        filesProcessed: prev.filesProcessed + Math.floor(Math.random() * 5),
        aiResponses: prev.aiResponses + Math.floor(Math.random() * 10)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <Activity className="w-12 h-12 mx-auto mb-3 text-green-500" />
        <h3 className="font-bold text-lg text-foreground">Real-Time System Monitor</h3>
        <p className="text-sm text-muted-foreground">Live system performance and usage metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500/10 p-4 rounded-lg text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-foreground">{stats.activeConsultations}</div>
          <div className="text-xs text-muted-foreground">Active Consultations</div>
        </div>
        <div className="bg-green-500/10 p-4 rounded-lg text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-foreground">{stats.patientsToday}</div>
          <div className="text-xs text-muted-foreground">Patients Today</div>
        </div>
        <div className="bg-purple-500/10 p-4 rounded-lg text-center">
          <Activity className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-foreground">{stats.filesProcessed}</div>
          <div className="text-xs text-muted-foreground">Files Processed</div>
        </div>
        <div className="bg-orange-500/10 p-4 rounded-lg text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold text-foreground">{stats.aiResponses}</div>
          <div className="text-xs text-muted-foreground">AI Responses</div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          System Alerts
        </h4>
        <div className="space-y-2">
          {systemAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border text-sm ${
                alert.type === 'warning' 
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{alert.message}</span>
              </div>
              <div className="text-xs opacity-70 mt-1">
                {alert.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">Performance Metrics</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>AI Response Time</span>
            <span className="text-green-600">~1.2s</span>
          </div>
          <div className="flex justify-between">
            <span>Voice Transcription</span>
            <span className="text-green-600">~2.1s</span>
          </div>
          <div className="flex justify-between">
            <span>File Processing</span>
            <span className="text-yellow-600">~3.5s</span>
          </div>
          <div className="flex justify-between">
            <span>System Uptime</span>
            <span className="text-green-600">99.98%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
