"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ExternalLink, Github, Heart, MessageCircle } from "lucide-react"

// Define project type
interface Project {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  team: string[]
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  likes: number
  comments: number
  images?: string[]
  longDescription?: string
}

// Sample project data
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neural Network Visualizer",
    description: "Interactive visualization of neural networks with real-time training data.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "Machine Learning",
    team: ["Alex Johnson", "Maria Garcia", "David Kim"],
    technologies: ["React", "TensorFlow.js", "Three.js"],
    githubUrl: "https://github.com",
    demoUrl: "https://demo.com",
    likes: 42,
    comments: 12,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    longDescription:
      "This project visualizes neural networks in 3D space, allowing users to see how data flows through the network during training. It includes interactive features to adjust learning rates, network architecture, and input data. The visualization helps in understanding how neural networks learn patterns and make predictions.",
  },
  {
    id: "2",
    title: "AR Campus Navigator",
    description: "Augmented reality app for navigating university campus with real-time directions.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "Augmented Reality",
    team: ["Sarah Lee", "James Wilson"],
    technologies: ["Unity", "ARKit", "C#"],
    githubUrl: "https://github.com",
    likes: 38,
    comments: 8,
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    longDescription:
      "AR Campus Navigator uses augmented reality to help students and visitors navigate the university campus. The app overlays directional arrows and information about buildings directly onto the camera view. Users can search for specific locations, classes, or facilities and get step-by-step directions in real-time.",
  },
  {
    id: "3",
    title: "EcoTrack",
    description: "IoT-based environmental monitoring system for tracking air quality and pollution levels.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "IoT",
    team: ["Michael Brown", "Emily Chen", "Robert Taylor", "Lisa Wong"],
    technologies: ["Arduino", "React Native", "Firebase", "TensorFlow Lite"],
    demoUrl: "https://demo.com",
    likes: 56,
    comments: 23,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    longDescription:
      "EcoTrack is an IoT-based environmental monitoring system that uses a network of sensors to track air quality, pollution levels, and other environmental metrics. The data is collected in real-time and analyzed using machine learning algorithms to identify patterns and predict future trends. The mobile app allows users to view current conditions and receive alerts when pollution levels exceed safe thresholds.",
  },
  {
    id: "4",
    title: "CryptoWallet",
    description: "Secure cryptocurrency wallet with multi-chain support and advanced security features.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "Blockchain",
    team: ["Daniel Martinez", "Sophia Anderson"],
    technologies: ["React Native", "Solidity", "Web3.js"],
    githubUrl: "https://github.com",
    demoUrl: "https://demo.com",
    likes: 29,
    comments: 7,
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    longDescription:
      "CryptoWallet is a secure cryptocurrency wallet that supports multiple blockchain networks. It features advanced security measures including biometric authentication, multi-signature transactions, and encrypted storage. The wallet allows users to send, receive, and store various cryptocurrencies, as well as interact with decentralized applications.",
  },
  {
    id: "5",
    title: "MindMelody",
    description: "AI-powered music generation based on brainwave patterns and emotional states.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "AI & Music",
    team: ["Jennifer Park", "Thomas Moore"],
    technologies: ["Python", "TensorFlow", "EEG Hardware", "Web Audio API"],
    likes: 67,
    comments: 19,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    longDescription:
      "MindMelody uses EEG sensors to capture brainwave patterns and emotional states, then generates personalized music using AI algorithms. The system learns from user feedback to improve the generated music over time. The project explores the intersection of neuroscience, artificial intelligence, and music theory to create a unique and personalized audio experience.",
  },
  {
    id: "6",
    title: "VirtualTryOn",
    description: "Virtual clothing try-on system using computer vision and augmented reality.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "Computer Vision",
    team: ["Ryan Johnson", "Olivia Williams", "Nathan Chen"],
    technologies: ["OpenCV", "TensorFlow", "React", "WebGL"],
    githubUrl: "https://github.com",
    likes: 45,
    comments: 14,
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    longDescription:
      "VirtualTryOn allows users to try on clothing virtually using computer vision and augmented reality. The system accurately maps clothing items onto the user's body in real-time, taking into account body shape, lighting, and movement. Users can browse a catalog of clothing items and see how they would look without physically trying them on.",
  },
]

// Filter categories
const CATEGORIES = [
  "All Projects",
  "Machine Learning",
  "Augmented Reality",
  "IoT",
  "Blockchain",
  "AI & Music",
  "Computer Vision",
]

interface ProjectGalleryProps {
  className?: string
}

export default function ProjectGallery({ className = "" }: ProjectGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Projects")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Filter projects based on category and search query
  const filteredProjects = PROJECTS.filter((project) => {
    const matchesCategory = selectedCategory === "All Projects" || project.category === selectedCategory
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  // Scroll to top of gallery when changing filters
  const scrollToTop = () => {
    galleryRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    scrollToTop()
  }

  // Handle project selection
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }

  // Handle image navigation
  const navigateImage = (direction: "next" | "prev") => {
    if (!selectedProject || !selectedProject.images) return

    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev === selectedProject.images!.length - 1 ? 0 : prev + 1))
    } else {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.images!.length - 1 : prev - 1))
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header with filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD]">
              PROJECT GALLERY
            </span>
          </h2>

          {/* Search input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f0f1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#E72585]/50"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4cc9f0] text-xs font-tech-mono">
              {filteredProjects.length} RESULTS
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm font-rajdhani ${
                selectedCategory === category
                  ? "bg-[#E72585] text-white"
                  : "bg-[#0f0f1a] border border-[#560BAD]/50 text-white/80 hover:bg-[#560BAD]/30"
              } transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div
        ref={galleryRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar"
      >
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => handleProjectSelect(project)} />
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/70 font-rajdhani">
            No projects found matching your criteria. Try adjusting your filters.
          </div>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f0f1a] border border-[#560BAD]/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="p-6">
                {/* Image gallery */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="relative mb-6 rounded-lg overflow-hidden aspect-video">
                    <Image
                      src={selectedProject.images[currentImageIndex] || "/placeholder.svg"}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />

                    {/* Navigation arrows */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateImage("prev")
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateImage("next")
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>

                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {selectedProject.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentImageIndex(index)
                              }}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex ? "bg-white" : "bg-white/50"
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Project details */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white font-rajdhani">{selectedProject.title}</h3>
                      <div className="text-[#4cc9f0] text-sm font-tech-mono mt-1">{selectedProject.category}</div>
                    </div>

                    <div className="flex space-x-3">
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white transition-colors"
                          aria-label="GitHub repository"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {selectedProject.demoUrl && (
                        <a
                          href={selectedProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white transition-colors"
                          aria-label="Live demo"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Long description */}
                  <p className="text-white/80 mb-6">{selectedProject.longDescription || selectedProject.description}</p>

                  {/* Team members */}
                  <div className="mb-4">
                    <h4 className="text-white font-rajdhani font-bold mb-2">TEAM</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.team.map((member, index) => (
                        <div key={index} className="bg-[#560BAD]/20 text-white/90 px-3 py-1 rounded-full text-sm">
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-white font-rajdhani font-bold mb-2">TECHNOLOGIES</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <div key={index} className="bg-[#E72585]/20 text-white/90 px-3 py-1 rounded-full text-sm">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engagement stats */}
                  <div className="flex space-x-4 text-white/70 text-sm">
                    <div className="flex items-center">
                      <Heart size={16} className="mr-1" />
                      <span>{selectedProject.likes} likes</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle size={16} className="mr-1" />
                      <span>{selectedProject.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl overflow-hidden cursor-pointer group relative"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] to-transparent opacity-70"></div>

        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-[#E72585]/80 text-white text-xs px-2 py-1 rounded-full font-rajdhani">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white font-rajdhani mb-2 group-hover:text-[#4cc9f0] transition-colors">
          {project.title}
        </h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{project.description}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="text-xs bg-[#560BAD]/20 text-white/80 px-2 py-0.5 rounded-full">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs bg-[#560BAD]/20 text-white/80 px-2 py-0.5 rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-white/60 text-xs">
          <div className="flex items-center">
            <Heart size={12} className="mr-1" />
            <span>{project.likes}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle size={12} className="mr-1" />
            <span>{project.comments}</span>
          </div>
          <div>
            {project.team.length} team member{project.team.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#560BAD]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </motion.div>
  )
}
