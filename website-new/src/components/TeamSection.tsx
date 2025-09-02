import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { mockAPI } from '../lib/mockData'

interface TeamMember {
  _id: string
  name: string
  role: string
  image: string
  bio?: string
  year: number
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await mockAPI.getTeam()
        // Only show active members, sorted by order
        setTeamMembers(data.filter((member: TeamMember) => member.isActive).sort((a: TeamMember, b: TeamMember) => a.order - b.order))
      } catch (error) {
        console.error('Error fetching team members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  return (
    <section id="team" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 font-orbitron"
        >
          Meet Our Team
        </motion.h2>

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
            {teamMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-purple-500/30 shadow-[0_0_15px_rgba(86,11,173,0.3)] hover:shadow-[0_0_25px_rgba(86,11,173,0.5)] transition-all duration-300 hover:scale-105">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to a placeholder if image doesn't load
                        const target = e.target as HTMLImageElement
                        target.src = "/images/robot-mascot-transparent.png"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-rajdhani">
                    {member.name}
                  </h3>
                  <p className="text-primary-500 text-xs sm:text-sm font-medium mb-2">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-white/70 text-xs italic leading-relaxed">
                      "{member.bio}"
                    </p>
                  )}
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