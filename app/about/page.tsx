"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

// Import the AnimatedLogo component at the top of the file
import AnimatedLogo from "@/components/animated-logo"

// Add the MascotSection component after the imports
function MascotSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="absolute top-24 left-6 md:left-12 lg:left-24 z-20 hidden md:block"
    >
      <div className="relative">
        <AnimatedLogo size={80} className="mascot-about" />
        <motion.div
          className="absolute -bottom-2 -right-2 bg-[#560BAD] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{ boxShadow: "0 0 10px rgba(86,11,173,0.7)" }}
        >
          !
        </motion.div>
      </div>

      <motion.div
        className="mt-3 bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-[#E72585]/30 max-w-[200px]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <p className="text-white text-sm font-rajdhani">
          Hi there! I'm the CuseHacks mascot. Explore our page to learn more about us!
        </p>
      </motion.div>
    </motion.div>
  )
}

// Add the FloatingMascot component for mobile devices
function FloatingMascot() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 right-6 z-50 md:hidden"
    >
      <AnimatedLogo size={60} />
    </motion.div>
  )
}

export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Enhance the FAQ section with improved functionality and accessibility
  // Update the toggleFaq function to handle keyboard navigation
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // Add keyboard event handler for FAQ items
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleFaq(index)
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background Image with overlay */}
      <div className="fixed inset-0 z-0">
        <Image src="/images/cyberpunk-city.webp" alt="Cyberpunk City" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#560BAD]/30 via-transparent to-[#560BAD]/20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
        <div className="absolute inset-0 scanlines opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <MascotSection />
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        {/* About Us Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(231,37,133,0.5)] font-orbitron">
              ABOUT US
            </h1>
            <div className="w-48 h-0.5 bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD] mx-auto mt-4 mb-6"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-8 border border-[#560BAD]/30 shadow-[0_0_30px_rgba(86,11,173,0.3)] max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#E72585] mb-6 font-rajdhani">What is Innovate Orange?</h2>
            <div className="text-white/90 space-y-4 font-rajdhani">
              <p>
                Innovate Orange is the first and only student-run hackathon organization at Syracuse University. We have
                a community of students who like to create things and help others do the same.
              </p>
              <p>
                We host weekly workshops and plan CuseHacks and Datathons each semester. We want to encourage and
                develop student interest in technology and programming and create opportunities for students to engage
                in project-based learning.
              </p>
              <p className="font-bold text-[#4cc9f0]">
                No technical skills are required to join the club or participate in our events!
              </p>
              <p>Join us at our next event!</p>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/events"
                className="bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-6 py-3 rounded-lg font-rajdhani font-bold tracking-wider hover:shadow-[0_0_20px_rgba(231,37,133,0.7)] transition-shadow"
              >
                UPCOMING EVENTS
              </Link>
            </div>
          </motion.div>
        </section>

        {/* CuseHacks 2025 Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(76,201,240,0.5)] font-orbitron">
              CUSEHACKS 2025
            </h2>
            <div className="w-48 h-0.5 bg-gradient-to-r from-[#4cc9f0] via-[#560BAD] to-[#E72585] mx-auto mt-4 mb-6"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-8 border border-[#4cc9f0]/30 shadow-[0_0_30px_rgba(76,201,240,0.3)] max-w-4xl mx-auto"
          >
            <div className="text-white/90 space-y-4 font-rajdhani">
              <p>
                CuseHacks is a 24-hour hackathon event where people come together to innovate, create, and build amazing
                projects. While competing with other participants to win prizes!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-[#0a0a1a] p-6 rounded-lg border border-[#E72585]/30">
                  <h3 className="text-[#E72585] font-bold text-xl mb-2 font-rajdhani">When</h3>
                  <p className="text-white">Saturday-Sunday, October 4-5th 2025</p>
                </div>

                <div className="bg-[#0a0a1a] p-6 rounded-lg border border-[#4cc9f0]/30">
                  <h3 className="text-[#4cc9f0] font-bold text-xl mb-2 font-rajdhani">Where</h3>
                  <p className="text-white">Life Science Atrium</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-[#560BAD] font-bold text-xl mb-4 font-rajdhani">Prizes & Categories</h3>
                <div className="bg-[#0a0a1a] p-6 rounded-lg border border-[#560BAD]/30">
                  <p className="text-white/80 italic">Coming soon! Stay tuned for prize categories and details.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/join"
                className="bg-gradient-to-r from-[#4cc9f0] to-[#560BAD] text-white px-6 py-3 rounded-lg font-rajdhani font-bold tracking-wider hover:shadow-[0_0_20px_rgba(76,201,240,0.7)] transition-shadow"
              >
                REGISTER NOW
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(86,11,173,0.5)] font-orbitron">
              FAQ
            </h2>
            <div className="w-48 h-0.5 bg-gradient-to-r from-[#560BAD] via-[#E72585] to-[#4cc9f0] mx-auto mt-4 mb-6"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl border border-[#560BAD]/30 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#560BAD]/10 transition-colors"
                  aria-expanded={expandedFaq === index}
                  aria-controls={`faq-content-${index}`}
                >
                  <span className="font-rajdhani font-bold text-white text-lg">{item.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="text-[#E72585] w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="text-[#4cc9f0] w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
                <div
                  id={`faq-content-${index}`}
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? "max-h-96 py-4" : "max-h-0 py-0"
                  }`}
                  aria-hidden={expandedFaq !== index}
                >
                  <p className="text-white/80 font-rajdhani">{item.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/70 font-rajdhani">
              Have more questions? Feel free to{" "}
              <a
                href="mailto:info@cusehacks.com"
                className="text-[#4cc9f0] hover:text-[#E72585] transition-colors underline"
              >
                contact us
              </a>
              .
            </p>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gradient-to-r from-[#E72585]/20 to-[#4cc9f0]/20 backdrop-blur-md rounded-xl p-8 border border-white/10 max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-rajdhani">Join Innovate Orange</h2>
            <p className="text-white/80 mb-6 font-rajdhani">
              Become part of our community and help shape the future of technology at Syracuse University.
            </p>
            <a
              href="https://syracuseuniversity.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-rajdhani font-bold transition-colors"
            >
              VISIT OUR CLUB PAGE
              <ExternalLink size={16} />
            </a>
          </motion.div>
        </section>
      </div>
      <FloatingMascot />
    </main>
  )
}

const faqItems = [
  {
    question: "What is a Hackathon?",
    answer:
      "A hackathon is a 24-hour coding competition in which you or your team create a project from scratch and compete against other participants for prizes!",
  },
  {
    question: "What type of workshops do you host?",
    answer:
      "We offer weekly workshops on various topics not included in core courses, such as Leetcode and Machine Learning.",
  },
  {
    question: "Do I need a team for CuseHacks 2025?",
    answer: "No, you don't need a team for CuseHacks. You can compete solo.",
  },
  {
    question: "Where is CuseHacks going to be?",
    answer: "Cusehacks is being held in the Life Science Atrium from Saturday-Sunday on October 4-5th.",
  },
  {
    question: "What do I need to bring?",
    answer: "Bring your laptop and charger and some hackathon spirit!",
  },
  {
    question: "Where and when are the workshops?",
    answer: "Our workshops are every Wednesday in Link Hall Room 160 at 7:00 pm. Come join us!",
  },
  {
    question: "Can I volunteer for CuseHacks 2025?",
    answer: "Yes, you can sign up as a volunteer for CuseHacks 2025!",
  },
  {
    question: "Can I participate if I have no experience?",
    answer: "Of course! Anyone can participate in CuseHacks, no matter your experience level you can compete.",
  },
  {
    question: "What are the rules?",
    answer:
      'Submissions are automatically entered for "Best Overall." To qualify for other categories, select them during submission. Projects must be created solely for CuseHacks 2025—no prior work allowed. Hackers may only contribute to one team. Boilerplate code is allowed if properly licensed and documented. Code is required for all categories except "Best Design."',
  },
  {
    question: "Are walk-ins accepted?",
    answer: "Yes, walk-ins are accepted. Feel free to stop by and join in on the coding!",
  },
  {
    question: "Does this cost money?",
    answer: "No, CuseHacks doesn't have any participation fee.",
  },
]
