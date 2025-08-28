"use client"

import { motion, AnimatePresence } from "framer-motion"

interface MascotSpeechProps {
  message: string
  isVisible?: boolean
  mood?: "normal" | "happy" | "excited" | "thinking" | "surprised"
}

export default function MascotSpeech({
  message,
  isVisible = true,
  mood = "normal",
}: MascotSpeechProps) {
  if (!message) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm max-w-xs"
          style={{
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <div className="relative">
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/80 backdrop-blur-sm transform rotate-45" />
            <p className="relative z-10">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
