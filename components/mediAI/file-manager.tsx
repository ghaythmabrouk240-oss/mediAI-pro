'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Image, File, X, Download, Eye } from 'lucide-react'

interface MedicalFile {
  id: string
  name: string
  type: 'lab' | 'image' | 'prescription' | 'report' | 'other'
  size: number
  uploadDate: string
  patientId?: string
  description?: string
}

export default function MedicalFileManager() {
  const [files, setFiles] = useState<MedicalFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileTypes = {
    lab: ['Blood Test', 'Urine Analysis', 'Biochemistry', 'Hematology'],
    image: ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG'],
    prescription: ['Medication List', 'Prescription'],
    report: ['Consultation Report', 'Discharge Summary', 'Progress Note'],
    other: ['Referral Letter', 'Insurance Document', 'Other']
  }

  const handleFiles = async (selectedFiles: FileList) => {
    setIsUploading(true)
    
    const newFiles: MedicalFile[] = []
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      
      // Determine file type based on name and extension
      const fileType = determineFileType(file.name, file.type)
      
      const medicalFile: MedicalFile = {
        id: `file_${Date.now()}_${i}`,
        name: file.name,
        type: fileType,
        size: file.size,
        uploadDate: new Date().toISOString(),
        description: `Medical ${fileType} file`
      }
      
      newFiles.push(medicalFile)
      
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setFiles(prev => [...prev, ...newFiles])
    setIsUploading(false)
    
    // In production, actually upload to cloud storage
    console.log('Files uploaded:', newFiles)
  }

  const determineFileType = (fileName: string, mimeType: string): MedicalFile['type'] => {
    const lowerName = fileName.toLowerCase()
    
    if (lowerName.includes('blood') || lowerName.includes('lab') || lowerName.includes('test')) return 'lab'
    if (lowerName.includes('xray') || lowerName.includes('mri') || lowerName.includes('ct') || lowerName.includes('scan')) return 'image'
    if (lowerName.includes('prescription') || lowerName.includes('medication')) return 'prescription'
    if (lowerName.includes('report') || lowerName.includes('summary') || lowerName.includes('note')) return 'report'
    
    return 'other'
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const downloadFile = (file: MedicalFile) => {
    // Simulate download - in production, this would fetch from storage
    const blob = new Blob([`Simulated content for ${file.name}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const getFileIcon = (type: MedicalFile['type']) => {
    switch (type) {
      case 'lab': return <FileText className="w-5 h-5 text-blue-500" />
      case 'image': return <Image className="w-5 h-5 text-green-500" />
      case 'prescription': return <File className="w-5 h-5 text-purple-500" />
      case 'report': return <FileText className="w-5 h-5 text-orange-500" />
      default: return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-4 space-y-4">
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-border bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.dicom,.txt,.doc,.docx"
        />
        
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          Upload Medical Files
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Drag & drop lab results, medical images, prescriptions, or reports
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Choose Files'}
        </button>
        
        <p className="text-xs text-muted-foreground mt-3">
          Supported: PDF, JPG, PNG, DICOM, TXT, DOC (Max 50MB each)
        </p>
      </div>

      {/* File List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No medical files uploaded yet</p>
            <p className="text-sm">Upload lab results, images, or reports to get started</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.type.toUpperCase()}</span>
                    <span>•</span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => downloadFile(file)}
                  className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center gap-2 p-3 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-500/20 transition-colors">
          <FileText className="w-4 h-4" />
          Lab Results
        </button>
        <button className="flex items-center gap-2 p-3 bg-green-500/10 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-500/20 transition-colors">
          <Image className="w-4 h-4" />
          Medical Images
        </button>
      </div>
    </div>
  )
}
