"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  connected: boolean[]
}

interface AnimatedBackgroundProps {
  type?: "circuit" | "matrix" | "particles"
  opacity?: number
  color?: string
  secondaryColor?: string
  speed?: number
}

export default function AnimatedBackground({
  type = "circuit",
  opacity = 0.1,
  color = "#E72585",
  secondaryColor = "#4cc9f0",
  speed = 1,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    let animationFrameId: number

    // Circuit background
    if (type === "circuit") {
      // Create nodes
      const nodeCount = 50
      const nodes: Node[] = []
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          connected: new Array(nodeCount).fill(false),
        })
      }

      // Animation loop
      const animate = () => {
        ctx.fillStyle = "rgba(10, 10, 26, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Update node positions
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]
          node.x += node.vx
          node.y += node.vy

          // Bounce off edges
          if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1
          if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1

          // Reset connections
          node.connected.fill(false)
        }

        // Check connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              // Max connection distance
              nodes[i].connected[j] = true
              nodes[j].connected[i] = true
            }
          }
        }

        // Draw nodes and connections
        ctx.strokeStyle = "rgba(231, 37, 133, 0.2)"
        ctx.lineWidth = 1

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]

          // Draw connections
          for (let j = i + 1; j < nodes.length; j++) {
            if (node.connected[j]) {
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(nodes[j].x, nodes[j].y)
              ctx.stroke()
            }
          }

          // Draw node
          ctx.fillStyle = "rgba(231, 37, 133, 0.8)"
          ctx.beginPath()
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        animationFrameId = requestAnimationFrame(animate)
      }

      animate()
    }

    // Matrix rain effect
    if (type === "matrix") {
      const fontSize = 14
      const columns = Math.floor(canvas.width / fontSize)
      const drops: number[] = []

      // Initialize drops
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height)
      }

      const matrix = () => {
        ctx.fillStyle = `rgba(0, 0, 0, 0.05)`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = color
        ctx.font = `${fontSize}px monospace`

        for (let i = 0; i < drops.length; i++) {
          // Random character
          const text = String.fromCharCode(0x30a0 + Math.random() * 33)

          // Draw the character
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)

          // Reset drop when it reaches bottom
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          }

          // Move drop down
          drops[i]++
        }

        animationFrameId = requestAnimationFrame(matrix)
      }

      matrix()
    }

    // Particle system
    if (type === "particles") {
      const particles: {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
        color: string
      }[] = []

      const particleCount = Math.floor((canvas.width * canvas.height) / 10000)

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          color: Math.random() > 0.5 ? color : secondaryColor,
        })
      }

      const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = opacity

        // Update and draw particles
        for (const particle of particles) {
          // Move particle
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1
          }

          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()

          // Draw connections
          for (const otherParticle of particles) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = particle.color
              ctx.globalAlpha = (1 - distance / 100) * opacity
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }

          ctx.globalAlpha = opacity
        }

        animationFrameId = requestAnimationFrame(drawParticles)
      }

      drawParticles()
    }

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [type, opacity, color, secondaryColor, speed])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity }} />

      {/* Additional visual elements */}
      <motion.div
        className="absolute inset-0 scanlines opacity-5 pointer-events-none"
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full bg-[#E72585]/20 filter blur-[100px]"
          style={{ width: "40vw", height: "40vw" }}
          animate={{
            x: ["-20vw", "10vw", "-20vw"],
            y: ["10vh", "50vh", "10vh"],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute rounded-full bg-[#4cc9f0]/20 filter blur-[100px]"
          style={{ width: "30vw", height: "30vw" }}
          animate={{
            x: ["60vw", "30vw", "60vw"],
            y: ["60vh", "20vh", "60vh"],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute rounded-full bg-[#560BAD]/15 filter blur-[100px]"
          style={{ width: "50vw", height: "50vw" }}
          animate={{
            x: ["30vw", "50vw", "30vw"],
            y: ["30vh", "60vh", "30vh"],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}
