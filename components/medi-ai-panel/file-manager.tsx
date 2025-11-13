// components/medi-ai-panel/file-manager.tsx
'use client'

import { useState } from 'react'
import { FileText, Download, Upload, Search, Folder } from 'lucide-react'

export default function MedicalFileManager() {
  const [files, setFiles] = useState([
    { id: 1, name: 'Medical_History_John_Smith.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-15' },
    { id: 2, name: 'Lab_Results_Blood_Test.pdf', type: 'pdf', size: '1.8 MB', date: '2024-01-10' },
    { id: 3, name: 'Prescription_Metformin.docx', type: 'doc', size: '0.8 MB', date: '2024-01-08' },
    { id: 4, name: 'XRay_Chest_Image.jpg', type: 'image', size: '4.2 MB', date: '2024-01-05' },
    { id: 5, name: 'Consultation_Notes_0124.txt', type: 'text', size: '0.3 MB', date: '2024-01-03' }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'doc': return '📝'
      case 'image': return '🖼️'
      default: return '📄'
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-600'
      case 'doc': return 'text-blue-600'
      case 'image': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <Folder className="w-12 h-12 mx-auto mb-3 text-blue-500" />
        <h3 className="font-bold text-lg text-gray-900">Medical File Manager</h3>
        <p className="text-sm text-gray-600">Manage patient documents and medical files</p>
      </div>

      {/* Search and Actions */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Patient Files</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredFiles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No files found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div key={file.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div>
                      <div className="font-medium text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-600">
                        {file.size} • {file.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Storage Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">Storage Usage</span>
          <span className="text-sm text-blue-700">9.5 MB / 100 MB</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '9.5%' }}></div>
        </div>
        <div className="text-xs text-blue-600 mt-1">9.5% of storage used</div>
      </div>
    </div>
  )
}