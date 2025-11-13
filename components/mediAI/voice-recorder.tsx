// components/medi-ai-panel/voice-recorder.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Download, FileText, Stethoscope, Play, Pause, RotateCcw } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  onRecordingComplete: (audioBlob: Blob, transcription: string) => void
  onGenerateAnalysis: (transcription: string) => void
  patientContext?: any
}

interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  audioBlob: Blob | null
  transcription: string
  isTranscribing: boolean
}

export default function VoiceRecorder({ 
  onTranscription, 
  onRecordingComplete, 
  onGenerateAnalysis,
  patientContext 
}: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioBlob: null,
    transcription: '',
    isTranscribing: false
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRecognitionRef = useRef<any>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100, // High quality for medical accuracy
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      
      audioChunksRef.current = []
      
      // Use WAV format for better medical audio quality
      const options = { mimeType: 'audio/webm;codecs=opus' }
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setState(prev => ({ ...prev, audioBlob }))
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      setState(prev => ({ ...prev, isRecording: true, isPaused: false }))

      // Start transcription
      startTranscription()

      // Update recording time
      recordingIntervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, recordingTime: prev.recordingTime + 1 }))
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Microphone access is required for medical consultations. Please allow microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()
      setState(prev => ({ ...prev, isRecording: false }))
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }

      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop()
      }

      // Complete the recording process
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          onRecordingComplete(audioBlob, state.transcription)
        }
      }, 500)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      if (state.isPaused) {
        mediaRecorderRef.current.resume()
        startTranscription()
      } else {
        mediaRecorderRef.current.pause()
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.stop()
        }
      }
      setState(prev => ({ ...prev, isPaused: !prev.isPaused }))
    }
  }

  const startTranscription = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    speechRecognitionRef.current = recognition

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'fr-FR' // French for medical use in French-speaking regions
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = state.transcription

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      const fullTranscription = finalTranscript + interimTranscript
      setState(prev => ({ ...prev, transcription: fullTranscription }))
      onTranscription(fullTranscription)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        alert('Microphone permissions are required for medical transcription.')
      }
    }

    recognition.start()
  }

  const resetRecording = () => {
    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      audioBlob: null,
      transcription: '',
      isTranscribing: false
    })
    audioChunksRef.current = []
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generateMedicalAnalysis = () => {
    if (state.transcription.trim()) {
      setState(prev => ({ ...prev, isTranscribing: true }))
      
      // Simulate analysis processing
      setTimeout(() => {
        onGenerateAnalysis(state.transcription)
        setState(prev => ({ ...prev, isTranscribing: false }))
      }, 2000)
    }
  }

  const downloadTranscription = () => {
    if (state.transcription) {
      const element = document.createElement('a')
      const file = new Blob([state.transcription], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `consultation-${patientContext?.id || 'unknown'}-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient Context */}
      {patientContext && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Consultation en cours</h3>
              <p className="text-sm text-blue-700">
                Patient: {patientContext.firstName} {patientContext.lastName}
                {patientContext.age && ` • ${patientContext.age} ans`}
                {patientContext.condition && ` • ${patientContext.condition}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Enregistrement de Consultation</h3>
          {state.isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">Enregistrement</span>
              <span className="text-sm text-gray-500">{formatTime(state.recordingTime)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {!state.isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg"
            >
              <Mic className="w-6 h-6" />
              Démarrer l'Enregistrement
            </button>
          ) : (
            <>
              <button
                onClick={pauseRecording}
                className="flex items-center gap-3 px-6 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-semibold"
              >
                {state.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {state.isPaused ? 'Reprendre' : 'Pause'}
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                <Square className="w-5 h-5" />
                Terminer
              </button>
            </>
          )}
        </div>

        {/* Transcription Display */}
        {(state.isRecording || state.transcription) && (
          <div className="border border-gray-200 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Transcription en Temps Réel</h4>
              {state.transcription && (
                <button
                  onClick={downloadTranscription}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              )}
            </div>
            
            <div className="min-h-[120px] max-h-60 overflow-y-auto p-3 bg-white rounded-lg border">
              {state.transcription ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {state.transcription}
                  {state.isRecording && (
                    <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                  )}
                </p>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>La transcription apparaîtra ici pendant l'enregistrement...</p>
                </div>
              )}
            </div>

            {/* Analysis Generation */}
            {!state.isRecording && state.transcription && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={generateMedicalAnalysis}
                  disabled={state.isTranscribing}
                  className="flex-1 flex items-center justify-center gap-3 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  <Stethoscope className="w-5 h-5" />
                  {state.isTranscribing ? 'Génération en cours...' : 'Générer Analyse Médicale'}
                </button>
                <button
                  onClick={resetRecording}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nouveau
                </button>
              </div>
            )}
          </div>
        )}

        {/* Medical Recording Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-2">Conseils pour l'Enregistrement Médical</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Parlez clairement et à débit modéré</li>
            <li>• Évitez les bruits de fond</li>
            <li>• Structurez votre consultation (anamnèse, examen, diagnostic, traitement)</li>
            <li>• Mentionnez les dosages et posologies avec précision</li>
            <li>• Notez les antécédents et allergies du patient</li>
          </ul>
        </div>
      </div>

      {/* Processing Indicator */}
      {state.isTranscribing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="font-semibold text-gray-900">Analyse en Cours</h3>
            </div>
            <p className="text-sm text-gray-600">
              Génération du résumé médical et création du PDF de consultation...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}