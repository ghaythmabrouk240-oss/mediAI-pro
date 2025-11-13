'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, FileText } from 'lucide-react'

interface Recording {
  id: string
  patientName: string
  date: string
  duration: number
  summary: string
  status: 'completed' | 'processing'
}

export default function ConsultationRecorder() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecordings()
  }, [])

  const fetchRecordings = async () => {
    try {
      const response = await fetch('/api/mediAI/recordings')
      const data = await response.json()
      setRecordings(data.recordings || [])
    } catch (error) {
      console.error('Error fetching recordings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/mediAI/recordings/${id}/download`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `consultation-${id}.pdf`
      a.click()
    } catch (error) {
      console.error('Error downloading recording:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/mediAI/recordings/${id}`, { method: 'DELETE' })
      fetchRecordings()
    } catch (error) {
      console.error('Error deleting recording:', error)
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading recordings...</div>
  }

  return (
    <div className="p-4 space-y-3">
      <div className="max-h-96 overflow-y-auto space-y-2">
        {recordings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recordings yet</p>
        ) : (
          recordings.map((recording) => (
            <div key={recording.id} className="bg-muted/50 p-3 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <FileText className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {recording.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(recording.date).toLocaleDateString()} •{' '}
                      {Math.round(recording.duration / 60)}m
                    </p>
                    {recording.status === 'processing' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs rounded">
                        Processing...
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(recording.id)}
                    className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                    aria-label="Download recording"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(recording.id)}
                    className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                    aria-label="Delete recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {recording.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2">{recording.summary}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
