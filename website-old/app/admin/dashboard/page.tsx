"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  Calendar,
  Award,
  Briefcase,
  Settings,
  LogOut,
  Home,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
} from "lucide-react"
import { getMockTeamMembers, getMockEvents, getMockSponsors, getMockPrizes } from "@/lib/mongodb"
import toast, { Toaster, Toast } from 'react-hot-toast'

// Admin dashboard page with modular sections for future MongoDB integration
export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    // MONGODB_INTEGRATION: Replace with actual auth check using MongoDB
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  // Handle logout
  const handleLogout = () => {
    // MONGODB_INTEGRATION: Add proper logout with MongoDB session management
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router will redirect
  }

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
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-white/70 hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
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

        {/* Content sections */}
        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "team" && <TeamSection />}
        {activeSection === "events" && <EventsSection />}
        {activeSection === "sponsors" && <SponsorsSection />}
        {activeSection === "prizes" && <PrizesSection />}
        {activeSection === "settings" && <SettingsSection />}
      </div>
    </div>
  )
}

// Overview section
function OverviewSection() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Team Members" value="15" icon={<Users size={24} />} color="#E72585" />
        <StatCard title="Upcoming Events" value="3" icon={<Calendar size={24} />} color="#4cc9f0" />
        <StatCard title="Sponsors" value="8" icon={<Briefcase size={24} />} color="#560BAD" />
      </div>

      <div className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 font-rajdhani">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard title="Add Team Member" icon={<Users size={20} />} />
          <QuickActionCard title="Create Event" icon={<Calendar size={20} />} />
          <QuickActionCard title="Add Sponsor" icon={<Briefcase size={20} />} />
          <QuickActionCard title="Manage Prizes" icon={<Award size={20} />} />
        </div>
      </div>

      <div className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 font-rajdhani">MongoDB Integration Notes</h2>
        <div className="text-white/80 space-y-2 text-sm">
          <p>This dashboard is designed for future MongoDB integration. Here's how to connect it:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Set up MongoDB Atlas and create a database for CuseHacks</li>
            <li>Create collections for: users, team_members, events, sponsors, prizes</li>
            <li>Configure environment variables for MongoDB connection</li>
            <li>Implement API routes in the /api directory for CRUD operations</li>
            <li>Replace the placeholder data with actual MongoDB queries</li>
          </ol>
          <p className="mt-4 text-[#4cc9f0]">
            Look for "MONGODB_INTEGRATION" comments throughout the code for specific integration points.
          </p>
        </div>
      </div>
    </div>
  )
}

// Team section with MongoDB integration comments
function TeamSection() {
  // Use mock data from our temporary MongoDB replacement
  const [teamMembers, setTeamMembers] = useState(getMockTeamMembers())
  const [editingMember, setEditingMember] = useState<any>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", role: "", year: "2025", image: "" })

  // Add a console log to show we're using mock data
  useEffect(() => {
    console.log("Using mock team members data for UI preview")
  }, [])

  // MONGODB_INTEGRATION: Replace with actual data from MongoDB
  // Example query: const [teamMembers, setTeamMembers] = useState([])
  // useEffect(() => { fetch('/api/team').then(res => res.json()).then(data => setTeamMembers(data)) }, [])
  // const [teamMembers, setTeamMembers] = useState([
  //   { id: 1, name: "Alex Johnson", role: "President", year: "2025", image: "/placeholder.svg?height=200&width=200" },
  //   {
  //     id: 2,
  //     name: "Jamie Smith",
  //     role: "Vice President",
  //     year: "2025",
  //     image: "/placeholder.svg?height=200&width=200",
  //   },
  //   { id: 3, name: "Taylor Brown", role: "Treasurer", year: "2025", image: "/placeholder.svg?height=200&width=200" },
  //   {
  //     id: 4,
  //     name: "Morgan Lee",
  //     role: "Event Coordinator",
  //     year: "2025",
  //     image: "/placeholder.svg?height=200&width=200",
  //   },
  //   {
  //     id: 5,
  //     name: "Casey Wilson",
  //     role: "Marketing Lead",
  //     year: "2025",
  //     image: "/placeholder.svg?height=200&width=200",
  //   },
  // ])
  // const [editingMember, setEditingMember] = useState<any>(null)
  // const [isAdding, setIsAdding] = useState(false)
  // const [newMember, setNewMember] = useState({ name: "", role: "", year: "2025", image: "" })

  // MONGODB_INTEGRATION: Replace with actual MongoDB operations
  const handleAddMember = () => {
    // Example: await fetch('/api/team', { method: 'POST', body: JSON.stringify(newMember) })
    setTeamMembers([...teamMembers, { ...newMember, id: Date.now() }])
    setNewMember({ name: "", role: "", year: "2025", image: "" })
    setIsAdding(false)
  }

  const handleUpdateMember = () => {
    // Example: await fetch(`/api/team/${editingMember.id}`, { method: 'PUT', body: JSON.stringify(editingMember) })
    setTeamMembers(teamMembers.map((m) => (m.id === editingMember.id ? editingMember : m)))
    setEditingMember(null)
  }

  const handleDeleteMember = (id: number) => {
    // Example: await fetch(`/api/team/${id}`, { method: 'DELETE' })
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-rajdhani">Current Team Members</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#E72585]/20 hover:bg-[#E72585]/30 text-[#E72585] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={18} />
          Add Member
        </button>
      </div>

      {/* Add member form */}
      {isAdding && (
        <div className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Add New Team Member</h3>
            <button onClick={() => setIsAdding(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/80 mb-1 text-sm">Name</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1 text-sm">Role</label>
              <input
                type="text"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1 text-sm">Year</label>
              <select
                value={newMember.year}
                onChange={(e) => setNewMember({ ...newMember, year: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-1 text-sm">Image URL</label>
              <input
                type="text"
                value={newMember.image}
                onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
                placeholder="/placeholder.svg?height=200&width=200"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddMember}
              className="bg-[#E72585] hover:bg-[#E72585]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Save size={18} />
              Save Member
            </button>
          </div>
        </div>
      )}

      {/* Edit member form */}
      {editingMember && (
        <div className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Edit Team Member</h3>
            <button onClick={() => setEditingMember(null)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/80 mb-1 text-sm">Name</label>
              <input
                type="text"
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1 text-sm">Role</label>
              <input
                type="text"
                value={editingMember.role}
                onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1 text-sm">Year</label>
              <select
                value={editingMember.year}
                onChange={(e) => setEditingMember({ ...editingMember, year: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-1 text-sm">Image URL</label>
              <input
                type="text"
                value={editingMember.image}
                onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                className="w-full bg-[#0a0a1a] border border-[#560BAD]/50 rounded-lg py-2 px-4 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleUpdateMember}
              className="bg-[#4cc9f0] hover:bg-[#4cc9f0]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Save size={18} />
              Update Member
            </button>
          </div>
        </div>
      )}

      {/* Team members list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member: any) => (
          <div key={member.id} className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0a0a1a] flex-shrink-0">
                <Image
                  src={member.image || "/placeholder.svg?height=200&width=200"}
                  alt={member.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-white/70 text-sm">{member.role}</p>
                <p className="text-[#4cc9f0] text-xs">{member.year}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setEditingMember(member)}
                className="text-white/70 hover:text-[#4cc9f0] transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="text-white/70 hover:text-[#E72585] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Year selector for previous team members */}
      <div className="mt-8">
        <h2 className="text-xl font-bold font-rajdhani mb-4">Previous Team Members</h2>
        <div className="flex gap-2 mb-4">
          <button className="bg-[#E72585]/20 text-[#E72585] px-4 py-2 rounded-lg">2024</button>
          <button className="bg-[#0f0f1a] text-white/70 hover:bg-[#0f0f1a]/80 px-4 py-2 rounded-lg">2023</button>
          <button className="bg-[#0f0f1a] text-white/70 hover:bg-[#0f0f1a]/80 px-4 py-2 rounded-lg">2022</button>
        </div>

        {/* MONGODB_INTEGRATION: Fetch previous team members from MongoDB based on selected year */}
        <div className="text-white/60 text-center py-4">
          Previous team members will be loaded from MongoDB based on the selected year.
        </div>
      </div>
    </div>
  )
}

// Events section placeholder
function EventsSection() {
  const [events, setEvents] = useState(getMockEvents())

  useEffect(() => {
    console.log("Using mock events data for UI preview")
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-rajdhani">Events Management</h2>
        <button className="bg-[#E72585]/20 hover:bg-[#E72585]/30 text-[#E72585] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <PlusCircle size={18} />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map((event: any) => (
          <div key={event.id} className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-[#4cc9f0] text-sm">
                  {event.date} • {event.time}
                </p>
                <p className="text-white/70 text-sm mt-1">{event.location}</p>
                <p className="text-white/80 mt-2">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-white/70 hover:text-[#4cc9f0] transition-colors">
                  <Edit size={16} />
                </button>
                <button className="text-white/70 hover:text-[#E72585] transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Sponsors section placeholder
function SponsorsSection() {
  const [sponsors, setSponsors] = useState(getMockSponsors())

  useEffect(() => {
    console.log("Using mock sponsors data for UI preview")
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-rajdhani">Sponsors Management</h2>
        <button className="bg-[#E72585]/20 hover:bg-[#E72585]/30 text-[#E72585] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <PlusCircle size={18} />
          Add Sponsor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((sponsor: any) => (
          <div key={sponsor.id} className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0a0a1a] flex-shrink-0">
                <Image
                  src={sponsor.logo || "/placeholder.svg?height=200&width=200"}
                  alt={sponsor.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{sponsor.name}</h3>
                <p className="text-[#E72585] text-sm">{sponsor.tier} Tier</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button className="text-white/70 hover:text-[#4cc9f0] transition-colors">
                <Edit size={16} />
              </button>
              <button className="text-white/70 hover:text-[#E72585] transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Prizes section placeholder
function PrizesSection() {
  const [prizes, setPrizes] = useState(getMockPrizes())

  useEffect(() => {
    console.log("Using mock prizes data for UI preview")
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-rajdhani">Prizes Management</h2>
        <button className="bg-[#E72585]/20 hover:bg-[#E72585]/30 text-[#E72585] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <PlusCircle size={18} />
          Add Prize
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prizes.map((prize: any) => (
          <div key={prize.id} className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{prize.category}</h3>
                <p className="text-[#E72585] text-sm">{prize.value}</p>
                <p className="text-white/80 mt-2">{prize.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-white/70 hover:text-[#4cc9f0] transition-colors">
                  <Edit size={16} />
                </button>
                <button className="text-white/70 hover:text-[#E72585] transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Settings section
function SettingsSection() {
  const handleClearDatabase = async () => {
    const confirmed = await new Promise((resolve) => {
      toast((t: Toast) => (
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={20} />
          <div>
            <p className="font-medium">Clear entire database?</p>
            <p className="text-sm text-white/70">This action cannot be undone.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1 text-sm bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    });

    if (confirmed) {
      try {
        const response = await fetch('/api/cleanup', {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to clear database');

        toast.success('Database cleared successfully', {
          position: 'top-center',
        });
      } catch (error) {
        toast.error('Failed to clear database', {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-6 border border-[#560BAD]/30">
        <h2 className="text-xl font-bold mb-4">Database Management</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-white/70 mb-4">
              Clear all data from the database. This action cannot be undone.
            </p>
            <button
              onClick={handleClearDatabase}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear Database
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

// Stat card component
function StatCard({
  title,
  value,
  icon,
  color,
}: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-[#0f0f1a] border border-[#560BAD]/30 rounded-xl p-6">
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

// Quick action card component
function QuickActionCard({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <button className="bg-[#0a0a1a] hover:bg-[#0a0a1a]/70 border border-[#560BAD]/20 rounded-lg p-4 flex items-center gap-3 transition-colors">
      <div className="text-[#4cc9f0]">{icon}</div>
      <span>{title}</span>
    </button>
  )
}
