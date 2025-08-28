"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import OptimizedNavbar from "@/components/optimized-navbar"

// Sample pictures data - replace with your actual images
const PICTURES = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Hackathon participants collaborating",
    category: "Event",
    year: 2024,
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Team presenting their project",
    category: "Presentations",
    year: 2024,
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Award ceremony",
    category: "Awards",
    year: 2024,
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Workshop session",
    category: "Workshops",
    year: 2024,
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Networking event",
    category: "Event",
    year: 2023,
  },
  {
    id: 6,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Hackathon opening ceremony",
    category: "Event",
    year: 2023,
  },
  {
    id: 7,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Team building activity",
    category: "Event",
    year: 2023,
  },
  {
    id: 8,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Project demo",
    category: "Presentations",
    year: 2023,
  },
  {
    id: 9,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Award winners",
    category: "Awards",
    year: 2022,
  },
  {
    id: 10,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Coding session",
    category: "Event",
    year: 2022,
  },
  {
    id: 11,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Mentoring session",
    category: "Workshops",
    year: 2022,
  },
  {
    id: 12,
    src: "/placeholder.svg?height=600&width=800",
    alt: "Closing ceremony",
    category: "Event",
    year: 2022,
  },
]

// Get unique categories and years for filters
const CATEGORIES = ["All", ...Array.from(new Set(PICTURES.map((pic) => pic.category)))]
const YEARS = [...Array.from(new Set(PICTURES.map((pic) => pic.year))).sort((a, b) => b - a)]

export default function PicturesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Filter pictures based on selected category and year
  const filteredPictures = PICTURES.filter(
    (pic) =>
      (selectedCategory === "All" || pic.category === selectedCategory) &&
      (selectedYear === null || pic.year === selectedYear),
  )

  // Get current image index in filtered array
  const currentImageIndex = selectedImage !== null ? filteredPictures.findIndex((pic) => pic.id === selectedImage) : -1

  // Navigate through images in lightbox
  const navigateImage = (direction: "next" | "prev") => {
    if (currentImageIndex === -1) return

    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % filteredPictures.length
        : (currentImageIndex - 1 + filteredPictures.length) % filteredPictures.length

    setSelectedImage(filteredPictures[newIndex].id)
  }

  return (
    <main className="min-h-screen w-full bg-[#0a0a1a]">
      <OptimizedNavbar />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cyberpunk-city.webp"
          alt="Cyberpunk City"
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-transparent to-[#0a0a1a]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-8 font-orbitron"
        >
          CuseHacks Gallery
        </motion.h1>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-4 border border-[#560BAD]/30">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#4cc9f0]" />
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? "bg-[#E72585] text-white"
                        : "bg-[#0a0a1a] text-white/80 hover:bg-[#560BAD]/50"
                    } transition-colors`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Year filter */}
            <div className="flex items-center gap-2">
              <span className="text-white/70">Year:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedYear(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedYear === null
                      ? "bg-[#4cc9f0] text-white"
                      : "bg-[#0a0a1a] text-white/80 hover:bg-[#4cc9f0]/50"
                  } transition-colors`}
                >
                  All
                </button>
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedYear === year
                        ? "bg-[#4cc9f0] text-white"
                        : "bg-[#0a0a1a] text-white/80 hover:bg-[#4cc9f0]/50"
                    } transition-colors`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery grid */}
        {filteredPictures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">No pictures found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPictures.map((picture) => (
              <motion.div
                key={picture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-[#0f0f1a] rounded-lg overflow-hidden border border-[#560BAD]/30 cursor-pointer"
                onClick={() => setSelectedImage(picture.id)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={picture.src || "/placeholder.svg"}
                    alt={picture.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-white/80 text-sm truncate">{picture.alt}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#E72585] text-xs">{picture.category}</span>
                    <span className="text-white/60 text-xs">{picture.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && currentImageIndex !== -1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>

              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-3 text-white hover:bg-black/70 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("prev")
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative max-w-4xl max-h-[80vh] w-full">
                <Image
                  src={filteredPictures[currentImageIndex].src || "/placeholder.svg"}
                  alt={filteredPictures[currentImageIndex].alt}
                  width={1200}
                  height={800}
                  className="object-contain w-full h-full"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
                  <p className="text-white">{filteredPictures[currentImageIndex].alt}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#E72585]">{filteredPictures[currentImageIndex].category}</span>
                    <span className="text-white/60">{filteredPictures[currentImageIndex].year}</span>
                  </div>
                </div>
              </div>

              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-3 text-white hover:bg-black/70 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("next")
                }}
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
