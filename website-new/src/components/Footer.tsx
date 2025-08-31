import { motion } from 'framer-motion'
import { Instagram, Mail } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/cusehacks/", label: "Instagram" },
    { icon: Mail, href: "mailto:info@cusehacks.org", label: "Email" },
    { 
      icon: ({ size, ...props }: { size?: number }) => (
        <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ), 
      href: "https://www.linkedin.com/company/cusehacks/", 
      label: "LinkedIn" 
    },
  ]

  return (
    <footer className="py-16 px-4 relative bg-[#0f0f1a]/90">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <img
            src="/images/robot-mascot-transparent.png"
            alt="CuseHacks Mascot"
            className="w-20 h-20 mx-auto mb-6"
          />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-8 font-orbitron"
        >
          See you there!
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 font-rajdhani">Innovate Orange</h3>
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#0a0a1a] rounded-full flex items-center justify-center hover:bg-accent-500/50 transition-all duration-300 border border-white/10 hover:border-accent-500/50 hover:scale-110"
                  aria-label={social.label}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 font-rajdhani">Quick Links</h3>
            <ul className="space-y-2">
              {["About", "Schedule", "Team", "FAQ"].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => document.querySelector(`#${link.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 font-rajdhani">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:info@cusehacks.org" 
                  className="text-white/80 hover:text-primary-400 transition-colors"
                >
                  info@cusehacks.org
                </a>
              </li>
              <li className="text-white/80">Syracuse University</li>
              <li className="text-white/80">Syracuse, NY</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10"
        >
          <p className="text-white/60 text-sm">© 2025 Innovate Orange. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer