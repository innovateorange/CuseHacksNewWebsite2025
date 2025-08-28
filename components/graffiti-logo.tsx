'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GraffitiLogoProps {
  size?: number;
  className?: string;
}

export default function GraffitiLogo({ size = 50, className = "" }: GraffitiLogoProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ scale: 0.8, rotate: -5 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full" />
      <div className="absolute inset-0.5 bg-black rounded-full flex items-center justify-center">
        <motion.span
          className="text-white font-['Ubuntu_Sans'] font-bold text-xl"
          style={{
            fontFamily: "'Ubuntu Sans', sans-serif",
            textShadow: `
              2px 2px 0 #000,
              -2px -2px 0 #000,
              2px -2px 0 #000,
              -2px 2px 0 #000,
              0 2px 0 #000,
              2px 0 0 #000,
              0 -2px 0 #000,
              -2px 0 0 #000,
              2px 2px 5px #000
            `,
            background: 'linear-gradient(45deg, #fff, #ccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            transform: 'rotate(-5deg)'
          }}
        >
          CH
        </motion.span>
      </div>
      <motion.div
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
} 