"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaUpload, FaTimes } from 'react-icons/fa';
import type { TeamMember, TeamMemberDocument } from '@/models/Team';
import toast, { Toaster } from 'react-hot-toast';

interface TeamMemberWithId extends TeamMember {
  _id: string;
}

export default function TeamAdminPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<TeamMemberWithId> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      setTeamMembers(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        const toastId = toast.custom(
          (t) => (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-gray-800 font-medium mb-4">Are you sure you want to delete this team member?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    toast.dismiss(toastId);
                    resolve(false);
                  }}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(toastId);
                    resolve(true);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
          { duration: Infinity }
        );
      });
    };

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }
      
      toast.success('Team member deleted successfully');
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
        if (editingMember) {
          setEditingMember({ ...editingMember, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      // Validate required fields
      if (!editingMember.name || !editingMember.role || !editingMember.year) {
        toast.error('Please fill in all required fields (Name, Role, Year)');
        return;
      }

      const method = editingMember._id ? 'PUT' : 'POST';
      const url = editingMember._id ? `/api/team?id=${editingMember._id}` : '/api/team';
      
      // Show loading toast
      const loadingToast = toast.loading(
        editingMember._id ? 'Updating team member...' : 'Creating new team member...'
      );
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingMember,
          year: parseInt(editingMember.year?.toString() || new Date().getFullYear().toString()),
          isActive: editingMember.isActive !== undefined ? editingMember.isActive : true,
          order: editingMember.order || teamMembers.length + 1,
          links: editingMember.links || {}
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${editingMember._id ? 'update' : 'create'} team member`);
      }
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(
        `Team member ${editingMember._id ? 'updated' : 'created'} successfully`,
        { duration: 3000 }
      );
      
      setShowForm(false);
      setEditingMember(null);
      setPreviewImage(null);
      await fetchTeamMembers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save team member';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-500 mt-1">Manage team members and their information</p>
          </div>
          <button
            onClick={() => {
              setEditingMember({
                name: '',
                role: '',
                image: '',
                bio: '',
                year: new Date().getFullYear(),
                isActive: true,
                order: teamMembers.length + 1,
                links: {}
              });
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <FaPlus /> Add Member
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingMember?._id ? 'Edit' : 'Add'} Team Member
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingMember(null);
                      setPreviewImage(null);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingMember?.name || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setEditingMember({ ...editingMember!, name: e.target.value })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={editingMember?.role || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setEditingMember({ ...editingMember!, role: e.target.value })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editingMember?.bio || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        setEditingMember({ ...editingMember!, bio: e.target.value })
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="number"
                        value={editingMember?.year || new Date().getFullYear()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setEditingMember({ ...editingMember!, year: parseInt(e.target.value) })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input
                        type="number"
                        value={editingMember?.order || 0}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setEditingMember({ ...editingMember!, order: parseInt(e.target.value) })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingMember?.isActive}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setEditingMember({ ...editingMember!, isActive: e.target.checked })
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active Member</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                        {previewImage || editingMember?.image ? (
                          <Image
                            src={previewImage || editingMember?.image || ''}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <FaUpload size={24} />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Upload Image
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingMember(null);
                        setPreviewImage(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member: TeamMemberWithId) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.bio}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingMember(member);
                          setPreviewImage(null);
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 