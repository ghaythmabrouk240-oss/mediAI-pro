// app/api/mediAI/patients/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Enhanced patient data storage
const patients: Map<string, any> = new Map()

// Initialize with some sample patient data
patients.set('patient_1', {
  id: 'patient_1',
  name: 'John Smith',
  age: 45,
  email: 'john.smith@example.com',
  phone: '+1-555-0123',
  conditions: ['Hypertension', 'Type 2 Diabetes'],
  medications: ['Lisinopril 10mg', 'Metformin 500mg'],
  allergies: ['Penicillin'],
  bloodType: 'A+',
  emergencyContact: 'Jane Smith (555-0124)',
  lastVisit: new Date().toISOString(),
  insurance: 'Medicare Part B'
})

patients.set('patient_2', {
  id: 'patient_2', 
  name: 'Maria Garcia',
  age: 32,
  email: 'maria.garcia@example.com',
  phone: '+1-555-0125',
  conditions: ['Asthma', 'Seasonal Allergies'],
  medications: ['Albuterol Inhaler', 'Loratadine 10mg'],
  allergies: ['Shellfish'],
  bloodType: 'O+',
  emergencyContact: 'Carlos Garcia (555-0126)',
  lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  insurance: 'Blue Cross Blue Shield'
})

patients.set('patient_3', {
  id: 'patient_3',
  name: 'Robert Johnson',
  age: 68,
  email: 'robert.johnson@example.com',
  phone: '+1-555-0127',
  conditions: ['COPD', 'Heart Failure'],
  medications: ['Spiriva', 'Lasix 40mg', 'Carvedilol'],
  allergies: ['Sulfa', 'Iodine'],
  bloodType: 'B-',
  emergencyContact: 'Sarah Johnson (555-0128)',
  lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  insurance: 'Medicare Advantage'
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('id')

    if (patientId) {
      const patient = patients.get(patientId)
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
      }
      return NextResponse.json({ patient })
    }

    // Return all patients
    const patientList = Array.from(patients.values())
    return NextResponse.json({ patients: patientList })
  } catch (error) {
    console.error('Error fetching patient context:', error)
    return NextResponse.json({ error: 'Failed to fetch patient data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, age, email, phone, conditions, medications, allergies, bloodType, emergencyContact, insurance } = await request.json()

    if (!name || !age) {
      return NextResponse.json({ error: 'Name and age are required' }, { status: 400 })
    }

    const patientId = `patient_${Date.now()}`
    const patient = {
      id: patientId,
      name,
      age,
      email: email || '',
      phone: phone || '',
      conditions: conditions || [],
      medications: medications || [],
      allergies: allergies || [],
      bloodType: bloodType || 'Unknown',
      emergencyContact: emergencyContact || '',
      insurance: insurance || '',
      lastVisit: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    patients.set(patientId, patient)

    // Log for HIPAA audit trail
    console.log('[MediAI Pro] Patient created:', { 
      id: patientId, 
      timestamp: new Date().toISOString(),
      hasMedicalData: conditions?.length > 0 || medications?.length > 0
    })

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
  }
}