import { useState, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import CountdownSection from '../components/CountdownSection'
import AboutSection from '../components/AboutSection'
import ScheduleSection from '../components/ScheduleSection'
import TeamSection from '../components/TeamSection'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'

function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a1a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white font-ubuntu">
      {/* Cyberpunk grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_1px,_#0a0a1a_1px),_linear-gradient(90deg,_transparent_1px,_#0a0a1a_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />
      
      <Navbar />
      <HeroSection />
      <CountdownSection />
      <AboutSection />
      <ScheduleSection />
      <TeamSection />
      <FAQSection />
      <Footer />
    </div>
  )
}

export default memo(HomePage)