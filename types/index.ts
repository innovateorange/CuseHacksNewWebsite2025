export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamData {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
} 