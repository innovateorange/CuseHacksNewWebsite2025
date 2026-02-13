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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-8 sm:p-10 border border-purple-500/30 shadow-[0_0_30px_rgba(86,11,173,0.3)]"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
              Saturday
            </h3>
            <ul className="space-y-3 text-white/90 text-base sm:text-lg">
              <li className="flex justify-between"><span>8:00 AM</span><span>Breakfast starts</span></li>
              <li className="flex justify-between"><span>8:30 AM</span><span>Doors open</span></li>
              <li className="flex justify-between"><span>11:30 AM</span><span>Opening Ceremony</span></li>
              <li className="flex justify-between"><span>12:00 PM</span><span>Coding Begins!</span></li>
              <li className="flex justify-between"><span>12:30 PM</span><span>Lunch starts!</span></li>
              <li className="flex justify-between"><span>3:30 PM</span><span>Workshop</span></li>
              <li className="flex justify-between"><span>6:00 PM</span><span>Dinner starts!</span></li>
              <li className="flex justify-between"><span>9:00 PM</span><span>Refuel with Energy Drinks</span></li>
              <li className="flex justify-between"><span>11:00 PM</span><span>Movie night starts!</span></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-8 sm:p-10 border border-purple-500/30 shadow-[0_0_30px_rgba(86,11,173,0.3)]"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
              Sunday
            </h3>
            <ul className="space-y-3 text-white/90 text-base sm:text-lg">
              <li className="flex justify-between"><span>9:30 AM</span><span>Breakfast snacks!</span></li>
              <li className="flex justify-between"><span>12:00 PM</span><span>Coding Finishes</span></li>
              <li className="flex justify-between"><span>12:30 PM</span><span>Lunch Begins</span></li>
              <li className="flex justify-between"><span>1:00 PM</span><span>Judging Begins</span></li>
              <li className="flex justify-between"><span>3:30 PM</span><span>Judging ends</span></li>
              <li className="flex justify-between"><span>4:00 PM</span><span>Closing Ceremony</span></li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ScheduleSection
