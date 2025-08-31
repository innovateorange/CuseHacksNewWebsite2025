"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Linkedin } from "lucide-react"

// Default fallback image as base64 data URL (a simple gray placeholder)
const DEFAULT_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAZABkAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t0UKMCloooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z"

interface TeamMemberProps {
  name: string
  role: string
  year: number
  image: string
  bio?: string
  linkedinUrl?: string
  onImageError?: () => void
}

export default function TeamMemberCard({ 
  name, 
  role, 
  year, 
  image, 
  bio, 
  linkedinUrl, 
  onImageError 
}: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageError = () => {
    setImageError(true)
    if (onImageError) {
      onImageError()
    }
  }

  const getImageSrc = () => {
    if (imageError || !image || image.trim() === '') {
      return DEFAULT_IMAGE
    }
    return image
  }

  if (!mounted) {
    return (
      <div className="bg-[#0a0a1a] rounded-lg overflow-hidden border border-[#560BAD]/30">
        <div className="aspect-square relative">
          <Image
            src={getImageSrc()}
            alt={name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent opacity-80"></div>
        </div>
        <div className="p-3 text-center">
          <h3 className="font-bold text-white">{name}</h3>
          <p className="text-sm text-[#4cc9f0]">{role}</p>
          <p className="text-xs text-white/60">Class of {year}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <motion.div
        initial={false}
        animate={{ y: isHovered ? -5 : 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#0a0a1a] rounded-lg overflow-hidden border border-[#560BAD]/30"
      >
        <div className="aspect-square relative">
          <Image
            src={getImageSrc()}
            alt={name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent opacity-80"></div>
        </div>
        <div className="p-3 text-center">
          <h3 className="font-bold text-white">{name}</h3>
          <p className="text-sm text-[#4cc9f0]">{role}</p>
          <p className="text-xs text-white/60">Class of {year}</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {isHovered && mounted && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0f0f1a]/95 backdrop-blur-sm rounded-lg p-4 border border-[#4cc9f0]/30 z-10 flex flex-col"
          >
            <h3 className="font-bold text-white mb-1">{name}</h3>
            <p className="text-sm text-[#4cc9f0] mb-1">{role}</p>
            <p className="text-xs text-white/60 mb-2">Class of {year}</p>

            {bio && <p className="text-xs text-white/80 mb-auto">{bio}</p>}

            <div className="flex justify-center gap-3 mt-3">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white/70 hover:text-[#4cc9f0] transition-colors bg-[#0a0a1a] px-3 py-1 rounded-full text-xs border border-[#4cc9f0]/30"
                  aria-label={`${name}'s LinkedIn profile`}
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
