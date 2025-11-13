'use client'

import { useEffect, useRef } from 'react'
import { AlertCircle, CheckCircle, Pill, Stethoscope, BookOpen } from 'lucide-react'

interface Message {
  role: string
  content: string
}

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
}

export default function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Enhanced message rendering for medical content
  const renderMessageContent = (content: string) => {
    // Convert markdown-style formatting to rich content
    const formattedContent = content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('🚨')) {
          return <div key={index} className="flex items-start gap-2 text-red-600 font-semibold my-2"><AlertCircle className="w-4 h-4 mt-1 flex-shrink-0" />{line}</div>
        }
        if (line.startsWith('💊')) {
          return <div key={index} className="flex items-start gap-2 text-blue-600 my-2"><Pill className="w-4 h-4 mt-1 flex-shrink-0" />{line}</div>
        }
        if (line.startsWith('📋')) {
          return <div key={index} className="flex items-start gap-2 text-green-600 my-2"><BookOpen className="w-4 h-4 mt-1 flex-shrink-0" />{line}</div>
        }
        if (line.startsWith('🔍')) {
          return <div key={index} className="flex items-start gap-2 text-purple-600 my-2"><Stethoscope className="w-4 h-4 mt-1 flex-shrink-0" />{line}</div>
        }
        if (line.startsWith('•')) {
          return <div key={index} className="ml-4 my-1 text-foreground">{line}</div>
        }
        if (line.includes('**') && line.endsWith('**')) {
          const boldText = line.replace(/\*\*/g, '')
          return <div key={index} className="font-bold text-foreground my-2 text-lg">{boldText}</div>
        }
        return <div key={index} className="my-1 text-foreground">{line}</div>
      })

    return <div className="whitespace-pre-wrap">{formattedContent}</div>
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h3 className="font-semibold text-foreground mb-2">MediAI Pro Clinical Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Advanced medical reasoning, evidence-based guidelines, and pharmacological insights.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Pill className="w-3 h-3" />
                <span>Drug Intelligence</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Guidelines</span>
              </div>
              <div className="flex items-center gap-1">
                <Stethoscope className="w-3 h-3" />
                <span>Diagnostics</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Emergency Protocols</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground border border-border'
                }`}
              >
                {message.role === 'assistant' ? (
                  renderMessageContent(message.content)
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span>Analyzing with clinical intelligence...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
