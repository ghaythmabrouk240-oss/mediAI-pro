'use client'

import { useState } from 'react'
import MedicalChat from '../components/mediAI/chat-panel'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MediAI Pro 🏥
          </h1>
          <p className="text-lg text-gray-600">
            Expert Medical AI Assistant - Free & Open Source
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <MedicalChat />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Consult with an AI assistant trained on medical knowledge</p>
          <p className="mt-2">⚠️ For educational purposes. Always consult healthcare professionals for medical decisions.</p>
        </div>
      </div>
    </main>
  )
}
