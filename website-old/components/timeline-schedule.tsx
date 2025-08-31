"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"

interface Event {
  id: string
  time: string
  title: string
  description: string
  location: string
  category: string
  icon?: React.ReactNode
}

interface TimelineScheduleProps {
  day: string
  events: Event[]
  className?: string
}

export default function TimelineSchedule({ day, events, className = "" }: TimelineScheduleProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeEvent, setActiveEvent] = useState<string | null>(null)

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    scrollContainer.addEventListener("scroll", checkScrollPosition)
    checkScrollPosition() // Initial check

    return () => {
      scrollContainer.removeEventListener("scroll", checkScrollPosition)
    }
  }, [])

  // Scroll left/right
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300 // px to scroll
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "workshop":
      case "workshops":
        return "from-[#E72585]/20 to-[#E72585]/5 border-[#E72585]/30"
      case "social":
        return "from-[#4cc9f0]/20 to-[#4cc9f0]/5 border-[#4cc9f0]/30"
      case "competition":
      case "competitions":
        return "from-[#560BAD]/20 to-[#560BAD]/5 border-[#560BAD]/30"
      case "tech talk":
      case "tech talks":
        return "from-[#9d4edd]/20 to-[#9d4edd]/5 border-[#9d4edd]/30"
      default:
        return "from-gray-700/20 to-gray-700/5 border-gray-700/30"
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "workshop":
      case "workshops":
        return <div className="w-4 h-4 rounded-full bg-[#E72585]" />
      case "social":
        return <div className="w-4 h-4 rounded-full bg-[#4cc9f0]" />
      case "competition":
      case "competitions":
        return <div className="w-4 h-4 rounded-full bg-[#560BAD]" />
      case "tech talk":
      case "tech talks":
        return <div className="w-4 h-4 rounded-full bg-[#9d4edd]" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white font-rajdhani">{day}</h3>

        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full ${
              canScrollLeft ? "bg-[#560BAD]/30 hover:bg-[#560BAD]/50 text-white" : "bg-gray-800/30 text-gray-600"
            } transition-colors`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full ${
              canScrollRight ? "bg-[#560BAD]/30 hover:bg-[#560BAD]/50 text-white" : "bg-gray-800/30 text-gray-600"
            } transition-colors`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Timeline track */}
      <div ref={scrollContainerRef} className="timeline-track pb-4 mb-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            className={`timeline-item ${getCategoryColor(
              event.category,
            )} backdrop-blur-md rounded-xl p-4 border cursor-pointer`}
            whileHover={{ y: -5 }}
            onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
          >
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 mr-3 mt-1">{event.icon || getCategoryIcon(event.category)}</div>

              <div>
                <div className="font-tech-mono text-sm text-white/70">{event.time}</div>
                <h4 className="font-rajdhani font-bold text-white text-lg">{event.title}</h4>
              </div>
            </div>

            <AnimatedDetails isOpen={activeEvent === event.id} event={event} />
          </motion.div>
        ))}
      </div>

      {/* Timeline line */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD] bottom-0 opacity-50 rounded-full">
        <motion.div
          className="absolute top-0 left-0 w-4 h-4 rounded-full bg-white -mt-1.5"
          animate={{
            x: [0, "98%", 0],
            backgroundColor: ["#E72585", "#4cc9f0", "#560BAD", "#E72585"],
            boxShadow: ["0 0 10px #E72585", "0 0 10px #4cc9f0", "0 0 10px #560BAD", "0 0 10px #E72585"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
    </div>
  )
}

function AnimatedDetails({ isOpen, event }: { isOpen: boolean; event: Event }) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="pt-2 space-y-2">
        <p className="text-white/80 text-sm">{event.description}</p>

        <div className="flex items-center text-xs text-white/70">
          <MapPin size={12} className="mr-1" />
          <span>{event.location}</span>
        </div>

        {/* Additional details could go here */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full"
          >
            Add to My Schedule
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
