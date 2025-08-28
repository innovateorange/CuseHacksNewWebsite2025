"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useAnimation } from "framer-motion"
import Image from 'next/image'

export default function AnimatedMascot() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentSection, setCurrentSection] = useState("hero")
  const mascotRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // Motion values for smooth animations
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smoother, more natural movement
  const springConfig = { damping: 25, stiffness: 200 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Scroll-based animations
  const { scrollY, scrollYProgress } = useScroll()
  const rotation = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, -5, 5, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [1, 1.1, 1, 1.1, 1, 1.05])

  // Position based on scroll - fixed position at bottom right with some movement
  const yPos = useTransform(scrollY, [0, 500, 1000, 1500, 2000, 2500], [20, 40, 60, 40, 20, 0])

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle mouse movement for mascot to follow cursor slightly
  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to viewport center
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      // Calculate distance from center (normalized)
      const distX = (e.clientX - centerX) / centerX
      const distY = (e.clientY - centerY) / centerY

      // Update motion values with limited movement range
      mouseX.set(distX * 20) // Limit movement to 20px
      mouseY.set(distY * 20)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY, isMobile])

  // Detect current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      // Get section elements
      const heroSection = document.getElementById("hero-section")
      const countdownSection = document.getElementById("countdown-section")
      const scheduleSection = document.getElementById("schedule-section")

      if (!heroSection) return

      // Determine current section
      if (scrollPosition < heroSection.offsetHeight) {
        setCurrentSection("hero")
      } else if (countdownSection && scrollPosition < countdownSection.offsetHeight + heroSection.offsetHeight) {
        setCurrentSection("countdown")
      } else if (scheduleSection) {
        setCurrentSection("schedule")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Blinking animation timing
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    // Random blink timing
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      Math.random() * 5000 + 3000,
    ) // Random interval between 3-8 seconds

    return () => clearInterval(blinkInterval)
  }, [])

  // Get message based on current section
  const getMessage = () => {
    switch (currentSection) {
      case "hero":
        return "Welcome to CuseHacks! Scroll down to see the countdown!"
      case "countdown":
        return "Mark your calendar! The hackathon is coming soon!"
      case "schedule":
        return "Check out our awesome schedule of events!"
      default:
        return "Hello! I'm the CuseHacks mascot!"
    }
  }

  // Flying animation based on scroll
  const flyAnimation = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.7, 0.8, 1],
    [
      { x: 0, y: 0, rotate: 0 },
      { x: -30, y: -20, rotate: -10 },
      { x: 0, y: 0, rotate: 0 },
      { x: 30, y: -20, rotate: 10 },
      { x: 0, y: 0, rotate: 0 },
      { x: -30, y: -20, rotate: -10 },
      { x: 0, y: 0, rotate: 0 },
    ],
  )

  return (
    <motion.div
      ref={mascotRef}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 select-none cursor-pointer"
      style={{
        x: springX,
        y: yPos,
        scale,
      }}
      initial={{ opacity: 0, x: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div className="relative w-24 h-24 md:w-32 md:h-32" style={flyAnimation}>
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#4cc9f0]/30 blur-xl"
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.8 : 0.5,
          }}
          transition={{
            duration: 0.3,
          }}
        />

        {/* Mascot image */}
        <Image
          src="/images/robot-mascot-transparent.png"
          alt="CuseHacks Mascot"
          width={128}
          height={128}
          className="object-contain"
        />
      </motion.div>

      {/* Speech bubble that appears on hover or changes with section */}
      <AnimatePresence>
        {(isHovered || scrollYProgress.get() > 0.05) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute top-0 right-full mr-2 bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium"
            style={{
              filter: "drop-shadow(0 0 5px rgba(76,201,240,0.5))",
              width: "max-content",
              maxWidth: "180px",
            }}
          >
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
            {getMessage()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive elements */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -bottom-2 -right-2 bg-[#560BAD] text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 border-white"
          style={{ boxShadow: "0 0 10px rgba(86,11,173,0.7)" }}
        >
          ?
        </motion.div>
      )}
    </motion.div>
  )
}
