import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MailOpen, Clock, Reply, Trash2, User, MessageSquare } from 'lucide-react'
import { mockAPI } from '../lib/mockData'

interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  submittedAt: string
  isRead: boolean
  status: 'new' | 'replied'
}

interface MessageStats {
  total: number
  unread: number
  new: number
  replied: number
}

function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [stats, setStats] = useState<MessageStats>({ total: 0, unread: 0, new: 0, replied: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all')

  // Authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      fetchMessages()
    } else {
      // Redirect to admin login
      window.location.href = '/admin'
    }
  }, [])

  const fetchMessages = async () => {
    try {
      const data = await mockAPI.getContactMessages()
      setMessages(data.messages)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMessageClick = async (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      await mockAPI.markMessageAsRead(message._id)
      // Update local state
      setMessages(prev => prev.map(m => m._id === message._id ? { ...m, isRead: true } : m))
      setStats(prev => ({ ...prev, unread: prev.unread - 1 }))
    }
  }

  const handleStatusUpdate = async (messageId: string, status: 'new' | 'replied') => {
    await mockAPI.updateMessageStatus(messageId, status)
    setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status, isRead: true } : m))
    setStats(prev => ({
      ...prev,
      new: status === 'replied' ? prev.new - 1 : prev.new + 1,
      replied: status === 'replied' ? prev.replied + 1 : prev.replied - 1,
      unread: prev.unread > 0 ? prev.unread - 1 : 0
    }))
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    await mockAPI.deleteContactMessage(messageId)
    const messageToDelete = messages.find(m => m._id === messageId)
    setMessages(prev => prev.filter(m => m._id !== messageId))
    
    if (messageToDelete) {
      setStats(prev => ({
        total: prev.total - 1,
        unread: messageToDelete.isRead ? prev.unread : prev.unread - 1,
        new: messageToDelete.status === 'new' ? prev.new - 1 : prev.new,
        replied: messageToDelete.status === 'replied' ? prev.replied - 1 : prev.replied
      }))
    }
    
    if (selectedMessage && selectedMessage._id === messageId) {
      setSelectedMessage(null)
    }
  }

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true
    return message.status === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/admin'}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Admin
            </button>
            <h1 className="text-4xl font-bold font-orbitron">Contact Messages</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 backdrop-blur-md rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-blue-400" size={24} />
              <div>
                <p className="text-blue-400 font-medium">Total Messages</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-red-500/20 to-red-500/5 backdrop-blur-md rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center gap-3">
              <Mail className="text-red-400" size={24} />
              <div>
                <p className="text-red-400 font-medium">Unread</p>
                <p className="text-2xl font-bold">{stats.unread}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-500/5 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-400" size={24} />
              <div>
                <p className="text-yellow-400 font-medium">New</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-green-500/20 to-green-500/5 backdrop-blur-md rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <Reply className="text-green-400" size={24} />
              <div>
                <p className="text-green-400 font-medium">Replied</p>
                <p className="text-2xl font-bold">{stats.replied}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Message List */}
          <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl border border-purple-500/30">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold mb-4">Messages</h2>
              
              {/* Filter Tabs */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All', count: stats.total },
                  { key: 'new', label: 'New', count: stats.new },
                  { key: 'replied', label: 'Replied', count: stats.replied }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === tab.key
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-white/60">
                  No messages found
                </div>
              ) : (
                <div className="p-2">
                  {filteredMessages.map((message) => (
                    <motion.div
                      key={message._id}
                      className={`p-4 rounded-lg mb-2 cursor-pointer transition-all ${
                        selectedMessage?._id === message._id
                          ? 'bg-primary-500/20 border border-primary-500/40'
                          : 'bg-white/5 hover:bg-white/10'
                      } ${!message.isRead ? 'border-l-4 border-l-accent-500' : ''}`}
                      onClick={() => handleMessageClick(message)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white flex items-center gap-2">
                          {message.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                          {message.subject}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          message.status === 'new' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {message.status}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{message.name} • {message.email}</p>
                      <p className="text-white/50 text-xs">{formatDate(message.submittedAt)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 backdrop-blur-md rounded-xl border border-blue-500/30">
            {selectedMessage ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Message Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedMessage._id, selectedMessage.status === 'new' ? 'replied' : 'new')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedMessage.status === 'new'
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-yellow-500 hover:bg-yellow-600'
                      }`}
                    >
                      Mark as {selectedMessage.status === 'new' ? 'Replied' : 'New'}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">From</label>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-white/60" />
                      <span>{selectedMessage.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Subject</label>
                    <p>{selectedMessage.subject}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Received</label>
                    <p className="text-white/80">{formatDate(selectedMessage.submittedAt)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Message</label>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`)
                        const body = encodeURIComponent(`Hi ${selectedMessage.name},\n\n`)
                        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=${subject}&body=${body}`
                        window.open(gmailUrl, '_blank')
                      }}
                      className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <Reply size={18} />
                      Reply via Email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center text-white/60">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMessagesPage