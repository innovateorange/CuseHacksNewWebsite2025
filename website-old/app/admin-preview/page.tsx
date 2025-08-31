"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Calendar, Award, Briefcase, Settings, Home } from "lucide-react"

export default function AdminPreviewPage() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f0f1a] border-r border-[#560BAD]/30 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 p-2">
          <Image
            src="/images/robot-mascot-transparent.png"
            alt="CuseHacks Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <h1 className="font-bold text-lg">CuseHacks</h1>
            <p className="text-xs text-white/60">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeSection === "overview" ? "bg-[#E72585]/20 text-[#E72585]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <Home size={18} />
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("team")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeSection === "team" ? "bg-[#E72585]/20 text-[#E72585]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <Users size={18} />
                Team Members
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("events")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeSection === "events" ? "bg-[#E72585]/20 text-[#E72585]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <Calendar size={18} />
                Events
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("sponsors")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeSection === "sponsors" ? "bg-[#E72585]/20 text-[#E72585]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <Briefcase size={18} />
                Sponsors
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("prizes")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeSection === "prizes" ? "bg-[#E72585]/20 text-[#E72585]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <Award size={18} />
                Prizes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("settings")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeSection === "settings" ? "bg-[#E72585]/20 text-[#E72585]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <Settings size={18} />
                Settings
              </button>
            </li>
          </ul>
        </nav>

        <div className="pt-4 border-t border-white/10">
          <Link
            href="/"
            className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-white/70 hover:bg-white/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-orbitron">
            {activeSection === "overview" && "Dashboard Overview"}
            {activeSection === "team" && "Team Members"}
            {activeSection === "events" && "Events Management"}
            {activeSection === "sponsors" && "Sponsors Management"}
            {activeSection === "prizes" && "Prizes Management"}
            {activeSection === "settings" && "Settings"}
          </h1>

          <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
            View Website
          </Link>
        </div>

        {/* Content */}
        <div className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 font-rajdhani">UI Preview Mode</h2>
          <p className="text-white/80 mb-4">
            This is a simplified preview of the admin dashboard UI. The database connection is temporarily disabled.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Team Members" value="15" icon={<Users size={24} />} color="#E72585" />
            <StatCard title="Upcoming Events" value="3" icon={<Calendar size={24} />} color="#4cc9f0" />
            <StatCard title="Sponsors" value="8" icon={<Briefcase size={24} />} color="#560BAD" />
          </div>

          <div className="mt-6 p-4 bg-[#0a0a1a] rounded-lg border border-[#4cc9f0]/30">
            <p className="text-[#4cc9f0] text-sm">
              MONGODB_INTEGRATION: When ready to connect to MongoDB, follow the integration points in the codebase.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat card component
function StatCard({
  title,
  value,
  icon,
  color,
}: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-[#0a0a1a] border border-[#560BAD]/30 rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-white/70 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  )
}
