import { NextRequest, NextResponse } from 'next/server'

// In-memory recordings storage (replace with database in production)
const recordings: Map<string, any> = new Map()

export async function GET() {
  try {
    const recordingList = Array.from(recordings.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return NextResponse.json({ recordings: recordingList })
  } catch (error) {
    console.error('Error fetching recordings:', error)
    return NextResponse.json({ error: 'Failed to fetch recordings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { patientName, duration, summary } = await request.json()

    const recordingId = `rec_${Date.now()}`
    const recording = {
      id: recordingId,
      patientName,
      date: new Date().toISOString(),
      duration,
      summary,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }

    recordings.set(recordingId, recording)

    // Log for HIPAA audit trail
    console.log('[MediAI] Recording created:', {
      id: recordingId,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ recording }, { status: 201 })
  } catch (error) {
    console.error('Error creating recording:', error)
    return NextResponse.json({ error: 'Failed to create recording' }, { status: 500 })
  }
}
