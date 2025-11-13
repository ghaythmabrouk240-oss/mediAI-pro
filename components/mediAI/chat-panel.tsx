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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate AI response
    setTimeout(() => {
      const response = getMedicalResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const getMedicalResponse = (query: string): string => {
    const lower = query.toLowerCase()
    
    if (lower.includes('chest pain')) {
      return `**Cardiac Assessment**\n\nDifferential:\n• ACS\n• PE\n• Pericarditis\n• Aortic dissection\n\nImmediate: ECG, aspirin, troponin`
    }
    
    if (lower.includes('headache')) {
      return `**Neurology Consult**\n\nDifferential:\n• Migraine\n• Tension\n• Cluster\n• SAH\n\nRed flags: Thunderclap onset`
    }
    
    if (lower.includes('fever') && lower.includes('cough')) {
      return `**Infectious Disease**\n\nConsider:\n• Pneumonia\n• COVID-19\n• Influenza\n• Bronchitis\n\nAssess with CURB-65`
    }
    
    return `**Medical Consultation**\n\nI've analyzed your query. Please provide specific symptoms for detailed medical guidance. For emergencies, seek immediate care.`
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h2 className="font-semibold">Medical AI Assistant</h2>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a medical question..."
            className="flex-1 border rounded-lg px-3 py-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
