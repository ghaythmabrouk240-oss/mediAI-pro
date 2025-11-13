// components/medi-ai-panel/clinical-dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, FileText, Clock, TrendingUp, AlertTriangle } from 'lucide-react'

export default function ClinicalDashboard() {
  const [stats, setStats] = useState({
    activeConsultations: 0,
    patientsProcessed: 0,
    filesAnalyzed: 0,
    avgResponseTime: 0
  })

  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading data
    setStats({
      activeConsultations: 12,
      patientsProcessed: 156,
      filesAnalyzed: 89,
      avgResponseTime: 1.2
    })

    setRecentActivity([
      { id: 1, type: 'consultation', patient: 'John Smith', time: '2 min ago', status: 'completed' },
      { id: 2, type: 'analysis', patient: 'Maria Garcia', time: '5 min ago', status: 'processing' },
      { id: 3, type: 'recording', patient: 'Robert Johnson', time: '8 min ago', status: 'completed' },
      { id: 4, type: 'test_order', patient: 'Sarah Wilson', time: '12 min ago', status: 'sent' }
    ])
  }, [])

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <Activity className="w-12 h-12 mx-auto mb-3 text-blue-500" />
        <h3 className="font-bold text-lg text-gray-900">Clinical Dashboard</h3>
        <p className="text-sm text-gray-600">Real-time medical AI performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeConsultations}</div>
              <div className="text-xs text-gray-600">Active Consultations</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.patientsProcessed}</div>
              <div className="text-xs text-gray-600">Patients Processed</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.filesAnalyzed}</div>
              <div className="text-xs text-gray-600">Files Analyzed</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}s</div>
              <div className="text-xs text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' :
                  activity.status === 'processing' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {activity.type.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-gray-600">{activity.patient}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          System Status
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>AI Medical Engine</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Operational</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Voice Transcription</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Operational</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Patient Database</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Connected</span>
          </div>
          <div className="flex justify-between items-center">
            <span>File Storage</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">High Load</span>
          </div>
        </div>
      </div>
    </div>
  )
}