import type React from "react"
import type { Metadata } from "next"
import { Ubuntu, Orbitron, Rajdhani } from "next/font/google"
import "./globals.css"
import ClientOnlyMascot from "@/components/mascot/client-mascot"
import CustomCursor from "@/components/custom-cursor"
import GraffitiLogo from "@/components/graffiti-logo"

// Initialize the Ubuntu font with all needed weights
const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu",
})

// Initialize the Orbitron font for futuristic/tech titles
const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
})

// Initialize the Rajdhani font for headings
const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rajdhani",
})

// Initialize Share Tech Mono for monospace text
const shareTechMono = {
  variable: "--font-share-tech-mono",
}

export const metadata: Metadata = {
  title: "CuseHacks",
  description: "Syracuse University's Premier Hackathon",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white">
        <ClientOnlyMascot />
        <CustomCursor />
        <GraffitiLogo className="fixed top-4 left-4 z-50" size={40} />
        {children}
      </body>
    </html>
  )
}

import './globals.css'