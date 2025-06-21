import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import WaiverUpload from '../components/WaiverUpload'

interface RegistrationData {
  playerFirstName: string
  playerLastName: string
  program: string
  parentFirstName: string
  parentLastName: string
  email: string
}

interface StoredData {
  registrationData: RegistrationData
  paymentIntentId?: string
  registrationId?: string
}

const RegistrationSuccess = () => {
  const [registrationInfo, setRegistrationInfo] = useState<StoredData | null>(null)

  useEffect(() => {
    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('registrationData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        console.log('Registration success data:', parsedData)
        setRegistrationInfo(parsedData)
        // Clear the data after reading it
        sessionStorage.removeItem('registrationData')
      } catch (error) {
        console.error('Error parsing registration data:', error)
      }
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
        <img 
          src="/branding/soccerBearTatBrown.png" 
          alt="Colombo Soccer Camp Logo" 
          className="w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-mc-blue mb-4">
          Registration Successful!
        </h1>
        
        {registrationInfo && (
          <div className="bg-mc-gold/10 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-bold text-mc-blue mb-2">Registration Details:</h3>
            <p><strong>Player:</strong> {registrationInfo.registrationData.playerFirstName} {registrationInfo.registrationData.playerLastName}</p>
            <p><strong>Program:</strong> {registrationInfo.registrationData.program === 'youth' ? 'Youth Program (Ages 8-14)' : 'High School Program (Grades 8-12)'}</p>
            <p><strong>Parent/Guardian:</strong> {registrationInfo.registrationData.parentFirstName} {registrationInfo.registrationData.parentLastName}</p>
            <p><strong>Email:</strong> {registrationInfo.registrationData.email}</p>
            {registrationInfo.paymentIntentId && (
              <p className="text-sm text-gray-600 mt-2"><strong>Payment ID:</strong> {registrationInfo.paymentIntentId}</p>
            )}
          </div>
        )}
        
        <p className="text-gray-700 mb-6">
          Thank you for registering for MC Girls Soccer Camp! A confirmation email has been sent to your email address with important camp information. You can complete your waiver submission below or use the link in your email later.
        </p>
        
        {/* Waiver Information Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <span className="text-yellow-600 text-2xl mr-3">📄</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Required Waiver Form</h3>
              <p className="text-yellow-700 mb-3">
                A signed waiver form is required before camp begins. Download it below, and if you're ready, you can upload the signed version right away!
              </p>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/documents/MC_Girls_Soccer_Camp_Waiver_2025.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-mc-blue text-white px-4 py-2 rounded-md hover:bg-mc-blue-dark transition-colors text-sm font-medium"
                  >
                    <span className="mr-2">�</span>
                    Download PDF Waiver
                  </a>
                  <a
                    href="/documents/MC_Girls_Soccer_Camp_Waiver_2025.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <span className="mr-2">🌐</span>
                    View HTML Version
                  </a>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-blue-700 text-sm mb-2">
                  <strong>Three ways to submit your waiver:</strong>
                </p>
                <ul className="text-blue-700 text-sm ml-4 space-y-1">
                  <li>• <strong>Upload Now:</strong> Print, sign, scan and upload below</li>
                  <li>• <strong>Upload Later:</strong> Use the link in your confirmation email</li>
                  <li>• <strong>In Person:</strong> Bring the completed form on the first day of camp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Waiver Upload Section */}
        {registrationInfo?.registrationId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <span className="text-green-600 text-2xl mr-3">📤</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Upload Signed Waiver (Optional)</h3>
                <p className="text-green-700 mb-4 text-sm">
                  Got your waiver printed, signed, and scanned already? Upload it now to complete everything at once!
                </p>
                
                <WaiverUpload
                  registrationId={registrationInfo.registrationId}
                  playerName={`${registrationInfo.registrationData.playerFirstName} ${registrationInfo.registrationData.playerLastName}`}
                  onUploadSuccess={() => {
                    console.log('Waiver uploaded successfully from registration success page')
                  }}
                />
                
                <div className="mt-3 p-3 bg-green-100 rounded text-sm text-green-700">
                  <p className="font-medium mb-1">💡 Pro Tip:</p>
                  <p>Many smartphone cameras can scan documents directly to PDF. Check your camera app or download a scanning app like Adobe Scan (free).</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-gray-700 mb-6">
          If you have any questions, please contact us at:{' '}
          <a 
            href="mailto:michael@mcolombo.com" 
            className="text-mc-blue hover:text-mc-blue-dark underline"
          >
            michael@mcolombo.com
          </a>
        </p>
        <Link
          to="/gallery"
          className="inline-block bg-mc-gold text-mc-blue px-6 py-3 rounded-md font-bold hover:bg-mc-gold-light transition-colors"
        >
          View Camp Gallery
        </Link>
      </div>
    </div>
  )
}

export default RegistrationSuccess