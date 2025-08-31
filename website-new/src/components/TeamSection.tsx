import { motion } from 'framer-motion'

const TeamSection = () => {
  // Team data - keeping original photos with new info
  const teamMembers: Array<{
    name: string
    role: string
    image: string
    funFact?: string
  }> = [
    { 
      name: "Stephanie Luu", 
      role: "PR Chair", 
      image: "/images/team/Hunter.jpg", // Using existing photos
      funFact: "I love FF7!" 
    },
    { 
      name: "Aryan Apte", 
      role: "Workshop Lead", 
      image: "/images/team/Aaron.jpg",
      funFact: "I can play drums blindfolded." 
    },
    { 
      name: "Sahaj Soni", 
      role: "Workshop Lead", 
      image: "/images/team/Adi.jpg",
      funFact: "I can speak 4 languages." 
    },
    { 
      name: "Alexander Hartman", 
      role: "Vice President", 
      image: "/images/team/Alex.jpg",
      funFact: "Four time Roblox dress to impress winner." 
    },
    { 
      name: "Andrew", 
      role: "Sponsorship", 
      image: "/images/team/Andrew.jpg"
    },
    { 
      name: "Dani", 
      role: "Design", 
      image: "/images/team/Dani.jpg"
    },
    { 
      name: "Jason", 
      role: "Operations", 
      image: "/images/team/Jason.jpg"
    },
    { 
      name: "Liam", 
      role: "Outreach", 
      image: "/images/team/Liam.jpg"
    },
  ]

  return (
    <section id="team" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-10 font-orbitron"
        >
          Meet Our Team
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 shadow-[0_0_15px_rgba(86,11,173,0.3)] hover:shadow-[0_0_25px_rgba(86,11,173,0.5)] transition-all duration-300 hover:scale-105">
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
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">
                  {member.name}
                </h3>
                <p className="text-primary-500 text-sm font-medium mb-2">
                  {member.role}
                </p>
                {member.funFact && (
                  <p className="text-white/70 text-xs italic">
                    "{member.funFact}"
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection