"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Download, Check } from "lucide-react"
import { generateCalendarInvite, downloadCalendarInvite } from "@/utils/calendar-utils"

interface CalendarButtonProps {
  title?: string
  description?: string
  location?: string
  startDate?: Date
  endDate?: Date
  url?: string
  className?: string
}

export default function CalendarButton({
  title = "CUSEHACKS Hackathon",
  description = "Join us for 24 hours of coding, creativity, and collaboration at Syracuse University's premier hackathon event.",
  location = "Syracuse University, Life Sciences Building, 107 College Place, Syracuse, NY 13210",
  startDate = new Date("2025-10-04T09:00:00"),
  endDate = new Date("2025-10-05T09:00:00"),
  url = "https://cusehacks.com",
  className = "",
}: CalendarButtonProps) {
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = () => {
    const icsContent = generateCalendarInvite({
      title,
      description,
      location,
      startDate,
      endDate,
      url,
    })

    downloadCalendarInvite(icsContent, "cusehacks-2025.ics")

    // Show success state
    setIsDownloaded(true)
    setTimeout(() => setIsDownloaded(false), 3000)
  }

  return (
    <motion.button
      className={`relative group flex items-center gap-2 px-5 py-3 rounded-lg ${className} ${
        isDownloaded
          ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
          : "bg-gradient-to-r from-[#E72585] to-[#560BAD] hover:from-[#E72585]/90 hover:to-[#560BAD]/90 text-white"
      }`}
      onClick={handleDownload}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-lg bg-[#E72585]/20 blur-md"></div>
      </div>

      {/* Icon */}
      <motion.div
        animate={{
          rotate: isHovered && !isDownloaded ? [0, -10, 10, 0] : 0,
          scale: isDownloaded ? [1, 1.2, 1] : 1,
        }}
        transition={{
          rotate: { duration: 0.5 },
          scale: { duration: 0.3 },
        }}
        className="relative z-10"
      >
        {isDownloaded ? <Check className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
      </motion.div>

      {/* Text */}
      <span className="relative z-10 font-medium">{isDownloaded ? "Added to Calendar" : "Add to Calendar"}</span>

      {/* Download icon (only shows on hover when not downloaded) */}
      {isHovered && !isDownloaded && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
          <Download className="w-4 h-4" />
        </motion.div>
      )}
    </motion.button>
  )
}
