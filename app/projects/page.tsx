"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Code, Filter, Search } from "lucide-react"
import { fetchProjectData, type Project } from "@/utils/project-data"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [years, setYears] = useState<string[]>([])

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true)
      try {
        const allProjects = await fetchProjectData()
        setProjects(allProjects)
        setFilteredProjects(allProjects)

        // Extract unique years
        const uniqueYears = Array.from(new Set(allProjects.map((p) => p.year))).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime(),
        )
        setYears(uniqueYears)
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Filter projects based on search query and selected year
  useEffect(() => {
    let filtered = projects

    if (selectedYear) {
      filtered = filtered.filter((project) => project.year === selectedYear)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.builtWith.some((tech) => tech.toLowerCase().includes(query)),
      )
    }

    setFilteredProjects(filtered)
  }, [searchQuery, selectedYear, projects])

  return (
    <main className="min-h-screen w-full bg-[#0a0a1a] relative">
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(231,37,133,0.5)] font-orbitron">
            PROJECT PORTFOLIO
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Explore all the innovative projects created during previous CuseHacks events
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-4 border border-[#560BAD]/30">
            {/* Year filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#4cc9f0]" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedYear === null
                      ? "bg-[#E72585] text-white"
                      : "bg-[#560BAD]/30 text-white/80 hover:bg-[#560BAD]/50"
                  } transition-colors`}
                >
                  All Years
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedYear === year
                        ? "bg-[#E72585] text-white"
                        : "bg-[#560BAD]/30 text-white/80 hover:bg-[#560BAD]/50"
                    } transition-colors`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#E72585]/50"
              />
            </div>
          </div>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#0f0f1a]/80 rounded-xl h-64"></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">No projects found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-6 border border-[#560BAD]/30 hover:border-[#E72585]/50 transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white font-rajdhani">{project.title}</h3>
                  <span className="text-[#4cc9f0] text-sm font-tech-mono">{project.year}</span>
                </div>

                <div className="mb-4">
                  <p className="text-[#4cc9f0] text-sm font-tech-mono mb-2">Built With:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.builtWith.map((tech, i) => (
                      <span key={i} className="bg-[#560BAD]/20 text-white/90 px-2 py-1 rounded-full text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <a
                    href={project.tryItOutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-4 py-2 rounded-lg text-sm hover:shadow-[0_0_15px_rgba(231,37,133,0.5)] transition-shadow"
                  >
                    <ExternalLink size={14} />
                    Try It Out
                  </a>

                  <a
                    href={project.tryItOutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#0a0a1a] border border-[#4cc9f0]/30 text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0a0a1a]/70 transition-colors"
                  >
                    <Code size={14} />
                    View Code
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
