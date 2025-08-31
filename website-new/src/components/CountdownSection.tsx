import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2025-10-04T09:00:00")

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <section id="countdown" className="py-20 px-4 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-10 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500"
        >
          Countdown to CuseHacks
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 shadow-[0_0_30px_rgba(86,11,173,0.3)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          {/* Countdown Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-[#0a0a1a]/50 rounded-lg p-4 border border-primary-500/20"
              >
                <div className="text-3xl md:text-4xl font-bold font-orbitron text-primary-500 mb-2">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="text-white/80 text-sm md:text-base font-rajdhani">
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <p className="text-white/90 text-lg mb-2">
              Join us for 24 hours of innovation, creativity, and collaboration!
            </p>
            <div className="flex items-center justify-center mt-4 text-white/80">
              <MapPin className="w-5 h-5 text-primary-500 mr-2" />
              <span>Life Science Atrium, Syracuse University</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CountdownSection