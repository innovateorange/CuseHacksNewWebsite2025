"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, ChevronDown, ChevronUp, Code, FileCode, Github, Rocket } from "lucide-react"

/**
 * MakeProject Page
 *
 * A comprehensive guide for creating projects at CuseHacks.
 * This page provides step-by-step instructions, resources, and tips
 * for participants to successfully build and submit their projects.
 *
 * Features:
 * - Modular sections with collapsible content
 * - Interactive UI elements
 * - Resource links and code examples
 * - Progress tracking
 * - Responsive design
 */
export default function MakeProjectPage() {
  // State for tracking expanded sections and progress
  const [expandedSection, setExpandedSection] = useState<number | null>(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const pageRef = useRef<HTMLDivElement>(null)

  // Toggle section expansion
  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index)
  }

  // Toggle step completion
  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps((prev) => (prev.includes(stepIndex) ? prev.filter((i) => i !== stepIndex) : [...prev, stepIndex]))
  }

  // Calculate progress percentage
  const progressPercentage = (completedSteps.length / projectSteps.length) * 100

  return (
    <main ref={pageRef} className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background Image with overlay */}
      <div className="fixed inset-0 z-0">
        <Image src="/images/cyberpunk-city.webp" alt="Cyberpunk City" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#560BAD]/30 via-transparent to-[#560BAD]/20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
        <div className="absolute inset-0 scanlines opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(231,37,133,0.5)] font-orbitron">
            MAKE YOUR PROJECT
          </h1>
          <div className="w-48 h-0.5 bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD] mx-auto mt-4 mb-6"></div>
          <p className="text-white/80 max-w-2xl mx-auto font-rajdhani">
            Follow this guide to create an amazing project for CuseHacks 2025. We've broken down the process into
            manageable steps to help you succeed.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 font-rajdhani">Your Progress</span>
            <span className="text-[#4cc9f0] font-tech-mono">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-[#0f0f1a]/80 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E72585] to-[#4cc9f0]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Project Steps */}
        <div className="max-w-3xl mx-auto space-y-4">
          {projectSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl border overflow-hidden ${
                completedSteps.includes(index) ? "border-[#4cc9f0]/50" : "border-[#560BAD]/30"
              }`}
            >
              {/* Step Header */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#560BAD]/10 transition-colors"
                aria-expanded={expandedSection === index}
                aria-controls={`step-content-${index}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      completedSteps.includes(index)
                        ? "bg-[#4cc9f0]/20 text-[#4cc9f0]"
                        : "bg-[#E72585]/20 text-[#E72585]"
                    }`}
                  >
                    {completedSteps.includes(index) ? (
                      <Check size={16} />
                    ) : (
                      <span className="font-tech-mono">{index + 1}</span>
                    )}
                  </div>
                  <span className="font-rajdhani font-bold text-white text-lg">{step.title}</span>
                </div>
                {expandedSection === index ? (
                  <ChevronUp className="text-[#E72585] w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="text-[#4cc9f0] w-5 h-5 flex-shrink-0" />
                )}
              </button>

              {/* Step Content */}
              <div
                id={`step-content-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  expandedSection === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 py-4 border-t border-[#560BAD]/30">
                  <div className="prose prose-invert max-w-none font-rajdhani">{step.content}</div>

                  {/* Resources Section */}
                  {step.resources && (
                    <div className="mt-6">
                      <h4 className="text-[#4cc9f0] font-bold mb-3 font-rajdhani">RESOURCES</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.resources.map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#0a0a1a] border border-[#560BAD]/30 p-3 rounded-lg hover:border-[#4cc9f0]/50 transition-colors group"
                          >
                            <div className="bg-[#560BAD]/20 p-2 rounded-lg">{resource.icon}</div>
                            <div>
                              <div className="text-white font-medium group-hover:text-[#4cc9f0] transition-colors">
                                {resource.title}
                              </div>
                              <div className="text-white/60 text-sm">{resource.description}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mark as Complete Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStepCompletion(index)
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        completedSteps.includes(index)
                          ? "bg-[#4cc9f0]/20 text-[#4cc9f0] hover:bg-[#4cc9f0]/30"
                          : "bg-[#E72585]/20 text-[#E72585] hover:bg-[#E72585]/30"
                      }`}
                    >
                      {completedSteps.includes(index) ? (
                        <>
                          <Check size={16} />
                          Completed
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-[#E72585]/20 to-[#4cc9f0]/20 backdrop-blur-md rounded-xl p-8 border border-white/10 max-w-3xl mx-auto text-center mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4 font-rajdhani">Ready to Submit Your Project?</h2>
          <p className="text-white/80 mb-6 font-rajdhani">
            Once you've completed your project, submit it through our platform to be considered for prizes and
            recognition.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-6 py-3 rounded-lg font-rajdhani font-bold tracking-wider hover:shadow-[0_0_20px_rgba(231,37,133,0.7)] transition-shadow"
          >
            <Rocket size={18} />
            SUBMIT YOUR PROJECT
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

// Project steps data with detailed content and resources
const projectSteps = [
  {
    title: "Brainstorm Ideas",
    content: (
      <>
        <p>
          Start by brainstorming project ideas that align with your interests and skills. Consider these approaches:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Identify a problem you or others face that technology could solve</li>
          <li>Explore the hackathon themes and prize categories for inspiration</li>
          <li>Think about combining multiple technologies in innovative ways</li>
          <li>Consider projects that could have social impact or educational value</li>
        </ul>
        <p className="mt-3">
          Remember, the best projects often come from personal experiences or challenges you've encountered. Don't worry
          about making something perfect—focus on creating something functional and innovative.
        </p>
      </>
    ),
    resources: [
      {
        title: "Ideation Techniques",
        description: "Methods for generating creative project ideas",
        url: "https://example.com/ideation",
        icon: <Rocket size={18} className="text-[#E72585]" />,
      },
      {
        title: "Previous Winners",
        description: "Get inspired by past CuseHacks projects",
        url: "https://example.com/winners",
        icon: <Code size={18} className="text-[#4cc9f0]" />,
      },
    ],
  },
  {
    title: "Form Your Team",
    content: (
      <>
        <p>
          While you can work solo, collaborating with others can enhance your project and make the experience more
          enjoyable. Here's how to form an effective team:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Aim for diverse skills (programming, design, domain knowledge)</li>
          <li>Attend team formation events at the beginning of the hackathon</li>
          <li>Clearly define roles and responsibilities</li>
          <li>Establish communication channels and meeting schedules</li>
        </ul>
        <p className="mt-3">
          Remember that team dynamics are crucial. Choose teammates you can work well with under time pressure, and make
          sure everyone is aligned on the project vision.
        </p>
      </>
    ),
    resources: [
      {
        title: "Team Formation Event",
        description: "Join our kickoff mixer to find teammates",
        url: "https://example.com/team-formation",
        icon: <Users size={18} className="text-[#E72585]" />,
      },
    ],
  },
  {
    title: "Plan Your Project",
    content: (
      <>
        <p>
          Before diving into coding, take time to plan your project. This will help you stay organized and make the most
          of your limited time.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Define the core features (MVP) and stretch goals</li>
          <li>Choose appropriate technologies and frameworks</li>
          <li>Create wireframes or mockups for the user interface</li>
          <li>Break down tasks and assign them to team members</li>
          <li>Set milestones to track progress throughout the hackathon</li>
        </ul>
        <p className="mt-3">
          Remember that scope creep is the enemy of hackathon success. Focus on building a working prototype with core
          functionality rather than a feature-rich but incomplete project.
        </p>
      </>
    ),
    resources: [
      {
        title: "Project Planning Template",
        description: "A structured template to organize your project",
        url: "https://example.com/planning",
        icon: <FileCode size={18} className="text-[#4cc9f0]" />,
      },
      {
        title: "Tech Stack Guide",
        description: "Choosing the right technologies for your project",
        url: "https://example.com/tech-stack",
        icon: <Code size={18} className="text-[#560BAD]" />,
      },
    ],
  },
  {
    title: "Build Your Project",
    content: (
      <>
        <p>
          This is where you bring your idea to life! Focus on implementing the core functionality first, then add
          additional features if time permits.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Set up version control (e.g., Git) from the beginning</li>
          <li>Work in parallel on different components when possible</li>
          <li>Regularly integrate your work to avoid last-minute merge conflicts</li>
          <li>Take advantage of libraries and APIs to accelerate development</li>
          <li>Don't forget to document your code as you go</li>
        </ul>
        <p className="mt-3">
          Remember to take breaks and stay hydrated! Building continuously for 24 hours isn't sustainable. Short breaks
          can actually improve your productivity and creativity.
        </p>
        <div className="bg-[#0a0a1a] p-4 rounded-lg mt-4 font-tech-mono text-sm">
          <div className="text-[#4cc9f0] mb-2">// Sample code structure for a web application</div>
          <div className="text-white">
            project-name/
            <br />
            ├── frontend/ <span className="text-[#E72585]/70">// User interface</span>
            <br />│ ├── src/
            <br />│ ├── public/
            <br />│ └── package.json
            <br />
            ├── backend/ <span className="text-[#E72585]/70">// Server and API</span>
            <br />│ ├── src/
            <br />│ ├── models/
            <br />│ └── package.json
            <br />
            ├── README.md <span className="text-[#E72585]/70">// Project documentation</span>
            <br />
            └── .gitignore
          </div>
        </div>
      </>
    ),
    resources: [
      {
        title: "GitHub Student Pack",
        description: "Free developer tools and services for students",
        url: "https://education.github.com/pack",
        icon: <Github size={18} className="text-white" />,
      },
      {
        title: "API Directory",
        description: "Collection of free APIs for your project",
        url: "https://example.com/apis",
        icon: <Code size={18} className="text-[#4cc9f0]" />,
      },
    ],
  },
  {
    title: "Test Your Project",
    content: (
      <>
        <p>Testing is crucial to ensure your project works as expected. Don't leave this until the last minute!</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Test each feature as you implement it</li>
          <li>Have team members test each other's work</li>
          <li>Test on different devices and browsers if applicable</li>
          <li>Create a demo flow to showcase your project effectively</li>
          <li>Prepare for common questions and edge cases</li>
        </ul>
        <p className="mt-3">
          Remember that judges will be testing your project, so make sure it's stable and the core functionality works
          reliably. It's better to have fewer features that work well than many features that are buggy.
        </p>
      </>
    ),
    resources: [
      {
        title: "Testing Checklist",
        description: "Comprehensive list of what to test",
        url: "https://example.com/testing",
        icon: <CheckSquare size={18} className="text-[#E72585]" />,
      },
    ],
  },
  {
    title: "Prepare Your Presentation",
    content: (
      <>
        <p>
          Your presentation is just as important as your code. It's your opportunity to showcase your project and the
          problem it solves.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Create a compelling story about your project</li>
          <li>Prepare a concise demo that highlights key features</li>
          <li>Practice your presentation multiple times</li>
          <li>Anticipate questions from judges</li>
          <li>Create a simple slide deck if needed (keep it visual)</li>
        </ul>
        <p className="mt-3">
          Your presentation should cover: the problem you're solving, your solution, the technology used, challenges
          faced, and future improvements. Keep it under the time limit and make sure everyone on the team participates.
        </p>
      </>
    ),
    resources: [
      {
        title: "Presentation Template",
        description: "Slide deck template for your project",
        url: "https://example.com/presentation",
        icon: <Presentation size={18} className="text-[#4cc9f0]" />,
      },
      {
        title: "Demo Recording Tips",
        description: "How to create an effective project demo",
        url: "https://example.com/demo-tips",
        icon: <Video size={18} className="text-[#560BAD]" />,
      },
    ],
  },
  {
    title: "Submit Your Project",
    content: (
      <>
        <p>
          The final step is to submit your project through our platform. Make sure to complete all required fields and
          provide comprehensive documentation.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Create a detailed README with setup instructions</li>
          <li>Include screenshots or a demo video</li>
          <li>List all team members and their contributions</li>
          <li>Provide links to the live demo and source code</li>
          <li>Submit before the deadline!</li>
        </ul>
        <p className="mt-3">
          Double-check your submission to ensure all links work and information is accurate. Late submissions are not
          accepted, so don't wait until the last minute.
        </p>
      </>
    ),
    resources: [
      {
        title: "Submission Guidelines",
        description: "Detailed instructions for project submission",
        url: "https://example.com/submission",
        icon: <Upload size={18} className="text-[#E72585]" />,
      },
      {
        title: "README Template",
        description: "Structure your project documentation",
        url: "https://example.com/readme",
        icon: <FileText size={18} className="text-[#4cc9f0]" />,
      },
    ],
  },
]

// Additional components for icons
function Users(props: any) {
  return (
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
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )
}

function CheckSquare(props: any) {
  return (
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
      {...props}
    >
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  )
}

function Presentation(props: any) {
  return (
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
      {...props}
    >
      <path d="M2 3h20"></path>
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
      <path d="m7 21 5-5 5 5"></path>
    </svg>
  )
}

function Video(props: any) {
  return (
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
      {...props}
    >
      <path d="m22 8-6 4 6 4V8Z"></path>
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
    </svg>
  )
}

function Upload(props: any) {
  return (
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
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" x2="12" y1="3" y2="15"></line>
    </svg>
  )
}

function FileText(props: any) {
  return (
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
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" x2="8" y1="13" y2="13"></line>
      <line x1="16" x2="8" y1="17" y2="17"></line>
      <line x1="10" x2="8" y1="9" y2="9"></line>
    </svg>
  )
}
