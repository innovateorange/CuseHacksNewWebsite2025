import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFeatureFlags } from '../contexts/FeatureFlagContext'

const HeroSection = () => {
  const { flags, loading } = useFeatureFlags()
  
  const scrollToCountdown = () => {
    document.querySelector('#countdown')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen pt-16 pb-16 px-4 flex flex-col items-center justify-center text-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cyberpunk-city.webp"
          alt="Cyberpunk City"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/90 via-[#0a0a1a]/80 to-[#0a0a1a]/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wider font-orbitron relative mb-6 sm:mb-8"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff1b6b] via-[#E72585] to-[#45caff] animate-gradient-x">
            CUSEHACKS
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff1b6b] via-[#E72585] to-[#45caff] opacity-20 blur-2xl -z-10" />
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium mb-6 sm:mb-8">
            October 4-5th 2025
          </p>
          
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Syracuse University's Premier Hackathon
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!loading && flags.registrationEnabled && (
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group bg-gradient-to-r from-[#4cc9f0] via-[#E72585] to-[#560BAD] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(76,201,240,0.3)] cursor-pointer"
                >
                  <span className="relative z-10">Register Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E72585] to-[#4cc9f0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
            )}
            
            {!loading && flags.projectSubmissionsEnabled && (
              <Link to="/submit">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group bg-gradient-to-r from-[#560BAD] via-[#E72585] to-[#ff1b6b] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(255,27,107,0.3)] cursor-pointer"
                >
                  <span className="relative z-10">Submit Project</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff1b6b] to-[#560BAD] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.button
          onClick={scrollToCountdown}
          className="text-white hover:bg-white/10 flex flex-col items-center justify-center gap-2 rounded-full px-8 py-4 border border-primary-500/30 hover:border-primary-500 transition-all duration-300 group backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-primary-500 group-hover:text-white transition-colors text-lg font-medium">
            Learn More
          </span>
          <ChevronDown className="h-6 w-6 text-primary-500 group-hover:text-white transition-colors animate-bounce" />
        </motion.button>
      </div>
    </section>
  )
}

export default HeroSection