"use client"

import { useState, useEffect } from "react"
import AnimatedMascot from "./animated-mascot"

export default function ClientOnlyMascot() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <AnimatedMascot />
} 