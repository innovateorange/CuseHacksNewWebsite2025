"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface AnimatedLogoProps {
  size?: number
  className?: string
}

export default function AnimatedLogo({ size = 50, className = "" }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)

  // Occasionally trigger glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 300)
      }
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [])

  // Special animation for the About page
  const isAboutPage = className.includes("mascot-about")

  // Enhanced hover animation for About page
  const hoverAnimation = isAboutPage
    ? {
        scale: 1.1,
        rotate: [0, -5, 5, -3, 0],
        y: [0, -5, 0],
        transition: {
          rotate: { duration: 0.5 },
          y: { duration: 0.5, repeat: 1, repeatType: "reverse" },
        },
      }
    : {
        scale: 1.1,
        rotate: [0, -5, 5, -3, 0],
        transition: { rotate: { duration: 0.5 } },
      }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ scale: 1 }}
        animate={{
          scale: isGlitching ? [1, 1.05, 0.95, 1] : 1,
          x: isGlitching ? [0, -2, 3, -1, 0] : 0,
        }}
        transition={{
          duration: isGlitching ? 0.3 : 0.2,
        }}
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, -3, 0],
          transition: { rotate: { duration: 0.5 } },
        }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link href="/">
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"
            style={{
              background: "radial-gradient(circle, rgba(255,51,112,0.6) 0%, rgba(255,51,112,0) 70%)",
              opacity: isHovered ? 0.8 : 0.5,
            }}
          />

          {/* RGB split effect during glitch */}
          {isGlitching && (
            <>
              <div className="absolute inset-0 opacity-70" style={{ transform: "translate(-2px, 0)" }}>
                <Image
                  src="/images/robot-mascot-transparent.png"
                  alt=""
                  width={size}
                  height={size}
                  className="object-contain"
                  style={{ filter: "hue-rotate(90deg) saturate(200%)" }}
                  aria-hidden="true"
                />
              </div>
              <div className="absolute inset-0 opacity-70" style={{ transform: "translate(2px, 0)" }}>
                <Image
                  src="/images/robot-mascot-transparent.png"
                  alt=""
                  width={size}
                  height={size}
                  className="object-contain"
                  style={{ filter: "hue-rotate(270deg) saturate(200%)" }}
                  aria-hidden="true"
                />
              </div>
            </>
          )}

          {/* Main image */}
          <Image
            src="/images/robot-mascot-transparent.png"
            alt="CuseHacks Logo"
            width={size}
            height={size}
            className="object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,51,112,0.5)]"
          />
        </Link>
      </motion.div>
    </div>
  )
}
