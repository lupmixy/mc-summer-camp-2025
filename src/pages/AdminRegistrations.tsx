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
  waiverUploaded?: boolean
  waiverUploadDate?: string
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
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Registration>>({})

  const fetchRegistrations = async () => {
    if (!adminKey) {
      setError('Please enter admin key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.get('/api/admin', {
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
      'Waiver Status',
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
        `"${reg.waiverUploaded ? 'Uploaded' : 'Pending'}"`,
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

  const handleEditRegistration = (registration: Registration) => {
    setEditingRegistration(registration)
    setEditFormData({
      playerName: registration.playerName,
      parentName: registration.parentName,
      email: registration.email,
      phone: registration.phone,
      program: registration.program,
      position: registration.position,
      shirtSize: registration.shirtSize,
      emergencyContact: registration.emergencyContact,
      emergencyPhone: registration.emergencyPhone,
      medicalConditions: registration.medicalConditions,
      dateOfBirth: registration.dateOfBirth,
      funFact: registration.funFact,
      paymentStatus: registration.paymentStatus,
      amount: registration.amount,
      status: registration.status
    })
    setShowEditModal(true)
  }

  const handleUpdateRegistration = async () => {
    if (!editingRegistration) return

    try {
      const response = await axios.put(`/api/admin-registration?id=${editingRegistration.id}`, editFormData, {
        headers: {
          'X-Admin-Key': adminKey
        }
      })

      if (response.data.success) {
        // Update the local state
        setRegistrations(prev => prev.map(reg => 
          reg.id === editingRegistration.id 
            ? { ...reg, ...editFormData }
            : reg
        ))
        setShowEditModal(false)
        setEditingRegistration(null)
        setEditFormData({})
        setError('')
      }
    } catch (err) {
      console.error('Error updating registration:', err)
      setError('Failed to update registration')
    }
  }

  const handleDeleteRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      return
    }

    try {
      const response = await axios.delete(`/api/admin-registration?id=${registrationId}`, {
        headers: {
          'X-Admin-Key': adminKey
        }
      })

      if (response.data.success) {
        // Remove from local state
        setRegistrations(prev => prev.filter(reg => reg.id !== registrationId))
      }
    } catch (err) {
      console.error('Error deleting registration:', err)
      setError('Failed to delete registration')
    }
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${reg.waiverUploaded ? 'text-green-600' : 'text-red-600'}`}>
                            {reg.waiverUploaded ? '✅ Uploaded' : '❌ Pending'}
                          </div>
                          {reg.waiverUploadDate && (
                            <div className="text-xs text-gray-500">
                              {formatDate(reg.waiverUploadDate)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(reg.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditRegistration(reg)}
                            className="text-mc-gold hover:text-mc-gold-light transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="ml-2 text-red-600 hover:text-red-500 transition-colors"
                          >
                            Delete
                          </button>
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

      {/* Edit Registration Modal */}
      {showEditModal && editingRegistration && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black opacity-50 absolute inset-0"></div>
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
            <h2 className="text-xl font-bold mb-4">Edit Registration</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Player Name</label>
                  <input
                    type="text"
                    value={editFormData.playerName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, playerName: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                  <input
                    type="text"
                    value={editFormData.parentName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, parentName: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <select
                    value={editFormData.program || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, program: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  >
                    <option value="youth">Youth Program</option>
                    <option value="high-school">High School Program</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={editFormData.position || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                    placeholder="e.g., Forward, Midfielder"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shirt Size</label>
                  <select
                    value={editFormData.shirtSize || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, shirtSize: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  >
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
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={editFormData.dateOfBirth || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    value={editFormData.emergencyContact || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
                  <input
                    type="tel"
                    value={editFormData.emergencyPhone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyPhone: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                <textarea
                  value={editFormData.medicalConditions || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, medicalConditions: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  placeholder="Any medical conditions, allergies, or special needs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fun Fact</label>
                <textarea
                  value={editFormData.funFact || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, funFact: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  placeholder="Something fun about the player"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                  <select
                    value={editFormData.paymentStatus || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Status</label>
                  <select
                    value={editFormData.status || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (cents)</label>
                <input
                  type="number"
                  value={editFormData.amount || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-mc-gold focus:border-transparent text-sm"
                  placeholder="Amount in cents (e.g., 15000 for $150.00)"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingRegistration(null)
                  setEditFormData({})
                  setError('')
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRegistration}
                className="bg-mc-gold text-mc-blue font-bold px-4 py-2 rounded-md"
              >
                Update Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRegistrations
