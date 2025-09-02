import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { mockAPI } from '../lib/mockData'

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

const TeamSection = () => {
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string>('active')

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

  // Get all academic year start years where at least one member served
  // For academic year "2010-2011", we use 2010 as the key
  // If someone served 2010-2020, their last academic year is "2019-2020"
  const academicYearStarts = new Set<number>()
  const currentYear = new Date().getFullYear()
  
  allTeamMembers.forEach(member => {
    // Handle ongoing service (endYear is null, 0, or future year)
    const effectiveEndYear = !member.endYear || member.endYear === 0 || member.endYear > currentYear 
      ? currentYear 
      : member.endYear
    
    // Academic years start from startYear and go up to (effectiveEndYear - 1)
    for (let year = member.startYear; year < effectiveEndYear; year++) {
      academicYearStarts.add(year)
    }
    
    // For ongoing service, also include current year
    if (!member.endYear || member.endYear === 0 || member.endYear > currentYear) {
      academicYearStarts.add(currentYear)
    }
  })
  const availableYears = [...academicYearStarts].sort((a, b) => b - a)
  
  // Filter team members based on selected year
  const filteredTeamMembers = selectedYear === 'active'
    ? allTeamMembers.filter(member => member.isActive)
    : allTeamMembers.filter(member => {
        const academicYearStart = parseInt(selectedYear)
        const currentYear = new Date().getFullYear()
        
        // Handle ongoing service (endYear is null, 0, or future year)
        const isOngoingService = !member.endYear || member.endYear === 0 || member.endYear > currentYear
        const effectiveEndYear = isOngoingService ? currentYear + 1 : (member.endYear || currentYear + 1)
        
        // Member appears in academic year "YYYY-(YYYY+1)" only if YYYY is within their service range
        return member.startYear <= academicYearStart && academicYearStart < effectiveEndYear
      })

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

          {/* Year Selection Dropdown */}
          {availableYears.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-gradient-to-r from-purple-500/20 to-purple-500/10 backdrop-blur-md border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:border-purple-500 focus:outline-none appearance-none cursor-pointer pr-8 min-w-[160px] text-sm"
              >
                <option value="active" className="bg-[#0a0a1a] text-white">Active Members</option>
                {availableYears.map(year => (
                  <option key={year} value={year.toString()} className="bg-[#0a0a1a] text-white">
                    {year} - {year + 1}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </motion.div>
          )}
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