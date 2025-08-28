"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Project {
  id: number
  title: string
  description: string
  image: string
}

interface ProjectCarouselProps {
  projects: Project[]
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
  }

  // Optimize scroll behavior
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentIndex * carouselRef.current.children[0].clientWidth
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <div className="relative">
      <button
        onClick={prevProject}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 z-10 hover:bg-black/70 transition-colors"
        aria-label="Previous project"
      >
        <ChevronLeft className="text-white" />
      </button>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 py-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="flex-shrink-0 w-64 h-48 bg-[#0a0a1a] rounded-lg overflow-hidden border border-[#560BAD]/30"
            whileHover={{ scale: 1.03 }} // Reduced scale effect
            transition={{ duration: 0.2 }} // Faster transition
          >
            <div className="relative w-full h-full">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
                loading={index === currentIndex || index === currentIndex + 1 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, 256px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                <h4 className="font-bold text-white font-rajdhani">{project.title}</h4>
                <p className="text-white/80 text-sm line-clamp-2">{project.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={nextProject}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 z-10 hover:bg-black/70 transition-colors"
        aria-label="Next project"
      >
        <ChevronRight className="text-white" />
      </button>

      {/* Pagination dots */}
      <div className="flex justify-center mt-2 gap-1">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-[#E72585]" : "bg-white/30"
            } transition-colors`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
