"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react"
import CalendarButton from "./calendar-button"

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  description: string
  capacity?: string
  registrationUrl?: string
  className?: string
}

export default function EventCard({
  title,
  date,
  time,
  location,
  description,
  capacity,
  registrationUrl,
  className = "",
}: EventCardProps) {
  // Parse date string to Date object for calendar
  const startDate = new Date(`${date}T${time.split(" - ")[0]}`)
  const endTime = time.split(" - ")[1] || time.split(" - ")[0]
  const endDate = new Date(`${date}T${endTime}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`bg-gradient-to-b from-[#560BAD]/20 to-[#560BAD]/5 backdrop-blur-md rounded-xl p-6 border border-[#560BAD]/30 shadow-[0_0_15px_rgba(86,11,173,0.2)] ${className}`}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>

        <div className="space-y-3 mb-4 flex-grow">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-[#E72585] mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-white/90">{date}</p>
              <p className="text-white/70 text-sm">{time}</p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-[#4cc9f0] mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-white/90">{location}</p>
          </div>

          {capacity && (
            <div className="flex items-start">
              <Users className="w-5 h-5 text-[#560BAD] mt-0.5 flex-shrink-0" />
              <p className="ml-3 text-white/90">{capacity}</p>
            </div>
          )}

          <p className="text-white/80 text-sm mt-3">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <CalendarButton
            title={title}
            description={description}
            location={location}
            startDate={startDate}
            endDate={endDate}
            className="text-sm py-2"
          />

          {registrationUrl && (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#4cc9f0]/20 to-[#4cc9f0]/10 hover:from-[#4cc9f0]/30 hover:to-[#4cc9f0]/20 text-white border border-[#4cc9f0]/30 rounded-lg px-4 py-2 text-sm transition-all"
            >
              More Info
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
