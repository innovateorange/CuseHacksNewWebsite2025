"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import TeamMemberCard from "./team-member-card"
import { useTeam } from "@/lib/hooks/useTeam"
import { Skeleton } from "@/components/ui/skeleton"
import type { TeamMember } from "@/lib/hooks/useTeam"
import Image from "next/image"
import { FaLinkedin } from 'react-icons/fa'

interface TeamMemberData {
  _id?: string;
  name: string;
  role: string;
  year: number;
  image: string;
  bio?: string;
  isActive: boolean;
  order: number;
  links: {
    linkedin?: string;
    github?: string;
    email?: string;
    website?: string;
  };
}

// Default fallback image as base64 data URL (a simple gray placeholder)
const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiMxOTE5MjIiLz48Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSI0MCIgZmlsbD0iIzMwMzAzMyIvPjwvc3ZnPg=='; // Darker placeholder

export function TeamSection({ showOnlyCurrentTeam = false }: { showOnlyCurrentTeam?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const { team, loading, error } = useTeam();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev: Set<string>) => new Set(prev).add(id));
  };

  const getImageSrc = (member: TeamMemberData): string => {
    if (!member.image || member.image === defaultImage) return defaultImage;
    return member.image;
  };

  if (!mounted || loading) {
    return (
      <div className="bg-gradient-to-b from-cuse-purple to-black py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-xl text-cuse-cyan">Meet the people behind CuseHacks</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-white/5 rounded-lg p-6 animate-pulse border border-cuse-pink/10">
                <div className="w-32 h-32 mx-auto bg-white/10 rounded-full mb-4" />
                <div className="h-5 bg-white/10 rounded w-3/4 mx-auto mb-3" />
                <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-cuse-purple to-black py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Error Loading Team</h2>
          <p className="text-xl text-cuse-pink">{error}</p>
        </div>
      </div>
    );
  }

  if (!team?.teams || team.teams.length === 0) {
    return (
      <div className="bg-gradient-to-b from-cuse-purple to-black py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">No Team Data Available</h2>
          <p className="text-xl text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  const allMembers = team.teams;
  const currentMembers = allMembers.filter((member: TeamMemberData) => 
    showOnlyCurrentTeam ? member.isActive && member.year === 2025 : member.isActive
  );
  const alumniMembers = allMembers.filter((member: TeamMemberData) => !member.isActive);

  return (
    <div className="bg-gradient-to-b from-cuse-purple to-black py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Team</h2>
          <p className="text-xl text-cuse-cyan">Meet the people behind CuseHacks</p>
        </div>

        <div className="mb-20 sm:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {currentMembers.map((member: TeamMemberData) => (
              <div
                key={member._id || `${member.name}-${member.role}`}
                className="group bg-gradient-to-br from-black/30 via-cuse-purple/10 to-black/30 rounded-lg p-6 border border-cuse-cyan/20 transform transition-all duration-300 hover:scale-105 hover:border-cuse-cyan/50 hover:shadow-lg hover:shadow-cuse-cyan/20 flex flex-col"
              >
                <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden group-hover:ring-2 group-hover:ring-cuse-pink/50 transition-all duration-300 flex-shrink-0">
                  {!loadedImages.has(member._id || '') && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  )}
                  <Image
                    src={getImageSrc(member)}
                    alt={`${member.name} - ${member.role}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      loadedImages.has(member._id || '') ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="128px"
                    loading="lazy"
                    onLoadingComplete={() => handleImageLoad(member._id || '')}
                  />
                </div>
                <div className="text-center flex-grow flex flex-col">
                  <h4 className="text-xl font-semibold text-white mb-1">{member.name}</h4>
                  <p className="text-cuse-pink text-center mb-3 font-medium">{member.role}</p>
                  <div className="relative flex-grow flex items-center justify-center mb-4 min-h-[40px]">
                    <p className="team-card-bio absolute inset-x-0 top-0 text-gray-300 text-sm text-center p-2 bg-black/70 backdrop-blur-sm rounded">
                      {member.bio || "No fun fact available!"}
                    </p>
                  </div>
                  {member.links?.linkedin && (
                    <div className="mt-auto pt-2 flex justify-center">
                      <Link
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cuse-cyan/70 hover:text-cuse-cyan transition-colors"
                        aria-label={`${member.name}'s LinkedIn Profile`}
                      >
                        <FaLinkedin size={24} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!showOnlyCurrentTeam && alumniMembers.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-white mb-10 text-center">Alumni</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {alumniMembers.map((member: TeamMemberData) => (
                <div
                  key={member._id || `${member.name}-${member.role}`}
                  className="group bg-black/50 rounded-lg p-6 border border-gray-700/50 transform transition-all duration-300 hover:scale-105 hover:bg-black/40 hover:border-gray-600 flex flex-col"
                >
                  <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden ring-1 ring-gray-600 group-hover:ring-2 group-hover:ring-gray-500 transition-all duration-300 flex-shrink-0">
                    {!loadedImages.has(member._id || '') && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    )}
                    <Image
                      src={getImageSrc(member)}
                      alt={`${member.name} - ${member.role} (Alumni)`}
                      fill
                      className={`object-cover grayscale transition-opacity duration-500 ${
                        loadedImages.has(member._id || '') ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes="128px"
                      loading="lazy"
                      onLoadingComplete={() => handleImageLoad(member._id || '')}
                    />
                  </div>
                  <div className="text-center flex-grow flex flex-col">
                    <h4 className="text-xl font-semibold text-white mb-1">{member.name}</h4>
                    <p className="text-gray-400 text-center mb-3 font-medium">{member.role}</p>
                    <div className="relative flex-grow flex items-center justify-center mb-4 min-h-[40px]">
                      <p className="team-card-bio absolute inset-x-0 top-0 text-gray-300 text-sm text-center p-2 bg-black/70 backdrop-blur-sm rounded">
                        {member.bio || "No fun fact available!"}
                      </p>
                    </div>
                    {member.links?.linkedin && (
                      <div className="mt-auto pt-2 flex justify-center">
                        <Link
                          href={member.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-400 transition-colors"
                          aria-label={`${member.name}'s LinkedIn Profile`}
                        >
                          <FaLinkedin size={24} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
