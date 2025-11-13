'use client'

import { useState } from 'react'
import { Brain, Stethoscope, Users, MessageCircle } from 'lucide-react'

type TabType = 'chat' | 'patients' | 'consultations' | 'analytics'

export default function MediAIPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('chat')

  const tabs = [
    { id: 'chat' as TabType, name: 'AI Chat', icon: MessageCircle },
    { id: 'patients' as TabType, name: 'Patients', icon: Users },
    { id: 'consultations' as TabType, name: 'Consultations', icon: Stethoscope },
    { id: 'analytics' as TabType, name: 'Analytics', icon: Brain }
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MediAI Pro</h1>
              <p className="text-sm text-gray-600">Expert Medical AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">AI Ready</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === 'chat' && (
          <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="h-full flex flex-col">
              <div className="flex-1 p-4">
                <p className="text-gray-600 text-center py-8">
                  Medical AI Chat Interface - Ready for expert consultations
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'patients' && (
          <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Management</h2>
            <p className="text-gray-600">Patient records and management system</p>
          </div>
        )}
        
        {activeTab === 'consultations' && (
          <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultations</h2>
            <p className="text-gray-600">Consultation history and recordings</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Medical insights and analytics dashboard</p>
          </div>
        )}
      </div>
    </div>
  )
}
