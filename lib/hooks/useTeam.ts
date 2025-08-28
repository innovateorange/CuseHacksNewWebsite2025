import { useState, useEffect } from 'react';

interface TeamMember {
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

interface TeamData {
  teams: TeamMember[];
}

export function useTeam() {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch('/api/team');
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        const data = await response.json();
        setTeam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  const updateTeam = async (newTeamData: TeamMember[]) => {
    try {
      const response = await fetch('/api/team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamMembers: newTeamData }),
      });

      if (!response.ok) {
        throw new Error('Failed to update team data');
      }

      const updatedData = await response.json();
      setTeam({ teams: updatedData.team });
      return { success: true, data: updatedData };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    team,
    loading,
    error,
    updateTeam,
  };
}

export type { TeamMember, TeamData }; 