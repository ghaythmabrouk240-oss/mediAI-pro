// components/medi-ai-panel/report-generator.tsx
'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, User, Stethoscope } from 'lucide-react'

export default function ReportGenerator() {
  const [reportType, setReportType] = useState('consultation')
  const [dateRange, setDateRange] = useState('today')
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTemplates = [
    { id: 'consultation', name: 'Consultation Summary', icon: FileText },
    { id: 'medical', name: 'Medical History', icon: User },
    { id: 'clinical', name: 'Clinical Analysis', icon: Stethoscope },
    { id: 'progress', name: 'Progress Report', icon: Calendar }
  ]

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      // In real implementation, this would download the report
      alert('Report generated successfully!')
    }, 2000)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <FileText className="w-12 h-12 mx-auto mb-3 text-blue-500" />
        <h3 className="font-bold text-lg text-gray-900">Medical Report Generator</h3>
        <p className="text-sm text-gray-600">Generate comprehensive medical reports</p>
      </div>

      {/* Report Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">Report Type</label>
        <div className="grid grid-cols-2 gap-3">
          {reportTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setReportType(template.id)}
              className={`p-4 border rounded-xl text-center transition-all ${
                reportType === template.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <template.icon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{template.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">Date Range</label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">Report Options</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm text-gray-700">Include patient demographics</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm text-gray-700">Include medication history</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Include lab results</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm text-gray-700">Include clinical notes</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateReport}
        disabled={isGenerating}
        className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating Report...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Generate & Download Report
          </>
        )}
      </button>

      {/* Recent Reports */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Recent Reports</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-700">Consultation_Summary_0124.pdf</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-700">Medical_History_John_Smith.pdf</span>
            <span className="text-gray-500">1 day ago</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-700">Clinical_Analysis_0124.pdf</span>
            <span className="text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}