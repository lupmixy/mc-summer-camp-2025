import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact form')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit contact form')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
          <img 
            src="/branding/soccerBearTatBrown.png" 
            alt="Colombo Soccer Camp Logo" 
            className="w-24 h-24 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-mc-blue mb-4">
            Thank You!
          </h1>
          <p className="text-gray-700 mb-6">
            Your message has been sent successfully. We'll get back to you as soon as possible!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-mc-gold text-mc-blue px-6 py-3 rounded-md font-bold hover:bg-mc-gold-light transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-white/80 text-lg">
          Have questions about MC Girls Soccer Camp? We'd love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-mc-blue mb-6">Send us a Message</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Camp Information">Camp Information</option>
                <option value="Registration Question">Registration Question</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Schedule Question">Schedule Question</option>
                <option value="Equipment Question">Equipment Question</option>
                <option value="Special Needs">Special Needs/Accommodations</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mc-gold focus:border-transparent resize-vertical"
                placeholder="Please tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-mc-gold text-mc-blue font-bold py-3 px-6 rounded-md hover:bg-mc-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-mc-blue mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-mc-gold p-3 rounded-full">
                <svg className="w-6 h-6 text-mc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">michael@mcolombo.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-mc-gold p-3 rounded-full">
                <svg className="w-6 h-6 text-mc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">
                  Donovan Field<br />
                  Malden Catholic High School<br />
                  Malden, MA
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-mc-gold p-3 rounded-full">
                <svg className="w-6 h-6 text-mc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Response Time</h3>
                <p className="text-gray-600">
                  We typically respond within 24 hours<br />
                  Faster response during business hours
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-mc-gold/10 rounded-lg border border-mc-gold/20">
            <h3 className="font-semibold text-mc-blue mb-2">Camp Dates 2025</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>All Programs:</strong> August 4-7, 2025</p>
              <p><strong>Time:</strong> 8:00 AM - 12:00 PM daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
