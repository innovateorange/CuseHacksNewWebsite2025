// Real API client for production use
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:3001/api')

class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'APIError'
  }
}

const getAuthToken = () => {
  return localStorage.getItem('admin_token')
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }))
      throw new APIError(errorData.message || `HTTP ${response.status}`, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError('Network request failed', 0)
  }
}

export const realAPI = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Keep UX consistent
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    return response
  },

  // Team
  getTeam: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest('/team/admin')
  },

  addTeamMember: async (memberData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest('/team/admin', {
      method: 'POST',
      body: JSON.stringify(memberData)
    })
  },

  updateTeamMember: async (memberData: any) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest(`/team/admin`, {
      method: 'PUT',
      body: JSON.stringify(memberData)
    })
  },

  deleteTeamMember: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest(`/team/admin?id=${id}`, {
      method: 'DELETE'
    })
  },

  // Contact Messages
  submitContactMessage: async (messageData: { name: string; email: string; subject: string; message: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return await apiRequest('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(messageData)
    })
  },

  getContactMessages: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest('/contact/admin')
  },

  markMessageAsRead: async (messageId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return await apiRequest(`/contact/admin`, {
      method: 'PATCH',
      body: JSON.stringify({ id: messageId, isRead: true })
    })
  },

  updateMessageStatus: async (messageId: string, status: 'new' | 'replied') => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return await apiRequest(`/contact/admin`, {
      method: 'PATCH',
      body: JSON.stringify({ id: messageId, status })
    })
  },

  deleteContactMessage: async (messageId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest(`/contact/admin?id=${messageId}`, {
      method: 'DELETE'
    })
  },

  // Feature Flags
  getFeatureFlags: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return await apiRequest('/admin/feature-flags')
  },

  updateFeatureFlag: async (flag: string, value: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest(`/admin/feature-flags`, {
      method: 'PUT',
      body: JSON.stringify({ flagName: flag, enabled: value })
    })
  },

  // Site Configuration (placeholder for future implementation)
  getSiteConfig: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    // Placeholder - return default config for now
    return { devpostLink: 'https://cusehacks2025.devpost.com' }
  },

  updateSiteConfig: async (updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Placeholder - just return success for now
    return { success: true, config: { devpostLink: 'https://cusehacks2025.devpost.com', ...updates } }
  },

  // Projects (placeholder for future implementation)
  getProjects: async (_category?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    // For now, return empty array - implement when needed
    return []
  },

  submitProject: async (_projectData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    // Placeholder - implement when needed
    return { success: true, id: Date.now().toString() }
  },

  voteProject: async (_projectId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Placeholder - implement when needed
    return { votes: 1 }
  },

  // Registration
  register: async (registrationData: { name: string; email: string; school: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    })
  },

  getRegistrations: async (page: number = 1, limit: number = 50, status?: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    })
    return await apiRequest(`/register/admin?${params}`)
  },

  updateRegistrationStatus: async (registrationId: string, status: 'pending' | 'confirmed' | 'waitlisted') => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest(`/register/admin`, {
      method: 'PUT',
      body: JSON.stringify({ id: registrationId, status })
    })
  },

  deleteRegistration: async (registrationId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return await apiRequest(`/register/admin?id=${registrationId}`, {
      method: 'DELETE'
    })
  }
}