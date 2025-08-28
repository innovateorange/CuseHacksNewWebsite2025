"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about-us" },
  { name: "Projects", href: "/#projects" },
  { name: "Schedule", href: "/#schedule" },
  { name: "FAQ", href: "/#faq" },
  { name: "Team", href: "/#team" },
  { name: "Pictures", href: "/pictures" },
  { name: "Admin", href: "/admin" },
]

export default function FixedNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Handle scroll events with throttling for better performance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Determine active section based on scroll position
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100 // Offset for better detection

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    // Throttle scroll event for better performance
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-purple-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/robot-mascot-transparent.png"
              alt="CuseHacks Logo"
              width={30}
              height={30}
              className="object-contain drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
              priority
            />
            <span className="font-bold text-white">CuseHacks</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeSection === link.href.replace("/#", "") || (link.href === "/" && activeSection === "home")
                    ? "text-pink-400"
                    : "text-white hover:text-pink-300"
                }`}
              >
                {link.name}
                {(activeSection === link.href.replace("/#", "") || (link.href === "/" && activeSection === "home")) && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-pink-500 w-full"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-pink-400 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="md:hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: mobileMenuOpen ? "auto" : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-900/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activeSection === link.href.replace("/#", "") || (link.href === "/" && activeSection === "home")
                  ? "text-pink-400 bg-purple-800/50"
                  : "text-white hover:bg-purple-800/30 hover:text-pink-300"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  )
}
