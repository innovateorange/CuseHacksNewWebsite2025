import { motion } from 'framer-motion'

const ScheduleSection = () => {
  const day1Events = [
    { time: "8:00 AM", event: "Check-in & Registration", description: "Grab your badge and swag" },
    { time: "9:00 AM", event: "Opening Ceremony", description: "Welcome and kickoff" },
    { time: "10:00 AM", event: "Hacking Begins", description: "Start building your projects" },
    { time: "12:00 PM", event: "Lunch", description: "Catered food for all participants" },
    { time: "2:00 PM", event: "Workshop: AI Integration", description: "Learn to add AI to your project" },
    { time: "6:00 PM", event: "Dinner", description: "Refuel for the night ahead" },
    { time: "11:00 PM", event: "Late Night Snack", description: "Keep your energy up" },
  ]

  const day2Events = [
    { time: "12:00 AM", event: "Midnight Activities", description: "Surprise events to keep you awake" },
    { time: "7:00 AM", event: "Breakfast", description: "Start your day right" },
    { time: "9:00 AM", event: "Hacking Ends", description: "Pencils down! Finish your projects" },
    { time: "10:00 AM", event: "Judging Begins", description: "Present to our panel of judges" },
    { time: "12:00 PM", event: "Lunch", description: "Final meal together" },
    { time: "1:00 PM", event: "Closing Ceremony", description: "Awards and recognitions" },
    { time: "2:30 PM", event: "Hackathon Ends", description: "See you next year!" },
  ]

  const EventCard = ({ events, title, color }: { events: typeof day1Events, title: string, color: string }) => (
    <motion.div 
      initial={{ opacity: 0, x: title.includes('1') ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`bg-gradient-to-b from-${color}/20 to-${color}/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-${color}/30 shadow-[0_0_15px_rgba(231,37,133,0.3)]`}
    >
      <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 font-rajdhani text-${color}`}>
        {title}
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {events.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start"
          >
            <div className="w-16 sm:w-20 text-xs sm:text-sm font-medium text-white/80 flex-shrink-0">
              {item.time}
            </div>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-${color} mx-2 sm:mx-3 mt-1 flex-shrink-0`} />
            <div className="flex-1">
              <div className="font-medium text-white text-sm sm:text-base">{item.event}</div>
              <div className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">{item.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EventCard 
            events={day1Events}
            title="Day 1: Saturday, Oct 25"
            color="accent-500"
          />
          <EventCard 
            events={day2Events}
            title="Day 2: Sunday, Oct 26"
            color="primary-500"
          />
        </div>
      </div>
    </section>
  )
}

export default ScheduleSection