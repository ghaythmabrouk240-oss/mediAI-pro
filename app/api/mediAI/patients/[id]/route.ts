import { NextRequest, NextResponse } from 'next/server'

// In-memory patient storage (replace with database in production)
const patients: Map<string, any> = new Map()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!patients.has(id)) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    patients.delete(id)

    // Log for HIPAA audit trail
    console.log('[MediAI] Patient deleted:', { id, timestamp: new Date().toISOString() })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 })
  }
}
