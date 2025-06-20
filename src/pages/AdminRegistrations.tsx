import { useState } from 'react'
import axios from 'axios'

interface Registration {
  id: string
  type: 'registration'
  playerName: string
  parentName: string
  email: string
  phone: string
  program: string
  position: string
  shirtSize: string
  emergencyContact: string
  emergencyPhone: string
  medicalConditions: string
  dateOfBirth: string
  funFact: string
  paymentStatus: string
  amount: number
  createdAt: string
  status: string
}

interface ContactSubmission {
  id: string
  type: 'contact'
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: string
  status: string
}

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'registrations' | 'contacts'>('registrations')

  const fetchRegistrations = async () => {
    if (!adminKey) {
      setError('Please enter admin key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.get('/api/admin-registrations', {
        headers: {
          'X-Admin-Key': adminKey
        }
      })

      setRegistrations(response.data.registrations)
      setContacts(response.data.contacts)
      setAuthenticated(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Invalid admin key')
      } else {
        setError('Failed to fetch admin data')
      }
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateOfBirth = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    // If it's already in YYYY-MM-DD format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr
    }
    // If it's a full datetime string, extract just the date part
    try {
      const date = new Date(dateStr)
      return date.toISOString().split('T')[0]
    } catch {
      return dateStr
    }
  }

  const exportRegistrationsToCSV = () => {
    if (registrations.length === 0) return

    const headers = [
      'Player Name',
      'Parent Name', 
      'Email',
      'Phone',
      'Program',
      'Position',
      'Shirt Size',
      'Emergency Contact',
      'Emergency Phone',
      'Medical Conditions',
      'Date of Birth',
      'Fun Fact',
      'Payment Status',
      'Amount',
      'Registration Date',
      'Status'
    ]

    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.playerName}"`,
        `"${reg.parentName}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.program}"`,
        `"${reg.position || ''}"`,
        `"${reg.shirtSize}"`,
        `"${reg.emergencyContact}"`,
        `"${reg.emergencyPhone}"`,
        `"${reg.medicalConditions || ''}"`,
        `"${formatDateOfBirth(reg.dateOfBirth)}"`,
        `"${reg.funFact || ''}"`,
        `"${reg.paymentStatus}"`,
        `"${reg.amount || ''}"`,
        `"${new Date(reg.createdAt).toLocaleDateString()}"`,
        `"${reg.status}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `mc-soccer-registrations-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportContactsToCSV = () => {
    if (contacts.length === 0) return

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Message',
      'Submission Date',
      'Status'
    ]

    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        `"${contact.name}"`,
        `"${contact.email}"`,
        `"${contact.phone || ''}"`,
        `"${contact.subject}"`,
        `"${contact.message.replace(/"/g, '""')}"`, // Escape quotes in message
        `"${new Date(contact.createdAt).toLocaleDateString()}"`,
        `"${contact.status}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `mc-soccer-contacts-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mc-blue to-mc-blue-dark flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <img 
              src="/branding/mclogo.png" 
              alt="MC Logo" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-mc-blue">Admin Access</h1>
            <p className="text-gray-600">Enter admin key to view registrations</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && fetchRegistrations()}
            />
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="w-full bg-mc-gold text-mc-blue font-bold py-2 px-4 rounded-md hover:bg-mc-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Access Admin Panel'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-mc-blue text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">MC Soccer Camp Admin</h1>
            <p className="text-mc-gold">Administrative Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Registrations: <span className="font-bold text-mc-gold">{registrations.length}</span>
            </span>
            <span className="text-sm">
              Contacts: <span className="font-bold text-mc-gold">{contacts.length}</span>
            </span>
            <button
              onClick={activeTab === 'registrations' ? exportRegistrationsToCSV : exportContactsToCSV}
              className="bg-mc-gold text-mc-blue px-4 py-2 rounded-md font-bold hover:bg-mc-gold-light transition-colors"
            >
              Export {activeTab === 'registrations' ? 'Registrations' : 'Contacts'} CSV
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="bg-mc-blue-dark text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('registrations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'registrations'
                    ? 'border-mc-gold text-mc-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registrations ({registrations.length})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-mc-gold text-mc-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contact Submissions ({contacts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'registrations' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-lg">Loading registrations...</div>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">No registrations found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{reg.playerName}</div>
                          <div className="text-sm text-gray-500">DOB: {formatDateOfBirth(reg.dateOfBirth)}</div>
                          <div className="text-sm text-gray-500">Size: {reg.shirtSize}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{reg.parentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reg.email}</div>
                          <div className="text-sm text-gray-500">{reg.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 capitalize">{reg.program}</div>
                          <div className="text-sm text-gray-500">{reg.position}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {reg.medicalConditions && (
                              <div><strong>Medical:</strong> {reg.medicalConditions}</div>
                            )}
                            {reg.funFact && (
                              <div><strong>Fun Fact:</strong> {reg.funFact}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reg.emergencyContact}</div>
                          <div className="text-sm text-gray-500">{reg.emergencyPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{formatCurrency(reg.amount)}</div>
                          <div className="text-sm text-green-600">{reg.paymentStatus}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(reg.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-lg">Loading contact submissions...</div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">No contact submissions found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.email}</div>
                          {contact.phone && (
                            <div className="text-sm text-gray-500">{contact.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contact.subject}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {contact.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(contact.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contact.status === 'new' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {contact.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRegistrations
