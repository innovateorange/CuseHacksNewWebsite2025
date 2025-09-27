import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Download, FileText, ExternalLink, FileDown } from 'lucide-react'
import { realAPI as mockAPI } from '../lib/api'

interface Registration {
  _id: string
  name: string
  email: string
  school: string
  registrationDate: string
  status: 'pending' | 'confirmed' | 'waitlisted'
  createdAt: string
  resumeUrl?: string
  resumeFileName?: string
  resumeUploadDate?: string
  hasResume?: boolean
}

interface RegistrationStats {
  total: number
  confirmed: number
  pending: number
  waitlisted: number
}

function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<RegistrationStats>({ total: 0, confirmed: 0, pending: 0, waitlisted: 0 })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check existing auth
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
    } else {
      // Redirect to main admin page for login
      window.location.href = '/admin'
    }
  }, [])

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const data = await mockAPI.getRegistrations()
      setRegistrations(data.registrations || [])
      setStats(data.stats || { total: 0, confirmed: 0, pending: 0, waitlisted: 0 })
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations()
    }
  }, [isAuthenticated])

  // Update registration status
  const updateStatus = async (registrationId: string, newStatus: 'pending' | 'confirmed' | 'waitlisted') => {
    try {
      const registration = registrations.find(r => r._id === registrationId)
      if (!registration) return

      await mockAPI.updateRegistrationStatus(registrationId, newStatus)

      // Update local state
      setRegistrations(prev =>
        prev.map(r =>
          r._id === registrationId
            ? { ...r, status: newStatus }
            : r
        )
      )

      // Update stats
      setStats(prev => {
        const updated = { ...prev }
        // Decrement old status
        updated[registration.status]--
        // Increment new status
        updated[newStatus]++
        return updated
      })
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Delete registration
  const deleteRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return

    try {
      const registration = registrations.find(r => r._id === registrationId)
      if (!registration) return

      await mockAPI.deleteRegistration(registrationId)

      // Remove from local state
      setRegistrations(prev => prev.filter(r => r._id !== registrationId))

      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        [registration.status]: prev[registration.status] - 1
      }))
    } catch (error) {
      console.error('Error deleting registration:', error)
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations to export')
      return
    }

    // CSV headers
    const headers = ['Name', 'Email', 'School', 'Status', 'Registration Date', 'Has Resume', 'Resume Filename', 'Resume URL']

    // Convert registrations to CSV format
    const csvContent = [
      headers.join(','),
      ...registrations.map(registration => [
        `"${registration.name.replace(/"/g, '""')}"`, // Escape quotes in names
        `"${registration.email}"`,
        `"${registration.school.replace(/"/g, '""')}"`, // Escape quotes in school names
        registration.status,
        new Date(registration.registrationDate).toLocaleDateString(),
        registration.hasResume ? 'Yes' : 'No',
        registration.resumeFileName ? `"${registration.resumeFileName.replace(/"/g, '""')}"` : '',
        registration.resumeUrl ? `"${registration.resumeUrl}"` : ''
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `cusehacks2025-registrations-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Download all resumes as ZIP
  const downloadResumes = async () => {
    const resumesWithFiles = registrations.filter(reg => reg.hasResume && reg.resumeUrl)

    if (resumesWithFiles.length === 0) {
      alert('No resumes available for download')
      return
    }

    try {
      // Create a simple ZIP-like download approach
      // For now, we'll download individual files
      // In a production environment, you'd want a proper ZIP creation service

      for (const registration of resumesWithFiles) {
        if (registration.resumeUrl && registration.resumeFileName) {
          // Create a link to download each resume
          const link = document.createElement('a')
          link.href = registration.resumeUrl
          link.download = `${registration.name.replace(/[^a-zA-Z0-9]/g, '_')}_${registration.resumeFileName}`
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Add small delay between downloads to avoid overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } catch (error) {
      console.error('Error downloading resumes:', error)
      alert('Failed to download resumes. Please try again.')
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-orbitron">Registration Management</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportToCSV}
              disabled={registrations.length === 0}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Download size={18} />
              Download CSV
            </button>
            <button
              onClick={downloadResumes}
              disabled={registrations.filter(r => r.hasResume).length === 0}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
              title={`Download ${registrations.filter(r => r.hasResume).length} resumes`}
            >
              <FileDown size={18} />
              Download Resumes ({registrations.filter(r => r.hasResume).length})
            </button>
            <Link
              to="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Admin
            </Link>
            <Link
              to="/"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
            >
              View Site
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-blue-400 text-sm font-medium mb-2">Total Registrations</h3>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-b from-green-500/20 to-green-500/5 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
            <h3 className="text-green-400 text-sm font-medium mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-white">{stats.confirmed}</p>
          </div>
          <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-500/5 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
            <h3 className="text-yellow-400 text-sm font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-white">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-b from-red-500/20 to-red-500/5 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
            <h3 className="text-red-400 text-sm font-medium mb-2">Waitlisted</h3>
            <p className="text-3xl font-bold text-white">{stats.waitlisted}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">No Registrations Yet</h3>
            <p className="text-white/60">Registration submissions will appear here.</p>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl border border-purple-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-500/10 border-b border-purple-500/20">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-white">Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-white">Email</th>
                    <th className="text-left px-6 py-4 font-semibold text-white">School</th>
                    <th className="text-left px-6 py-4 font-semibold text-white">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-white">Resume</th>
                    <th className="text-left px-6 py-4 font-semibold text-white">Registered</th>
                    <th className="text-left px-6 py-4 font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <motion.tr
                      key={registration._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {registration.name}
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {registration.school}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          registration.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                          registration.status === 'waitlisted' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                        }`}>
                          {registration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {registration.hasResume && registration.resumeUrl ? (
                          <a
                            href={registration.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                            title={registration.resumeFileName || 'Download Resume'}
                          >
                            <FileText size={16} />
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-white/40 text-sm">No resume</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {new Date(registration.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <select
                            value={registration.status}
                            onChange={(e) => updateStatus(registration._id, e.target.value as any)}
                            className="bg-[#0a0a1a]/50 border border-primary-500/30 rounded px-3 py-1 text-sm text-white focus:border-primary-500 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="waitlisted">Waitlisted</option>
                          </select>
                          <button
                            onClick={() => deleteRegistration(registration._id)}
                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRegistrationsPage