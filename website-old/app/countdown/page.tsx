"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the heavy component
const CyberpunkCountdown = dynamic(() => import("@/components/cyberpunk-countdown"), {
  ssr: false,
  loading: () => <CountdownPlaceholder />,
})

// Simple placeholder for the countdown
function CountdownPlaceholder() {
  return (
    <div className="w-full h-[500px] bg-[#0a0a1a]/50 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-white/50 text-xl">Loading countdown...</div>
    </div>
  )
}

export default function CountdownPage() {
  // Set neon as the default variant as requested
  const [variant, setVariant] = useState<"default" | "neon" | "terminal" | "holographic">("neon")
  const [isLoaded, setIsLoaded] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen w-full bg-[#0a0a1a] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cyberpunk-city.webp"
          alt="Cyberpunk City"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-transparent to-[#0a0a1a]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD] mb-4"
          >
            CYBERPUNK COUNTDOWN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto"
          >
            A futuristic countdown timer to CuseHacks 2025
          </motion.p>
        </div>

        {/* Variant selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <VariantButton
            label="DEFAULT"
            isActive={variant === "default"}
            onClick={() => setVariant("default")}
            color="#E72585"
          />
          <VariantButton
            label="NEON"
            isActive={variant === "neon"}
            onClick={() => setVariant("neon")}
            color="#4cc9f0"
          />
          <VariantButton
            label="TERMINAL"
            isActive={variant === "terminal"}
            onClick={() => setVariant("terminal")}
            color="#00ff41"
          />
          <VariantButton
            label="HOLOGRAPHIC"
            isActive={variant === "holographic"}
            onClick={() => setVariant("holographic")}
            color="#560BAD"
          />
        </div>

        {/* Sound toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-white/80 hover:text-white transition-colors"
          >
            {soundEnabled ? (
              <>
                <Volume2 size={16} className="text-[#4cc9f0]" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX size={16} />
                <span>Sound Off</span>
              </>
            )}
          </button>
        </div>

        {/* Countdown Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {isLoaded ? (
            <CyberpunkCountdown
              targetDate="2025-10-04T09:00:00"
              variant={variant}
              className="corner-brackets"
              soundEnabled={soundEnabled}
            />
          ) : (
            <CountdownPlaceholder />
          )}
        </motion.div>

        {/* Features list */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            title="Interactive Elements"
            description="Hover over countdown digits to see special effects and animations."
            icon="✨"
          />
          <FeatureCard
            title="Terminal Mode"
            description="Try the terminal variant for a hacker aesthetic with matrix-style effects."
            icon="💻"
          />
          <FeatureCard
            title="Hidden Features"
            description="Look for hidden interactions and easter eggs throughout the countdown."
            icon="🔍"
          />
        </div>

        {/* Event details */}
        <div className="mt-16 max-w-2xl mx-auto bg-[#0a0a1a]/80 backdrop-blur-md rounded-xl p-6 border border-[#560BAD]/30">
          <h2 className="text-2xl font-bold text-center mb-4 font-rajdhani text-[#4cc9f0]">Event Details</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-24 font-bold text-[#E72585]">When:</div>
              <div className="flex-1">October 4-5th, 2025</div>
            </div>
            <div className="flex items-start">
              <div className="w-24 font-bold text-[#E72585]">Where:</div>
              <div className="flex-1">Life Science Atrium, Syracuse University</div>
            </div>
            <div className="flex items-start">
              <div className="w-24 font-bold text-[#E72585]">What:</div>
              <div className="flex-1">24-hour hackathon with workshops, mentorship, food, and prizes</div>
            </div>
            <div className="flex items-start">
              <div className="w-24 font-bold text-[#E72585]">Who:</div>
              <div className="flex-1">Open to all students regardless of experience level</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-block">
              <button className="bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(231,37,133,0.3)]">
                Register Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

interface VariantButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
  color: string
}

function VariantButton({ label, isActive, onClick, color }: VariantButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-tech-mono text-sm transition-all ${
        isActive ? "bg-white/10 border border-white/30" : "bg-black/30 border border-white/10 text-white/70"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: isActive ? `0 0 15px ${color}` : "none",
        color: isActive ? color : undefined,
      }}
    >
      {label}
    </motion.button>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#4cc9f0]/30 transition-colors"
      whileHover={{ y: -5, boxShadow: "0 5px 20px rgba(76, 201, 240, 0.2)" }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-white font-rajdhani font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </motion.div>
  )
}
