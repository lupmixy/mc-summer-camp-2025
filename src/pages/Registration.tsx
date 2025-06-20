import { useState } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios'
import DatePicker from 'react-datepicker'
import InputMask from 'react-input-mask'
import { useLocation } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css"

type Program = 'youth' | 'highschool'

const CAMP_PRICES = {
  youth: 19900,
  highschool: 24900
}

const POSITIONS = [
  'Forward',
  'Midfielder',
  'Defender',
  'Goalkeeper',
  'Not Sure Yet'
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const RegistrationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation()

  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    playerFirstName: '',
    playerLastName: '',
    dateOfBirth: new Date(),
    program: (location.state?.program || 'youth') as Program,
    position: '',
    funFact: '',
    parentFirstName: '',
    parentLastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    agreedToTerms: false,
    shirtSize: '',
    hasSignedWaiver: false
  })

  const handleProgramChange = (program: Program) => {
    setFormData(prev => ({ ...prev, program }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe not initialized');
      }

      // Get payment intent
      const response = await axios.post(`${API_BASE_URL}/create-payment-intent`, {
        amount: formData.program === 'youth' ? 19900 : 24900,
        program: formData.program
      });

      const { clientSecret } = response.data;

      // Confirm card payment with the card elements
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: formData.parentFirstName + ' ' + formData.parentLastName,
            email: formData.email
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      console.log('Payment confirmed successfully, submitting registration')

      const registrationData = {
        ...formData,
        paymentStatus: 'paid',
        amount: CAMP_PRICES[formData.program]
      }

      console.log('Sending registration data:', registrationData)

      const registrationResponse = await axios.post(`${API_BASE_URL}/register`, registrationData)

      console.log('Registration response:', registrationResponse.data)

      if (registrationResponse.data.success) {
        // Store registration data in sessionStorage for the success page
        sessionStorage.setItem('registrationData', JSON.stringify({
          registrationData: registrationData,
          paymentIntentId: result.paymentIntent?.id
        }))
        window.location.href = '/registration-success'
      } else {
        throw new Error('Registration failed: ' + JSON.stringify(registrationResponse.data))
      }
    } catch (err) {
      console.error('Registration error:', err)
      if (axios.isAxiosError(err) && err.response) {
        console.error('Server error details:', err.response.data)
        const errorMessage = err.response.data?.details || err.response.data?.error || `Server error (${err.response.status})`
        alert(`Registration failed: ${errorMessage}`)
      } else if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
        alert(`Registration failed: ${err.message}`)
      } else {
        console.error('Unknown error:', err)
        alert('Registration failed: Unknown error occurred')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Program Selection */}
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <img 
            src="/branding/soccerBearTatBrown.png" 
            alt="Soccer Bear" 
            className="w-10 h-10"
          />
          <h2 className="text-2xl font-bold text-gray-800">Select Your Program</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleProgramChange('youth')}
            className={`p-6 rounded-lg border-2 transition-all ${
              formData.program === 'youth'
                ? 'border-mc-gold ring-2 ring-mc-gold ring-offset-2 bg-white'
                : 'border-gray-200 hover:border-mc-gold/50 opacity-60 hover:opacity-100 bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-4">
              <img 
                src="/branding/soccerBearTatBrown.png" 
                alt="Youth Program" 
                className="w-12 h-12 mr-3"
              />
              <div className="text-left">
                <h3 className="font-bold text-gray-800">Youth Program</h3>
                <p className="text-gray-600">Ages 8-14</p>
              </div>
            </div>
            <p className="font-bold text-2xl text-mc-blue">$199</p>
          </button>

          <button
            type="button"
            onClick={() => handleProgramChange('highschool')}
            className={`p-6 rounded-lg border-2 transition-all ${
              formData.program === 'highschool'
                ? 'border-mc-gold ring-2 ring-mc-gold ring-offset-2 bg-white'
                : 'border-gray-200 hover:border-mc-gold/50 opacity-60 hover:opacity-100 bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-4">
              <img 
                src="/branding/lancerGirlsSoccerladyLancerBluered@3x.png" 
                alt="High School Program" 
                className="w-12 h-12 mr-3"
              />
              <div className="text-left">
                <h3 className="font-bold text-gray-800">High School Program</h3>
                <p className="text-gray-600">Grades 8-12</p>
              </div>
            </div>
            <p className="font-bold text-2xl text-mc-blue">$249</p>
          </button>
        </div>
      </div>

      {/* Player Information */}
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <img 
            src="/branding/soccerBearTatBrown.png" 
            alt="Soccer Bear" 
            className="w-10 h-10"
          />
          <h2 className="text-2xl font-bold text-gray-800">Player Information</h2>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="playerFirstName" className="block text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="playerFirstName"
                value={formData.playerFirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, playerFirstName: e.target.value }))}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="playerLastName" className="block text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="playerLastName"
                value={formData.playerLastName}
                onChange={(e) => setFormData(prev => ({ ...prev, playerLastName: e.target.value }))}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Date of Birth *</label>
            <DatePicker
              selected={formData.dateOfBirth}
              onChange={(date: Date | null) => date && setFormData(prev => ({ ...prev, dateOfBirth: date }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Preferred Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
            >
              <option value="">Select a position...</option>
              {POSITIONS.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Shirt Size *</label>
            <select
              value={formData.shirtSize}
              onChange={(e) => setFormData(prev => ({ ...prev, shirtSize: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              required
            >
              <option value="">Select a size...</option>
              <option value="YS">Youth Small</option>
              <option value="YM">Youth Medium</option>
              <option value="YL">Youth Large</option>
              <option value="AS">Adult Small</option>
              <option value="AM">Adult Medium</option>
              <option value="AL">Adult Large</option>
              <option value="AXL">Adult XL</option>
            </select>
          </div>

          <div>
            <label htmlFor="funFact" className="block text-gray-700 mb-2">
              Fun Fact About Player
            </label>
            <textarea
              id="funFact"
              value={formData.funFact}
              onChange={(e) => setFormData(prev => ({ ...prev, funFact: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              rows={2}
              placeholder="Share something interesting about yourself! (Optional)"
            />
          </div>
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <img 
            src="/branding/soccerBearTatBrown.png" 
            alt="Soccer Bear" 
            className="w-10 h-10"
          />
          <h2 className="text-2xl font-bold text-gray-800">Parent/Guardian Information</h2>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="parentFirstName" className="block text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="parentFirstName"
                value={formData.parentFirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, parentFirstName: e.target.value }))}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="parentLastName" className="block text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="parentLastName"
                value={formData.parentLastName}
                onChange={(e) => setFormData(prev => ({ ...prev, parentLastName: e.target.value }))}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone Number *
            </label>
            <InputMask
              mask="(999) 999-9999"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-mc-blue mb-6">Emergency Contact</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="emergencyContact" className="block text-gray-700 mb-2">
              Emergency Contact Name *
            </label>
            <input
              type="text"
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="emergencyPhone" className="block text-gray-700 mb-2">
              Emergency Contact Phone *
            </label>
            <InputMask
              mask="(999) 999-9999"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-mc-blue mb-6">Medical Information</h2>
        <div>
          <label htmlFor="medicalConditions" className="block text-gray-700 mb-2">
            Medical Conditions or Allergies
          </label>
          <textarea
            id="medicalConditions"
            value={formData.medicalConditions}
            onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
            rows={4}
            placeholder="Please list any medical conditions, allergies, or medications we should be aware of. Write 'None' if not applicable."
          />
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-mc-blue mb-6">Payment Information</h2>
        <div className="space-y-4">
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Program Cost:</p>
            <p className="text-3xl font-bold text-mc-blue">
              ${(CAMP_PRICES[formData.program] / 100).toFixed(2)}
            </p>
          </div>
          <div className="mt-4 p-6 border-2 border-mc-gold rounded-lg bg-white shadow-lg">
            <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center">
              <span className="text-mc-gold mr-2">💳</span>
              Card Details
            </label>
            
            {/* Card Number - Full Width */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <div className="p-4 border-2 border-mc-gold/30 rounded-md bg-gray-50 focus-within:border-mc-gold focus-within:bg-white transition-all">
                <CardNumberElement
                  options={{
                    style: {
                      base: {
                        fontSize: '18px',
                        color: '#1e3a8a',
                        fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
                        fontWeight: '500',
                        '::placeholder': {
                          color: '#6b7280',
                        },
                      },
                      invalid: {
                        color: '#dc2626',
                      },
                      complete: {
                        color: '#059669',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Expiry and CVC - Side by Side on Desktop, Stacked on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <div className="p-4 border-2 border-mc-gold/30 rounded-md bg-gray-50 focus-within:border-mc-gold focus-within:bg-white transition-all">
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          fontSize: '18px',
                          color: '#1e3a8a',
                          fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
                          fontWeight: '500',
                          '::placeholder': {
                            color: '#6b7280',
                          },
                        },
                        invalid: {
                          color: '#dc2626',
                        },
                        complete: {
                          color: '#059669',
                        },
                      },
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                <div className="p-4 border-2 border-mc-gold/30 rounded-md bg-gray-50 focus-within:border-mc-gold focus-within:bg-white transition-all">
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: '18px',
                          color: '#1e3a8a',
                          fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
                          fontWeight: '500',
                          '::placeholder': {
                            color: '#6b7280',
                          },
                        },
                        invalid: {
                          color: '#dc2626',
                        },
                        complete: {
                          color: '#059669',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-4 flex items-center">
              <span className="text-green-500 mr-1">🔒</span>
              Your payment information is encrypted and secure. Zip code is not required.
            </p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-mc-blue mb-6">Terms and Agreements</h2>
        
        {/* Waiver Download Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <span className="text-yellow-600 text-xl mr-3">📄</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Required Waiver Form</h3>
              <p className="text-yellow-700 text-sm mb-3">
                A signed waiver form is required before camp begins. You can download it now and either:
              </p>
              <ul className="text-yellow-700 text-sm mb-3 ml-4">
                <li>• Upload the signed PDF after completing registration, or</li>
                <li>• Bring the completed form on the first day of camp</li>
              </ul>
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
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
              className="mt-1 mr-3"
              required
            />
            <label htmlFor="agreedToTerms" className="text-gray-700">
              I agree to the terms and conditions of the camp, including the payment and refund policies.
            </label>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="hasSignedWaiver"
              checked={formData.hasSignedWaiver}
              onChange={(e) => setFormData(prev => ({ ...prev, hasSignedWaiver: e.target.checked }))}
              className="mt-1 mr-3"
              required
            />
            <label htmlFor="hasSignedWaiver" className="text-gray-700">
              I acknowledge that a signed waiver form is required and will be submitted before or on the first day of camp.
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !formData.agreedToTerms || !formData.hasSignedWaiver}
        className="w-full bg-mc-gold text-mc-blue font-bold py-4 px-8 rounded-md text-lg
                   hover:bg-mc-gold-light hover:text-mc-blue-dark
                   focus:outline-none focus:ring-4 focus:ring-mc-gold/50 
                   disabled:bg-mc-gold/50 disabled:text-mc-blue/70 disabled:cursor-not-allowed
                   transition-colors duration-200 ease-in-out"
      >
        {isProcessing ? 'Processing...' : 'Complete Registration'}
      </button>
    </form>
  )
}

const Registration = () => {
  return (
    <Elements stripe={stripePromise}>
      <RegistrationForm />
    </Elements>
  );
};

export default Registration