import { motion } from 'framer-motion'

const ScheduleSection = () => {
  return (
    <section id="schedule" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 font-orbitron"
        >
          Schedule
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-12 sm:p-16 border border-purple-500/30 shadow-[0_0_30px_rgba(86,11,173,0.3)]"
        >
          <p className="text-6xl sm:text-8xl font-bold text-center font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
            TBD
          </p>
          <p className="text-white/70 text-center mt-6 text-lg">
            Schedule coming soon!
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ScheduleSection
