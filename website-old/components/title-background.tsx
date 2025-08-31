"use client"
import { useEffect, useRef } from "react"

export default function TitleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Draw splatter effect
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "#ec4899")
      gradient.addColorStop(0.5, "#f472b6")
      gradient.addColorStop(1, "#ec4899")

      ctx.fillStyle = gradient

      // Draw main shape
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)

      // Top edge with random bumps
      for (let x = 0; x < canvas.width; x += 20) {
        const height = canvas.height / 2 - (Math.random() * 30 + 10)
        ctx.lineTo(x, height)
      }

      // Right edge
      ctx.lineTo(canvas.width, canvas.height / 2)

      // Bottom edge with random bumps
      for (let x = canvas.width; x > 0; x -= 20) {
        const height = canvas.height / 2 + (Math.random() * 30 + 10)
        ctx.lineTo(x, height)
      }

      // Close path
      ctx.closePath()
      ctx.fill()

      // Add some splatter dots
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 10 + 5

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Add glow effect
      ctx.shadowColor = "#ec4899"
      ctx.shadowBlur = 15

      // Draw text placeholder (actual text is rendered in React)
      ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 30, 300, 60)

      // Reset shadow
      ctx.shadowBlur = 0
    }

    draw()

    // Redraw occasionally for animation effect
    const interval = setInterval(() => {
      draw()
    }, 2000)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [])

  return (
    <div className="relative w-full h-40">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
