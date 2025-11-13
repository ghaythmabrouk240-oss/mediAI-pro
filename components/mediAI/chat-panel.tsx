'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Brain, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function MedicalChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI processing - no API calls
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMedicalResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const generateMedicalResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('chest pain') || lowerQuery.includes('heart')) {
      return `**🫀 CARDIOLOGY CONSULTATION**\n\n**Critical Differential:**\n• ACS (40-60%) - ECG, troponin, aspirin\n• PE (15-25%) - Wells criteria\n• Aortic Dissection (5-8%)\n• Pericarditis (10-12%)\n\n**Immediate:** ECG, IV access, aspirin, monitoring`
    }
    
    if (lowerQuery.includes('headache') || lowerQuery.includes('migraine')) {
      return `**🧠 NEUROLOGY CONSULTATION**\n\n**Differential:**\n• Migraine (55-65%)\n• Tension-type (25-35%)\n• Cluster (3-5%)\n• SAH (1-2%)\n\n**Red Flags:** Thunderclap onset, focal deficits`
    }
    
    if (lowerQuery.includes('fever') && lowerQuery.includes('cough')) {
      return `**🦠 INFECTIOUS DISEASE**\n\n**Assessment:**\n• Pneumonia (30-40%)\n• COVID-19 (25-35%)\n• Influenza (15-25%)\n• Bronchitis (10-15%)\n\n**CURB-65 scoring for severity**`
    }
    
    if (lowerQuery.includes('abdominal pain')) {
      return `**👨‍⚕️ GASTROENTEROLOGY**\n\n**By Location:**\n• RUQ: Cholecystitis, hepatitis\n• RLQ: Appendicitis, ovarian cyst\n• LUQ: Gastritis, pancreatitis\n• LLQ: Diverticulitis, colitis\n\n**Surgical Red Flags present**`
    }
    
    return `**🩺 MEDICAL CONSULTATION**\n\nI've analyzed your query. For comprehensive medical guidance:\n\n• Provide specific symptoms and timing\n• Include relevant medical history\n• Mention current medications\n\nFor urgent concerns, seek immediate medical evaluation.`
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6" />
          <div>
            <h2 className="font-semibold text-lg">Medical AI Assistant</h2>
            <p className="text-blue-100 text-sm">Expert medical consultation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Welcome to MediAI Pro</p>
            <p className="text-sm mt-2">Ask me any medical question for expert consultation</p>
            <div className="mt-6 grid grid-cols-1 gap-2 text-sm text-left max-w-md mx-auto">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="font-medium">Try asking:</span>
                <br />
                "55-year-old with chest pain and shortness of breath"
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="font-medium">Or:</span>
                <br />
                "Differential diagnosis for severe headache"
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Brain className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a medical question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
