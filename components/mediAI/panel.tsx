'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, StopCircle, Download, FileText, User, AudioLines, BarChart3, Code, Stethoscope, Settings, Bell, Shield, Activity, X, MessageCircle, Bot, ClipboardList, TestTube, Square, Play, Pause, RotateCcw, Zap, Brain, TrendingUp, AlertTriangle, Clock, Users } from 'lucide-react'
import ChatInterface from './chat-interface'
import PatientManagement from './patient-management'
import ConsultationRecorder from './consultation-recorder'
import VoiceRecorder from './voice-recorder'
import MedicalFileManager from './file-manager'
import ReportGenerator from './report-generator'
import IntegrationGuide from './integration-guide'
import ConsultationAnalyzer from './consultation-analyzer'
import RealTimeMonitor from './real-time-monitor'
import ClinicalDashboard from './clinical-dashboard'

interface MediAIPanelProps {
  onClose: () => void
}

export default function MediAIPanel({ onClose }: MediAIPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'patients' | 'records' | 'files' | 'reports' | 'analysis' | 'resume' | 'test-order' | 'monitor' | 'integrations' | 'settings'>('chat')
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: string; content: string; timestamp: Date }>>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [patientContext, setPatientContext] = useState<any>(null)
  const [systemStatus, setSystemStatus] = useState({
    ai: 'online',
    database: 'connected',
    storage: 'active',
    api: 'operational'
  })

  // Real-time system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        ai: Math.random() > 0.1 ? 'online' : 'degraded'
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { 
      role: 'user', 
      content: inputValue,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
     const response = await fetch('/api/mediAI/ollama', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: inputValue,
    conversationHistory: messages
        }),
      })

      if (!response.ok) throw new Error('API response error')

      const data = await response.json()
      const assistantMessage = { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: '⚠️ System temporarily unavailable. Please try again in a moment.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser. Please use Chrome or Edge.')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(prev => prev + ' ' + transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone permissions.')
      }
    }

    recognition.start()
  }

  const handleRecordingComplete = async (audioBlob: Blob, transcription: string) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const formData = new FormData()
      formData.append('audio', new Blob([buffer]), `consultation-${Date.now()}.webm`)
      formData.append('patientId', patientContext?.id || 'unknown')
      formData.append('transcription', transcription)
      
      const response = await fetch('/api/mediAI/upload-recording', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        console.log('Recording uploaded successfully')
        const successMessage = { 
          role: 'assistant', 
          content: `✅ Consultation recorded and transcribed. Ready for analysis.`,
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, successMessage])
      }
    } catch (error) {
      console.error('Failed to upload recording:', error)
    }
  }

  const handleGenerateAnalysis = async (transcription: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/mediAI/analyze-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription,
          patientContext
        }),
      })

      if (!response.ok) throw new Error('Analysis generation failed')

      const data = await response.json()
      
      // Add analysis to chat
      const analysisMessage = { 
        role: 'assistant', 
        content: `📊 **Medical Analysis Generated**\n\n**Summary:** ${data.summary}\n\n**Key Findings:**\n${data.keyFindings.map((finding: string) => `• ${finding}`).join('\n')}\n\n**Recommendations:**\n${data.recommendations.map((rec: string) => `• ${rec}`).join('\n')}`,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, analysisMessage])
      
      // Switch to chat tab to show the analysis
      setActiveTab('chat')
      
    } catch (error) {
      console.error('Error generating analysis:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: '⚠️ Error generating analysis. Please try again.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // New function to handle test order generation
  const handleGenerateTestOrder = async (testDescription: string, patientInfo: any) => {
    try {
      const response = await fetch('/api/mediAI/generate-test-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testDescription,
          patientInfo,
          doctorNotes: inputValue
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Test order generated:', data)
        // Add success message to chat
        const successMessage = { 
          role: 'assistant', 
          content: `✅ Test order for "${testDescription}" has been generated and sent to the laboratory and patient.`,
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, successMessage])
      }
    } catch (error) {
      console.error('Failed to generate test order:', error)
    }
  }

  // New function to generate patient resume
  const handleGeneratePatientResume = async (patientId: string) => {
    try {
      const response = await fetch('/api/mediAI/generate-patient-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Add resume to chat
        const resumeMessage = { 
          role: 'assistant', 
          content: `📋 Patient Resume Generated:\n\n${data.resume}`,
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, resumeMessage])
      }
    } catch (error) {
      console.error('Failed to generate patient resume:', error)
    }
  }

  const tabs = [
    { id: 'chat' as const, name: 'AI Chat', icon: MessageCircle, badge: messages.length },
    { id: 'dashboard' as const, name: 'Dashboard', icon: Activity },
    { id: 'records' as const, name: 'Records', icon: Mic },
    { id: 'patients' as const, name: 'Patients', icon: User },
    { id: 'files' as const, name: 'Files', icon: FileText },
    { id: 'reports' as const, name: 'Reports', icon: BarChart3 },
    { id: 'analysis' as const, name: 'Analyze', icon: Stethoscope },
    { id: 'resume' as const, name: 'Resume', icon: ClipboardList },
    { id: 'test-order' as const, name: 'Test Order', icon: TestTube },
    { id: 'monitor' as const, name: 'Monitor', icon: Bell },
    { id: 'integrations' as const, name: 'Integrate', icon: Code },
    { id: 'settings' as const, name: 'Settings', icon: Settings },
  ]

  return (
    <div className="fixed bottom-32 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
      {/* Header - Clean Professional Design */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">MediAI Pro</h2>
              <p className="text-blue-100 text-sm">Clinical Command Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* System Status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${
            systemStatus.ai === 'online' ? 'bg-green-400' : 'bg-yellow-400'
          }`}></div>
          <span>AI: {systemStatus.ai}</span>
          <span className="opacity-70">•</span>
          <Shield className="w-3 h-3" />
          <span>HIPAA Compliant</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/80 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors flex-shrink-0 min-w-0 relative ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'chat' && (
          <ChatInterface messages={messages} isLoading={isLoading} />
        )}
        
        {activeTab === 'dashboard' && <ClinicalDashboard />}
        
        {activeTab === 'patients' && <PatientManagement onPatientSelect={setPatientContext} />}
        
        {activeTab === 'records' && (
          <div className="p-4">
            <VoiceRecorder 
              onTranscription={(text) => setInputValue(text)}
              onRecordingComplete={handleRecordingComplete}
              onGenerateAnalysis={handleGenerateAnalysis}
              patientContext={patientContext}
            />
          </div>
        )}
        
        {activeTab === 'files' && <MedicalFileManager />}
        
        {activeTab === 'reports' && <ReportGenerator />}
        
        {activeTab === 'analysis' && <ConsultationAnalyzer />}
        
        {activeTab === 'resume' && (
          <div className="p-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Patient Resume</h3>
              <p className="text-sm text-gray-600 mb-4">Access patient files and generate comprehensive summaries</p>
              
              {patientContext ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Selected: {patientContext.name}</span>
                    </div>
                    <button
                      onClick={() => handleGeneratePatientResume(patientContext.id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Generate Patient Resume
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">Patient Files</h4>
                    <div className="space-y-2">
                      {['Medical History', 'Lab Results', 'Prescriptions', 'Consultation Notes'].map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file}</span>
                          <button className="ml-auto text-xs text-blue-600 hover:text-blue-800">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a patient first to access files</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'test-order' && (
          <div className="p-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Laboratory Test Order</h3>
              <p className="text-sm text-gray-600 mb-4">Generate professional test orders for laboratories</p>
              
              <div className="space-y-3">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Test Type</option>
                  <option>Blood Test - Complete Blood Count</option>
                  <option>Blood Test - Lipid Profile</option>
                  <option>Urine Analysis</option>
                  <option>MRI Scan</option>
                  <option>X-Ray</option>
                  <option>ECG</option>
                </select>
                
                <textarea
                  placeholder="Additional notes or specific instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                
                <button
                  onClick={() => handleGenerateTestOrder('Blood Test - Complete Blood Count', patientContext)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-medium"
                >
                  <TestTube className="w-4 h-4" />
                  Generate & Send Test Order
                </button>
                
                <div className="text-xs text-gray-500 text-center">
                  Order will be sent to laboratory and patient automatically
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'monitor' && <RealTimeMonitor />}
        {activeTab === 'integrations' && <IntegrationGuide />}
        {activeTab === 'settings' && (
          <div className="p-4 text-center text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>System Settings</p>
            <p className="text-sm">Configuration and preferences</p>
          </div>
        )}
      </div>

      {/* Input Area (Chat Tab Only) */}
      {activeTab === 'chat' && (
        <div className="border-t border-gray-200 p-4 bg-white">
          {patientContext && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg text-sm text-blue-700">
              <User className="w-4 h-4" />
              <span>Consulting: {patientContext.name}</span>
              <button 
                onClick={() => setPatientContext(null)}
                className="ml-auto text-xs text-blue-500 hover:text-blue-700"
              >
                Clear
              </button>
            </div>
          )}
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask medical questions, describe symptoms..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Voice input"
          >
            {isRecording ? (
              <>
                <StopCircle className="w-4 h-4" />
                Recording... Speak now
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Quick Voice Input
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            systemStatus.ai === 'online' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          <span>v2.1.0</span>
        </div>
        <span>MediAI Pro Enterprise</span>
        <span>{messages.length} msgs</span>
      </div>
    </div>
  )
}
