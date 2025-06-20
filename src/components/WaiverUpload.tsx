import { useState } from 'react'

interface WaiverUploadProps {
  registrationId: string
  playerName: string
  onUploadSuccess?: () => void
}

const WaiverUpload = ({ registrationId, playerName, onUploadSuccess }: WaiverUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
        setError('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('waiver', file)
      formData.append('registrationId', registrationId)
      formData.append('playerName', playerName)

      const response = await fetch('/api/upload-waiver', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploaded(true)
      setFile(null)
      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (uploaded) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-green-500 text-2xl mr-3">✅</span>
          <div>
            <h3 className="text-lg font-semibold text-green-800">Waiver Uploaded Successfully!</h3>
            <p className="text-green-700">Thank you for submitting the signed waiver form.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">📄 Upload Signed Waiver</h3>
        <p className="text-yellow-700 text-sm mb-4">
          Please download, print, sign, and upload the completed waiver form. This is required before camp begins.
        </p>
        
        {/* Download Waiver Link */}
        <div className="mb-4">
          <a
            href="/documents/MC_Girls_Soccer_Camp_Waiver_2025.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-mc-blue text-white px-4 py-2 rounded-md hover:bg-mc-blue-dark transition-colors text-sm font-medium"
          >
            <span className="mr-2">📥</span>
            Download Waiver Form (Print as PDF)
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Signed Waiver (PDF only)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-mc-gold file:text-mc-blue hover:file:bg-mc-gold-light"
            disabled={uploading}
          />
          {file && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-mc-gold text-mc-blue font-semibold px-6 py-2 rounded-md hover:bg-mc-gold-light disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Signed Waiver'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>• File must be in PDF format</p>
        <p>• Maximum file size: 10MB</p>
        <p>• The waiver must be completely filled out and signed</p>
      </div>
    </div>
  )
}

export default WaiverUpload
