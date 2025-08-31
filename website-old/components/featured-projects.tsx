"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ExternalLink, Code, ChevronRight } from "lucide-react"

// This component displays featured projects
// Replace this with your actual project data
export default function FeaturedProjects() {
  const [isLoading, setIsLoading] = useState(false)

  // Real project data should be fetched from your database or CMS
  // This is a placeholder structure for you to replace with actual data
  const featuredProjects = [
    {
      id: "project-1",
      title: "CampusConnect",
      description: "A platform connecting students with similar interests for collaboration and social activities.",
      builtWith: ["React", "Node.js", "MongoDB", "Express"],
      tryItOutLink: "https://campusconnect.cusehacks.org",
      codeLink: "https://github.com/cusehacks/campusconnect",
    },
    {
      id: "project-2",
      title: "StudyBuddy",
      description: "AI-powered study assistant that helps students organize notes and prepare for exams.",
      builtWith: ["Python", "TensorFlow", "Flask", "React"],
      tryItOutLink: "https://studybuddy.cusehacks.org",
      codeLink: "https://github.com/cusehacks/studybuddy",
    },
    {
      id: "project-3",
      title: "EcoTrack",
      description: "Sustainability tracking app that helps students monitor and reduce their carbon footprint.",
      builtWith: ["React Native", "Firebase", "Node.js", "Chart.js"],
      tryItOutLink: "https://ecotrack.cusehacks.org",
      codeLink: "https://github.com/cusehacks/ecotrack",
    },
    {
      id: "project-4",
      title: "EventHub",
      description: "A centralized platform for campus events and activities with real-time updates.",
      builtWith: ["Next.js", "Supabase", "Tailwind CSS", "TypeScript"],
      tryItOutLink: "https://eventhub.cusehacks.org",
      codeLink: "https://github.com/cusehacks/eventhub",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white font-rajdhani">Featured Projects</h2>
        <Link
          href="/projects"
          className="flex items-center gap-2 text-[#4cc9f0] hover:text-[#E72585] transition-colors"
        >
          View Full Portfolio
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-6 border border-[#560BAD]/30 hover:border-[#E72585]/50 transition-all hover:-translate-y-1"
          >
            <h3 className="text-xl font-bold text-white mb-3 font-rajdhani">{project.title}</h3>

            <p className="text-white/80 text-sm mb-4">{project.description}</p>

            {/* Built With section in a clearly defined container */}
            <div className="mb-4 bg-[#0a0a1a] rounded-lg p-3 border border-[#4cc9f0]/20">
              <p className="text-[#4cc9f0] text-xs font-tech-mono mb-2">BUILT WITH:</p>
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
                href={project.codeLink}
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
    </div>
  )
}
