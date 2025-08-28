"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, AlertTriangle, X } from "lucide-react"

interface CyberpunkCountdownProps {
  targetDate: string
  className?: string
  onComplete?: () => void
  variant?: "default" | "neon" | "terminal" | "holographic"
  soundEnabled?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

export default function CyberpunkCountdown({
  targetDate,
  className = "",
  onComplete,
  variant = "neon", // Changed default to neon as requested
  soundEnabled = false,
}: CyberpunkCountdownProps) {
  // Core countdown state
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

  // UI state
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [isGlitching, setIsGlitching] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleMessages, setConsoleMessages] = useState<string[]>([])
  const [easterEggFound, setEasterEggFound] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  // Animation controls
  const containerRef = useRef<HTMLDivElement>(null)
  const consoleInputRef = useRef<HTMLInputElement>(null)

  // Audio refs - only create if sound is enabled
  const audioRefs = useRef<{
    tick?: HTMLAudioElement
    alarm?: HTMLAudioElement
    glitch?: HTMLAudioElement
  }>({})

  // Timers and intervals
  const timerRef = useRef<NodeJS.Timeout>()
  const glitchIntervalRef = useRef<NodeJS.Timeout>()
  const warningIntervalRef = useRef<NodeJS.Timeout>()

  // Calculate initial total seconds on mount
  useEffect(() => {
    const targetTime = new Date(targetDate).getTime()
    const now = new Date().getTime()
    const difference = targetTime - now

    if (difference > 0) {
      const totalSeconds = Math.floor(difference / 1000)
      setInitialTotalSeconds(totalSeconds)
    }

    // Initialize audio elements only if sound is enabled
    if (soundEnabled) {
      audioRefs.current.tick = new Audio("/sounds/tick.mp3")
      audioRefs.current.alarm = new Audio("/sounds/alarm.mp3")
      audioRefs.current.glitch = new Audio("/sounds/glitch.mp3")
    }

    // Set up random warning messages with reduced frequency
    warningIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.9) {
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000)
      }
    }, 20000) // Reduced frequency

    // Add keyboard listener for easter eggs
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+C to toggle console
      if (e.ctrlKey && e.altKey && e.key === "c") {
        setShowConsole((prev) => !prev)
        if (!showConsole) {
          addConsoleMessage("SYSTEM: Terminal access granted")
          addConsoleMessage("SYSTEM: Enter 'help' for available commands")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      // Clean up all timers and listeners
      if (timerRef.current) clearInterval(timerRef.current)
      if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current)
      if (warningIntervalRef.current) clearInterval(warningIntervalRef.current)

      window.removeEventListener("keydown", handleKeyDown)

      // Stop all audio
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) audio.pause()
      })
    }
  }, [targetDate, soundEnabled, showConsole])

  // Console functionality
  const addConsoleMessage = (message: string) => {
    setConsoleMessages((prev) => [...prev, message])
  }

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!consoleInputRef.current) return

    const command = consoleInputRef.current.value.trim().toLowerCase()
    addConsoleMessage(`> ${command}`)

    // Process commands
    switch (command) {
      case "help":
        addConsoleMessage("Available commands: help, status, clear, hack, exit")
        break
      case "status":
        addConsoleMessage(`System status: Online`)
        addConsoleMessage(
          `Time remaining: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`,
        )
        addConsoleMessage(`Completion: ${getProgressPercentage().toFixed(2)}%`)
        break
      case "clear":
        setConsoleMessages([])
        break
      case "hack":
        addConsoleMessage("SYSTEM: Initiating time acceleration protocol...")
        setEasterEggFound(true)
        break
      case "exit":
        setShowConsole(false)
        break
      default:
        addConsoleMessage(`Unknown command: ${command}`)
    }

    consoleInputRef.current.value = ""
  }

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDate).getTime()
      const now = new Date().getTime()

      // Apply time acceleration if easter egg is found
      let difference = targetTime - now
      if (easterEggFound) {
        difference = Math.max(0, difference - 1000 * 60) // Accelerate by 1 minute per second
      }

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

          // Play tick sound if enabled
          if (soundEnabled && audioRefs.current.tick) {
            audioRefs.current.tick.currentTime = 0
            audioRefs.current.tick.play().catch(() => {})
          }

          // Trigger glitch effect on second change with reduced frequency
          if (Math.random() > 0.8) {
            setIsGlitching(true)
            setTimeout(() => setIsGlitching(false), 300)
          }
        }

        setTimeLeft(newTimeLeft)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 })

        // Play alarm sound when countdown reaches zero
        if (prevTimeLeft.totalSeconds > 0 && soundEnabled && audioRefs.current.alarm) {
          audioRefs.current.alarm.play().catch(() => {})
        }

        if (onComplete) onComplete()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    timerRef.current = timer

    return () => clearInterval(timer)
  }, [targetDate, onComplete, timeLeft, prevTimeLeft, soundEnabled, easterEggFound])

  // Trigger glitch effect periodically with reduced frequency
  useEffect(() => {
    glitchIntervalRef.current = setInterval(() => {
      setIsGlitching(true)

      // Play glitch sound if enabled
      if (soundEnabled && audioRefs.current.glitch) {
        audioRefs.current.glitch.currentTime = 0
        audioRefs.current.glitch.play().catch(() => {})
      }

      setTimeout(() => setIsGlitching(false), 500)
    }, 15000) // Reduced frequency from 10s to 15s

    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
    }
  }, [soundEnabled])

  // Format number with leading zero
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

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case "neon":
        return {
          container: "bg-[#0a0a1a]/90 border-[#E72585]",
          text: "font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD]",
          digit: "bg-[#0a0a1a] border-2 border-[#E72585] text-[#E72585] shadow-[0_0_15px_rgba(231,37,133,0.7)]",
          label: "text-[#4cc9f0]",
        }
      case "terminal":
        return {
          container: "bg-black/90 border-[#00ff41]",
          text: "font-tech-mono text-[#00ff41]",
          digit: "bg-black border border-[#00ff41] text-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.5)]",
          label: "text-[#00ff41]",
        }
      case "holographic":
        return {
          container: "bg-[#0a0a2a]/80 border-[#4cc9f0]",
          text: "font-rajdhani text-[#4cc9f0]",
          digit:
            "bg-[#0a0a2a]/50 backdrop-blur-md border border-[#4cc9f0]/50 text-white shadow-[0_0_15px_rgba(76,201,240,0.5)]",
          label: "text-[#4cc9f0]",
        }
      default:
        return {
          container: "bg-[#0f0f1a]/90 border-[#560BAD]/50",
          text: "font-rajdhani text-white",
          digit: "bg-gradient-to-b from-[#E72585] to-[#E72585]/70 text-white shadow-[0_0_15px_rgba(231,37,133,0.5)]",
          label: "text-[#4cc9f0]",
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <motion.div
      ref={containerRef}
      className={`${className} relative border rounded-xl overflow-hidden ${styles.container}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Warning message */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/80 border border-yellow-500 text-yellow-500 px-4 py-2 rounded flex items-center gap-2 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="font-tech-mono text-sm">SYSTEM ANOMALY DETECTED</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/50 overflow-hidden rounded-t-xl">
        <motion.div
          className="h-full bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: getProgressPercentage() / 100 }}
          style={{ originX: 0 }}
          aria-hidden="true"
        />
      </div>

      {/* Countdown header */}
      <div className="text-center mb-6 pt-6 relative">
        <motion.h3
          className={`text-xl font-bold tracking-widest ${styles.text}`}
          animate={{
            textShadow: isGlitching
              ? ["0 0 5px #E72585", "0 0 10px #4cc9f0", "0 0 5px #560BAD"]
              : "0 0 5px rgba(231, 37, 133, 0.7)",
          }}
          transition={{ duration: 0.3 }}
        >
          {isGlitching ? "S¥ST3M C0UNTD0WN" : "SYSTEM COUNTDOWN"}
        </motion.h3>
        <div
          className={`text-sm font-tech-mono mt-1 ${variant === "terminal" ? "text-[#00ff41]" : "text-[#4cc9f0]"}`}
          aria-label={`${getProgressPercentage().toFixed(2)}% complete`}
        >
          {getProgressPercentage().toFixed(2)}% COMPLETE
        </div>

        {/* Terminal button */}
        <button
          onClick={() => {
            setShowConsole((prev) => !prev)
            if (!showConsole) {
              addConsoleMessage("SYSTEM: Terminal access granted")
              addConsoleMessage("SYSTEM: Enter 'help' for available commands")
            }
          }}
          className="absolute left-4 top-4 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle terminal"
        >
          <Terminal size={18} />
        </button>
      </div>

      {/* Countdown units */}
      <div className="grid grid-cols-4 gap-4 relative z-10 px-4" role="timer" aria-label="Countdown timer">
        <CountdownUnit
          label="DAYS"
          value={formatNumber(timeLeft.days)}
          hasChanged={hasChanged("days")}
          color="primary"
          isHovering={isHovering === "days"}
          setIsHovering={() => setIsHovering("days")}
          clearHovering={() => setIsHovering(null)}
          isGlitching={isGlitching}
          variant={variant}
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
          variant={variant}
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
          variant={variant}
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
          variant={variant}
        />
      </div>

      {/* Event date */}
      <motion.div
        className="text-center mt-6 pb-6"
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
        <div className={`font-rajdhani ${variant === "terminal" ? "text-[#00ff41]" : "text-white"}`}>EVENT STARTS</div>
        <div className={`font-tech-mono font-bold ${variant === "terminal" ? "text-[#00ff41]" : "text-[#4cc9f0]"}`}>
          OCTOBER 4-5TH 2025
        </div>
      </motion.div>

      {/* Terminal console */}
      <AnimatePresence>
        {showConsole && (
          <motion.div
            className="absolute inset-0 bg-black/95 z-30 flex flex-col p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-[#00ff41] font-tech-mono text-sm">SYSTEM TERMINAL v1.0</div>
              <button onClick={() => setShowConsole(false)} className="text-[#00ff41] hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-auto mb-2 terminal-scrollbar">
              {consoleMessages.map((msg, i) => (
                <div key={i} className="text-[#00ff41] font-tech-mono text-sm mb-1">
                  {msg}
                </div>
              ))}
            </div>

            <form onSubmit={handleConsoleSubmit} className="flex">
              <span className="text-[#00ff41] font-tech-mono text-sm mr-2">&gt;</span>
              <input
                ref={consoleInputRef}
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-[#00ff41] font-tech-mono text-sm"
                autoFocus
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styles for terminal scrollbar */}
      <style jsx global>{`
        .terminal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
          background: #00ff41;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00cc33;
        }
      `}</style>
    </motion.div>
  )
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
  variant: "default" | "neon" | "terminal" | "holographic"
}

function CountdownUnit({
  label,
  value,
  hasChanged,
  color,
  isHovering,
  setIsHovering,
  clearHovering,
  isGlitching,
  variant,
}: CountdownUnitProps) {
  // Get variant-specific styles
  const getStyles = () => {
    switch (variant) {
      case "neon":
        return {
          container: "bg-[#0a0a1a] border-2",
          digit:
            color === "primary"
              ? "border-[#E72585] text-[#E72585] shadow-[0_0_15px_rgba(231,37,133,0.7)]"
              : color === "secondary"
                ? "border-[#4cc9f0] text-[#4cc9f0] shadow-[0_0_15px_rgba(76,201,240,0.7)]"
                : "border-[#560BAD] text-[#560BAD] shadow-[0_0_15px_rgba(86,11,173,0.7)]",
          text: color === "primary" ? "text-[#E72585]" : color === "secondary" ? "text-[#4cc9f0]" : "text-[#560BAD]",
          font: "font-orbitron",
        }
      case "terminal":
        return {
          container: "bg-black border",
          digit: "border-[#00ff41] text-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.5)]",
          text: "text-[#00ff41]",
          font: "font-tech-mono",
        }
      case "holographic":
        return {
          container: "bg-[#0a0a2a]/50 backdrop-blur-md border",
          digit: "border-[#4cc9f0]/50 text-white shadow-[0_0_15px_rgba(76,201,240,0.5)]",
          text: "text-[#4cc9f0]",
          font: "font-rajdhani",
        }
      default:
        return {
          container: "bg-[#0f0f1a] border",
          digit:
            color === "primary"
              ? "border-[#E72585]/50 shadow-[0_0_15px_rgba(231,37,133,0.5)]"
              : color === "secondary"
                ? "border-[#4cc9f0]/50 shadow-[0_0_15px_rgba(76,201,240,0.5)]"
                : "border-[#560BAD]/50 shadow-[0_0_15px_rgba(86,11,173,0.5)]",
          text: color === "primary" ? "text-pink-400" : color === "secondary" ? "text-cyan-400" : "text-purple-400",
          font: "font-rajdhani",
        }
    }
  }

  const styles = getStyles()

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
        className={`${styles.container} rounded-lg p-2 border-opacity-50 ${styles.digit} ${hasChanged ? "animate-pulse" : ""}`}
        animate={{
          boxShadow: isHovering
            ? variant === "terminal"
              ? "0 0 20px rgba(0,255,65,0.8)"
              : "0 0 20px rgba(76,201,240,0.8)"
            : "none",
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
                className={`${styles.container} w-14 h-20 md:w-16 md:h-24 flex items-center justify-center rounded-md m-1 relative overflow-hidden ${styles.digit}`}
              >
                {/* RGB split effect on glitch */}
                {isGlitching && (
                  <>
                    <div
                      className="absolute inset-0 flex items-center justify-center text-red-500 opacity-70"
                      style={{ transform: "translate(-1px, 0)" }}
                    >
                      <span className={`${styles.font} text-3xl md:text-4xl font-bold`}>{digit}</span>
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center text-blue-500 opacity-70"
                      style={{ transform: "translate(1px, 0)" }}
                    >
                      <span className={`${styles.font} text-3xl md:text-4xl font-bold`}>{digit}</span>
                    </div>
                  </>
                )}

                {/* Digit */}
                <span className={`${styles.font} text-3xl md:text-4xl font-bold relative z-10`}>{digit}</span>

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
            ? variant === "terminal"
              ? ["0 0 5px #00ff41", "0 0 10px #00ff41", "0 0 5px #00ff41"]
              : ["0 0 5px #4cc9f0", "0 0 10px #4cc9f0", "0 0 5px #4cc9f0"]
            : "0 0 0px transparent",
        }}
        transition={{
          scale: { duration: 0.2 },
          y: { duration: 0.2 },
          textShadow: { duration: 1.5, repeat: isHovering ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" },
        }}
      >
        <span className={`${styles.font} text-sm font-bold tracking-widest ${styles.text}`}>{label}</span>
      </motion.div>
    </motion.div>
  )
}
