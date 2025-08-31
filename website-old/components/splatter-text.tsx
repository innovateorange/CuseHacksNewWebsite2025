"use client"
import { useEffect, useRef } from "react"

interface SplatterTextProps {
  text: string
  className?: string
  color?: string
}

export default function SplatterText({ text, className = "", color = "#ec4899" }: SplatterTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Draw splatter effect
    ctx.fillStyle = color

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw text
    ctx.font = "bold 80px Impact, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw splatter behind text
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw random splatter shapes
    for (let i = 0; i < 20; i++) {
      const x = centerX + (Math.random() - 0.5) * canvas.width * 0.8
      const y = centerY + (Math.random() - 0.5) * canvas.height * 0.5
      const radius = 10 + Math.random() * 40

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw text
    ctx.fillStyle = "white"
    ctx.fillText(text, centerX, centerY)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [text, color])

  return (
    <div className={`relative w-full h-40 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
