import { motion } from 'framer-motion'

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 font-orbitron"
        >
          About Us
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-accent-500/20 to-accent-500/5 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 border border-accent-500/30 shadow-[0_0_30px_rgba(231,37,133,0.3)] relative"
        >
          <div className="space-y-6 text-white/90 leading-relaxed">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-rajdhani text-accent-500">
                Who is Innovate Orange?
              </h3>
              <p className="mb-4">
                Innovate Orange is the first and only student-run hackathon organization at Syracuse University. 
                We have a community of students who like to create things and help others do the same.
              </p>
            </div>

            <p className="mb-4">
              We host weekly workshops and plan CuseHacks and Datathons each semester. We want to encourage 
              and develop student interest in technology and programming and create opportunities for students 
              to engage in project-based learning.
            </p>

            <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg p-3 sm:p-4 border border-primary-500/30 mb-4">
              <p className="font-bold text-white text-center text-base sm:text-lg">
                No technical skills are required to join the club or participate in our events!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="bg-[#0a0a1a]/50 rounded-lg p-3 sm:p-4 border border-accent-500/20">
                <h4 className="text-base sm:text-lg font-semibold text-accent-500 mb-2">CuseHacks 2025</h4>
                <p className="text-sm leading-relaxed">A 24-hour hackathon event where people come together to innovate, create, and build amazing projects while competing for prizes!</p>
              </div>
              <div className="bg-[#0a0a1a]/50 rounded-lg p-3 sm:p-4 border border-primary-500/20">
                <h4 className="text-base sm:text-lg font-semibold text-primary-500 mb-2">Weekly Workshops</h4>
                <p className="text-sm leading-relaxed">Every Wednesday in Link Hall Room 160 at 7:00 PM. Topics include Leetcode, Machine Learning, and more!</p>
              </div>
            </div>

            <p className="text-center text-lg font-medium">
              Join us at our next event!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection