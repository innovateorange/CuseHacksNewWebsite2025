"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isOverLink, setIsOverLink] = useState(false)

  useEffect(() => {
    // Only show cursor after mouse moves
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Track mouse clicks
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Track when hovering over links or buttons
    const handleLinkHover = () => {
      const hoveredElement = document.querySelectorAll("a, button, [role=button], input, select, textarea")

      hoveredElement.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsOverLink(true))
        el.addEventListener("mouseleave", () => setIsOverLink(false))
      })
    }

    // Initial setup for link detection
    handleLinkHover()

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Mutation observer to detect new links added to the DOM
    const observer = new MutationObserver(handleLinkHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      observer.disconnect()
    }
  }, [])

  // Hide default cursor
  useEffect(() => {
    document.body.classList.add("custom-cursor")
    return () => document.body.classList.remove("custom-cursor")
  }, [])

  return (
    <>
      {/* Outer cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isClicking ? 0.8 : isOverLink ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          mass: 0.2,
          stiffness: 800,
          damping: 35,
          scale: { duration: 0.15 },
        }}
        style={{
          width: "48px",
          height: "48px",
          border: "2px solid rgba(231, 37, 133, 0.5)",
          boxShadow: "0 0 10px rgba(231, 37, 133, 0.5), inset 0 0 10px rgba(231, 37, 133, 0.3)",
        }}
      />

      {/* Inner cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicking ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isOverLink ? "#4cc9f0" : "#E72585",
        }}
        transition={{
          type: "spring",
          mass: 0.1,
          stiffness: 1000,
          damping: 25,
          scale: { duration: 0.1 },
          backgroundColor: { duration: 0.2 },
        }}
        style={{
          width: "8px",
          height: "8px",
          boxShadow: "0 0 10px currentColor",
        }}
      />

      {/* Cursor trail */}
      {isVisible && <CursorTrail mousePosition={mousePosition} isClicking={isClicking} isOverLink={isOverLink} />}
    </>
  )
}

function CursorTrail({
  mousePosition,
  isClicking,
  isOverLink,
}: {
  mousePosition: { x: number; y: number }
  isClicking: boolean
  isOverLink: boolean
}) {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; timestamp: number }>>([])

  useEffect(() => {
    // Add current position to trail
    const newPoint = { ...mousePosition, timestamp: Date.now() }
    setTrail((prev) => [...prev, newPoint].slice(-10)) // Keep last 10 points

    // Clean up old trail points
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setTrail((prev) => prev.filter((point) => now - point.timestamp < 300)) // Remove points older than 300ms
    }, 100)

    return () => clearInterval(cleanupInterval)
  }, [mousePosition])

  return (
    <>
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp
        const opacity = 1 - age / 300 // Fade out based on age
        const size = 6 - index * 0.5 // Decrease size for older points

        return (
          <motion.div
            key={`${point.timestamp}-${index}`}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity * 0.5,
              backgroundColor: isOverLink ? "#4cc9f0" : "#E72585",
              boxShadow: "0 0 5px currentColor",
            }}
          />
        )
      })}
    </>
  )
}
