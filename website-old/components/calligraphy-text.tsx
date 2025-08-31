"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface CalligraphyTextProps {
  text: string
  className?: string
  delay?: number
}

export default function CalligraphyText({ text, className = "", delay = 0 }: CalligraphyTextProps) {
  const letters = Array.from(text)
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation variants for each letter
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: delay + i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  // Draw SVG path for calligraphy effect
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const textElements = container.querySelectorAll(".calligraphy-letter")

    textElements.forEach((element, index) => {
      const letterDelay = 0.05 * index + delay
      setTimeout(() => {
        element.classList.add("painted")
      }, letterDelay * 1000)
    })
  }, [delay])

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-center">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="calligraphy-letter relative inline-block"
            custom={index}
            variants={letterVariants}
            style={{
              WebkitTextStroke: "1px currentColor",
              color: "transparent",
              transition: "color 0.5s ease",
              textShadow: "0 0 10px currentColor",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
            <span
              className="absolute inset-0 opacity-0 transition-opacity duration-500"
              style={{
                color: "currentColor",
                transitionDelay: `${index * 0.05 + 0.2}s`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          </motion.span>
        ))}
      </div>
      <style jsx>{`
        .calligraphy-letter.painted > span {
          opacity: 1;
        }
      `}</style>
    </motion.div>
  )
}
