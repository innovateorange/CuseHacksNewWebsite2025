export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  name: string;
  role: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface TeamData {
  teamMembers: TeamMember[];
  roles: string[];
} 