"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function CuseHacksTitle() {
  return (
    <div className="relative w-full">
      <Image
        src="/images/cusehacks-title-bg.png"
        alt="CUSEHACKS"
        width={800}
        height={200}
        priority
        className="w-full h-auto"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold text-white tracking-wider"
          style={{
            textShadow: "4px 4px 0px rgba(0,0,0,0.3)",
            fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
          }}
        >
          CUSEHACKS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="text-xl md:text-2xl font-bold text-white mt-2"
        >
          October 4-5th 2025
        </motion.p>
      </div>
    </div>
  )
}
