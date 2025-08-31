import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { mockAPI } from '../lib/mockData'

function SubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    teamMembers: [''],
    technologies: [''],
    githubUrl: '',
    liveUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const categories = [
    'Best Overall',
    'Best UI/UX',
    'Best Hardware Hack',
    'Most Creative',
    'Best Use of AI'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: 'teamMembers' | 'technologies', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'teamMembers' | 'technologies') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'teamMembers' | 'technologies', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Filter out empty strings
      const cleanedData = {
        ...formData,
        teamMembers: formData.teamMembers.filter(member => member.trim()),
        technologies: formData.technologies.filter(tech => tech.trim())
      }

      // Validate required fields
      if (!cleanedData.title || !cleanedData.description || !cleanedData.category || cleanedData.teamMembers.length === 0) {
        throw new Error('Please fill in all required fields')
      }

      const result = await mockAPI.submitProject(cleanedData)

      if (!result.success) {
        throw new Error('Submission failed')
      }

      setSubmitStatus('success')
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        teamMembers: [''],
        technologies: [''],
        githubUrl: '',
        liveUrl: ''
      })
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold font-orbitron mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
            Submit Your Project
          </h1>
          <p className="text-white/80 text-lg">
            Share your amazing creation with the CuseHacks 2025 community!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-8 border border-purple-500/30"
        >
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <h3 className="font-bold text-green-400 mb-2">🎉 Project Submitted Successfully!</h3>
              <p className="text-green-300">Your project has been submitted and is pending approval. You can view all projects on the projects page.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <h3 className="font-bold text-red-400 mb-2">❌ Submission Failed</h3>
              <p className="text-red-300">Please check your information and try again.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="Enter your project title"
                maxLength={100}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none h-32 resize-vertical"
                placeholder="Describe your project, what it does, and what makes it special"
                maxLength={1000}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-sm font-medium mb-2">Team Members *</label>
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => handleArrayChange('teamMembers', index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Team member name"
                    required={index === 0}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('teamMembers', index)}
                      className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('teamMembers')}
                className="mt-2 px-4 py-2 bg-primary-500/20 border border-primary-500/50 rounded-lg hover:bg-primary-500/30"
              >
                Add Team Member
              </button>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium mb-2">Technologies Used</label>
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Technology, framework, or tool"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('technologies', index)}
                      className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('technologies')}
                className="mt-2 px-4 py-2 bg-primary-500/20 border border-primary-500/50 rounded-lg hover:bg-primary-500/30"
              >
                Add Technology
              </button>
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Repository</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="https://github.com/username/project"
              />
            </div>

            {/* Live URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Live Demo URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="https://your-project-demo.com"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
              <Link
                to="/"
                className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default SubmitPage