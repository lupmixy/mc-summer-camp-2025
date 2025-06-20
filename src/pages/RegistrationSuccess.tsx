import { Link } from 'react-router-dom'

const RegistrationSuccess = () => {
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