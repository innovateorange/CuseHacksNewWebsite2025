import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useFeatureFlags } from '../contexts/FeatureFlagContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { flags, loading } = useFeatureFlags()

  const navItems = [
    { name: 'Home', href: '#home', type: 'scroll' },
    { name: 'About', href: '#about', type: 'scroll' },
    { name: 'Schedule', href: '#schedule', type: 'scroll' },
    { name: 'Team', href: '#team', type: 'scroll' },
    { name: 'FAQ', href: '#faq', type: 'scroll' },
  ]

  const scrollTo = (id: string) => {
    if (isHomePage) {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/' + id
    }
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-orbitron font-bold text-xl bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
            >
              CUSEHACKS
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollTo(item.href)}
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-500/20 rounded-lg"
                >
                  {item.name}
                </button>
              ))}
              {!loading && flags.projectSubmissionsEnabled && (
                <Link
                  to="/projects"
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-500/20 rounded-lg"
                >
                  Projects
                </Link>
              )}
              {!loading && flags.registrationEnabled && (
                <Link
                  to="/register"
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-500/20 rounded-lg"
                >
                  Register
                </Link>
              )}
              {!loading && flags.projectSubmissionsEnabled && (
                <Link
                  to="/submit"
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Submit Project
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-primary-500 p-3 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-md border-b border-primary-500/20"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollTo(item.href)}
                className="text-white/80 hover:text-white block px-4 py-3 text-base font-medium w-full text-left hover:bg-primary-500/20 rounded-lg min-h-[44px] flex items-center"
              >
                {item.name}
              </button>
            ))}
            {!loading && flags.projectSubmissionsEnabled && (
              <Link
                to="/projects"
                className="text-white/80 hover:text-white block px-4 py-3 text-base font-medium w-full text-left hover:bg-primary-500/20 rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>
            )}
            {!loading && flags.registrationEnabled && (
              <Link
                to="/register"
                className="text-white/80 hover:text-white block px-4 py-3 text-base font-medium w-full text-left hover:bg-primary-500/20 rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            )}
            {!loading && flags.projectSubmissionsEnabled && (
              <Link
                to="/submit"
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-full mt-4 block text-center min-h-[44px] flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                Submit Project
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar