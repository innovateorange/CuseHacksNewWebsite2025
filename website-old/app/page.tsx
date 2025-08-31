"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingBar from '@/components/loading-bar'
import CountdownTimer from '@/components/countdown-timer'
import Navbar from '@/components/navbar'
import FeaturedProjects from '@/components/featured-projects'
import { TeamSection } from '@/app/components/team-section'

// FAQ items
const faqItems = [
  {
    question: "What is a hackathon?",
    answer:
      "A hackathon is an event where people come together to collaborate on creating innovative projects, typically in the form of software or hardware solutions, within a limited timeframe.",
  },
  {
    question: "Who can participate in CuseHacks?",
    answer:
      "CuseHacks is open to all students, regardless of their major or technical background. Whether you're a seasoned coder or a beginner, you're welcome to join!",
  },
  {
    question: "What should I bring to the hackathon?",
    answer:
      "We recommend bringing your laptop, charger, any hardware you plan to use, a valid student ID, and a passion for innovation! Don't forget comfortable clothing and personal toiletries.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "No, participation in CuseHacks is completely free! We provide meals, snacks, and resources to all participants.",
  },
  {
    question: "Can I work on a team?",
    answer:
      "Yes, teamwork is highly encouraged! You can form a team of up to four members. It's a great way to collaborate and learn from others.",
  },
  {
    question: "What kind of projects can I create?",
    answer:
      "The possibilities are endless! You can work on web applications, mobile apps, hardware projects, or anything else that sparks your creativity. Just make sure it aligns with the hackathon's theme and rules.",
  },
]

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Refs for scroll navigation
  const countdownRef = useRef<HTMLDivElement>(null!)
  const aboutRef = useRef<HTMLDivElement>(null!)
  const projectsRef = useRef<HTMLDivElement>(null!)
  const scheduleRef = useRef<HTMLDivElement>(null!)
  const faqRef = useRef<HTMLDivElement>(null!)
  const teamRef = useRef<HTMLDivElement>(null!)

  // Optimize loading time
  useEffect(() => {
    setIsLoading(false)
    setLoaded(true)
  }, [])

  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // Scroll to section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Target date for countdown - October 4, 2025
  const targetDate = new Date("2025-10-04T09:00:00")

  return (
    <main className="relative w-full bg-[#0a0a1a] text-white font-['Ubuntu_Sans',sans-serif] overflow-hidden">
      {/* Loading Bar */}
      <LoadingBar isLoading={isLoading} />

      {/* Fixed Navbar */}
      <Navbar />

      {/* Cyberpunk grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_1px,_#0a0a1a_1px),_linear-gradient(90deg,_transparent_1px,_#0a0a1a_1px)] bg-[size:30px_30px] [background-position:center] opacity-20"></div>

      {/* Hero Section - Enhanced */}
      <section
        id="home"
        className="relative min-h-screen pt-12 pb-16 px-4 flex flex-col items-center justify-center text-center"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cyberpunk-city.webp"
            alt="Cyberpunk City"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={60}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/90 via-[#0a0a1a]/80 to-[#0a0a1a]/90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-wider relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff1b6b] via-[#E72585] to-[#45caff] animate-gradient-x">
              CUSEHACKS
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff1b6b] via-[#E72585] to-[#45caff] opacity-20 blur-2xl -z-10"></div>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <p className="text-2xl md:text-3xl text-white/90 font-medium mb-8">
              October 4-5th 2025
            </p>

            <button
              className="relative group bg-gradient-to-r from-[#4cc9f0] via-[#E72585] to-[#560BAD] text-white px-12 py-4 rounded-xl font-bold text-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(76,201,240,0.3)]"
            >
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#E72585] to-[#4cc9f0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-[#0a0a1a] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </motion.div>
        </div>

        {/* Scroll down indicator - enhanced */}
        <motion.button
          onClick={() => scrollToSection(countdownRef)}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:bg-white/10 flex flex-col items-center gap-2 rounded-full px-6 py-3 border border-[#4cc9f0]/30 hover:border-[#4cc9f0] transition-all duration-300 group backdrop-blur-sm"
          aria-label="Scroll down"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="text-[#4cc9f0] group-hover:text-white transition-colors text-lg font-medium">Learn More</span>
          <ChevronDown className="h-6 w-6 text-[#4cc9f0] group-hover:text-white transition-colors animate-bounce" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4cc9f0]/10 via-[#E72585]/10 to-[#560BAD]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        </motion.button>
      </section>

      {/* Countdown Section - Enhanced */}
      <section ref={countdownRef} id="countdown" className="py-20 px-4 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-10 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-[#4cc9f0] to-[#560BAD]"
          >
            Countdown to CuseHacks
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-b from-[#560BAD]/20 to-[#560BAD]/5 backdrop-blur-md rounded-xl p-8 border border-[#560BAD]/30 shadow-[0_0_30px_rgba(86,11,173,0.3)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4cc9f0]/10 via-[#E72585]/10 to-[#560BAD]/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            
            <CountdownTimer targetDate={targetDate} />

            <div className="mt-8 text-center">
              <p className="text-white/90 text-lg mb-2">
                Join us for 24 hours of innovation, creativity, and collaboration!
              </p>
              <div className="flex items-center justify-center mt-4 text-white/80">
                <MapPin className="w-5 h-5 text-[#4cc9f0] mr-2" />
                <span>Life Science Atrium, Syracuse University</span>
              </div>
              <div className="mt-6">
                <Link href="/countdown" className="inline-block">
                  <Button className="relative group bg-gradient-to-r from-[#4cc9f0] to-[#560BAD] hover:from-[#E72585] hover:to-[#4cc9f0] text-white transition-all duration-300">
                    <span className="relative z-10">View Detailed Countdown</span>
                    <div className="absolute inset-0 bg-[#0a0a1a] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section ref={aboutRef} id="about-us" className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 font-orbitron">About Us</h2>

          <div className="bg-gradient-to-b from-[#E72585]/20 to-[#E72585]/5 backdrop-blur-md rounded-xl p-8 border border-[#E72585]/30 shadow-[0_0_30px_rgba(231,37,133,0.3)] relative">
            <h3 className="text-2xl font-bold mb-4 font-rajdhani text-[#E72585]">What is Innovate Orange?</h3>
            <p className="text-white/90 mb-4">
              Innovate Orange is the first and only student-run hackathon organization at Syracuse University. We have a
              community of students who like to create things and help others do the same.
            </p>
            <p className="text-white/90 mb-4">
              We host weekly workshops and plan CuseHacks and Datathons each semester. We want to encourage and develop
              student interest in technology and programming and create opportunities for students to engage in
              project-based learning.
            </p>
            <p className="font-bold text-white mb-4">
              No technical skills are required to join the club or participate in our events!
            </p>
            <p className="text-white/90">Join us at our next event!</p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section ref={projectsRef} id="projects" className="py-20 px-4 bg-[#0f0f1a]/90">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 font-orbitron">Featured Projects</h2>
          <FeaturedProjects />
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} id="team" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 font-orbitron">Meet Our Team</h2>
          <TeamSection showOnlyCurrentTeam={true} />
        </div>
      </section>

      {/* Schedule Section */}
      <section ref={scheduleRef} id="schedule" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 font-orbitron">Schedule</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Day 1 */}
            <div className="bg-gradient-to-b from-[#E72585]/20 to-[#E72585]/5 backdrop-blur-md rounded-xl p-6 border border-[#E72585]/30 shadow-[0_0_15px_rgba(231,37,133,0.3)]">
              <h3 className="text-xl font-bold mb-6 font-rajdhani text-[#E72585]">Day 1: Saturday, Oct 4</h3>

              <div className="space-y-6">
                {[
                  { time: "8:00 AM", event: "Check-in & Registration", description: "Grab your badge and swag" },
                  { time: "9:00 AM", event: "Opening Ceremony", description: "Welcome and kickoff" },
                  { time: "10:00 AM", event: "Hacking Begins", description: "Start building your projects" },
                  { time: "12:00 PM", event: "Lunch", description: "Catered food for all participants" },
                  {
                    time: "2:00 PM",
                    event: "Workshop: AI Integration",
                    description: "Learn to add AI to your project",
                  },
                  { time: "6:00 PM", event: "Dinner", description: "Refuel for the night ahead" },
                  { time: "11:00 PM", event: "Late Night Snack", description: "Keep your energy up" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-20 text-sm font-medium text-white/80">{item.time}</div>
                    <div className="w-4 h-4 rounded-full bg-[#E72585] mx-2 mt-1 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-white">{item.event}</div>
                      <div className="text-sm text-white/70">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-gradient-to-b from-[#4cc9f0]/20 to-[#4cc9f0]/5 backdrop-blur-md rounded-xl p-6 border border-[#4cc9f0]/30 shadow-[0_0_15px_rgba(76,201,240,0.3)]">
              <h3 className="text-xl font-bold mb-6 font-rajdhani text-[#4cc9f0]">Day 2: Sunday, Oct 5</h3>

              <div className="space-y-6">
                {[
                  {
                    time: "12:00 AM",
                    event: "Midnight Activities",
                    description: "Surprise events to keep you awake",
                  },
                  { time: "7:00 AM", event: "Breakfast", description: "Start your day right" },
                  { time: "9:00 AM", event: "Hacking Ends", description: "Pencils down! Finish your projects" },
                  { time: "10:00 AM", event: "Judging Begins", description: "Present to our panel of judges" },
                  { time: "12:00 PM", event: "Lunch", description: "Final meal together" },
                  { time: "1:00 PM", event: "Closing Ceremony", description: "Awards and recognitions" },
                  { time: "2:30 PM", event: "Hackathon Ends", description: "See you next year!" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-20 text-sm font-medium text-white/80">{item.time}</div>
                    <div className="w-4 h-4 rounded-full bg-[#4cc9f0] mx-2 mt-1 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-white">{item.event}</div>
                      <div className="text-sm text-white/70">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} id="faq" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 font-orbitron">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-[#560BAD]/20 to-[#560BAD]/5 backdrop-blur-md rounded-xl overflow-hidden border border-[#560BAD]/30"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-3 text-left flex justify-between items-center"
                  aria-expanded={expandedFaq === index}
                >
                  <span className="font-medium text-white">{item.question}</span>
                  {expandedFaq === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#E72585]"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#4cc9f0]"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>

                <div
                  className={`px-4 overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? "max-h-40 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-white/80 text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/80 mb-4">Still have questions? Feel free to reach out!</p>
            <Button className="bg-gradient-to-r from-[#560BAD] to-[#E72585] hover:opacity-90 text-white shadow-[0_0_15px_rgba(86,11,173,0.3)]">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 relative bg-[#0f0f1a]/90">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/images/robot-mascot-transparent.png"
              alt="CuseHacks Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>

          <h2 className="text-3xl font-bold mb-8 font-orbitron">See you there!</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 font-rajdhani">Innovate Orange</h3>
              <div className="flex gap-2 justify-center">
                <a
                  href="https://twitter.com/cusehacks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#0a0a1a] rounded-full flex items-center justify-center hover:bg-[#E72585]/50 transition-colors border border-white/10"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="https://instagram.com/cusehacks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#0a0a1a] rounded-full flex items-center justify-center hover:bg-[#E72585]/50 transition-colors border border-white/10"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 font-rajdhani">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/team" className="text-white/80 hover:text-white transition-colors">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/pictures" className="text-white/80 hover:text-white transition-colors">
                    Event Pictures
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-white/80 hover:text-white transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 font-rajdhani">Contact</h3>
              <ul className="space-y-2">
                <li className="text-white/80">info@cusehacks.org</li>
                <li className="text-white/80">Syracuse University</li>
                <li className="text-white/80">Syracuse, NY</li>
              </ul>
            </div>
          </div>

          <p className="text-white/60 text-sm">© 2025 Innovate Orange. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
