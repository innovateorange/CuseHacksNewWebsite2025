"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedCountdownProps {
  targetDate: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function AnimatedCountdown({ targetDate, className = "" }: AnimatedCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Fix the infinite update loop by restructuring the useEffect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        const newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }

        // Only update prevTimeLeft when seconds change
        if (newTimeLeft.seconds !== timeLeft.seconds) {
          setPrevTimeLeft(timeLeft)
        }

        setTimeLeft(newTimeLeft)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate]) // Remove timeLeft from dependencies

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString()
  }

  // Check if a specific unit has changed
  const hasChanged = (unit: keyof TimeLeft) => {
    return timeLeft[unit] !== prevTimeLeft[unit]
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-4 gap-4">
        <CountdownUnit
          label="DAYS"
          value={formatNumber(timeLeft.days)}
          hasChanged={hasChanged("days")}
          color="primary"
        />
        <CountdownUnit
          label="HOURS"
          value={formatNumber(timeLeft.hours)}
          hasChanged={hasChanged("hours")}
          color="secondary"
        />
        <CountdownUnit
          label="MINUTES"
          value={formatNumber(timeLeft.minutes)}
          hasChanged={hasChanged("minutes")}
          color="accent"
        />
        <CountdownUnit
          label="SECONDS"
          value={formatNumber(timeLeft.seconds)}
          hasChanged={hasChanged("seconds")}
          color="primary"
        />
      </div>
    </div>
  )
}

interface CountdownUnitProps {
  label: string
  value: string
  hasChanged: boolean
  color: "primary" | "secondary" | "accent"
}

function CountdownUnit({ label, value, hasChanged, color }: CountdownUnitProps) {
  const colorClasses = {
    primary: "from-[#E72585] to-[#E72585]/70 border-[#E72585] shadow-[0_0_15px_rgba(231,37,133,0.5)]",
    secondary: "from-[#4cc9f0] to-[#4cc9f0]/70 border-[#4cc9f0] shadow-[0_0_15px_rgba(76,201,240,0.5)]",
    accent: "from-[#560BAD] to-[#560BAD]/70 border-[#560BAD] shadow-[0_0_15px_rgba(86,11,173,0.5)]",
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`bg-[#0f0f1a] rounded-lg p-2 border border-opacity-50 ${hasChanged ? "animate-pulse" : ""}`}>
        <div className="relative">
          {/* Glitch effect on change */}
          {hasChanged && <div className="absolute inset-0 glitch-overlay opacity-50"></div>}

          {/* Digits with flip animation */}
          <div className="flex justify-center">
            <AnimatePresence mode="popLayout">
              {value.split("").map((digit, i) => (
                <motion.div
                  key={`${i}-${digit}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gradient-to-b ${colorClasses[color]} w-14 h-20 md:w-16 md:h-24 flex items-center justify-center rounded-md m-1 relative overflow-hidden`}
                >
                  {/* Scanlines effect */}
                  <div className="absolute inset-0 scanlines opacity-10"></div>

                  {/* Digit */}
                  <span className="font-tech-mono text-3xl md:text-4xl font-bold text-white relative z-10">
                    {digit}
                  </span>

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
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className={`font-rajdhani text-sm font-bold tracking-widest text-${color === "primary" ? "pink" : color === "secondary" ? "cyan" : "purple"}-400`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
