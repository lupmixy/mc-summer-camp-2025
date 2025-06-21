import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import WaiverUpload from '../components/WaiverUpload'

const WaiverSubmission = () => {
  const location = useLocation()
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [playerName, setPlayerName] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Get registration ID from URL query params
    const urlParams = new URLSearchParams(location.search)
    const regId = urlParams.get('registrationId')
    const playerNameParam = urlParams.get('playerName')

    if (regId) {
      setRegistrationId(regId)
      setPlayerName(playerNameParam || '')
    } else {
      setError('Registration ID not found in URL. Please use the link from your confirmation email.')
    }
  }, [location])

  const handleUploadSuccess = () => {
    // Waiver uploaded successfully - could redirect or show success message
    console.log('Waiver uploaded successfully!')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mc-blue to-mc-blue-dark py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg text-center">
            <img 
              src="/branding/soccerBearTatBrown.png" 
              alt="Colombo Soccer Camp Logo" 
              className="w-24 h-24 mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Link
            </h1>
            <p className="text-gray-700 mb-6">
              {error}
            </p>
            <Link
              to="/"
              className="inline-block bg-mc-gold text-mc-blue px-6 py-3 rounded-md font-bold hover:bg-mc-gold-light transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!registrationId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mc-blue to-mc-blue-dark py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mc-gold mx-auto mb-4"></div>
            <p className="text-gray-700">Loading waiver submission form...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mc-blue to-mc-blue-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <img 
              src="/branding/soccerBearTatBrown.png" 
              alt="Colombo Soccer Camp Logo" 
              className="w-24 h-24 mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-mc-blue mb-4">
              Submit Waiver Form
            </h1>
            <p className="text-gray-700 mb-2">
              Colombo Girls Soccer Camp 2025
            </p>
            {playerName && (
              <p className="text-lg font-semibold text-mc-blue">
                Player: {playerName}
              </p>
            )}
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <span className="text-blue-600 text-xl mr-3">ℹ️</span>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Waiver Form Instructions</h3>
                  <ol className="text-blue-700 text-sm space-y-1 ml-4">
                    <li>1. Download and print the waiver form using the link below</li>
                    <li>2. Fill out all required information completely</li>
                    <li>3. Sign the form (parent/guardian signature required)</li>
                    <li>4. Scan or take a clear photo of the completed form</li>
                    <li>5. Upload the signed waiver as a PDF using the form below</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <a
                href="/documents/MC_Girls_Soccer_Camp_Waiver_2025.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-mc-gold text-mc-blue px-6 py-3 rounded-md hover:bg-mc-gold-light transition-colors text-lg font-medium"
              >
                <span className="mr-2">📥</span>
                Download Waiver Form
              </a>
            </div>
          </div>

          <WaiverUpload 
            registrationId={registrationId}
            playerName={playerName}
            onUploadSuccess={handleUploadSuccess}
          />

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about the waiver form, please contact us:
            </p>
            <a 
              href="mailto:michael@mcolombo.com" 
              className="text-mc-blue hover:text-mc-blue-dark underline font-medium"
            >
              michael@mcolombo.com
            </a>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaiverSubmission
