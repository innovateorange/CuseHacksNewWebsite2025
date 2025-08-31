"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import Image from 'next/image';
import Link from "next/link"
import { FaGlobe } from "react-icons/fa"
import type { TeamMember } from '@/models/Team'

// Default fallback image as base64 data URL
const DEFAULT_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAZABkAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uLk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+u0UKMCloooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z"

// Function to generate a placeholder image URL
const getPlaceholderImage = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=560BAD&color=fff&size=256`
}

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleImageError = (memberId: string) => {
    setImageErrors((prev: Record<string, boolean>) => ({
      ...prev,
      [memberId]: true
    }));
  };

  const getImageSrc = (member: TeamMember & { _id: string }) => {
    if (imageErrors[member._id]) {
      return getPlaceholderImage(member.name);
    }
    return member.image || getPlaceholderImage(member.name);
  };

  // Group team members by year
  const teamByYear = teamMembers.reduce((acc, member) => {
    const year = member.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(member);
    return acc;
  }, {} as Record<number, TeamMember[]>);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] py-20 relative overflow-hidden">
      {/* Enhanced cyberpunk background */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#0a0a1a_1px),_linear-gradient(90deg,_transparent_1px,_#0a0a1a_1px)] bg-[size:30px_30px] [background-position:center] opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00ffff_1px,_transparent_1px)] bg-[size:20px_20px] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#00ffff]/5 via-transparent to-[#ff00ff]/5"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ffff] via-[#ff00ff] to-[#00ffff] animate-gradient-x">
              Our Team
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#00ffff] via-[#ff00ff] to-[#00ffff] opacity-50 blur-xl -z-10"></span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Meet the talented individuals who make our projects possible
          </p>
        </motion.div>

        {Object.entries(teamByYear).map(([year, members]) => (
          <div key={year} className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold mb-8 text-[#00ffff] relative inline-block"
            >
              <span className="relative z-10">Class of {year}</span>
              <span className="absolute inset-0 bg-[#00ffff] opacity-20 blur-lg -z-10"></span>
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {members.map((member: TeamMember & { _id: string }) => (
                <motion.div
                  key={member._id}
                  variants={item}
                  className="group relative bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-[#00ffff]/20 
                            hover:border-[#00ffff]/50 transition-all duration-300 cyberpunk-card
                            before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r 
                            before:from-transparent before:via-[#00ffff]/10 before:to-transparent 
                            before:opacity-0 before:transition-opacity hover:before:opacity-100
                            shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]
                            after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r 
                            after:from-[#00ffff]/0 after:via-[#ff00ff]/10 after:to-[#00ffff]/0 
                            after:opacity-0 after:transition-opacity group-hover:after:opacity-100"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00ffff]/0 via-[#ff00ff]/10 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                  
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden 
                                ring-4 ring-[#00ffff]/20 group-hover:ring-[#00ffff]/40 transition-all duration-300
                                before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#00ffff]/0 
                                before:via-[#ff00ff]/20 before:to-[#00ffff]/0 before:opacity-0 
                                group-hover:before:opacity-100 before:transition-opacity
                                shadow-[0_0_20px_rgba(0,255,255,0.2)]
                                after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r 
                                after:from-[#00ffff]/0 after:via-[#ff00ff]/10 after:to-[#00ffff]/0 
                                after:opacity-0 after:transition-opacity group-hover:after:opacity-100">
                    <Image
                      src={getImageSrc(member)}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(member._id)}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2 relative group-hover:text-[#00ffff] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#00ffff] text-center mb-6 group-hover:text-[#ff00ff] transition-colors">{member.role}</p>
                  <div className="flex justify-center space-x-6">
                    {member.links?.linkedin && (
                      <a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#0077b5] transition-colors duration-300 transform hover:scale-110 relative group"
                      >
                        <FaLinkedin size={24} />
                        <span className="absolute -top-2 -right-2 bg-[#0077b5] text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          LinkedIn
                        </span>
                      </a>
                    )}
                    {member.links?.github && (
                      <a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#ff00ff] transition-colors duration-300 transform hover:scale-110 relative group"
                      >
                        <FaGithub size={24} />
                        <span className="absolute -top-2 -right-2 bg-[#ff00ff] text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          GitHub
                        </span>
                      </a>
                    )}
                    {member.links?.website && (
                      <a
                        href={member.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00ffff] transition-colors duration-300 transform hover:scale-110 relative group"
                      >
                        <FaGlobe size={24} />
                        <span className="absolute -top-2 -right-2 bg-[#00ffff] text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          Website
                        </span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
