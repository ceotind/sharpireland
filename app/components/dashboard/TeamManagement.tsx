'use client';

import { useState, useEffect } from 'react';
import { logActivity } from '../../utils/activity-logger-client';

interface TeamMember {
  id: string;
  role: 'owner' | 'admin' | 'member';
  permissions: {
    can_manage_members: boolean;
    can_manage_projects: boolean;
    can_view_analytics: boolean;
    can_manage_settings: boolean;
  };
  joined_at: string;
  user_profiles: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    company: string | null;
    role: string | null;
  };
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface TeamManagementProps {
  userId: string;
}

export default function TeamManagement({ userId }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'member' | 'admin'>('member');

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch teams');
      }

      setTeams(result.data || []);
      if (result.data && result.data.length > 0 && !selectedTeam) {
        setSelectedTeam(result.data[0]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async (teamId: string) => {
    if (!teamId) return;
    
    setMembersLoading(true);
    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch team members');
      }

      setTeamMembers(result.data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
    } finally {
      setMembersLoading(false);
    }
  };

  // Create new team
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeamName.trim()) return;

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTeamName.trim(),
          description: newTeamDescription.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create team');
      }

      await logActivity({
        action: 'team_created',
        description: `Created team: ${newTeamName}`,
        metadata: { team_name: newTeamName }
      }, { userId });

      setNewTeamName('');
      setNewTeamDescription('');
      setShowCreateModal(false);
      await fetchTeams();
    } catch (err) {
      console.error('Error creating team:', err);
      setError(err instanceof Error ? err.message : 'Failed to create team');
    }
  };

  // Add team member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeam || !newMemberEmail.trim()) return;

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newMemberEmail.trim(),
          role: newMemberRole,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add team member');
      }

      await logActivity({
        action: 'team_member_added',
        description: `Added member to team: ${selectedTeam.name}`,
        metadata: { team_name: selectedTeam.name, member_email: newMemberEmail }
      }, { userId });

      setNewMemberEmail('');
      setNewMemberRole('member');
      setShowAddMemberModal(false);
      await fetchTeamMembers(selectedTeam.id);
    } catch (err) {
      console.error('Error adding team member:', err);
      setError(err instanceof Error ? err.message : 'Failed to add team member');
    }
  };

  // Remove team member
  const handleRemoveMember = async (memberUserId: string, memberName: string) => {
    if (!selectedTeam) return;
    
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/members?userId=${memberUserId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove team member');
      }

      await logActivity({
        action: 'team_member_removed',
        description: `Removed ${memberName} from team: ${selectedTeam.name}`,
        metadata: { team_name: selectedTeam.name, member_name: memberName }
      }, { userId });

      await fetchTeamMembers(selectedTeam.id);
    } catch (err) {
      console.error('Error removing team member:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove team member');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
    }
  }, [selectedTeam]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="team-management-loading">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="team-management-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          id="create-team-button"
        >
          Create Team
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" id="team-error-message">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-1" id="teams-list-section">
          <h4 className="font-medium text-gray-900 mb-3">Your Teams</h4>
          {teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500" id="no-teams-message">
              <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <p>No teams yet</p>
              <p className="text-sm">Create your first team to get started</p>
            </div>
          ) : (
            <div className="space-y-2" id="teams-list">
              {teams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTeam?.id === team.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  id={`team-item-${team.id}`}
                >
                  <h5 className="font-medium text-gray-900">{team.name}</h5>
                  {team.description && (
                    <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created {new Date(team.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="lg:col-span-2" id="team-members-section">
          {selectedTeam ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">
                  Members of {selectedTeam.name}
                </h4>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  id="add-member-button"
                >
                  Add Member
                </button>
              </div>

              {membersLoading ? (
                <div className="animate-pulse space-y-3" id="members-loading">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3" id="members-list">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      id={`member-item-${member.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {member.user_profiles.avatar_url ? (
                            <img
                              src={member.user_profiles.avatar_url}
                              alt={member.user_profiles.full_name || member.user_profiles.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {(member.user_profiles.full_name || member.user_profiles.username).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {member.user_profiles.full_name || member.user_profiles.username}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {member.user_profiles.company || 'No company'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                          {member.role.toUpperCase()}
                        </span>
                        {member.role !== 'owner' && (
                          <button
                            onClick={() => handleRemoveMember(
                              member.user_profiles.id,
                              member.user_profiles.full_name || member.user_profiles.username
                            )}
                            className="text-red-600 hover:text-red-800 text-sm"
                            id={`remove-member-${member.id}`}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500" id="no-team-selected">
              <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <p>Select a team to view members</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="create-team-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
            <form onSubmit={handleCreateTeam}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                  required
                  id="new-team-name-input"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team description"
                  rows={3}
                  id="new-team-description-input"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  id="cancel-create-team"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  id="confirm-create-team"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="add-member-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            <form onSubmit={handleAddMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter member email"
                  required
                  id="new-member-email-input"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as 'member' | 'admin')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-member-role-select"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  id="cancel-add-member"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  id="confirm-add-member"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}