import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Generate a sample PDF (in production, this would fetch from database and generate actual PDF)
    const pdfContent = `
Consultation Report - ${id}
Generated: ${new Date().toISOString()}

This is a sample consultation report.
In production, this would contain:
- Full consultation transcript
- Medical recommendations
- Drug interaction alerts
- Treatment guidelines
- Patient information (encrypted)

HIPAA Compliance Notice:
This document contains protected health information (PHI).
Unauthorized access is prohibited by law.
    `

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="consultation-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error downloading recording:', error)
    return NextResponse.json({ error: 'Failed to download recording' }, { status: 500 })
  }
}
