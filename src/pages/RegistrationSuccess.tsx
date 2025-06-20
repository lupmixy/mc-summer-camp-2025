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
}

const RegistrationSuccess = () => {
  const [registrationInfo, setRegistrationInfo] = useState<StoredData | null>(null)

  useEffect(() => {
    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('registrationData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
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
          Thank you for registering for MC Girls Soccer Camp! A confirmation email has been sent to your email address.
        </p>
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