import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { mockAPI } from '../lib/mockData'
import ResumeUpload from '../components/ResumeUpload'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: ''
  })
  const [resumeData, setResumeData] = useState<{
    url: string
    fileName: string
    uploadDate: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleResumeUploadSuccess = (data: { url: string; fileName: string; uploadDate: string }) => {
    setResumeData(data)
    setUploadError(null)
  }

  const handleResumeUploadError = (error: string) => {
    setUploadError(error)
    setResumeData(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.school) {
        throw new Error('Please fill in all required fields')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      // Include resume data in registration
      const registrationData = {
        ...formData,
        ...(resumeData && {
          resumeUrl: resumeData.url,
          resumeFileName: resumeData.fileName,
          resumeUploadDate: resumeData.uploadDate,
          hasResume: true
        })
      }

      const result = await mockAPI.register(registrationData)

      if (!result.success) {
        throw new Error('Registration failed')
      }

      setSubmitStatus('success')
      // Reset form
      setFormData({
        name: '',
        email: '',
        school: ''
      })
      setResumeData(null)
      setUploadError(null)
    } catch (error) {
      console.error('Registration error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold font-orbitron mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
            Register for CuseHacks 2025
          </h1>
          <p className="text-white/80 text-lg">
            Join us for Syracuse University's Premier Hackathon on October 25-26th, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 relative"
        >
          {/* X Close Button */}
          <Link
            to="/"
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X size={20} />
          </Link>
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <h3 className="font-bold text-green-400 mb-2">🎉 Registration Successful!</h3>
              <p className="text-green-300">
                Thank you for registering! We'll send you more details about CuseHacks 2025 soon.
                Keep an eye on your email for updates and important information.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <h3 className="font-bold text-red-400 mb-2">❌ Registration Failed</h3>
              <p className="text-red-300">Please check your information and try again.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium mb-2">School/University *</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="Enter your school or university name"
                required
              />
            </div>

            {/* Resume Upload */}
            <div>
              <ResumeUpload
                onUploadSuccess={handleResumeUploadSuccess}
                onUploadError={handleResumeUploadError}
              />
              {uploadError && (
                <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{uploadError}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register Now'}
              </button>
              <Link
                to="/"
                className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            <p>
              Questions? Contact us at{' '}
              <a href="mailto:innovateorange@gmail.com" className="text-primary-400 hover:text-primary-300">
                innovateorange@gmail.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage