"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface MascotPainterProps {
  targetElementId: string
  mascotSize?: number
}

export default function MascotPainter({ targetElementId, mascotSize = 80 }: MascotPainterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mascotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const targetElement = document.getElementById(targetElementId)
    if (!targetElement || !mascotRef.current || !containerRef.current) return

    const targetRect = targetElement.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate the path for the mascot to follow
    const startX = containerRect.width / 2
    const startY = containerRect.height / 2
    const endX = targetRect.left - containerRect.left + targetRect.width / 2
    const endY = targetRect.top - containerRect.top - mascotSize / 2

    // Animate the mascot along the path
    const mascot = mascotRef.current
    mascot.style.transition = "transform 1s ease-in-out"
    mascot.style.transform = `translate(${endX - mascotSize / 2}px, ${endY}px)`

    // Return to original position after animation
    const timer = setTimeout(() => {
      mascot.style.transform = `translate(${startX - mascotSize / 2}px, ${startY - mascotSize / 2}px)`
    }, 2000)

    return () => clearTimeout(timer)
  }, [targetElementId, mascotSize])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        ref={mascotRef}
        className="absolute"
        initial={{ x: "50%", y: "50%" }}
        style={{ width: mascotSize, height: mascotSize }}
      >
        <Image
          src="/images/robot-mascot-transparent.png"
          alt="Painting Mascot"
          width={mascotSize}
          height={mascotSize}
          className="object-contain"
        />
      </motion.div>
    </div>
  )
}
