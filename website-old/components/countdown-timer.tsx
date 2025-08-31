"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  targetDate: Date
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        // If the target date has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0")
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="col-span-1">
            <div className="bg-white rounded-md p-2 text-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <div className="text-3xl font-bold text-black font-tech-mono">00</div>
            </div>
            <div className="text-center mt-2 text-sm font-rajdhani">
              {i === 0 ? "Days" : i === 1 ? "Hours" : i === 2 ? "Minutes" : "Seconds"}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Days */}
      <div className="col-span-1">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-md p-2 text-center shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <div className="text-3xl font-bold text-black font-tech-mono">{formatNumber(timeLeft.days)}</div>
        </motion.div>
        <div className="text-center mt-2 text-sm font-rajdhani">Days</div>
      </div>

      {/* Hours */}
      <div className="col-span-1">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-md p-2 text-center shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <div className="text-3xl font-bold text-black font-tech-mono">{formatNumber(timeLeft.hours)}</div>
        </motion.div>
        <div className="text-center mt-2 text-sm font-rajdhani">Hours</div>
      </div>

      {/* Minutes */}
      <div className="col-span-1">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-md p-2 text-center shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <div className="text-3xl font-bold text-black font-tech-mono">{formatNumber(timeLeft.minutes)}</div>
        </motion.div>
        <div className="text-center mt-2 text-sm font-rajdhani">Minutes</div>
      </div>

      {/* Seconds */}
      <div className="col-span-1">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-md p-2 text-center shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <div className="text-3xl font-bold text-black font-tech-mono">{formatNumber(timeLeft.seconds)}</div>
        </motion.div>
        <div className="text-center mt-2 text-sm font-rajdhani">Seconds</div>
      </div>
    </div>
  )
}
