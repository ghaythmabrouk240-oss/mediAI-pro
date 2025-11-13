import { NextRequest, NextResponse } from 'next/server'

// In-memory recordings storage (replace with database in production)
const recordings: Map<string, any> = new Map()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!recordings.has(id)) {
      return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
    }

    recordings.delete(id)

    // Log for HIPAA audit trail
    console.log('[MediAI] Recording deleted:', { id, timestamp: new Date().toISOString() })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting recording:', error)
    return NextResponse.json({ error: 'Failed to delete recording' }, { status: 500 })
  }
}
