"use client"

import { useState } from "react"
import CyberpunkCountdown from "@/components/cyberpunk-countdown"
import UltraCyberpunkCountdown from "@/components/ultra-cyberpunk-countdown"
import { motion } from "framer-motion"
import { ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CountdownDemo() {
  const [variant, setVariant] = useState<"default" | "neon" | "terminal" | "holographic">("default")
  const [useUltraVersion, setUseUltraVersion] = useState(true)

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
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-transparent to-[#0a0a1a]"></div>
        <div className="absolute inset-0 scanlines opacity-30"></div>
      </div>

      {/* Circuit grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E72585] via-[#4cc9f0] to-[#560BAD] mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CYBERPUNK COUNTDOWN
          </motion.h1>
          <motion.p
            className="text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A futuristic countdown timer with glitch effects, ambient sound, and interactive elements.
          </motion.p>
        </div>

        {/* Version toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setUseUltraVersion(!useUltraVersion)}
            className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-white/80 hover:text-white transition-colors"
          >
            {useUltraVersion ? (
              <>
                <span>Ultra Version</span>
                <ToggleRight className="text-[#E72585]" />
              </>
            ) : (
              <>
                <span>Standard Version</span>
                <ToggleLeft className="text-white/50" />
              </>
            )}
          </button>
        </div>

        {useUltraVersion ? (
          // Ultra version
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <UltraCyberpunkCountdown targetDate="2025-10-04T09:00:00" />
          </motion.div>
        ) : (
          // Standard version with variant selector
          <>
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

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <CyberpunkCountdown targetDate="2025-10-04T09:00:00" variant={variant} className="corner-brackets" />
              <span className="hidden"></span> {/* Hidden span for corner brackets */}
            </motion.div>
          </>
        )}

        {/* Features list */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            title="Orbital Time Display"
            description="Unique hexagonal layout with orbital time units and interactive hover effects."
            icon="🌌"
          />
          <FeatureCard
            title="Dynamic Particles"
            description="Reactive particle system that responds to time changes and user interaction."
            icon="✨"
          />
          <FeatureCard
            title="Millisecond Precision"
            description="High-precision countdown with millisecond display for added intensity."
            icon="⏱️"
          />
          <FeatureCard
            title="Immersive Glitches"
            description="Random visual distortions and system warnings create a dystopian atmosphere."
            icon="🔮"
          />
          <FeatureCard
            title="Ambient Sound"
            description="Toggle atmospheric background sounds and hear satisfying ticks as time progresses."
            icon="🔊"
          />
          <FeatureCard
            title="Fullscreen Mode"
            description="Expand the countdown to fill your entire screen for maximum impact."
            icon="📺"
          />
        </div>

        {/* Hint */}
        <div className="mt-12 text-center text-white/50 text-sm">
          <p>Hover over the time units to see their connections to the central seconds display</p>
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
