import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { mockAPI } from '../lib/mockData'

interface TeamMember {
  _id: string
  name: string
  role: string
  image: string
  bio?: string
  isActive: boolean
  order: number
  links?: {
    github?: string
    linkedin?: string
    email?: string
    website?: string
  }
}

const TeamSection = () => {
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<string>('current')

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await mockAPI.getTeam()
        // Store all team members, we'll filter them later based on selection
        setAllTeamMembers(data.sort((a: TeamMember, b: TeamMember) => a.order - b.order))
      } catch (error) {
        console.error('Error fetching team members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  // Filter team members based on selected tab (current/past)
  const filteredTeamMembers = selectedTab === 'current'
    ? allTeamMembers.filter(member => member.isActive)
    : allTeamMembers.filter(member => !member.isActive)

  return (
    <section id="team" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 sm:mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold font-orbitron"
          >
            Meet Our Team
          </motion.h2>

          {/* Current/Past Members Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <select
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
              className="bg-gradient-to-r from-purple-500/20 to-purple-500/10 backdrop-blur-md border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none appearance-none cursor-pointer pr-8 min-w-[160px] text-sm"
            >
              <option value="current" className="bg-[#0a0a1a] text-white">Current Members</option>
              <option value="past" className="bg-[#0a0a1a] text-white">Past Members</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredTeamMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-purple-500/30 shadow-[0_0_15px_rgba(86,11,173,0.3)] h-full flex flex-col">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a placeholder if image doesn't load
                        const target = e.target as HTMLImageElement
                        target.src = "/images/robot-mascot-transparent.png"
                      }}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-rajdhani">
                    {member.name}
                  </h3>
                  <p className="text-primary-500 text-xs sm:text-sm font-medium mb-2">
                    {member.role}
                  </p>
                  <div className="flex-1">
                    {member.bio && (
                      <p className="text-white/70 text-xs italic leading-relaxed">
                        "{member.bio}"
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TeamSection