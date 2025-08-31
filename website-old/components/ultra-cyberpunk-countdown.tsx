"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Volume2, VolumeX, AlertTriangle, Zap, Maximize2 } from "lucide-react"

interface UltraCyberpunkCountdownProps {
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
  milliseconds: number
}

export default function UltraCyberpunkCountdown({
  targetDate,
  className = "",
  onComplete,
}: UltraCyberpunkCountdownProps) {
  // Core countdown state
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    milliseconds: 0,
  })
  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    milliseconds: 0,
  })
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(0)

  // UI state
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeUnit, setActiveUnit] = useState<string | null>(null)
  const [pulseEffect, setPulseEffect] = useState(false)

  // Animation controls
  const progressControls = useAnimation()
  const glitchControls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Refs for audio
  const audioTickRef = useRef<HTMLAudioElement | null>(null)
  const audioAlarmRef = useRef<HTMLAudioElement | null>(null)
  const audioAmbientRef = useRef<HTMLAudioElement | null>(null)
  const audioGlitchRef = useRef<HTMLAudioElement | null>(null)

  // Canvas refs
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null)

  // Animation frames and intervals
  const animationFrameRef = useRef<number>()
  const particleAnimationRef = useRef<number>()
  const timerRef = useRef<NodeJS.Timeout>()
  const glitchIntervalRef = useRef<NodeJS.Timeout>()
  const warningIntervalRef = useRef<NodeJS.Timeout>()
  const millisecondIntervalRef = useRef<NodeJS.Timeout>()

  // Warning messages
  const warningMessages = [
    "TEMPORAL ANOMALY DETECTED",
    "REALITY BUFFER OVERFLOW",
    "QUANTUM FLUCTUATION WARNING",
    "TIMELINE INTEGRITY: 87%",
    "DIMENSIONAL SHIFT IMMINENT",
    "CHRONO-SYNC ERROR",
  ]

  // Initialize on mount
  useEffect(() => {
    const targetTime = new Date(targetDate).getTime()
    const now = new Date().getTime()
    const difference = targetTime - now

    if (difference > 0) {
      const totalSeconds = Math.floor(difference / 1000)
      setInitialTotalSeconds(totalSeconds)
    }

    // Initialize audio elements
    audioTickRef.current = new Audio("/sounds/tick.mp3")
    audioAlarmRef.current = new Audio("/sounds/alarm.mp3")
    audioAmbientRef.current = new Audio("/sounds/ambient.mp3")
    audioGlitchRef.current = new Audio("/sounds/glitch.mp3")

    if (audioAmbientRef.current) {
      audioAmbientRef.current.loop = true
      audioAmbientRef.current.volume = 0.2
    }

    // Set up random warning messages
    warningIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) {
        setWarningMessage(warningMessages[Math.floor(Math.random() * warningMessages.length)])
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000)
      }
    }, 8000)

    // Set up glitch effect interval
    glitchIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsGlitching(true)
        if (soundEnabled && audioGlitchRef.current) {
          audioGlitchRef.current.currentTime = 0
          audioGlitchRef.current.play().catch((e) => console.log("Audio play failed:", e))
        }
        setTimeout(() => setIsGlitching(false), 500)
      }
    }, 5000)

    // Initialize millisecond counter
    millisecondIntervalRef.current = setInterval(() => {
      const targetTime = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = targetTime - now

      if (difference > 0) {
        setTimeLeft((prev) => ({
          ...prev,
          milliseconds: Math.floor((difference % 1000) / 10),
        }))
      }
    }, 10)

    // Initialize background effects
    initBackgroundEffects()
    initParticleEffects()

    return () => {
      // Clean up all timers and listeners
      if (timerRef.current) clearInterval(timerRef.current)
      if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current)
      if (warningIntervalRef.current) clearInterval(warningIntervalRef.current)
      if (millisecondIntervalRef.current) clearInterval(millisecondIntervalRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (particleAnimationRef.current) cancelAnimationFrame(particleAnimationRef.current)

      // Stop all audio
      if (audioAmbientRef.current) audioAmbientRef.current.pause()
    }
  }, [targetDate, warningMessages])

  // Toggle sound effects
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)

    if (!soundEnabled && audioAmbientRef.current) {
      audioAmbientRef.current.play().catch((e) => console.log("Audio play failed:", e))
    } else if (audioAmbientRef.current) {
      audioAmbientRef.current.pause()
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Calculate time remaining
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
          milliseconds: Math.floor((difference % 1000) / 10),
        }

        // Only update prevTimeLeft when seconds change
        if (newTimeLeft.seconds !== timeLeft.seconds) {
          setPrevTimeLeft(timeLeft)

          // Play tick sound if enabled
          if (soundEnabled && audioTickRef.current) {
            audioTickRef.current.currentTime = 0
            audioTickRef.current.play().catch((e) => console.log("Audio play failed:", e))
          }

          // Trigger pulse effect
          setPulseEffect(true)
          setTimeout(() => setPulseEffect(false), 500)
        }

        setTimeLeft((prev) => ({
          ...newTimeLeft,
          milliseconds: prev.milliseconds,
        }))
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, milliseconds: 0 })

        // Play alarm sound when countdown reaches zero
        if (prevTimeLeft.totalSeconds > 0 && soundEnabled && audioAlarmRef.current) {
          audioAlarmRef.current.play().catch((e) => console.log("Audio play failed:", e))
        }

        if (onComplete) onComplete()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    timerRef.current = timer

    return () => clearInterval(timer)
  }, [targetDate, onComplete, prevTimeLeft.totalSeconds, soundEnabled])

  // Update progress
  useEffect(() => {
    if (initialTotalSeconds > 0 && timeLeft.totalSeconds > 0) {
      const progress = 1 - timeLeft.totalSeconds / initialTotalSeconds
      progressControls.start({ scaleX: progress, transition: { duration: 0.5 } })
    }
  }, [timeLeft.totalSeconds, initialTotalSeconds, progressControls])

  // Initialize background effects
  const initBackgroundEffects = () => {
    const canvas = backgroundCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Grid parameters
    const gridSize = 30
    const lineWidth = 0.5

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "rgba(76, 201, 240, 0.15)"
      ctx.lineWidth = lineWidth

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw pulsing circles at grid intersections
      const time = Date.now() / 1000

      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          // Calculate pulse based on time and position
          const pulse = 0.5 + 0.5 * Math.sin(time + x * 0.01 + y * 0.01)

          // Only draw some points for performance
          if (Math.random() > 0.97) {
            ctx.fillStyle = `rgba(76, 201, 240, ${0.1 + 0.2 * pulse})`
            ctx.beginPath()
            ctx.arc(x, y, 1 + pulse, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  // Initialize particle effects
  const initParticleEffects = () => {
    const canvas = particlesCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle system
    const particles: {
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
      life: number
      maxLife: number
    }[] = []

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      createParticle(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1)
    }

    function createParticle(x: number, y: number, size: number) {
      const colors = ["#E72585", "#4cc9f0", "#560BAD", "#00ff41"]
      particles.push({
        x,
        y,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        life: 0,
        maxLife: 100 + Math.random() * 100,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position
        p.x += p.speedX
        p.y += p.speedY
        p.life++

        // Calculate opacity based on life
        const opacity = 1 - p.life / p.maxLife

        // Draw particle
        ctx.globalAlpha = opacity
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Remove dead particles
        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
          i--

          // Create a new particle to replace the dead one
          createParticle(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1)
        }

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      }

      // Add extra particles on pulse
      if (pulseEffect && particles.length < 200) {
        for (let i = 0; i < 20; i++) {
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const angle = Math.random() * Math.PI * 2
          const distance = 50 + Math.random() * 100

          createParticle(
            centerX + Math.cos(angle) * distance,
            centerY + Math.sin(angle) * distance,
            Math.random() * 4 + 2,
          )
        }
      }

      ctx.globalAlpha = 1
      particleAnimationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current)
      }
    }
  }

  // Format number with leading zero
  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString()
  }

  // Format milliseconds
  const formatMilliseconds = (ms: number) => {
    return ms < 10 ? `0${ms}` : ms.toString()
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

  return (
    <motion.div
      ref={containerRef}
      className={`${className} relative overflow-hidden bg-[#0a0a1a] border-2 border-[#4cc9f0]/30 rounded-lg`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "500px",
        boxShadow: "0 0 30px rgba(76, 201, 240, 0.3), inset 0 0 20px rgba(76, 201, 240, 0.1)",
      }}
    >
      {/* Background grid */}
      <canvas ref={backgroundCanvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Particle effects */}
      <canvas
        ref={particlesCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Scanlines effect */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>

      {/* Glitch overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            className="absolute inset-0 bg-[#E72585]/10 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.2, 0, 0.3, 0],
              x: [0, -5, 3, -2, 0],
              scaleX: [1, 1.02, 0.99, 1.01, 1],
            }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Warning message */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md flex items-center gap-2 z-30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="font-tech-mono text-sm">{warningMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex space-x-3 z-30">
        <button
          onClick={toggleSound}
          className="bg-black/50 p-2 rounded-full text-white/70 hover:text-white transition-colors"
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-black/50 p-2 rounded-full text-white/70 hover:text-white transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/50 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD]"
          initial={{ scaleX: 0 }}
          animate={progressControls}
          style={{ originX: 0 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
        {/* Title */}
        <motion.h2
          className="text-2xl md:text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD] mb-8 tracking-wider"
          animate={{
            textShadow: isGlitching
              ? ["0 0 5px #E72585", "0 0 10px #4cc9f0", "0 0 5px #560BAD"]
              : "0 0 10px rgba(76, 201, 240, 0.7)",
          }}
        >
          {isGlitching ? "S¥ST3M C0UNTD0WN" : "SYSTEM COUNTDOWN"}
        </motion.h2>

        {/* Hexagonal countdown display */}
        <div className="relative mb-12">
          {/* Center circle */}
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#4cc9f0]/30 flex items-center justify-center z-10"
            style={{
              background: "radial-gradient(circle, rgba(76, 201, 240, 0.1) 0%, rgba(10, 10, 26, 0.8) 70%)",
              boxShadow: "inset 0 0 20px rgba(76, 201, 240, 0.3)",
            }}
            animate={{
              boxShadow: pulseEffect
                ? [
                    "inset 0 0 20px rgba(76, 201, 240, 0.3)",
                    "inset 0 0 40px rgba(76, 201, 240, 0.5)",
                    "inset 0 0 20px rgba(76, 201, 240, 0.3)",
                  ]
                : "inset 0 0 20px rgba(76, 201, 240, 0.3)",
              scale: pulseEffect ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="font-tech-mono text-[#4cc9f0] text-xl md:text-2xl font-bold">
                {formatNumber(timeLeft.seconds)}
                <span className="text-[#E72585]">.</span>
                <span className="text-sm">{formatMilliseconds(timeLeft.milliseconds)}</span>
              </div>
              <div className="text-[#4cc9f0]/70 text-xs uppercase mt-1 font-tech-mono">Seconds</div>
            </div>
          </motion.div>

          {/* Orbital units */}
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Days - Top */}
            <TimeUnit
              value={timeLeft.days}
              label="Days"
              position="top"
              hasChanged={hasChanged("days")}
              isActive={activeUnit === "days"}
              setActive={() => setActiveUnit("days")}
              clearActive={() => setActiveUnit(null)}
              isGlitching={isGlitching}
              color="#E72585"
            />

            {/* Hours - Right */}
            <TimeUnit
              value={timeLeft.hours}
              label="Hours"
              position="right"
              hasChanged={hasChanged("hours")}
              isActive={activeUnit === "hours"}
              setActive={() => setActiveUnit("hours")}
              clearActive={() => setActiveUnit(null)}
              isGlitching={isGlitching}
              color="#560BAD"
            />

            {/* Minutes - Bottom */}
            <TimeUnit
              value={timeLeft.minutes}
              label="Minutes"
              position="bottom"
              hasChanged={hasChanged("minutes")}
              isActive={activeUnit === "minutes"}
              setActive={() => setActiveUnit("minutes")}
              clearActive={() => setActiveUnit(null)}
              isGlitching={isGlitching}
              color="#4cc9f0"
            />

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              <motion.circle
                cx="50%"
                cy="50%"
                r="30%"
                fill="none"
                stroke="rgba(76, 201, 240, 0.1)"
                strokeWidth="1"
                strokeDasharray="5 5"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 120,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{ transformOrigin: "center" }}
              />

              <motion.line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="10%"
                stroke="rgba(231, 37, 133, 0.3)"
                strokeWidth="1"
                strokeDasharray="5 3"
                animate={{
                  opacity: activeUnit === "days" ? [0.3, 0.8, 0.3] : 0.3,
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              <motion.line
                x1="50%"
                y1="50%"
                x2="90%"
                y2="50%"
                stroke="rgba(86, 11, 173, 0.3)"
                strokeWidth="1"
                strokeDasharray="5 3"
                animate={{
                  opacity: activeUnit === "hours" ? [0.3, 0.8, 0.3] : 0.3,
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />

              <motion.line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="90%"
                stroke="rgba(76, 201, 240, 0.3)"
                strokeWidth="1"
                strokeDasharray="5 3"
                animate={{
                  opacity: activeUnit === "minutes" ? [0.3, 0.8, 0.3] : 0.3,
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </svg>
          </div>
        </div>

        {/* Completion percentage */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-32 bg-black/50 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#E72585]" style={{ width: `${getProgressPercentage()}%` }} />
          </div>
          <div className="font-tech-mono text-[#E72585] text-sm">{getProgressPercentage().toFixed(2)}%</div>
        </div>

        {/* Event date */}
        <motion.div
          className="text-center"
          animate={{
            textShadow: [
              "0 0 5px rgba(76, 201, 240, 0.5)",
              "0 0 10px rgba(76, 201, 240, 0.8)",
              "0 0 5px rgba(76, 201, 240, 0.5)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="font-rajdhani text-white/80">EVENT STARTS</div>
          <div className="font-tech-mono font-bold text-[#4cc9f0] text-lg">OCTOBER 4-5TH 2025</div>
        </motion.div>

        {/* Power indicator */}
        <motion.div
          className="absolute bottom-4 left-4 flex items-center gap-2"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Zap size={14} className="text-[#E72585]" />
          <div className="font-tech-mono text-xs text-[#E72585]">POWER: OPTIMAL</div>
        </motion.div>
      </div>

      {/* Hidden audio elements */}
      <audio src="/sounds/tick.mp3" preload="auto" />
      <audio src="/sounds/alarm.mp3" preload="auto" />
      <audio src="/sounds/ambient.mp3" preload="auto" loop />
      <audio src="/sounds/glitch.mp3" preload="auto" />
    </motion.div>
  )
}

interface TimeUnitProps {
  value: number
  label: string
  position: "top" | "right" | "bottom" | "left"
  hasChanged: boolean
  isActive: boolean
  setActive: () => void
  clearActive: () => void
  isGlitching: boolean
  color: string
}

function TimeUnit({
  value,
  label,
  position,
  hasChanged,
  isActive,
  setActive,
  clearActive,
  isGlitching,
  color,
}: TimeUnitProps) {
  // Position styles
  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return { top: "0", left: "50%", transform: "translateX(-50%)" }
      case "right":
        return { top: "50%", right: "0", transform: "translateY(-50%)" }
      case "bottom":
        return { bottom: "0", left: "50%", transform: "translateX(-50%)" }
      case "left":
        return { top: "50%", left: "0", transform: "translateY(-50%)" }
    }
  }

  const positionStyles = getPositionStyles()

  // Format number with leading zero
  const formattedValue = value < 10 ? `0${value}` : value.toString()

  return (
    <motion.div
      className="absolute"
      style={positionStyles}
      onMouseEnter={setActive}
      onMouseLeave={clearActive}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="w-20 h-20 flex items-center justify-center rounded-lg overflow-hidden"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, ${color}05 70%)`,
          boxShadow: `0 0 15px ${color}40, inset 0 0 10px ${color}30`,
          border: `2px solid ${color}30`,
        }}
        animate={{
          boxShadow: isActive
            ? `0 0 25px ${color}70, inset 0 0 15px ${color}50`
            : `0 0 15px ${color}40, inset 0 0 10px ${color}30`,
          borderColor: isActive ? `${color}70` : `${color}30`,
          scale: hasChanged ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          {/* RGB split effect on glitch */}
          {isGlitching && (
            <>
              <div
                className="absolute inset-0 flex items-center justify-center text-red-500 opacity-70"
                style={{ transform: "translate(-1px, 0)" }}
              >
                <span className="font-tech-mono text-2xl font-bold">{formattedValue}</span>
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center text-blue-500 opacity-70"
                style={{ transform: "translate(1px, 0)" }}
              >
                <span className="font-tech-mono text-2xl font-bold">{formattedValue}</span>
              </div>
            </>
          )}

          <div className="font-tech-mono text-2xl font-bold" style={{ color }}>
            {formattedValue}
          </div>
          <div className="text-xs uppercase mt-1 font-tech-mono text-white/70">{label}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}
