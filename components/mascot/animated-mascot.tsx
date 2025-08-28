"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import MascotDesign from "./mascot-design"
import MascotSpeech from "./mascot-speech"
import MascotControls from "./mascot-controls"
import { X } from "lucide-react"

// Define movement paths for the mascot
const MOVEMENT_PATHS = [
  // Path 1: Bottom right to top left and back
  [
    { x: 20, y: 20 },
    { x: -20, y: -20 },
    { x: 0, y: 0 },
  ],
  // Path 2: Circle motion
  [
    { x: 20, y: 0 },
    { x: 0, y: 20 },
    { x: -20, y: 0 },
    { x: 0, y: -20 },
    { x: 20, y: 0 },
  ],
  // Path 3: Bounce around
  [
    { x: 30, y: -10 },
    { x: -20, y: 20 },
    { x: 10, y: -30 },
    { x: 0, y: 0 },
  ],
  // Path 4: Zigzag
  [
    { x: 30, y: 0 },
    { x: 15, y: -20 },
    { x: 0, y: 0 },
    { x: -15, y: 20 },
    { x: -30, y: 0 },
    { x: 0, y: 0 },
  ],
]

// Special animations
const SPECIAL_ANIMATIONS = {
  dance: {
    x: [0, 10, -10, 10, -10, 0],
    y: [0, -10, -5, -10, -5, 0],
    rotate: [0, 5, -5, 5, -5, 0],
    transition: { duration: 1.5 },
  },
  spin: {
    rotate: [0, 360],
    transition: { duration: 1, ease: "easeInOut" },
  },
  wave: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    transition: { duration: 1 },
  },
}

export default function AnimatedMascot() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentSection, setCurrentSection] = useState("hero")
  const [isBlinking, setIsBlinking] = useState(false)
  const [currentPath, setCurrentPath] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [mood, setMood] = useState<"happy" | "excited" | "thinking" | "surprised" | "normal">("normal")
  const [variant, setVariant] = useState<"default" | "cyberpunk" | "hacker">("default")
  const [specialAnimation, setSpecialAnimation] = useState<"dance" | "spin" | "wave" | null>(null)
  const mascotRef = useRef<HTMLDivElement>(null)

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
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      Math.random() * 5000 + 3000 // Random interval between 3-8 seconds
    )
    return () => clearInterval(blinkInterval)
  }, [])

  // Periodic movement along paths
  useEffect(() => {
    // Start movement every 10-15 seconds
    const moveInterval = setInterval(
      () => {
        if (!isMoving && !showControls) {
          setIsMoving(true)

          // Choose a random path
          setCurrentPath(Math.floor(Math.random() * MOVEMENT_PATHS.length))

          // End movement after animation completes
          setTimeout(() => {
            setIsMoving(false)
          }, 5000) // Movement duration
        }
      },
      Math.random() * 5000 + 10000,
    ) // Random interval

    return () => clearInterval(moveInterval)
  }, [isMoving, showControls])

  // Handle click animation
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isClicked])

  // Listen for special animation events
  useEffect(() => {
    const handleSpecialAnimation = (e: Event) => {
      const customEvent = e as CustomEvent
      const action = customEvent.detail as keyof typeof SPECIAL_ANIMATIONS

      if (SPECIAL_ANIMATIONS[action]) {
        setSpecialAnimation(action)

        // Reset after animation completes
        setTimeout(
          () => {
            setSpecialAnimation(null)
          },
          SPECIAL_ANIMATIONS[action].transition.duration * 1000 + 100,
        )
      }
    }

    window.addEventListener("mascot-action", handleSpecialAnimation)
    return () => window.removeEventListener("mascot-action", handleSpecialAnimation)
  }, [])

  // Get message based on current section and mood
  const getMessage = () => {
    // Special messages based on mood
    if (mood === "excited") return "I'm super excited about CuseHacks! This is going to be amazing!"
    if (mood === "thinking") return "Hmm, I wonder what cool projects people will build..."
    if (mood === "surprised") return "Wow! Look at all these awesome features and events!"

    // Default section-based messages
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

  // Get current movement path
  const getCurrentMovementPath = () => {
    if (!isMoving) return { x: 0, y: 0 }

    const path = MOVEMENT_PATHS[currentPath]
    return path[Math.floor((Date.now() % 5000) / (5000 / path.length))]
  }

  const movementPath = getCurrentMovementPath()

  // Get special animation if active
  const getSpecialAnimation = () => {
    if (!specialAnimation) return {}
    return SPECIAL_ANIMATIONS[specialAnimation]
  }

  // Handle special animations
  const handleSpecialAnimation = (animation: "dance" | "spin" | "wave") => {
    setSpecialAnimation(animation)
    setTimeout(() => {
      setSpecialAnimation(null)
    }, 2000)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.div
        ref={mascotRef}
        className="relative w-48 h-48 md:w-64 md:h-64 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => {
          setIsClicked(true)
          setTimeout(() => setIsClicked(false), 300)
        }}
        style={{
          x: springX.get(),
          y: springY.get(),
          rotate: rotation.get(),
          scale: scale.get(),
        }}
        animate={specialAnimation ? SPECIAL_ANIMATIONS[specialAnimation] : {}}
      >
        <motion.div
          animate={{
            scaleY: isBlinking ? 0.2 : 1,
          }}
          transition={{ duration: 0.1 }}
          className="w-full h-full"
        >
          <MascotDesign className="w-full h-full" />
        </motion.div>
        <MascotSpeech
          message={getMessage()}
          isVisible={isHovered || scrollYProgress.get() > 0.05}
          mood={mood}
        />

        {/* Hover glow effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'radial-gradient(circle, #f8ec24 0%, transparent 70%)',
            }}
          />
        )}
      </motion.div>
      <MascotControls
        show={showControls}
        onClose={() => setShowControls(false)}
        onVariantChange={setVariant}
        onAnimationChange={handleSpecialAnimation}
      />
    </div>
  )
}
