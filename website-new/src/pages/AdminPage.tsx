import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { mockAPI } from '../lib/mockData'
import { useFeatureFlags } from '../contexts/FeatureFlagContext'
import ImageUpload from '../components/ImageUpload'

interface TeamMember {
  _id: string
  name: string
  role: string
  image: string
  bio?: string
  startYear: number
  endYear: number | null  // null or 0 indicates ongoing service
  isActive: boolean
  order: number
  links?: {
    github?: string
    linkedin?: string
    email?: string
    website?: string
  }
}

function AdminPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [authLoading, setAuthLoading] = useState(false)
  const { flags, updateFlag, loading: flagsLoading } = useFeatureFlags()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    image: '',
    bio: '',
    startYear: new Date().getFullYear(),
    endYear: null as number | null,  // null indicates ongoing service
    order: 1,
    links: { github: '', linkedin: '', email: '', website: '' }
  })
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [siteConfig, setSiteConfig] = useState({ devpostLink: '' })
  const [configLoading, setConfigLoading] = useState(false)

  // Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    
    try {
      const data = await mockAPI.login(credentials.email, credentials.password)
      
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_token', data.token)
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    } finally {
      setAuthLoading(false)
    }
  }

  // Check existing auth
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const data = await mockAPI.getTeam()
      setTeamMembers(data.sort((a: TeamMember, b: TeamMember) => a.order - b.order))
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeamMembers()
      loadSiteConfig()
    }
  }, [isAuthenticated])

  // Load site config
  const loadSiteConfig = async () => {
    try {
      const config = await mockAPI.getSiteConfig()
      setSiteConfig(config)
    } catch (error) {
      console.error('Error loading site config:', error)
    }
  }

  // Update DevPost link
  const handleUpdateDevPostLink = async (newLink: string) => {
    if (!newLink.trim()) {
      alert('Please enter a valid DevPost link')
      return
    }

    setConfigLoading(true)
    try {
      const result = await mockAPI.updateSiteConfig({ devpostLink: newLink.trim() })
      if (result.success) {
        setSiteConfig(result.config)
        alert('DevPost link updated successfully!')
      }
    } catch (error) {
      console.error('Error updating DevPost link:', error)
      alert('Failed to update DevPost link')
    } finally {
      setConfigLoading(false)
    }
  }

  // Delete team member
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    
    try {
      await mockAPI.deleteTeamMember(id)
      setTeamMembers(prev => prev.filter(member => member._id !== id))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting team member')
    }
  }

  // Toggle active status
  const toggleActive = async (member: TeamMember) => {
    try {
      const updatedMember = { ...member, isActive: !member.isActive }
      await mockAPI.updateTeamMember(updatedMember)
      setTeamMembers(prev => 
        prev.map(m => m._id === member._id ? updatedMember : m)
      )
    } catch (error) {
      console.error('Toggle error:', error)
    }
  }

  // Add team member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const memberData = {
        ...newMember,
        _id: Date.now().toString(),
        isActive: true
      }
      await mockAPI.addTeamMember(memberData)
      setTeamMembers(prev => [...prev, memberData].sort((a, b) => a.order - b.order))
      setNewMember({
        name: '',
        role: '',
        image: '',
        bio: '',
        startYear: new Date().getFullYear(),
        endYear: null,  // null indicates ongoing service
        order: Math.max(...teamMembers.map(m => m.order), 0) + 1,
        links: { github: '', linkedin: '', email: '', website: '' }
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Add member error:', error)
      alert('Error adding team member')
    }
  }

  // Edit team member
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setShowEditForm(true)
    setShowAddForm(false)
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return

    try {
      await mockAPI.updateTeamMember(editingMember)
      setTeamMembers(prev => 
        prev.map(m => m._id === editingMember._id ? editingMember : m).sort((a, b) => a.order - b.order)
      )
      setEditingMember(null)
      setShowEditForm(false)
    } catch (error) {
      console.error('Update member error:', error)
      alert('Error updating team member')
    }
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center mb-8 font-orbitron">Admin Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {authLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-orbitron">Admin Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
            >
              View Site
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token')
                setIsAuthenticated(false)
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <h2 className="text-xl font-bold text-blue-400 mb-2">Team Management</h2>
              <p className="text-white/70 text-sm mb-4">Manage team members, roles, and profiles</p>
            </div>
            <button
              onClick={() => window.location.href = '/admin/registrations'}
              className="bg-gradient-to-b from-green-500/20 to-green-500/5 backdrop-blur-md rounded-xl p-6 border border-green-500/30 text-left hover:bg-green-500/10 transition-colors"
            >
              <h2 className="text-xl font-bold text-green-400 mb-2">Registrations</h2>
              <p className="text-white/70 text-sm">View and manage hackathon registrations</p>
            </button>
            <button
              onClick={() => window.location.href = '/admin/messages'}
              className="bg-gradient-to-b from-orange-500/20 to-orange-500/5 backdrop-blur-md rounded-xl p-6 border border-orange-500/30 text-left hover:bg-orange-500/10 transition-colors"
            >
              <h2 className="text-xl font-bold text-orange-400 mb-2">Messages</h2>
              <p className="text-white/70 text-sm">View and respond to contact messages</p>
            </button>
            <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-xl font-bold text-purple-400 mb-2">Feature Controls</h2>
              <p className="text-white/70 text-sm mb-4">Toggle site features and functionality</p>
            </div>
          </div>

          {/* Feature Flag Controls */}
          <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-400 mb-4">Site Feature Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Project Submissions</h4>
                  <p className="text-white/70 text-sm">Allow users to submit their hackathon projects</p>
                </div>
                <button
                  onClick={() => updateFlag('projectSubmissionsEnabled', !flags.projectSubmissionsEnabled)}
                  disabled={flagsLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    flags.projectSubmissionsEnabled ? 'bg-primary-500' : 'bg-gray-600'
                  } ${flagsLoading ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      flags.projectSubmissionsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">User Registration</h4>
                  <p className="text-white/70 text-sm">Allow new users to register for the hackathon</p>
                </div>
                <button
                  onClick={() => updateFlag('registrationEnabled', !flags.registrationEnabled)}
                  disabled={flagsLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    flags.registrationEnabled ? 'bg-primary-500' : 'bg-gray-600'
                  } ${flagsLoading ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      flags.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Project Voting</h4>
                  <p className="text-white/70 text-sm">Allow users to vote on submitted projects</p>
                </div>
                <button
                  onClick={() => updateFlag('votingEnabled', !flags.votingEnabled)}
                  disabled={flagsLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    flags.votingEnabled ? 'bg-primary-500' : 'bg-gray-600'
                  } ${flagsLoading ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      flags.votingEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Site Configuration */}
          <div className="bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 backdrop-blur-md rounded-xl p-6 border border-cyan-500/30 mb-8">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">Site Configuration</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-3">
                  <h4 className="text-white font-medium mb-2">DevPost Link</h4>
                  <p className="text-white/70 text-sm mb-3">Set the DevPost link where users will submit their projects</p>
                </div>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={siteConfig.devpostLink}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, devpostLink: e.target.value }))}
                    placeholder="https://yourcontest.devpost.com"
                    className="flex-1 px-4 py-2 bg-[#0a0a1a]/50 border border-cyan-500/30 rounded-lg focus:border-cyan-500 focus:outline-none text-white"
                  />
                  <button
                    onClick={() => handleUpdateDevPostLink(siteConfig.devpostLink)}
                    disabled={configLoading}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {configLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
                {siteConfig.devpostLink && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-white/70 text-sm">Current link:</span>
                    <a 
                      href={siteConfig.devpostLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-sm hover:text-cyan-300 underline"
                    >
                      {siteConfig.devpostLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-orbitron">Team Members</h2>
          <div className="flex gap-2">
            {showEditForm && (
              <button
                onClick={() => {
                  setShowEditForm(false)
                  setEditingMember(null)
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel Edit
              </button>
            )}
            <button
              onClick={() => {
                setShowAddForm(!showAddForm)
                setShowEditForm(false)
                setEditingMember(null)
              }}
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {showAddForm ? 'Cancel' : 'Add Member'}
            </button>
          </div>
        </div>

        {/* Add Member Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 mb-6"
          >
            <h3 className="text-xl font-bold text-purple-400 mb-4">Add New Team Member</h3>
            <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                <ImageUpload
                  onImageChange={(imageUrl) => setNewMember(prev => ({ ...prev, image: imageUrl }))}
                  currentImage={newMember.image}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start Year</label>
                <input
                  type="number"
                  value={newMember.startYear}
                  onChange={(e) => setNewMember(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  min="1900"
                  max="2100"
                  required
                />
                <p className="text-white/60 text-xs mt-1">Year when this person started serving</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Year</label>
                <input
                  type="number"
                  value={newMember.endYear || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setNewMember(prev => ({ 
                      ...prev, 
                      endYear: value === '' || value === '0' ? null : parseInt(value) 
                    }))
                  }}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  min="0"
                  max="2100"
                  placeholder="Leave empty or enter 0 for ongoing service"
                />
                <p className="text-white/60 text-xs mt-1">Year when this person finished serving (leave empty or use 0 for current members)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  value={newMember.order}
                  onChange={(e) => setNewMember(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={newMember.links.linkedin}
                  onChange={(e) => setNewMember(prev => ({ ...prev, links: { ...prev.links, linkedin: e.target.value } }))}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={newMember.bio}
                  onChange={(e) => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  rows={3}
                  placeholder="Short bio about the team member..."
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Edit Member Form */}
        {showEditForm && editingMember && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 mb-6"
          >
            <h3 className="text-xl font-bold text-blue-400 mb-4">Edit Team Member</h3>
            <form onSubmit={handleUpdateMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, role: e.target.value }) : null)}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                <ImageUpload
                  onImageChange={(imageUrl) => setEditingMember(prev => prev ? ({ ...prev, image: imageUrl }) : null)}
                  currentImage={editingMember.image}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start Year</label>
                <input
                  type="number"
                  value={editingMember.startYear}
                  onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, startYear: parseInt(e.target.value) }) : null)}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  min="1900"
                  max="2100"
                  required
                />
                <p className="text-white/60 text-xs mt-1">Year when this person started serving</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Year</label>
                <input
                  type="number"
                  value={editingMember.endYear || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setEditingMember(prev => prev ? ({ 
                      ...prev, 
                      endYear: value === '' || value === '0' ? null : parseInt(value) 
                    }) : null)
                  }}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  min="0"
                  max="2100"
                  placeholder="Leave empty or enter 0 for ongoing service"
                />
                <p className="text-white/60 text-xs mt-1">Year when this person finished serving (leave empty or use 0 for current members)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  value={editingMember.order}
                  onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, order: parseInt(e.target.value) }) : null)}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={editingMember.links?.linkedin || ''}
                  onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, links: { ...prev.links, linkedin: e.target.value } }) : null)}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember(prev => prev ? ({ ...prev, bio: e.target.value }) : null)}
                  className="w-full px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white"
                  rows={3}
                  placeholder="Short bio about the team member..."
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Update Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingMember(null)
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 ${!member.isActive ? 'opacity-50' : ''}`}
              >
                <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/images/robot-mascot-transparent.png"
                    }}
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">
                  {member.name}
                </h3>
                <p className="text-primary-500 text-sm font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-white/70 text-xs mb-4">
                  Served: {member.startYear} - {member.endYear || 'Present'} | Order: {member.order}
                </p>
                
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleActive(member)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      member.isActive 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {member.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleEditMember(member)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage