"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface MascotControlsProps {
  show: boolean
  onClose: () => void
  onVariantChange: (variant: "default" | "cyberpunk" | "hacker") => void
  onAnimationChange: (animation: "dance" | "spin" | "wave") => void
}

export default function MascotControls({
  show,
  onClose,
  onVariantChange,
  onAnimationChange,
}: MascotControlsProps) {
  const [selectedVariant, setSelectedVariant] = useState<"default" | "cyberpunk" | "hacker">("default")

  const handleVariantChange = (variant: "default" | "cyberpunk" | "hacker") => {
    setSelectedVariant(variant)
    onVariantChange(variant)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-32 right-8 bg-black/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Mascot Controls</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-white/80 mb-2">Style</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVariantChange("default")}
                  className={`px-3 py-1 rounded ${
                    selectedVariant === "default"
                      ? "bg-[#E72585] text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => handleVariantChange("cyberpunk")}
                  className={`px-3 py-1 rounded ${
                    selectedVariant === "cyberpunk"
                      ? "bg-[#ff3370] text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  Cyberpunk
                </button>
                <button
                  onClick={() => handleVariantChange("hacker")}
                  className={`px-3 py-1 rounded ${
                    selectedVariant === "hacker"
                      ? "bg-[#00ff41] text-black"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  Hacker
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white/80 mb-2">Animations</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => onAnimationChange("dance")}
                  className="px-3 py-1 rounded bg-white/10 text-white/60 hover:bg-white/20"
                >
                  Dance
                </button>
                <button
                  onClick={() => onAnimationChange("spin")}
                  className="px-3 py-1 rounded bg-white/10 text-white/60 hover:bg-white/20"
                >
                  Spin
                </button>
                <button
                  onClick={() => onAnimationChange("wave")}
                  className="px-3 py-1 rounded bg-white/10 text-white/60 hover:bg-white/20"
                >
                  Wave
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
