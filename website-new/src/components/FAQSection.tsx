import { useState } from 'react'
import { motion } from 'framer-motion'
import ContactModal from './ContactModal'

const FAQSection = () => {
  const [showContactModal, setShowContactModal] = useState(false)

  const faqItems = [
    {
      question: "What is a Hackathon?",
      answer: "A hackathon is a 24-hour coding competition in which you or your team create a project from scratch and compete against other participants for prizes!",
    },
    {
      question: "What type of workshops do you host?",
      answer: "We offer weekly workshops on various topics not included in core courses, such as Leetcode and Machine Learning.",
    },
    {
      question: "Do I need a team for CuseHacks 2025?",
      answer: "No, you don't need a team for CuseHacks. You can compete solo!",
    },
    {
      question: "Where is CuseHacks going to be?",
      answer: "CuseHacks is being held in the Life Science Atrium from Saturday-Sunday on October 25th-26th.",
    },
    {
      question: "What do I need to bring?",
      answer: "Bring your laptop, charger and some hackathon spirit!",
    },
    {
      question: "Where and when are the workshops?",
      answer: "Our workshops are every Wednesday in Link Hall Room 160 at 6:30 pm. Come join us!",
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
      answer: "Submissions are automatically entered for 'Best Overall.' To qualify for other categories, select them during submission. Projects must be created solely for CuseHacks 2025—no prior work allowed. Hackers may only contribute to one team. Boilerplate code is allowed if properly licensed and documented. Code is required for all categories except 'Best Design.'",
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

  // Split into two columns evenly
  const leftColumnItems = faqItems.slice(0, 6)  // First 6 items
  const rightColumnItems = faqItems.slice(6, 11) // Remaining 5 items

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 font-orbitron"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            {leftColumnItems.map((item, index) => (
              <div key={`left-${index}`} className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-primary-500 font-rajdhani flex items-start">
                  <span className="text-accent-500 mr-2 sm:mr-3 mt-1 flex-shrink-0">•</span>
                  {item.question}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed ml-4 sm:ml-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            {rightColumnItems.map((item, index) => (
              <div key={`right-${index}`} className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-primary-500 font-rajdhani flex items-start">
                  <span className="text-accent-500 mr-2 sm:mr-3 mt-1 flex-shrink-0">•</span>
                  {item.question}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed ml-4 sm:ml-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </motion.div>
        </div>


        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-white/80 mb-4">Still have questions? Feel free to reach out!</p>
          <button 
            onClick={() => setShowContactModal(true)}
            className="bg-gradient-to-r from-purple-500 to-accent-500 hover:opacity-90 text-white px-8 py-3 rounded-lg font-medium transition-opacity duration-300 shadow-[0_0_15px_rgba(86,11,173,0.3)]"
          >
            Contact Us
          </button>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </section>
  )
}

export default FAQSection