// components/medi-ai-panel/consultation-recorder.tsx
'use client'

import { useState } from 'react'
import { Mic, Square, Play, Pause, Download } from 'lucide-react'

export default function ConsultationRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordings, setRecordings] = useState<any[]>([])

  const startRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    // Add to recordings list
    setRecordings(prev => [...prev, {
      id: Date.now(),
      name: `Consultation_${new Date().toLocaleDateString()}`,
      duration: '2:34',
      date: new Date().toLocaleDateString()
    }])
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <Mic className="w-12 h-12 mx-auto mb-3 text-blue-500" />
        <h3 className="font-bold text-lg text-gray-900">Consultation Recorder</h3>
        <p className="text-sm text-gray-600">Record and manage patient consultations</p>
      </div>

      {/* Recording Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-3 mx-auto px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            <Mic className="w-6 h-6" />
            Start Recording Consultation
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording in progress...</span>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={togglePause}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop Recording
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Previous Recordings */}
      {recordings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Previous Recordings</h4>
          <div className="space-y-2">
            {recordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{recording.name}</div>
                  <div className="text-sm text-gray-600">
                    {recording.date} • {recording.duration}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recording Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Recording Best Practices</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ensure quiet environment for clear audio</li>
          <li>• Speak clearly and at moderate pace</li>
          <li>• State patient consent at beginning</li>
          <li>• Summarize key findings at end</li>
          <li>• Keep recordings under 30 minutes for best quality</li>
        </ul>
      </div>
    </div>
  )
}