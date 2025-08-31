"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa'

interface TeamMember {
  _id?: string
  name: string
  role: string
  image: string
  bio: string
  year: number
  isActive: boolean
  order: number
  links: {
    github?: string
    linkedin?: string
    email?: string
    website?: string
  }
}

export function TeamSection({ showOnlyCurrentTeam = false }: { showOnlyCurrentTeam?: boolean }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        console.log('Fetching team members...');
        const response = await fetch('/api/team');
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch team members');
        const data = await response.json();
        console.log('Fetched team members:', data);
        
        // Filter for current team if showOnlyCurrentTeam is true
        const filteredData = showOnlyCurrentTeam 
          ? data.filter((member: TeamMember) => member.year === 2025 && member.isActive)
          : data;
        
        setTeamMembers(Array.isArray(filteredData) ? filteredData : []);
        
        // Extract unique years and sort them
        const years = Array.from(new Set<number>(filteredData.map((member: TeamMember) => member.year)))
          .sort((a, b) => b - a);
        setAvailableYears(years);
        
        // Set initial selected year
        if (years.length > 0) {
          setSelectedYear(showOnlyCurrentTeam ? 2025 : years[0]);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [showOnlyCurrentTeam]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4cc9f0]"></div>
      </div>
    )
  }

  // If showing only current team, show just 2025 members
  if (showOnlyCurrentTeam) {
    const currentTeam = teamMembers
      .filter(member => member.year === 2025 && member.isActive)
      .sort((a, b) => a.order - b.order);
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {currentTeam.map((member) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-[#0f0f1a]/80 backdrop-blur-xl rounded-xl p-6 border border-[#4cc9f0]/20 
                        hover:border-[#4cc9f0]/50 transition-all duration-300
                        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r 
                        before:from-transparent before:via-[#4cc9f0]/5 before:to-transparent 
                        before:opacity-0 before:transition-opacity hover:before:opacity-100
                        shadow-[0_0_20px_rgba(76,201,240,0.1)] hover:shadow-[0_0_30px_rgba(76,201,240,0.2)]"
            >
              <div className="flex flex-col space-y-4">
                <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden ring-2 ring-[#4cc9f0]/30 shadow-[0_0_15px_rgba(76,201,240,0.3)]">
                  <Image
                    src={member.image || '/images/default-avatar.png'}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <h3 className="text-xl font-bold text-white truncate">{member.name}</h3>
                  <p className="text-[#4cc9f0] truncate">{member.role}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#4cc9f0]/20">
                <p className="text-gray-300 text-sm line-clamp-2">{member.bio}</p>
                <div className="flex justify-center space-x-4 mt-4">
                  {member.links?.linkedin && (
                    <a
                      href={member.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#0077b5] transition-colors"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {member.links?.github && (
                    <a
                      href={member.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#E72585] transition-colors"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                  {member.links?.website && (
                    <a
                      href={member.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#4cc9f0] transition-colors"
                    >
                      <FaGlobe size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Full team page with year selection
  return (
    <div className="space-y-8">
      {/* Year Selection Buttons */}
      <div className="flex flex-wrap justify-center gap-4 px-4 mb-8">
        {availableYears.map((year) => (
          <motion.button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-6 py-2 rounded-lg font-bold transition-all duration-300
              ${selectedYear === year 
                ? 'bg-[#4cc9f0] text-white shadow-[0_0_20px_rgba(76,201,240,0.3)]' 
                : 'bg-[#0f0f1a]/50 text-gray-400 hover:bg-[#0f0f1a] hover:text-white border border-[#4cc9f0]/20'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Class of {year}
          </motion.button>
        ))}
      </div>

      {/* Team Members Grid */}
      {selectedYear && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {teamMembers
            .filter(member => member.year === selectedYear)
            .sort((a, b) => a.order - b.order)
            .map((member) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-[#0f0f1a]/80 backdrop-blur-xl rounded-xl p-6 border border-[#4cc9f0]/20 
                          hover:border-[#4cc9f0]/50 transition-all duration-300
                          before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r 
                          before:from-transparent before:via-[#4cc9f0]/5 before:to-transparent 
                          before:opacity-0 before:transition-opacity hover:before:opacity-100
                          shadow-[0_0_20px_rgba(76,201,240,0.1)] hover:shadow-[0_0_30px_rgba(76,201,240,0.2)]"
              >
                <div className="flex flex-col space-y-4">
                  <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden ring-2 ring-[#4cc9f0]/30 shadow-[0_0_15px_rgba(76,201,240,0.3)]">
                    <Image
                      src={member.image || '/images/default-avatar.png'}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-center">
                    <h3 className="text-xl font-bold text-white truncate">{member.name}</h3>
                    <p className="text-[#4cc9f0] truncate">{member.role}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#4cc9f0]/20">
                  <p className="text-gray-300 text-sm line-clamp-3">{member.bio}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    {member.links?.linkedin && (
                      <a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#0077b5] transition-colors"
                      >
                        <FaLinkedin size={20} />
                      </a>
                    )}
                    {member.links?.github && (
                      <a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#E72585] transition-colors"
                      >
                        <FaGithub size={20} />
                      </a>
                    )}
                    {member.links?.website && (
                      <a
                        href={member.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#4cc9f0] transition-colors"
                      >
                        <FaGlobe size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
} 