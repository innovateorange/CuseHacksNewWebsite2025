"use client"

import React, { useState, useEffect, FormEvent, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Upload, Image as ImageIcon, LayoutDashboard, Users, FolderKanban, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { NextPage } from 'next';
import { FaLinkedin, FaGithub, FaGlobe, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';

interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  demoUrl: string;
}

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  year: string;
  bio: string;
  image?: string;
  links?: {
    linkedin?: string;
    github?: string;
    website?: string;
    email?: string;
  };
}

const AdminPage: NextPage = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'projects' | 'team' | 'settings'>('projects');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRole, setNewRole] = useState('');
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: '',
    title: '',
    description: '',
    technologies: [],
    image: '',
    githubUrl: '',
    demoUrl: '',
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({
    name: '',
    role: '',
    year: '',
    bio: '',
    image: '',
    links: {
      linkedin: '',
      github: '',
      website: '',
      email: ''
    }
  });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newTech, setNewTech] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamResponse, projectsResponse] = await Promise.all([
          fetch('/api/team'),
          fetch('/api/projects')
        ]);

        if (!teamResponse.ok || !projectsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const teamDataJson = await teamResponse.json();
        const projectsData = await projectsResponse.json();

        setTeamMembers(Array.isArray(teamDataJson) ? teamDataJson : []);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        setTeamMembers([]);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProjectSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) throw new Error('Failed to create project');
      
      const data = await response.json();
      setProjects((prevProjects: Project[]) => [...prevProjects, data]);
      setNewProject({
        id: '',
        title: '',
        description: '',
        technologies: [],
        image: '',
        githubUrl: '',
        demoUrl: '',
      });
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsAdding(true);
  };

  const handleUpdateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    const updatedProject: Project = {
      ...editingProject
    };

    setProjects((prev: Project[]) => prev.map((p: Project) => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects((prevProjects: Project[]) => prevProjects.filter((project: Project) => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleTechChange = (index: number, value: string): void => {
    setNewProject((prev: Project) => {
      const newTechs = [...prev.technologies];
      newTechs[index] = value;
      return { ...prev, technologies: newTechs };
    });
  };

  const handleRemoveTech = (index: number): void => {
    setNewProject((prev: Project) => {
      const newTechs = [...prev.technologies];
      newTechs.splice(index, 1);
      return { ...prev, technologies: newTechs };
    });
  };

  const handleAddTech = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && newTech.trim()) {
      e.preventDefault();
      setNewProject((prev: Project) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleProjectChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewProject((prev: Project) => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTeamMember((prev: TeamMember) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMemberLinksChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeamMember((prev: TeamMember) => ({
      ...prev,
      links: {
        ...prev.links,
        [name]: value
      }
    }));
  };

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTeamMember((prev: TeamMember) => ({
      ...prev,
      role: e.target.value
    }));
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeamMember),
      });

      if (!response.ok) throw new Error('Failed to create team member');
      
      const data = await response.json();
      setTeamMembers((prev: TeamMember[]) => [...prev, data]);
      setNewTeamMember({
        name: '',
        role: '',
        year: '',
        bio: '',
        image: '',
        links: {
          linkedin: '',
          github: '',
          website: '',
          email: ''
        }
      });
      toast.success('Team member added successfully');
    } catch (error) {
      console.error('Failed to create team member:', error);
      toast.error('Failed to add team member');
    }
  };

  const handleUpdateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      const response = await fetch(`/api/team/${editingMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingMember),
      });

      if (!response.ok) throw new Error('Failed to update team member');
      
      const updatedMember = await response.json();
      setTeamMembers((prev: TeamMember[]) => prev.map((member: TeamMember) => 
        member._id === updatedMember._id ? updatedMember : member
      ));
      setEditingMember(null);
      toast.success('Team member updated successfully');
    } catch (error) {
      console.error('Failed to update team member:', error);
      toast.error('Failed to update team member');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTeamMembers(prev => prev.filter(member => member._id !== id));
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  // Group team members by year
  const teamByYear = teamMembers.reduce((acc: Record<number, TeamMember[]>, member) => {
    const year = member.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(member);
    return acc;
  }, {});

  const renderTechnologies = (techs: string[], index: number) => (
    <div key={index} className="flex items-center gap-2">
      <Input
        type="text"
        value={techs[index]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTechChange(index, e.target.value)}
        placeholder="Technology"
        className="flex-1"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          handleRemoveTech(index);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const handleCancelEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditingProject(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech(e);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingImage(index);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      handleTeamMemberChange({ target: { name: 'image', value: data.url } } as ChangeEvent<HTMLInputElement>);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleAddRole = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNewTeamMember((prev: TeamMember) => ({
      ...prev,
      roles: [...(prev.roles || []), '']
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#560BAD] mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] py-20 relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#0a0a1a_1px),_linear-gradient(90deg,_transparent_1px,_#0a0a1a_1px)] bg-[size:30px_30px] [background-position:center] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ff00ff] animate-gradient-x">
              Admin Dashboard
            </span>
            {/* Neon glow effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ff00ff] opacity-50 blur-xl -z-10"></span>
          </h1>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveSection('projects')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-300",
              activeSection === 'projects'
                ? "bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/50"
                : "text-gray-400 hover:text-[#00ffff] hover:bg-[#00ffff]/10"
            )}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveSection('team')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-300",
              activeSection === 'team'
                ? "bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/50"
                : "text-gray-400 hover:text-[#00ffff] hover:bg-[#00ffff]/10"
            )}
          >
            Team
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeSection === 'projects' && (
            <>
              {/* Project form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="col-span-full bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-white/10 
                          hover:border-[#00ffff]/50 transition-all duration-300 cyberpunk-card"
              >
                <Card className="mb-8 bg-[#0f0f1a]/80 backdrop-blur-md border border-[#560BAD]/30 shadow-[0_0_30px_rgba(86,11,173,0.3)]">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-[#E72585] to-[#560BAD] bg-clip-text text-transparent">Project Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add New Project Form */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0f0f1a]/80 backdrop-blur-md rounded-xl p-6 border border-[#560BAD]/30 shadow-[0_0_30px_rgba(86,11,173,0.3)] mb-8"
                    >
                      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#E72585] to-[#560BAD] bg-clip-text text-transparent">Add New Project</h2>
                      <form onSubmit={handleProjectSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Title</label>
                          <input
                            type="text"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Description</label>
                          <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                            rows={3}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Technologies</label>
                          <div className="space-y-2">
                            {renderTechnologies(newProject.technologies, 0)}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddTech(e);
                              }}
                              className="flex items-center gap-2 text-[#4cc9f0] hover:text-[#E72585] transition-colors"
                            >
                              <Plus size={16} />
                              Add Technology
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Demo Link</label>
                          <input
                            type="url"
                            value={newProject.demoUrl}
                            onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                            className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Code Repository Link</label>
                          <input
                            type="url"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                            required
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newProject.featured}
                            onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                            className="rounded border-[#560BAD]/30 focus:ring-[#4cc9f0] text-[#4cc9f0]"
                          />
                          <label className="text-sm font-medium text-[#4cc9f0]">Featured Project</label>
                        </div>

                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(231,37,133,0.3)]"
                        >
                          Add Project
                        </button>
                      </form>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project list */}
              {projects.map((project: Project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-white/10 
                            hover:border-[#00ffff]/50 transition-all duration-300 cyberpunk-card"
                >
                  {editingProject?._id === project.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingProject?.title ?? ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          if (editingProject) {
                            setEditingProject({
                              ...editingProject,
                              title: e.target.value,
                            });
                          }
                        }}
                        className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                      />
                      <textarea
                        value={editingProject?.description ?? ''}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                          if (editingProject) {
                            setEditingProject({
                              ...editingProject,
                              description: e.target.value,
                            });
                          }
                        }}
                        className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                        rows={4}
                      />
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            if (editingProject) {
                              handleUpdateProject(e as unknown as FormEvent<HTMLFormElement>);
                            }
                          }}
                          className="bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-[#E72585] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#4cc9f0]">{project.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-[#4cc9f0] hover:text-[#560BAD] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="bg-[#560BAD]/20 text-white/90 px-2 py-1 rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4cc9f0] hover:text-[#E72585] transition-colors"
                        >
                          View Demo
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4cc9f0] hover:text-[#E72585] transition-colors"
                        >
                          View Code
                        </a>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </>
          )}

          {activeSection === 'team' && (
            <div className="col-span-full space-y-8">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-[#4cc9f0] via-[#E72585] to-[#560BAD]">
                  Team Members
                </h2>
                <Button
                  onClick={() => setIsAdding(true)}
                  className="bg-[#4cc9f0] hover:bg-[#4cc9f0]/80 text-black px-6 py-3 text-lg font-medium rounded-xl flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(76,201,240,0.3)]"
                >
                  <Plus className="w-5 h-5" />
                  Add Team Member
                </Button>
              </div>

              {/* Team Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member: TeamMember, index: number) => (
                  <div key={member._id || index} className="relative p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    {member._id && (
                      <button
                        onClick={() => handleDeleteTeamMember(member._id as string)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                    {member.image && (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={100}
                        height={100}
                        className="rounded-full mx-auto mb-4 border-2 border-cyan-500 glow-cyan"
                      />
                    )}
                    <h3 className="text-xl font-bold text-center mb-2 text-cyan-400">{member.name}</h3>
                    <p className="text-gray-400 text-center">{member.role}</p>
                    <p className="text-gray-400 text-center">{member.year}</p>
                    <p className="text-gray-300 mt-4">{member.bio}</p>
                    <div className="flex justify-center gap-4 mt-4">
                      {member.links?.linkedin && (
                        <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer">
                          <FaLinkedin size={24} />
                        </a>
                      )}
                      {member.links?.github && (
                        <a href={member.links.github} target="_blank" rel="noopener noreferrer">
                          <FaGithub size={24} />
                        </a>
                      )}
                      {member.links?.website && (
                        <a href={member.links.website} target="_blank" rel="noopener noreferrer">
                          <FaGlobe size={24} />
                        </a>
                      )}
                      {member.links?.email && (
                        <a href={`mailto:${member.links.email}`}>
                          <FaEnvelope size={24} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Team Member Modal */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-[#0a0a1a] rounded-xl p-6 w-full max-w-2xl border border-[#00ffff]/20"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">
                          {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setIsAdding(false);
                            setEditingMember(null);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <form onSubmit={handleAddTeamMember} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-gray-300">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={newTeamMember.name}
                              onChange={handleTeamMemberChange}
                              className="bg-black/40 border-[#00ffff]/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="role" className="text-gray-300">Role</Label>
                            <Input
                              id="role"
                              name="role"
                              value={newTeamMember.role}
                              onChange={handleRoleChange}
                              className="bg-black/40 border-[#00ffff]/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="year" className="text-gray-300">Year</Label>
                            <Input
                              id="year"
                              name="year"
                              type="number"
                              value={newTeamMember.year}
                              onChange={handleTeamMemberChange}
                              className="bg-black/40 border-[#00ffff]/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="image" className="text-gray-300">Image URL</Label>
                            <Input
                              id="image"
                              name="image"
                              value={newTeamMember.image}
                              onChange={handleTeamMemberChange}
                              className="bg-black/40 border-[#00ffff]/20 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={newTeamMember.bio}
                            onChange={handleTeamMemberChange}
                            className="bg-black/40 border-[#00ffff]/20 text-white h-24"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="linkedin" className="text-gray-300">LinkedIn URL</Label>
                            <Input
                              id="linkedin"
                              name="links.linkedin"
                              value={newTeamMember.links.linkedin}
                              onChange={handleTeamMemberLinksChange}
                              className="bg-black/40 border-[#00ffff]/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="github" className="text-gray-300">GitHub URL</Label>
                            <Input
                              id="github"
                              name="links.github"
                              value={newTeamMember.links.github}
                              onChange={handleTeamMemberLinksChange}
                              className="bg-black/40 border-[#00ffff]/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="website" className="text-gray-300">Website URL</Label>
                            <Input
                              id="website"
                              name="links.website"
                              value={newTeamMember.links.website}
                              onChange={handleTeamMemberLinksChange}
                              className="bg-black/40 border-[#00ffff]/20 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsAdding(false);
                              setEditingMember(null);
                            }}
                            className="border-[#00ffff]/20 text-gray-300 hover:text-white"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black"
                          >
                            {editingMember ? 'Update' : 'Add'} Team Member
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a1a] p-6 rounded-xl max-w-2xl w-full border border-[#560BAD]/30 shadow-[0_0_30px_rgba(86,11,173,0.3)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E72585] to-[#560BAD] bg-clip-text text-transparent">Edit Project</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-[#560BAD]/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setEditingProject({
                        ...editingProject,
                        title: e.target.value,
                      });
                    }}
                    className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Description</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                      setEditingProject({
                        ...editingProject,
                        description: e.target.value,
                      });
                    }}
                    className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Technologies</label>
                  <div className="space-y-2">
                    {renderTechnologies(editingProject.technologies, 0)}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingProject({ ...editingProject, technologies: editingProject.technologies.filter((_, i) => i !== index) });
                      }}
                      className="flex items-center gap-2 text-[#4cc9f0] hover:text-[#E72585] transition-colors"
                    >
                      <Plus size={16} />
                      Add Technology
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Demo Link</label>
                  <input
                    type="url"
                    value={editingProject.demoUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                    className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#4cc9f0]">Code Repository Link</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full bg-[#0a0a1a] border border-[#560BAD]/30 rounded-lg px-4 py-2 focus:border-[#4cc9f0] focus:ring-1 focus:ring-[#4cc9f0] transition-colors"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded border-[#560BAD]/30 focus:ring-[#4cc9f0] text-[#4cc9f0]"
                  />
                  <label className="text-sm font-medium text-[#4cc9f0]">Featured Project</label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-[#E72585] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      if (editingProject) {
                        handleUpdateProject(e as unknown as FormEvent<HTMLFormElement>);
                      }
                    }}
                    className="bg-gradient-to-r from-[#E72585] to-[#560BAD] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(231,37,133,0.3)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminPage;
