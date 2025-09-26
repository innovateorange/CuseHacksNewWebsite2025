import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Send, User, MessageCircle } from 'lucide-react'
import { mockAPI } from '../lib/mockData'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save message to admin panel
      await mockAPI.submitContactMessage(formData)
      
      setSubmitted(true)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setSubmitted(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting contact message:', error)
      // Show specific error message from API
      const errorMessage = error instanceof Error ? error.message : 'Error sending message. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gradient-to-b from-[#1a1a2e] to-[#0a0a1a] rounded-xl p-4 sm:p-6 w-full max-w-md mx-4 border border-primary-500/30 shadow-[0_0_30px_rgba(86,11,173,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Mail className="text-primary-500" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold text-white font-orbitron">Contact Us</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="text-green-400 mb-4">
                  <Send size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white/70">Your message has been submitted successfully. We'll get back to you soon!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white placeholder-white/50"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white placeholder-white/50"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-4 text-white/50" size={18} />
                  <input
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white placeholder-white/50"
                    required
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0a0a1a]/50 border border-primary-500/30 rounded-lg focus:border-primary-500 focus:outline-none text-white placeholder-white/50 resize-none"
                    rows={4}
                    required
                  />
                </div>

                {/* Quick Contact Info */}
                <div className="bg-primary-500/10 rounded-lg p-4 border border-primary-500/20">
                  <h4 className="text-white font-medium mb-2">Quick Contact</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-white/70">📧 innovateorange@gmail.com</p>
                    <p className="text-white/70">🏫 Syracuse University</p>
                    <p className="text-white/70">📍 Syracuse, NY</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 text-white rounded-lg font-medium transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContactModal