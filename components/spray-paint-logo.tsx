"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface SprayPaintLogoProps {
  text?: string
  subtext?: string
  onComplete?: () => void
}

export default function SprayPaintLogo({
  text = "CUSEHACKS",
  subtext = "October 4-5th 2025",
  onComplete,
}: SprayPaintLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [sprayComplete, setSprayComplete] = useState(false)
  const [textRevealProgress, setTextRevealProgress] = useState(0)
  const [subtextVisible, setSubtextVisible] = useState(false)

  // Store animation state in refs to avoid re-renders
  const sprayPositionRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<any[]>([])
  const frameRef = useRef(0)
  const pathIndexRef = useRef(0)

  // Color theme
  const colors = {
    primary: "#E72585", // Vibrant pink/magenta
    secondary: "#4cc9f0", // Bright cyan/blue
    accent: "#560BAD", // Deep purple
  }

  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sprayComplete) {
        setSubtextVisible(true)
        if (onComplete) onComplete()
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [sprayComplete, onComplete])

  // Text canvas for revealing text
  useEffect(() => {
    const canvas = textCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    updateCanvasSize()

    // Draw text that will be revealed
    const drawText = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient for text
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, colors.primary)
      gradient.addColorStop(0.5, colors.secondary)
      gradient.addColorStop(1, colors.accent)

      ctx.fillStyle = gradient

      // Set text style
      const fontSize = Math.min(canvas.width * 0.1, 100)
      ctx.font = `bold ${fontSize}px "Impact", sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Add glow effect
      ctx.shadowColor = colors.primary
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Draw main text
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      // Add second layer for extra glow
      ctx.shadowColor = colors.secondary
      ctx.shadowBlur = 15
      ctx.globalAlpha = 0.7
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      // Reset
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }

    drawText()

    // Redraw on window resize
    window.addEventListener("resize", () => {
      updateCanvasSize()
      drawText()
    })

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [text, colors])

  // Particle class definition
  const Particle = useCallback(function (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    size?: number,
  ) {
    this.x = x
    this.y = y
    this.size = size || Math.random() * 5 + 1
    this.speedX = Math.random() * 3 - 1.5
    this.speedY = Math.random() * 3 - 1.5
    this.color = color
    this.alpha = 1
    this.gravity = 0.05
    this.friction = 0.95
    this.shrink = 0.97

    this.update = function () {
      this.speedX *= this.friction
      this.speedY *= this.friction
      this.speedY += this.gravity
      this.x += this.speedX
      this.y += this.speedY
      this.size *= this.shrink
      this.alpha -= 0.01
    }

    this.draw = function () {
      ctx.globalAlpha = this.alpha
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = this.color
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }, [])

  // Initialize spray paint animation
  const initAnimation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Initialize spray position
    sprayPositionRef.current = {
      x: canvas.width * 0.1,
      y: canvas.height / 2,
    }

    // Reset animation state
    particlesRef.current = []
    frameRef.current = 0
    pathIndexRef.current = 0

    // Path for the spray to follow (roughly the shape of "CUSEHACKS")
    const pathPoints = [
      { x: canvas.width * 0.1, y: canvas.height * 0.5, color: colors.primary, progress: 0, size: 5 },
      { x: canvas.width * 0.15, y: canvas.height * 0.3, color: colors.primary, progress: 0.05, size: 8 },
      { x: canvas.width * 0.1, y: canvas.height * 0.7, color: colors.primary, progress: 0.1, size: 10 },
      { x: canvas.width * 0.2, y: canvas.height * 0.5, color: colors.primary, progress: 0.15, size: 8 },
      { x: canvas.width * 0.25, y: canvas.height * 0.7, color: colors.primary, progress: 0.2, size: 10 },
      { x: canvas.width * 0.3, y: canvas.height * 0.5, color: colors.primary, progress: 0.25, size: 8 },
      { x: canvas.width * 0.35, y: canvas.height * 0.3, color: colors.secondary, progress: 0.3, size: 10 },
      { x: canvas.width * 0.35, y: canvas.height * 0.5, color: colors.secondary, progress: 0.35, size: 12 },
      { x: canvas.width * 0.35, y: canvas.height * 0.7, color: colors.secondary, progress: 0.4, size: 10 },
      { x: canvas.width * 0.4, y: canvas.height * 0.5, color: colors.secondary, progress: 0.45, size: 8 },
      { x: canvas.width * 0.45, y: canvas.height * 0.3, color: colors.secondary, progress: 0.5, size: 10 },
      { x: canvas.width * 0.45, y: canvas.height * 0.7, color: colors.secondary, progress: 0.55, size: 12 },
      { x: canvas.width * 0.5, y: canvas.height * 0.3, color: colors.accent, progress: 0.6, size: 10 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, color: colors.accent, progress: 0.65, size: 8 },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, color: colors.accent, progress: 0.7, size: 10 },
      { x: canvas.width * 0.55, y: canvas.height * 0.3, color: colors.accent, progress: 0.75, size: 12 },
      { x: canvas.width * 0.55, y: canvas.height * 0.5, color: colors.accent, progress: 0.8, size: 10 },
      { x: canvas.width * 0.55, y: canvas.height * 0.7, color: colors.accent, progress: 0.85, size: 8 },
      { x: canvas.width * 0.6, y: canvas.height * 0.3, color: colors.primary, progress: 0.9, size: 10 },
      { x: canvas.width * 0.6, y: canvas.height * 0.7, color: colors.primary, progress: 0.92, size: 12 },
      { x: canvas.width * 0.65, y: canvas.height * 0.5, color: colors.primary, progress: 0.94, size: 10 },
      { x: canvas.width * 0.7, y: canvas.height * 0.3, color: colors.primary, progress: 0.96, size: 8 },
      { x: canvas.width * 0.7, y: canvas.height * 0.7, color: colors.primary, progress: 0.98, size: 10 },
      { x: canvas.width * 0.75, y: canvas.height * 0.5, color: colors.secondary, progress: 1.0, size: 12 },
    ]

    // Animation loop
    const animate = () => {
      if (sprayComplete) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Current target point
      const currentTarget = pathPoints[pathIndexRef.current]
      const targetX = currentTarget.x
      const targetY = currentTarget.y
      const sprayColor = currentTarget.color
      const spraySize = currentTarget.size

      // Current spray position
      const { x: sprayX, y: sprayY } = sprayPositionRef.current

      // Move spray towards target point
      const dx = targetX - sprayX
      const dy = targetY - sprayY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 3) {
        // Move towards target
        sprayPositionRef.current.x += (dx / distance) * 3
        sprayPositionRef.current.y += (dy / distance) * 3

        // Gradually increase spray intensity as we approach target
        const sprayIntensity = Math.max(0, 1 - distance / 50)

        // Create spray particles based on intensity and movement
        if (frameRef.current % 1 === 0) {
          // Every frame
          const particleCount = Math.floor(10 * sprayIntensity) + 5
          for (let i = 0; i < particleCount; i++) {
            // Create a spray pattern
            const angle = Math.random() * Math.PI * 2
            const particleDistance = Math.random() * spraySize
            const offsetX = Math.cos(angle) * particleDistance
            const offsetY = Math.sin(angle) * particleDistance

            particlesRef.current.push(
              new Particle(
                ctx,
                sprayPositionRef.current.x + offsetX,
                sprayPositionRef.current.y + offsetY,
                sprayColor,
                Math.random() * 4 + 1,
              ),
            )
          }
        }
      } else {
        // Reached target, move to next point
        pathIndexRef.current++

        if (pathIndexRef.current < pathPoints.length) {
          // Update text reveal progress
          setTextRevealProgress(pathPoints[pathIndexRef.current - 1].progress)

          // Burst effect when reaching a point
          for (let i = 0; i < 20; i++) {
            particlesRef.current.push(
              new Particle(
                ctx,
                sprayPositionRef.current.x + Math.random() * 10 - 5,
                sprayPositionRef.current.y + Math.random() * 10 - 5,
                sprayColor,
                Math.random() * 8 + 2,
              ),
            )
          }
        } else {
          // Completed the path
          setTextRevealProgress(1)
          setSprayComplete(true)

          // Final burst
          for (let i = 0; i < 50; i++) {
            particlesRef.current.push(
              new Particle(
                ctx,
                canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.8,
                canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.5,
                [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)],
                Math.random() * 10 + 5,
              ),
            )
          }

          return
        }
      }

      // Update and draw particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update()
        particlesRef.current[i].draw()

        // Remove faded or tiny particles
        if (particlesRef.current[i].alpha <= 0 || particlesRef.current[i].size <= 0.2) {
          particlesRef.current.splice(i, 1)
          i--
        }
      }

      // Draw spray nozzle with glow effect
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(sprayPositionRef.current.x, sprayPositionRef.current.y, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#333"
      ctx.fill()

      // Glow effect
      ctx.shadowColor = sprayColor
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(sprayPositionRef.current.x, sprayPositionRef.current.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = sprayColor
      ctx.fill()
      ctx.shadowBlur = 0

      // Spray direction indicator
      if (distance > 5) {
        ctx.beginPath()
        ctx.moveTo(sprayPositionRef.current.x, sprayPositionRef.current.y)
        ctx.lineTo(sprayPositionRef.current.x + (dx / distance) * 15, sprayPositionRef.current.y + (dy / distance) * 15)
        ctx.strokeStyle = sprayColor
        ctx.lineWidth = 2
        ctx.stroke()
      }

      frameRef.current++
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)
  }, [Particle, colors, sprayComplete])

  // Spray paint animation
  useEffect(() => {
    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (sprayComplete) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Handle window resize
    const handleResize = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      // Restart animation with new dimensions
      initAnimation()
    }

    // Initialize animation
    initAnimation()

    // Add resize listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [initAnimation, sprayComplete])

  return (
    <div className="relative w-full h-40 md:h-60 lg:h-80">
      {/* Text canvas that will be revealed */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `polygon(0 0, ${textRevealProgress * 100}% 0, ${textRevealProgress * 100}% 100%, 0 100%)`,
          filter: `drop-shadow(0 0 10px ${textRevealProgress > 0.5 ? "#4cc9f0" : "#E72585"})`,
          transition: "filter 0.5s ease",
        }}
      >
        <canvas ref={textCanvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Spray paint canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtext with glow effect */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="h-16"></div> {/* Spacer for text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: subtextVisible ? 1 : 0,
            y: subtextVisible ? 0 : 10,
            textShadow: subtextVisible
              ? ["0 0 5px #4cc9f0", "0 0 15px #E72585", "0 0 5px #4cc9f0"]
              : "0 0 0 transparent",
          }}
          transition={{
            duration: 0.8,
            textShadow: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 2,
            },
          }}
          className="text-xl md:text-2xl text-white font-medium mt-16 md:mt-20 lg:mt-24"
        >
          {subtext}
        </motion.p>
      </div>

      {/* Spray paint effect overlay */}
      {sprayComplete && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent spray-shine"></div>
        </motion.div>
      )}
    </div>
  )
}
