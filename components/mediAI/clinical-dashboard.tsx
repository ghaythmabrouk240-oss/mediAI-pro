'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, AlertTriangle, Clock, Users, FileText, Brain, Zap } from 'lucide-react'

export default function ClinicalDashboard() {
  const [clinicalMetrics, setClinicalMetrics] = useState({
    patientsTreated: 1247,
    averageConsultationTime: '18.2min',
    diagnosticAccuracy: '94.7%',
    drugInteractionsPrevented: 89,
    emergencyFlags: 23,
    timeSaved: '347 hours'
  })

  const [liveCases, setLiveCases] = useState([
    { id: 1, status: 'critical', diagnosis: 'STEMI', location: 'ED Bay 3', time: '2min ago', priority: 1 },
    { id: 2, status: 'urgent', diagnosis: 'Stroke Alert', location: 'Neuro ICU', time: '5min ago', priority: 2 },
    { id: 3, status: 'stable', diagnosis: 'Pneumonia', location: 'Floor 4W', time: '12min ago', priority: 3 }
  ])

  const [aiInsights, setAiInsights] = useState([
    '📊 68% of hypertension patients are not at goal BP - consider medication titration',
    '💊 12 patients on high-risk drug combinations - review for alternatives',
    '🏥 ED overcrowding predicted in 2 hours - prepare surge capacity',
    '🔍 Rising community pneumonia cases - consider empiric coverage adjustment'
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setClinicalMetrics(prev => ({
        ...prev,
        patientsTreated: prev.patientsTreated + Math.floor(Math.random() * 3),
        drugInteractionsPrevented: prev.drugInteractionsPrevented + Math.floor(Math.random() * 2)
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const criticalAlerts = liveCases.filter(caseItem => caseItem.priority === 1)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h3 className="font-bold text-2xl text-foreground">CLINICAL COMMAND CENTER</h3>
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-sm text-muted-foreground">Real-time clinical intelligence and operational awareness</p>
      </div>

      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <div className="font-bold">CRITICAL CASES ACTIVE</div>
                <div className="text-sm opacity-90">{criticalAlerts.length} patients requiring immediate attention</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg">🚨 PRIORITY 1</div>
              <div className="text-sm opacity-90">Maximum urgency</div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all">
          <Users className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{clinicalMetrics.patientsTreated}</div>
          <div className="text-sm opacity-90">Patients Treated</div>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all">
          <Clock className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{clinicalMetrics.averageConsultationTime}</div>
          <div className="text-sm opacity-90">Avg Consultation</div>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all">
          <Brain className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{clinicalMetrics.diagnosticAccuracy}</div>
          <div className="text-sm opacity-90">Diagnostic Accuracy</div>
        </div>
        <div className="bg-orange-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all">
          <Activity className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{clinicalMetrics.drugInteractionsPrevented}</div>
          <div className="text-sm opacity-90">Rx Interactions Prevented</div>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{clinicalMetrics.emergencyFlags}</div>
          <div className="text-sm opacity-90">Emergency Flags</div>
        </div>
        <div className="bg-cyan-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all">
          <TrendingUp className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{clinicalMetrics.timeSaved}</div>
          <div className="text-sm opacity-90">Clinician Time Saved</div>
        </div>
      </div>

      {/* Live Case Tracking */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Cases */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h4 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            LIVE ACTIVE CASES
          </h4>
          <div className="space-y-3">
            {liveCases.map(caseItem => (
              <div 
                key={caseItem.id}
                className={`p-3 rounded-lg border-l-4 ${
                  caseItem.priority === 1 
                    ? 'bg-red-500/10 border-l-red-500' 
                    : caseItem.priority === 2
                    ? 'bg-orange-500/10 border-l-orange-500'
                    : 'bg-blue-500/10 border-l-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-foreground">{caseItem.diagnosis}</div>
                    <div className="text-sm text-muted-foreground">{caseItem.location}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${
                      caseItem.priority === 1 ? 'text-red-600' :
                      caseItem.priority === 2 ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                      PRIORITY {caseItem.priority}
                    </div>
                    <div className="text-xs text-muted-foreground">{caseItem.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Clinical Insights */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h4 className="font-bold text-lg text-foreground mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI CLINICAL INSIGHTS
          </h4>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-border">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="text-sm text-foreground">{insight}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
        <h4 className="font-bold text-lg mb-3">🚀 PERFORMANCE ANALYTICS</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">98.2%</div>
            <div className="text-sm opacity-90">System Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold">1.2s</div>
            <div className="text-sm opacity-90">Avg Response Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold">247</div>
            <div className="text-sm opacity-90">Active Providers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">$2.4M</div>
            <div className="text-sm opacity-90">Cost Savings</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
          🚨 Emergency Protocol
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          💊 Medication Review
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
          📊 Analytics Report
        </button>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
          🔍 Case Review
        </button>
      </div>
    </div>
  )
}
