// Mock data for standalone frontend operation

// Feature flags for controlling site functionality
export const featureFlags = {
  projectSubmissionsEnabled: false,
  registrationEnabled: true,
  votingEnabled: true,
  adminPanelEnabled: true
}

// Site configuration
export const siteConfig = {
  devpostLink: 'https://cusehacks2025.devpost.com'
}

export const mockTeamMembers = [
  {
    _id: '1',
    name: 'Jason Kapodistrias',
    role: 'President',
    image: '/images/team/Jason.jpg',
    bio: 'Some of my hobbies are music production and hiking.',
    startYear: 2025,
    endYear: null,  // null indicates ongoing service
    isActive: true,
    order: 1,
    links: { linkedin: '' }
  },
  {
    _id: '2',
    name: 'Alan Tom', 
    role: 'Vice President',
    image: '/images/team/Alan.jpg',
    bio: 'Hobbies: Playing video games, cooking, gardening, and I\'m also interested in aquascaping!',
    startYear: 2025,
    endYear: null,  // null indicates ongoing service
    isActive: true,
    order: 2,
    links: { linkedin: '' }
  },
  {
    _id: '3',
    name: 'Kamaljit Aulakh',
    role: 'Web Dev Chair', 
    image: '/images/team/Kamaljit.jpg',
    bio: 'Fueled by chai and fluent in at least five languages (some human, some code).',
    startYear: 2025,
    endYear: null,  // null indicates ongoing service
    isActive: true,
    order: 3,
    links: { linkedin: '' }
  },
  {
    _id: '4',
    name: 'Danielle Lawton',
    role: 'Secretary',
    image: '/images/team/Dani.jpg', 
    bio: 'CS major from Harvard, MA. Lover of big dogs.',
    startYear: 2025,
    endYear: null,  // null indicates ongoing service
    isActive: true,
    order: 4,
    links: { linkedin: '' }
  },
  {
    _id: '5',
    name: 'Hunter Mimaroglu',
    role: 'Sponsorship',
    image: '/images/team/Hunter.jpg',
    bio: 'Some of my hobbies are basketball and mountain biking!',
    startYear: 2025,
    endYear: null,  // null indicates ongoing service
    isActive: true,
    order: 7,
    links: { linkedin: '' }
  },
  {
    _id: '6',
    name: 'Alex Levy',
    role: 'Design Chair',
    image: '/images/team/Alex.jpg',
    bio: 'I like creating stuff, playing video games, and watching cat videos!',
    startYear: 2025,
    endYear: null,  // null indicates ongoing service
    isActive: true,
    order: 8,
    links: { linkedin: '' }
  },
  // Historical team members with flexible date ranges
  {
    _id: '7',
    name: 'Former President',
    role: 'President',
    image: '/images/team/placeholder.jpg',
    bio: 'Led the team during the 2024-2025 academic year.',
    startYear: 2024,
    endYear: 2025,
    isActive: true,
    order: 1,
    links: { linkedin: '' }
  },
  {
    _id: '8',
    name: 'Long-term Member',
    role: 'Vice President', 
    image: '/images/team/placeholder.jpg',
    bio: 'Served multiple terms from 2022 to 2024.',
    startYear: 2022,
    endYear: 2024,
    isActive: true,
    order: 2,
    links: { linkedin: '' }
  },
  {
    _id: '9',
    name: 'Legacy Member',
    role: 'Secretary',
    image: '/images/team/placeholder.jpg',
    bio: 'A founding member who served from the early days.',
    startYear: 1990,
    endYear: 2005,
    isActive: true,
    order: 3,
    links: { linkedin: '' }
  }
]

// Sample data - only keep essential examples
export const mockProjects = [
  {
    _id: '1',
    title: 'CampusConnect',
    description: 'A platform to connect students across campus for study groups, events, and networking.',
    category: 'Best Overall',
    teamMembers: ['Alice Johnson', 'Bob Smith'],
    technologies: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/example/campusconnect',
    liveUrl: 'https://campusconnect-demo.com',
    submissionDate: '2025-01-15T10:30:00Z',
    isApproved: true,
    votes: 42,
    images: []
  }
]

export const mockRegistrations = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    school: 'Syracuse University',
    registrationDate: '2025-01-10T14:30:00Z',
    status: 'confirmed' as const,
    createdAt: '2025-01-10T14:30:00Z'
  }
]

export const mockContactMessages = [
  {
    _id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    subject: 'Question about hackathon rules',
    message: 'Hi, I was wondering if we can use existing open source libraries in our project?',
    submittedAt: '2025-01-15T09:30:00Z',
    isRead: false,
    status: 'new' as const
  },
  {
    _id: '2',
    name: 'Alex Chen',
    email: 'alex@university.edu',
    subject: 'Team formation help',
    message: 'I\'m looking for teammates for the hackathon. Are there any Discord channels for team matching?',
    submittedAt: '2025-01-14T16:45:00Z',
    isRead: true,
    status: 'replied' as const
  }
]

import { realAPI } from './api'

// Configuration - set to false to use real API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

console.log('API Mode:', USE_MOCK_API ? 'Mock' : 'Real')

// Helper functions for localStorage persistence
const getStoredTeamMembers = () => {
  if (typeof window === 'undefined') return mockTeamMembers
  const stored = localStorage.getItem('teamMembers')
  if (!stored) {
    // Initialize localStorage with default team members on first load
    setStoredTeamMembers(mockTeamMembers)
    return mockTeamMembers
  }
  return JSON.parse(stored)
}

const setStoredTeamMembers = (members: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('teamMembers', JSON.stringify(members))
  }
}

// Helper functions for site config persistence
const getStoredSiteConfig = () => {
  if (typeof window === 'undefined') return siteConfig
  const stored = localStorage.getItem('siteConfig')
  if (!stored) {
    // Initialize localStorage with default config on first load
    setStoredSiteConfig(siteConfig)
    return siteConfig
  }
  return JSON.parse(stored)
}

const setStoredSiteConfig = (config: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('siteConfig', JSON.stringify(config))
  }
}

// Mock API functions
const mockAPIImpl = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
    if (email === 'admin@cusehacks.org' && password === 'password123') {
      return { success: true, token: 'mock-jwt-token' }
    }
    throw new Error('Invalid credentials')
  },

  // Team
  getTeam: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return getStoredTeamMembers()
  },

  deleteTeamMember: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const currentMembers = getStoredTeamMembers()
    const updatedMembers = currentMembers.filter((member: any) => member._id !== _id)
    setStoredTeamMembers(updatedMembers)
    return { success: true }
  },

  updateTeamMember: async (updatedMember: any) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const currentMembers = getStoredTeamMembers()
    const updatedMembers = currentMembers.map((member: any) => 
      member._id === updatedMember._id ? updatedMember : member
    )
    setStoredTeamMembers(updatedMembers)
    return updatedMember
  },

  addTeamMember: async (member: any) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const currentMembers = getStoredTeamMembers()
    const newMembers = [...currentMembers, member]
    setStoredTeamMembers(newMembers)
    return { success: true, member }
  },

  // Development helper: reset team members to default
  resetTeamMembers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setStoredTeamMembers(mockTeamMembers)
    return { success: true }
  },

  // Projects  
  getProjects: async (category?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    if (category && category !== 'all') {
      return mockProjects.filter(p => p.category === category)
    }
    return mockProjects
  },

  submitProject: async (_projectData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true, id: Date.now().toString() }
  },

  voteProject: async (projectId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const project = mockProjects.find(p => p._id === projectId)
    if (project) {
      project.votes += 1
      return { votes: project.votes }
    }
    throw new Error('Project not found')
  },

  // Registration
  register: async (registrationData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { 
      success: true, 
      registrationId: Date.now().toString(),
      registration: {
        ...registrationData,
        status: 'pending',
        registrationDate: new Date().toISOString()
      }
    }
  },

  getRegistrations: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      registrations: mockRegistrations,
      stats: {
        total: mockRegistrations.length,
        confirmed: mockRegistrations.filter(r => r.status === 'confirmed').length,
        pending: 0,
        waitlisted: 0
      }
    }
  },

  // Feature Flags
  getFeatureFlags: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    // Load from localStorage if available
    const stored = localStorage.getItem('cusehacks_feature_flags')
    if (stored) {
      try {
        const parsedFlags = JSON.parse(stored)
        // Update the featureFlags object with stored values
        Object.assign(featureFlags, parsedFlags)
      } catch (error) {
        console.error('Error parsing stored feature flags:', error)
      }
    }
    return featureFlags
  },

  updateFeatureFlag: async (flag: keyof typeof featureFlags, value: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    featureFlags[flag] = value
    // Persist to localStorage
    localStorage.setItem('cusehacks_feature_flags', JSON.stringify(featureFlags))
    return { success: true, flags: featureFlags }
  },

  // Site Configuration
  getSiteConfig: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return getStoredSiteConfig()
  },

  updateSiteConfig: async (updates: Partial<typeof siteConfig>) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const currentConfig = getStoredSiteConfig()
    const updatedConfig = { ...currentConfig, ...updates }
    setStoredSiteConfig(updatedConfig)
    return { success: true, config: updatedConfig }
  },

  // Contact Messages
  submitContactMessage: async (messageData: { name: string; email: string; subject: string; message: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newMessage = {
      _id: Date.now().toString(),
      ...messageData,
      submittedAt: new Date().toISOString(),
      isRead: false,
      status: 'new' as const
    }
    mockContactMessages.unshift(newMessage) // Add to beginning for newest first
    return { success: true, messageId: newMessage._id }
  },

  getContactMessages: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      messages: mockContactMessages,
      stats: {
        total: mockContactMessages.length,
        unread: mockContactMessages.filter(m => !m.isRead).length,
        new: mockContactMessages.filter(m => m.status === 'new').length,
        replied: mockContactMessages.filter(m => m.status === 'replied').length
      }
    }
  },

  markMessageAsRead: async (messageId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const message = mockContactMessages.find(m => m._id === messageId)
    if (message) {
      message.isRead = true
    }
    return { success: true }
  },

  updateMessageStatus: async (messageId: string, status: 'new' | 'replied') => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const message = mockContactMessages.find(m => m._id === messageId)
    if (message) {
      message.status = status
      message.isRead = true
    }
    return { success: true }
  },

  deleteContactMessage: async (messageId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockContactMessages.findIndex(m => m._id === messageId)
    if (index > -1) {
      mockContactMessages.splice(index, 1)
    }
    return { success: true }
  }
}

// Export the API based on configuration
export const mockAPI = USE_MOCK_API ? mockAPIImpl : realAPI