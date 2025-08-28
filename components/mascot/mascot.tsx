"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import MascotDesign from "./mascot-design"

export default function Mascot() {
  const [isHovered, setIsHovered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [currentSection, setCurrentSection] = useState("home")
  const [mood, setMood] = useState<"normal" | "happy" | "excited" | "thinking" | "surprised">("normal")
  const [isClicked, setIsClicked] = useState(false)
  const [variant, setVariant] = useState<"default" | "cyberpunk" | "hacker">("default")

  // Handle scroll progress
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, Math.random() * 3000 + 2000) // Blink every 2-5 seconds

    return () => clearInterval(blinkInterval)
  }, [])

  // Mood changes based on scroll position
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest > 0.8) {
        setMood("excited")
      } else if (latest > 0.5) {
        setMood("happy")
      } else {
        setMood("normal")
      }
    })

    return () => unsubscribe()
  }, [smoothProgress])

  // Handle click animation
  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  return (
    <motion.div
      className="fixed bottom-8 right-8 w-32 h-32 cursor-pointer z-50"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MascotDesign
        isHovered={isHovered}
        isBlinking={isBlinking}
        currentSection={currentSection}
        scrollYProgress={smoothProgress.get()}
        mood={mood}
        isClicked={isClicked}
        variant={variant}
      />
    </motion.div>
  )
} 