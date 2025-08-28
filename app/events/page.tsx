"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, Filter, Search } from "lucide-react"
import EventCard from "@/components/event-card"

// Event categories
const CATEGORIES = ["All Events", "Workshops", "Competitions", "Social", "Tech Talks"]

// Sample events data
const EVENTS = [
  {
    id: 1,
    title: "Opening Ceremony",
    date: "2025-10-04",
    time: "09:00 AM - 10:00 AM",
    location: "Life Sciences Building, Main Auditorium",
    description:
      "Join us for the official kickoff of CuseHacks 2025! Meet the organizers, learn about the event, and get inspired for your hackathon journey.",
    category: "Social",
    featured: true,
  },
  {
    id: 2,
    title: "Workshop: Intro to AI with Python",
    date: "2025-10-04",
    time: "11:00 AM - 12:30 PM",
    location: "Room 132, Computer Science Building",
    description:
      "Learn the basics of artificial intelligence and how to implement simple AI models using Python and popular libraries.",
    category: "Workshops",
    capacity: "50 participants",
    registrationUrl: "#register",
  },
  {
    id: 3,
    title: "Tech Talk: Future of Web Development",
    date: "2025-10-04",
    time: "02:00 PM - 03:00 PM",
    location: "Virtual (Zoom)",
    description: "Industry experts discuss emerging trends and technologies shaping the future of web development.",
    category: "Tech Talks",
    registrationUrl: "#register",
  },
  {
    id: 4,
    title: "Team Building Activity",
    date: "2025-10-04",
    time: "04:00 PM - 05:00 PM",
    location: "Student Center, Main Hall",
    description:
      "Looking for teammates? Join this structured networking session to find collaborators with complementary skills.",
    category: "Social",
  },
  {
    id: 5,
    title: "Workshop: Building with React and Next.js",
    date: "2025-10-04",
    time: "06:00 PM - 07:30 PM",
    location: "Room 201, Computer Science Building",
    description:
      "Hands-on workshop covering modern web development with React and Next.js. Build a full-stack application in 90 minutes!",
    category: "Workshops",
    capacity: "40 participants",
    registrationUrl: "#register",
  },
  {
    id: 6,
    title: "Midnight Snack & Gaming Break",
    date: "2025-10-05",
    time: "12:00 AM - 01:00 AM",
    location: "Student Center, Game Room",
    description: "Take a break from coding! Enjoy snacks, games, and connect with fellow hackers.",
    category: "Social",
  },
  {
    id: 7,
    title: "Project Submission Deadline",
    date: "2025-10-05",
    time: "09:00 AM",
    location: "Online Submission Portal",
    description:
      "Final deadline to submit your projects for judging. Make sure to complete your submission on the hackathon platform.",
    category: "Competitions",
    featured: true,
  },
  {
    id: 8,
    title: "Project Expo & Judging",
    date: "2025-10-05",
    time: "10:00 AM - 12:00 PM",
    location: "Life Sciences Building, Exhibition Hall",
    description:
      "Present your projects to judges and peers. This is your chance to showcase what you've built and get valuable feedback.",
    category: "Competitions",
  },
  {
    id: 9,
    title: "Closing Ceremony & Awards",
    date: "2025-10-05",
    time: "01:00 PM - 02:30 PM",
    location: "Life Sciences Building, Main Auditorium",
    description:
      "Join us for the grand finale of CuseHacks 2025! Winners will be announced and prizes awarded across multiple categories.",
    category: "Social",
    featured: true,
  },
]

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter events based on category and search query
  const filteredEvents = EVENTS.filter((event) => {
    const matchesCategory = selectedCategory === "All Events" || event.category === selectedCategory
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group events by date
  const eventsByDate = filteredEvents.reduce(
    (acc, event) => {
      const date = event.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(event)
      return acc
    },
    {} as Record<string, typeof EVENTS>,
  )

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort()

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  return (
    <main className="relative min-h-screen w-full">
      {/* Background Image with overlay */}
      <div className="fixed inset-0 z-0">
        <Image src="/images/cyberpunk-city.webp" alt="Cyberpunk City" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#560BAD]/30 via-transparent to-[#560BAD]/20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(231,37,133,0.5)] font-orbitron">
            Event Schedule
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Explore all the exciting events happening at CuseHacks 2025. From workshops to tech talks, there's something
            for everyone!
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#560BAD]/20 backdrop-blur-md rounded-xl p-4 border border-[#560BAD]/30">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#4cc9f0]" />
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? "bg-[#E72585] text-white"
                        : "bg-[#560BAD]/30 text-white/80 hover:bg-[#560BAD]/50"
                    } transition-colors`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full bg-[#560BAD]/30 border border-[#560BAD]/50 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#E72585]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Events list */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/80">
              No events found matching your criteria. Try adjusting your filters.
            </motion.div>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[#E72585]" />
                  <h2 className="text-2xl font-bold text-white">{formatDate(date)}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsByDate[date].map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      date={formatDate(event.date)}
                      time={event.time}
                      location={event.location}
                      description={event.description}
                      capacity={event.capacity}
                      registrationUrl={event.registrationUrl}
                      className={event.featured ? "border-[#E72585]/30 from-[#E72585]/20 to-[#E72585]/5" : ""}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
