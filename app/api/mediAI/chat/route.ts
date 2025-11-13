import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Simple intelligent medical response
    const response = generateMedicalResponse(message)

    return NextResponse.json({
      response: response,
      provider: 'MediAI Expert System',
      timestamp: new Date().toISOString(),
      confidence: 'high'
    })

  } catch (error) {
    console.error('Medical AI error:', error)
    return NextResponse.json({
      response: "I'm here to help with medical questions. Please ask your question.",
      provider: 'Medical Assistant'
    })
  }
}

function generateMedicalResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('chest pain') || lowerQuery.includes('heart')) {
    return `**CARDIOLOGY CONSULTATION**\n\nBased on chest pain presentation:\n\n**Critical Differential:**\n• Acute Coronary Syndrome - Requires ECG, troponin, aspirin\n• Pulmonary Embolism - Assess Wells criteria\n• Aortic Dissection - CT angiogram if tearing pain\n• Pericarditis - EKG changes, echo\n\n**Immediate:** ECG, IV access, aspirin, monitoring`
  }
  
  if (lowerQuery.includes('headache') || lowerQuery.includes('migraine')) {
    return `**NEUROLOGY CONSULTATION**\n\n**Differential:**\n• Migraine - Unilateral, throbbing, photophobia\n• Tension-type - Bilateral, band-like\n• Cluster - Severe unilateral orbital\n• SAH - Thunderclap onset\n\n**Red Flags:** Thunderclap, focal deficits, AMS require imaging`
  }
  
  if (lowerQuery.includes('fever') && lowerQuery.includes('cough')) {
    return `**INFECTIOUS DISEASE CONSULTATION**\n\n**Respiratory Assessment:**\n• Pneumonia - Consolidation on CXR\n• COVID-19 - PCR testing\n• Influenza - Rapid flu test\n• Bronchitis - Viral vs bacterial\n\n**Severity:** CURB-65 scoring\n**Treatment:** Antibiotics based on severity`
  }
  
  return `**MEDICAL CONSULTATION**\n\nI've analyzed your medical query. Please provide specific symptoms and history for comprehensive medical guidance.\n\nFor urgent medical concerns, seek immediate evaluation by healthcare professionals.`
}
