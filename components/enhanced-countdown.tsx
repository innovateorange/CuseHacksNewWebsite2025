"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"

interface EnhancedCountdownProps {
  targetDate: string
  className?: string
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

interface CountdownUnitProps {
  label: string
  value: string
  hasChanged: boolean
  color: "primary" | "secondary" | "accent"
  isHovering: boolean
  setIsHovering: () => void
  clearHovering: () => void
  isGlitching: boolean
}

export default function EnhancedCountdown({ targetDate, className = "", onComplete }: EnhancedCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  })
  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  })
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(0)
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [isGlitching, setIsGlitching] = useState(false)
  const progressControls = useAnimation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const timerRef = useRef<NodeJS.Timeout>()
  const glitchIntervalRef = useRef<NodeJS.Timeout>()

  // Calculate initial total seconds on mount
  useEffect(() => {
    const targetTime = new Date(targetDate).getTime()
    const now = new Date().getTime()
    const difference = targetTime - now

    if (difference > 0) {
      const totalSeconds = Math.floor(difference / 1000)
      setInitialTotalSeconds(totalSeconds)
    }

    return () => {
      // Clean up any timers
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [targetDate])

  // Fix the infinite update loop by restructuring the useEffect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = targetTime - now

      if (difference > 0) {
        const newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          totalSeconds: Math.floor(difference / 1000),
        }

        // Only update prevTimeLeft when seconds change
        if (newTimeLeft.seconds !== timeLeft.seconds) {
          setPrevTimeLeft(timeLeft)
        }

        setTimeLeft(newTimeLeft)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 })
        if (onComplete) onComplete()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete]) // Remove timeLeft from dependencies

  // Update progress bar
  useEffect(() => {
    if (initialTotalSeconds > 0 && timeLeft.totalSeconds > 0) {
      const progress = 1 - timeLeft.totalSeconds / initialTotalSeconds
      progressControls.start({ scaleX: progress, transition: { duration: 0.5 } })
    }
  }, [timeLeft.totalSeconds, initialTotalSeconds, progressControls])

  // Trigger glitch effect periodically
  useEffect(() => {
    glitchIntervalRef.current = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 500)
    }, 10000)

    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
    }
  }, [])

  // Matrix rain effect with proper cleanup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    const resizeHandler = () => {
      resizeCanvas()
      // Reset drops when resizing
      for (let i = 0; i < drops.length; i++) {
        drops[i] = Math.random() * -100
      }
    }

    window.addEventListener("resize", resizeHandler)

    // Matrix characters
    const chars = "01"
    const fontSize = 10
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set color and font
      ctx.fillStyle = "#4cc9f0"
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)]

        // Draw character
        ctx.fillStyle = i % 3 === 0 ? "#E72585" : i % 3 === 1 ? "#4cc9f0" : "#560BAD"
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        // Move drop down
        drops[i]++

        // Reset drop to top with random delay
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resizeHandler)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString()
  }

  // Check if a specific unit has changed
  const hasChanged = (unit: keyof TimeLeft) => {
    return timeLeft[unit] !== prevTimeLeft[unit]
  }

  // Calculate percentage of time remaining
  const getProgressPercentage = () => {
    if (initialTotalSeconds === 0) return 0
    return ((initialTotalSeconds - timeLeft.totalSeconds) / initialTotalSeconds) * 100
  }

  // Add visual enhancements and interaction improvements to the countdown component

  // Add a celebration effect when countdown reaches zero
  useEffect(() => {
    // Check if countdown is close to zero
    if (timeLeft.totalSeconds > 0 && timeLeft.totalSeconds < 10) {
      // Start increasing glitch frequency as we get closer to zero
      const glitchFrequency = Math.max(1000, timeLeft.totalSeconds * 1000)

      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }

      glitchIntervalRef.current = setInterval(() => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 300)
      }, glitchFrequency)
    }

    // Celebration effect when countdown reaches zero
    if (timeLeft.totalSeconds === 0 && prevTimeLeft.totalSeconds > 0) {
      // Trigger celebration animation
      celebrateCountdownComplete()
    }

    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
    }
  }, [timeLeft.totalSeconds, prevTimeLeft.totalSeconds])

  // Celebration animation function
  const celebrateCountdownComplete = () => {
    // Create confetti effect
    if (typeof window !== "undefined") {
      // Simple confetti effect using canvas
      const canvas = document.createElement("canvas")
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.position = "fixed"
      canvas.style.top = "0"
      canvas.style.left = "0"
      canvas.style.pointerEvents = "none"
      canvas.style.zIndex = "9999"
      document.body.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        document.body.removeChild(canvas)
        return
      }

      // Create confetti particles
      const particles: {
        x: number
        y: number
        size: number
        color: string
        speedX: number
        speedY: number
        rotation: number
        rotationSpeed: number
      }[] = []

      // Colors matching our theme
      const colors = ["#E72585", "#4cc9f0", "#560BAD", "#ffffff"]

      // Create 200 particles
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 6 - 3,
          speedY: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
        })
      }

      // Animate confetti
      let animationFrame: number
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let particlesLeft = false

        particles.forEach((particle) => {
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate((particle.rotation * Math.PI) / 180)

          ctx.fillStyle = particle.color
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)

          ctx.restore()

          // Update particle position
          particle.x += particle.speedX
          particle.y += particle.speedY
          particle.rotation += particle.rotationSpeed

          // Add gravity
          particle.speedY += 0.1

          // Check if particle is still on screen
          if (particle.y < canvas.height) {
            particlesLeft = true
          }
        })

        if (particlesLeft) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          document.body.removeChild(canvas)
          cancelAnimationFrame(animationFrame)
        }
      }

      animate()

      // Remove canvas after animation completes (fallback)
      setTimeout(() => {
        if (document.body.contains(canvas)) {
          document.body.removeChild(canvas)
          cancelAnimationFrame(animationFrame)
        }
      }, 10000)
    }
  }

  // Add a responsive design enhancement for mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640

      // Adjust canvas and animation behavior for mobile
      if (isMobile) {
        // Reduce animation complexity on mobile
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext("2d")
          if (ctx) {
            // Reduce the number of matrix characters on mobile
            ctx.globalAlpha = 0.1 // Reduce opacity
          }
        }
      }
    }

    handleResize() // Initial check
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Add reduced motion support
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const handleReducedMotionChange = () => {
      if (mediaQuery.matches) {
        // Disable animations for users who prefer reduced motion
        if (glitchIntervalRef.current) {
          clearInterval(glitchIntervalRef.current)
        }

        setIsGlitching(false)

        // Stop canvas animation
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = undefined
        }

        // Clear canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d")
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        }
      } else {
        // Re-enable animations
        if (!glitchIntervalRef.current) {
          glitchIntervalRef.current = setInterval(() => {
            setIsGlitching(true)
            setTimeout(() => setIsGlitching(false), 500)
          }, 10000)
        }
      }
    }

    handleReducedMotionChange() // Initial check
    mediaQuery.addEventListener("change", handleReducedMotionChange)

    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange)
    }
  }, [])

  // Add social sharing capabilities
  const shareCountdown = () => {
    if (typeof navigator.share !== "undefined") {
      navigator
        .share({
          title: "CUSEHACKS Countdown",
          text: `Join us for CUSEHACKS on October 4-5th 2025! Only ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, and ${timeLeft.seconds} seconds to go!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(
          `Join us for CUSEHACKS on October 4-5th 2025! Only ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, and ${timeLeft.seconds} seconds to go! ${window.location.href}`,
        )
        .then(() => {
          alert("Countdown info copied to clipboard!")
        })
        .catch((error) => console.log("Error copying to clipboard", error))
    }
  }

  return (
    <div className={`${className} relative`} aria-live="polite" aria-atomic="true">
      {/* Matrix rain background */}
      <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20">
        <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/50 overflow-hidden rounded-t-xl">
        <motion.div
          className="h-full bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD]"
          initial={{ scaleX: 0 }}
          animate={progressControls}
          style={{ originX: 0 }}
          aria-hidden="true"
        />
      </div>

      {/* Countdown header */}
      <div className="text-center mb-6 pt-4">
        <motion.h3
          className="text-xl font-rajdhani font-bold text-white tracking-widest"
          animate={{
            textShadow: isGlitching
              ? ["0 0 5px #E72585", "0 0 10px #4cc9f0", "0 0 5px #560BAD"]
              : "0 0 5px rgba(231, 37, 133, 0.7)",
          }}
          transition={{ duration: 0.3 }}
        >
          TIME REMAINING
        </motion.h3>
        <div
          className="text-sm font-tech-mono text-white/60 mt-1"
          aria-label={`${getProgressPercentage().toFixed(2)}% complete`}
        >
          {getProgressPercentage().toFixed(2)}% COMPLETE
        </div>
      </div>

      {/* Countdown units */}
      <div className="grid grid-cols-4 gap-4 relative z-10" role="timer" aria-label="Countdown timer">
        <CountdownUnit
          label="DAYS"
          value={formatNumber(timeLeft.days)}
          hasChanged={hasChanged("days")}
          color="primary"
          isHovering={isHovering === "days"}
          setIsHovering={() => setIsHovering("days")}
          clearHovering={() => setIsHovering(null)}
          isGlitching={isGlitching}
        />
        <CountdownUnit
          label="HOURS"
          value={formatNumber(timeLeft.hours)}
          hasChanged={hasChanged("hours")}
          color="secondary"
          isHovering={isHovering === "hours"}
          setIsHovering={() => setIsHovering("hours")}
          clearHovering={() => setIsHovering(null)}
          isGlitching={isGlitching}
        />
        <CountdownUnit
          label="MINUTES"
          value={formatNumber(timeLeft.minutes)}
          hasChanged={hasChanged("minutes")}
          color="accent"
          isHovering={isHovering === "minutes"}
          setIsHovering={() => setIsHovering("minutes")}
          clearHovering={() => setIsHovering(null)}
          isGlitching={isGlitching}
        />
        <CountdownUnit
          label="SECONDS"
          value={formatNumber(timeLeft.seconds)}
          hasChanged={hasChanged("seconds")}
          color="primary"
          isHovering={isHovering === "seconds"}
          setIsHovering={() => setIsHovering("seconds")}
          clearHovering={() => setIsHovering(null)}
          isGlitching={isGlitching}
        />
      </div>

      {/* Circular progress indicator */}
      <div className="mt-8 flex justify-center">
        <div className="relative w-32 h-32" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a2e" strokeWidth="8" />

            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 45 * (1 - getProgressPercentage() / 100),
              }}
              transition={{ duration: 0.5 }}
              transform="rotate(-90 50 50)"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E72585" />
                <stop offset="50%" stopColor="#4cc9f0" />
                <stop offset="100%" stopColor="#560BAD" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white font-tech-mono text-lg">{getProgressPercentage().toFixed(0)}%</span>
            <span className="text-white/60 text-xs font-rajdhani">COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Event date */}
      <motion.div
        className="text-center mt-6 pb-4"
        animate={{
          opacity: [0.7, 1, 0.7],
          textShadow: [
            "0 0 5px rgba(76, 201, 240, 0.5)",
            "0 0 10px rgba(76, 201, 240, 0.8)",
            "0 0 5px rgba(76, 201, 240, 0.5)",
          ],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="text-white font-rajdhani">EVENT STARTS</div>
        <div className="text-[#4cc9f0] font-tech-mono font-bold">OCTOBER 4-5TH 2025</div>
      </motion.div>
      <div className="flex justify-center mt-4 mb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareCountdown}
          className="bg-[#0f0f1a] border border-[#4cc9f0]/50 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-[#4cc9f0]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]"
          aria-label="Share countdown"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share Countdown
        </motion.button>
      </div>
    </div>
  )
}

// Update the CountdownUnit component to fix animation issues
function CountdownUnit({
  label,
  value,
  hasChanged,
  color,
  isHovering,
  setIsHovering,
  clearHovering,
  isGlitching,
}: CountdownUnitProps) {
  const colorClasses = {
    primary: {
      gradient: "from-[#E72585] to-[#E72585]/70",
      border: "border-[#E72585]",
      shadow: "shadow-[0_0_15px_rgba(231,37,133,0.5)]",
      glow: "0 0 20px rgba(231,37,133,0.8)",
      text: "text-pink-400",
    },
    secondary: {
      gradient: "from-[#4cc9f0] to-[#4cc9f0]/70",
      border: "border-[#4cc9f0]",
      shadow: "shadow-[0_0_15px_rgba(76,201,240,0.5)]",
      glow: "0 0 20px rgba(76,201,240,0.8)",
      text: "text-cyan-400",
    },
    accent: {
      gradient: "from-[#560BAD] to-[#560BAD]/70",
      border: "border-[#560BAD]",
      shadow: "shadow-[0_0_15px_rgba(86,11,173,0.5)]",
      glow: "0 0 20px rgba(86,11,173,0.8)",
      text: "text-purple-400",
    },
  }

  // Add sound effect on digit change (if user has interacted with the page)
  useEffect(() => {
    if (hasChanged && typeof window !== "undefined" && window.AudioContext) {
      try {
        // Only play sound if user has interacted with the page
        if (document.hasFocus() && document.visibilityState === "visible") {
          const audioCtx = new AudioContext()
          const oscillator = audioCtx.createOscillator()
          const gainNode = audioCtx.createGain()

          // Set frequency based on unit type
          let frequency = 440
          if (label === "DAYS") frequency = 330
          if (label === "HOURS") frequency = 440
          if (label === "MINUTES") frequency = 550
          if (label === "SECONDS") frequency = 660

          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)

          // Quick fade out
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)

          oscillator.connect(gainNode)
          gainNode.connect(audioCtx.destination)

          oscillator.start()
          oscillator.stop(audioCtx.currentTime + 0.2)
        }
      } catch (e) {
        // Ignore audio errors
      }
    }
  }, [hasChanged, label])

  return (
    <motion.div
      className="flex flex-col items-center"
      onHoverStart={setIsHovering}
      onHoverEnd={clearHovering}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      aria-label={`${label}: ${value}`}
    >
      <motion.div
        className={`bg-[#0f0f1a] rounded-lg p-2 border border-opacity-50 ${colorClasses[color].border} ${hasChanged ? "animate-pulse" : ""}`}
        animate={{
          boxShadow: isHovering ? colorClasses[color].glow : "none",
          y: isGlitching ? [0, -2, 1, -1, 0] : 0,
        }}
        transition={{
          boxShadow: { duration: 0.2 },
          y: { duration: 0.2 },
        }}
      >
        <div className="relative">
          {/* Glitch effect on change or when globally glitching */}
          {(hasChanged || isGlitching) && (
            <motion.div
              className="absolute inset-0 bg-current opacity-0"
              animate={{
                opacity: [0, 0.1, 0, 0.05, 0],
                x: [-1, 1, -1, 0],
              }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Digits with enhanced flip animation */}
          <div className="flex justify-center">
            {value.split("").map((digit, i) => (
              <motion.div
                key={`${label}-${i}-${digit}`}
                initial={false}
                animate={{
                  rotateX: hasChanged ? [0, -90, 0] : 0,
                  scale: isHovering ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  rotateX: { duration: 0.5 },
                  scale: { duration: 1, repeat: isHovering ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" },
                }}
                className={`bg-gradient-to-b ${colorClasses[color].gradient} w-14 h-20 md:w-16 md:h-24 flex items-center justify-center rounded-md m-1 relative overflow-hidden ${colorClasses[color].shadow}`}
              >
                {/* Scanlines effect */}
                <div className="absolute inset-0 scanlines opacity-10"></div>

                {/* Digit */}
                <span className="font-tech-mono text-3xl md:text-4xl font-bold text-white relative z-10">{digit}</span>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-10"></div>

                {/* Flicker animation on change */}
                {hasChanged && (
                  <motion.div
                    className="absolute inset-0 bg-current"
                    animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                {/* Enhanced hover effect */}
                {isHovering && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.05, 0.15, 0.05],
                      background: [
                        `radial-gradient(circle at 50% 50%, white 0%, transparent 70%)`,
                        `radial-gradient(circle at 50% 50%, white 0%, transparent 90%)`,
                        `radial-gradient(circle at 50% 50%, white 0%, transparent 70%)`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-2 text-center"
        animate={{
          scale: isHovering ? 1.1 : 1,
          y: isHovering ? -2 : 0,
          textShadow: isHovering
            ? [
                `0 0 5px ${color === "primary" ? "#E72585" : color === "secondary" ? "#4cc9f0" : "#560BAD"}`,
                `0 0 10px ${color === "primary" ? "#E72585" : color === "secondary" ? "#4cc9f0" : "#560BAD"}`,
                `0 0 5px ${color === "primary" ? "#E72585" : color === "secondary" ? "#4cc9f0" : "#560BAD"}`,
              ]
            : `0 0 0px transparent`,
        }}
        transition={{
          scale: { duration: 0.2 },
          y: { duration: 0.2 },
          textShadow: { duration: 1.5, repeat: isHovering ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" },
        }}
      >
        <span className={`font-rajdhani text-sm font-bold tracking-widest ${colorClasses[color].text}`}>{label}</span>
      </motion.div>
    </motion.div>
  )
}
