import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { mockAPI } from '../lib/mockData'

function SubmitPage() {
  const [devpostLink, setDevpostLink] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDevpostLink = async () => {
      try {
        const config = await mockAPI.getSiteConfig()
        setDevpostLink(config.devpostLink)
      } catch (error) {
        console.error('Error loading DevPost link:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDevpostLink()
  }, [])

  const handleRedirectToDevpost = () => {
    if (devpostLink) {
      window.open(devpostLink, '_blank', 'noopener,noreferrer')
    } else {
      alert('DevPost link not configured. Please contact the organizers.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold font-orbitron mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
            Submit Your Project
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Ready to showcase your amazing creation? Submit your project to DevPost!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-12 border border-purple-500/30 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Submit on DevPost</h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              All project submissions for CuseHacks 2025 are handled through DevPost. 
              Click the button below to be redirected to our official DevPost page where 
              you can submit your project and compete for amazing prizes!
            </p>

            {devpostLink && (
              <div className="mb-6 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-cyan-300 text-sm">
                  You'll be redirected to: <span className="font-mono">{devpostLink}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRedirectToDevpost}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg"
              >
                <ExternalLink className="w-5 h-5" />
                Submit on DevPost
              </button>
              
              <Link
                to="/"
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-center text-lg"
              >
                Back to Home
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white/50 text-sm">
                Need help? Contact the organizers at{' '}
                <a href="mailto:innovateorange@gmail.com" className="text-primary-400 hover:text-primary-300">
                  innovateorange@gmail.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SubmitPage