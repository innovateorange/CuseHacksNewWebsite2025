import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Github, Heart } from 'lucide-react'
import { mockAPI } from '../lib/mockData'

interface Project {
  _id: string
  title: string
  description: string
  category: string
  teamMembers: string[]
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  submissionDate: string
  isApproved: boolean
  votes: number
  images?: string[]
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [votingProject, setVotingProject] = useState<string | null>(null)
  const [devpostLink, setDevpostLink] = useState('')

  const categories = [
    'all',
    'Best Overall',
    'Best UI/UX',
    'Best Hardware Hack',
    'Most Creative',
    'Best Use of AI'
  ]

  useEffect(() => {
    fetchProjects()
  }, [selectedCategory])

  useEffect(() => {
    const loadDevpostLink = async () => {
      try {
        const config = await mockAPI.getSiteConfig()
        setDevpostLink(config.devpostLink)
      } catch (error) {
        console.error('Error loading DevPost link:', error)
      }
    }

    loadDevpostLink()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await mockAPI.getProjects(selectedCategory === 'all' ? undefined : selectedCategory)
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (projectId: string) => {
    setVotingProject(projectId)
    try {
      const data = await mockAPI.voteProject(projectId)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? { ...project, votes: data.votes }
            : project
        )
      )
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVotingProject(null)
    }
  }

  const handleSubmitProject = () => {
    if (devpostLink) {
      window.open(devpostLink, '_blank', 'noopener,noreferrer')
    } else {
      alert('DevPost link not configured. Please contact the organizers.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white">
      <div className="relative">
        {/* Background grid */}
        <div className="fixed inset-0 bg-[linear-gradient(transparent_1px,_#0a0a1a_1px),_linear-gradient(90deg,_transparent_1px,_#0a0a1a_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />
        
        <div className="relative z-10 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold font-orbitron mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
                Project Showcase
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Discover the amazing projects created at CuseHacks 2025
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleSubmitProject}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Submit Your Project
                </button>
                <Link
                  to="/"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                        : 'bg-purple-500/20 text-white/80 hover:bg-purple-500/30 border border-purple-500/30'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Projects Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
                />
              </div>
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
                <p className="text-white/60 mb-6">
                  {selectedCategory === 'all' 
                    ? 'No projects have been submitted yet. Be the first!'
                    : `No projects in the "${selectedCategory}" category yet.`}
                </p>
                <button
                  onClick={handleSubmitProject}
                  className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Submit Your Project
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105"
                  >
                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {project.category}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-white mb-3 font-rajdhani group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Team Members */}
                    <div className="mb-4">
                      <p className="text-xs text-white/60 mb-1">Team:</p>
                      <p className="text-white/80 text-sm">
                        {project.teamMembers.join(', ')}
                      </p>
                    </div>

                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-white/60 mb-2">Technologies:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded">
                              +{project.technologies.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                            title="View on GitHub"
                          >
                            <Github size={16} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                            title="View Live Demo"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>

                      {/* Voting */}
                      <button
                        onClick={() => handleVote(project._id)}
                        disabled={votingProject === project._id}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Heart size={14} className="text-red-400" />
                        <span className="text-sm text-white">
                          {votingProject === project._id ? '...' : project.votes}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage