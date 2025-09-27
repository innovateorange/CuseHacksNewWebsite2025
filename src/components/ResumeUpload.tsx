import { useState, useRef } from 'react'
import { Upload, X, Check, AlertCircle } from 'lucide-react'

interface ResumeUploadProps {
  onUploadSuccess: (data: { url: string; fileName: string; uploadDate: string }) => void
  onUploadError: (error: string) => void
}

function ResumeUpload({ onUploadSuccess, onUploadError }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed')
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    try {
      validateFile(file)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setUploadedFile({ name: file.name, url: data.url })
      onUploadSuccess(data)
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (uploadedFile) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Check className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-green-300 font-medium">Resume uploaded successfully</p>
            <p className="text-green-200 text-sm">{uploadedFile.name}</p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="p-1 text-green-400 hover:text-green-300 transition-colors"
          title="Remove file"
        >
          <X size={18} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Resume Upload <span className="text-white/60">(Optional)</span>
      </label>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-primary-400 bg-primary-500/10'
            : 'border-primary-500/30 hover:border-primary-500/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="text-white/80">Uploading resume...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <Upload className="w-12 h-12 text-primary-400" />
            <div>
              <p className="text-white/90 mb-1">
                Drop your resume here or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary-400 hover:text-primary-300 underline"
                >
                  browse files
                </button>
              </p>
              <p className="text-white/60 text-sm">PDF only, max 5MB</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center space-x-2 text-sm text-white/60">
        <AlertCircle size={16} />
        <span>Resume submission is optional but recommended for better networking opportunities</span>
      </div>
    </div>
  )
}

export default ResumeUpload