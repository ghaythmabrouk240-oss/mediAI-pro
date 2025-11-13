'use client'

import { useState } from 'react'
import { FileText, Stethoscope, ClipboardList, AlertTriangle, CheckCircle, User } from 'lucide-react'

interface ClinicalAnalysis {
  chiefComplaint: string
  symptomsFound: string[]
  vitalSigns: any
  differentialDiagnosis: string[]
  urgencyLevel: string
  recommendedWorkup: string[]
  clinicalNotes: string[]
}

interface ClinicalBriefing {
  patientSummary: string
  keyFindings: string[]
  assessment: string
  plan: string[]
  discussionPoints: string[]
  redFlags: string[]
}

export default function ConsultationAnalyzer() {
  const [consultationText, setConsultationText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ClinicalAnalysis | null>(null)
  const [clinicalBriefing, setClinicalBriefing] = useState<ClinicalBriefing | null>(null)

  const sampleConsultations = [
    `45M with 2 hours of substernal chest pressure radiating to left arm. Associated diaphoresis and shortness of breath. PMH: HTN, HLD. Meds: Lisinopril, Atorvastatin. VS: BP 150/90, HR 110, RR 22, O2 sat 94%. ECG shows ST elevation in anterior leads.`,
    `68F with progressive dyspnea on exertion and orthopnea. PMH: DM2, CAD s/p PCI. Meds: Metformin, Aspirin, Clopidogrel. Physical exam: JVD +8cm, bilateral crackles 1/3 up, +S3, 2+ pitting edema. BNP 850. Echo pending.`,
    `32F with new onset thunderclap headache while exercising. No focal neuro deficits. PMH: migraine. Meds: Sumatriptan PRN. Neuro exam: CN II-XII intact, strength 5/5 throughout, sensation intact. No meningismus. CT head ordered.`
  ]

  const analyzeConsultation = async () => {
    if (!consultationText.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/mediAI/analyze-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationText: consultationText,
          patientInfo: { role: 'physician_consultation' }
        }),
      })

      const data = await response.json()
      setAnalysis(data.analysis)
      setClinicalBriefing(data.doctorsResume)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Clinical analysis service temporarily unavailable')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const loadSample = (sample: string) => {
    setConsultationText(sample)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <Stethoscope className="w-12 h-12 mx-auto mb-3 text-blue-500" />
        <h3 className="font-bold text-lg text-foreground">Clinical Encounter Analysis</h3>
        <p className="text-sm text-muted-foreground">
          AI-powered clinical documentation and decision support
        </p>
      </div>

      {/* Sample Consultations */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Clinical Scenarios:</label>
        <div className="flex flex-wrap gap-2">
          {sampleConsultations.map((sample, index) => (
            <button
              key={index}
              onClick={() => loadSample(sample)}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
            >
              Case {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Clinical Encounter Notes:
        </label>
        <textarea
          value={consultationText}
          onChange={(e) => setConsultationText(e.target.value)}
          placeholder="Enter HPI, physical exam findings, assessment and plan..."
          className="w-full h-32 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none font-mono"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyzeConsultation}
        disabled={isAnalyzing || !consultationText.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Analyzing Clinical Data...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5 inline mr-2" />
            Generate Clinical Briefing & Analysis
          </>
        )}
      </button>

      {/* Results */}
      {analysis && clinicalBriefing && (
        <div className="space-y-6">
          {/* Urgency Alert */}
          {analysis.urgencyLevel === 'URGENT' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">URGENT CLINICAL SCENARIO - Immediate Intervention Required</span>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {/* Clinical Briefing */}
            <div className="bg-muted/50 rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-foreground">Clinical Encounter Briefing</h4>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-foreground">Case Summary:</strong>
                  <p className="text-muted-foreground mt-1">{clinicalBriefing.patientSummary}</p>
                </div>
                
                <div>
                  <strong className="text-foreground">Key Clinical Findings:</strong>
                  <ul className="text-muted-foreground mt-1 list-disc list-inside">
                    {clinicalBriefing.keyFindings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <strong className="text-foreground">Clinical Assessment:</strong>
                  <p className="text-muted-foreground mt-1">{clinicalBriefing.assessment}</p>
                </div>
                
                <div>
                  <strong className="text-foreground">Management Plan:</strong>
                  <ul className="text-muted-foreground mt-1 list-disc list-inside">
                    {clinicalBriefing.plan.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Clinical Analysis */}
            <div className="bg-muted/50 rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-foreground">AI Clinical Analysis</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-foreground">Clinical Features:</strong>
                  <div className="mt-1 space-y-1">
                    {analysis.symptomsFound.map((symptom, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-muted-foreground">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <strong className="text-foreground">Differential Diagnosis:</strong>
                  <div className="mt-1 space-y-1">
                    {analysis.differentialDiagnosis.slice(0, 5).map((diagnosis, index) => (
                      <div key={index} className="text-muted-foreground">
                        {diagnosis}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <strong className="text-foreground">Diagnostic Workup:</strong>
                  <div className="mt-1 space-y-1">
                    {analysis.recommendedWorkup.map((test, index) => (
                      <div key={index} className="text-muted-foreground">
                        • {test}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <strong className="text-foreground">Clinical Considerations:</strong>
                  <div className="mt-1 space-y-1">
                    {analysis.clinicalNotes.map((note, index) => (
                      <div key={index} className="text-muted-foreground">
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
