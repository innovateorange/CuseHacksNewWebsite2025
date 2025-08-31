"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ExternalLink, Github, Code } from "lucide-react"

// Define project interface for type safety and documentation
interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  featured?: boolean
}

// Sample projects data - can be replaced with actual projects
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neural Network Visualizer",
    description: "Interactive visualization of neural networks with real-time training data.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["React", "TensorFlow.js", "Three.js"],
    githubUrl: "https://github.com",
    demoUrl: "https://demo.com",
    featured: true,
  },
  {
    id: "2",
    title: "AR Campus Navigator",
    description: "Augmented reality app for navigating university campus with real-time directions.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["Unity", "ARKit", "C#"],
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "EcoTrack",
    description: "IoT-based environmental monitoring system for tracking air quality and pollution levels.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["Arduino", "React Native", "Firebase", "TensorFlow Lite"],
    demoUrl: "https://demo.com",
    featured: true,
  },
]

interface ProjectShowcaseProps {
  className?: string
  title?: string
  description?: string
}

/**
 * ProjectShowcase Component
 *
 * A modular, accessible component for showcasing projects with interactive features.
 *
 * Features:
 * - Responsive carousel design
 * - Keyboard navigation support
 * - Animated transitions
 * - Detailed project modal
 * - Accessibility compliant
 *
 * @param className - Optional CSS class for styling
 * @param title - Optional custom title for the showcase section
 * @param description - Optional custom description for the showcase section
 */
export default function ProjectShowcase({
  className = "",
  title = "FEATURED PROJECTS",
  description = "Explore innovative projects from previous hackathons. Get inspired and see what's possible!",
}: ProjectShowcaseProps) {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Filter featured projects if available, otherwise use all projects
  const displayProjects = PROJECTS.filter((project) => project.featured) || PROJECTS

  // Navigation functions
  const nextProject = () => {
    setCurrentIndex((prev) => (prev === displayProjects.length - 1 ? 0 : prev + 1))
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayProjects.length - 1 : prev - 1))
  }

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextProject()
    } else if (e.key === "ArrowLeft") {
      prevProject()
    }
  }

  return (
    <section className={`${className}`}>
      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">{title}</h2>
        <div className="w-48 h-0.5 bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD] mx-auto mt-4 mb-6"></div>
        <p className="text-white/80 max-w-2xl mx-auto font-rajdhani">{description}</p>
      </div>

      {/* Project carousel */}
      <div
        ref={carouselRef}
        className="relative max-w-4xl mx-auto"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Project showcase carousel"
      >
        {/* Navigation buttons */}
        <button
          onClick={prevProject}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-[#E72585]"
          aria-label="Previous project"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextProject}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-[#E72585]"
          aria-label="Next project"
        >
          <ChevronRight size={24} />
        </button>

        {/* Project slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl overflow-hidden border border-[#560BAD]/30"
          >
            <div className="relative aspect-video">
              <Image
                src={displayProjects[currentIndex].image || "/placeholder.svg"}
                alt={displayProjects[currentIndex].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/50 to-transparent"></div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">
                {displayProjects[currentIndex].title}
              </h3>

              <p className="text-white/80 mb-4">{displayProjects[currentIndex].description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {displayProjects[currentIndex].technologies.map((tech, idx) => (
                  <span key={idx} className="bg-[#E72585]/20 text-white/90 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedProject(displayProjects[currentIndex])}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-4 py-2 rounded-lg font-rajdhani font-bold tracking-wider hover:shadow-[0_0_15px_rgba(231,37,133,0.5)] transition-shadow"
                >
                  <Code size={16} />
                  VIEW DETAILS
                </button>

                {displayProjects[currentIndex].demoUrl && (
                  <a
                    href={displayProjects[currentIndex].demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#0a0a1a] border border-[#4cc9f0]/50 text-white px-4 py-2 rounded-lg hover:bg-[#0a0a1a]/70 transition-colors"
                  >
                    <ExternalLink size={16} />
                    LIVE DEMO
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {displayProjects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? "bg-[#E72585] w-6" : "bg-white/50"
              }`}
              aria-label={`Go to project ${idx + 1}`}
              aria-current={idx === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f0f1a] border border-[#560BAD]/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <Image
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">{selectedProject.title}</h3>

                <p className="text-white/80 mb-6">{selectedProject.description}</p>

                <div className="mb-6">
                  <h4 className="text-[#4cc9f0] font-bold mb-2 font-rajdhani">TECHNOLOGIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-[#E72585]/20 text-white/90 px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#0a0a1a] border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-[#0a0a1a]/70 transition-colors"
                    >
                      <Github size={16} />
                      GITHUB
                    </a>
                  )}

                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#0a0a1a] border border-[#4cc9f0]/50 text-white px-4 py-2 rounded-lg hover:bg-[#0a0a1a]/70 transition-colors"
                    >
                      <ExternalLink size={16} />
                      LIVE DEMO
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
