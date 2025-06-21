import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
          src="/branding/mclogo.png" 
          alt="MC Logo" 
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
          Thank you for registering for MC Girls Soccer Camp! A confirmation email has been sent to your email address with important camp information and a link to submit your required waiver form.
        </p>
        
        {/* Waiver Information Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <span className="text-yellow-600 text-2xl mr-3">📄</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Next Step: Waiver Form</h3>
              <p className="text-yellow-700 mb-3">
                A signed waiver form is required before camp begins. We've sent you an email with a convenient link to submit it online, or you can download it now:
              </p>
              
              <div className="mb-4">
                <a
                  href="/documents/MC_Girls_Soccer_Camp_Waiver_2025.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-mc-blue text-white px-4 py-2 rounded-md hover:bg-mc-blue-dark transition-colors text-sm font-medium mr-3 mb-2"
                >
                  <span className="mr-2">📥</span>
                  Download Waiver Form
                </a>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-blue-700 text-sm mb-2">
                  <strong>Two ways to submit your waiver:</strong>
                </p>
                <ul className="text-blue-700 text-sm ml-4 space-y-1">
                  <li>• <strong>Online:</strong> Use the link in your confirmation email to upload the signed PDF</li>
                  <li>• <strong>In Person:</strong> Bring the completed form on the first day of camp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">
          If you have any questions, please contact us at:{' '}
          <a 
            href="mailto:mcgirlssoccer12@gmail.com" 
            className="text-mc-blue hover:text-mc-blue-dark underline"
          >
            mcgirlssoccer12@gmail.com
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