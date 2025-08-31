"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface LoadingBarProps {
  isLoading: boolean
}

export default function LoadingBar({ isLoading }: LoadingBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      setProgress(0)

      // Simulate loading progress - optimized to be faster
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Faster progression
          const increment = prev < 50 ? 10 : prev < 80 ? 5 : 2
          const newProgress = Math.min(prev + increment, 90)
          return newProgress
        })
      }, 100) // Reduced interval time

      return () => clearInterval(interval)
    } else {
      // Complete the progress when loading is done
      setProgress(100)
    }
  }, [isLoading])

  if (!isLoading && progress === 100) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="h-1 bg-gradient-to-r from-[#E72585] to-[#4cc9f0]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2 }} // Faster transition
      />
    </div>
  )
}
