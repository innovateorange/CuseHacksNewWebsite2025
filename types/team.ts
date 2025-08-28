export interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  year: string;
  bio?: string;
  image?: string;
  links?: {
    linkedin?: string;
    github?: string;
    website?: string;
    email?: string;
  };
} 