// components/medi-ai-panel/patient-management.tsx
'use client'

import { useState, useEffect } from 'react'
import { User, Search, Plus, Calendar, Phone, Mail, Stethoscope } from 'lucide-react'

interface Patient {
  id: string
  name: string
  age: number
  email: string
  phone: string
  conditions: string[]
  medications: string[]
  allergies: string[]
  bloodType: string
  emergencyContact: string
  lastVisit: string
  insurance: string
}

interface PatientManagementProps {
  onPatientSelect: (patient: Patient) => void
}

export default function PatientManagement({ onPatientSelect }: PatientManagementProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/mediAI/patients')
      const data = await response.json()
      setPatients(data.patients || [])
    } catch (error) {
      console.error('Error fetching patients:', error)
      // Fallback to mock data
      setPatients([
        {
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
        },
        {
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
        },
        {
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
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.conditions.some(condition => 
      condition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    onPatientSelect(patient)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Patient Management</h3>
          <p className="text-sm text-gray-600">Select a patient to begin consultation</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          <Plus className="w-4 h-4" />
          New Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search patients by name or condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Patient List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No patients found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                selectedPatient?.id === patient.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                    <p className="text-sm text-gray-600">
                      {patient.age} years • {patient.bloodType}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {patient.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div className="flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3" />
                    Last visit
                  </div>
                  <div>{formatDate(patient.lastVisit)}</div>
                </div>
              </div>

              {/* Medical Info */}
              <div className="mt-3 space-y-2">
                {patient.conditions.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Stethoscope className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {patient.conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.medications.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0">💊</div>
                    <div className="flex flex-wrap gap-1">
                      {patient.medications.slice(0, 3).map((med, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {med}
                        </span>
                      ))}
                      {patient.medications.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{patient.medications.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {patient.allergies.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0">⚠️</div>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Insurance */}
              <div className="mt-2 text-xs text-gray-500">
                Insurance: {patient.insurance}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Patient Info */}
      {selectedPatient && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <User className="w-4 h-4" />
            <span className="font-medium">Selected for Consultation</span>
          </div>
          <p className="text-sm text-green-600">
            <strong>{selectedPatient.name}</strong> is now selected. All AI interactions will be 
            context-aware of this patient's medical history.
          </p>
        </div>
      )}
    </div>
  )
}