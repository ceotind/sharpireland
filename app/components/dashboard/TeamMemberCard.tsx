'use client';

import { useState } from 'react';
import { logActivity } from '../../utils/activity-logger';

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

interface TeamMemberCardProps {
  member: TeamMember;
  currentUserId: string;
  currentUserRole: 'owner' | 'admin' | 'member';
  teamId: string;
  teamName: string;
  onRemove?: (memberId: string) => void;
  onRoleChange?: (memberId: string, newRole: 'owner' | 'admin' | 'member') => void;
  onPermissionChange?: (memberId: string, permissions: TeamMember['permissions']) => void;
}

export default function TeamMemberCard({
  member,
  currentUserId,
  currentUserRole,
  teamId,
  teamName,
  onRemove,
  onRoleChange,
  onPermissionChange
}: TeamMemberCardProps) {
  const [showPermissions, setShowPermissions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localPermissions, setLocalPermissions] = useState(member.permissions);

  const isCurrentUser = member.user_profiles.id === currentUserId;
  const canManageThisMember = currentUserRole === 'owner' || 
    (currentUserRole === 'admin' && member.role === 'member');
  const canRemoveThisMember = canManageThisMember && !isCurrentUser && member.role !== 'owner';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'member':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRoleChange = async (newRole: 'owner' | 'admin' | 'member') => {
    if (!onRoleChange || isUpdating) return;

    setIsUpdating(true);
    try {
      await onRoleChange(member.id, newRole);
      
      await logActivity({
        action: 'team_member_role_changed',
        description: `Changed ${member.user_profiles.full_name || member.user_profiles.username}'s role to ${newRole} in team: ${teamName}`,
        metadata: { 
          team_id: teamId,
          team_name: teamName,
          member_id: member.id,
          member_name: member.user_profiles.full_name || member.user_profiles.username,
          old_role: member.role,
          new_role: newRole
        }
      });
    } catch (error) {
      console.error('Error changing member role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePermissionChange = async (permissionKey: keyof TeamMember['permissions'], value: boolean) => {
    if (!onPermissionChange || isUpdating) return;

    const updatedPermissions = {
      ...localPermissions,
      [permissionKey]: value
    };

    setLocalPermissions(updatedPermissions);
    setIsUpdating(true);

    try {
      await onPermissionChange(member.id, updatedPermissions);
      
      await logActivity({
        action: 'team_member_permissions_changed',
        description: `Updated permissions for ${member.user_profiles.full_name || member.user_profiles.username} in team: ${teamName}`,
        metadata: { 
          team_id: teamId,
          team_name: teamName,
          member_id: member.id,
          member_name: member.user_profiles.full_name || member.user_profiles.username,
          permission_changed: permissionKey,
          new_value: value
        }
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      // Revert local state on error
      setLocalPermissions(member.permissions);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove || !canRemoveThisMember) return;

    const memberName = member.user_profiles.full_name || member.user_profiles.username;
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    try {
      await onRemove(member.id);
      
      await logActivity({
        action: 'team_member_removed',
        description: `Removed ${memberName} from team: ${teamName}`,
        metadata: { 
          team_id: teamId,
          team_name: teamName,
          member_id: member.id,
          member_name: memberName
        }
      });
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      id={`team-member-card-${member.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3" id={`member-info-${member.id}`}>
          <div className="relative">
            {member.user_profiles.avatar_url ? (
              <img
                src={member.user_profiles.avatar_url}
                alt={member.user_profiles.full_name || member.user_profiles.username}
                className="w-12 h-12 rounded-full object-cover"
                id={`member-avatar-${member.id}`}
              />
            ) : (
              <div 
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center"
                id={`member-avatar-placeholder-${member.id}`}
              >
                <span className="text-gray-600 font-medium text-lg">
                  {(member.user_profiles.full_name || member.user_profiles.username).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isCurrentUser && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">•</span>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">
              {member.user_profiles.full_name || member.user_profiles.username}
              {isCurrentUser && <span className="text-blue-600 ml-1">(You)</span>}
            </h4>
            <p className="text-sm text-gray-600">
              {member.user_profiles.company || 'No company'}
            </p>
            <p className="text-xs text-gray-500">
              Joined {formatJoinDate(member.joined_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2" id={`member-actions-${member.id}`}>
          {canManageThisMember && member.role !== 'owner' ? (
            <select
              value={member.role}
              onChange={(e) => handleRoleChange(e.target.value as 'owner' | 'admin' | 'member')}
              disabled={isUpdating}
              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              id={`member-role-select-${member.id}`}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              {currentUserRole === 'owner' && <option value="owner">Owner</option>}
            </select>
          ) : (
            <span 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}
              id={`member-role-badge-${member.id}`}
            >
              {member.role.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Permissions Section */}
      <div className="border-t border-gray-100 pt-3" id={`member-permissions-${member.id}`}>
        <button
          onClick={() => setShowPermissions(!showPermissions)}
          className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800"
          id={`toggle-permissions-${member.id}`}
        >
          <span>Permissions</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showPermissions ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showPermissions && (
          <div className="mt-3 space-y-2" id={`permissions-list-${member.id}`}>
            {Object.entries(localPermissions).map(([key, value]) => (
              <label 
                key={key} 
                className="flex items-center justify-between text-sm"
                id={`permission-${key}-${member.id}`}
              >
                <span className="text-gray-700">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePermissionChange(key as keyof TeamMember['permissions'], e.target.checked)}
                  disabled={!canManageThisMember || isUpdating || member.role === 'owner'}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {canRemoveThisMember && (
        <div className="border-t border-gray-100 pt-3 mt-3" id={`member-remove-section-${member.id}`}>
          <button
            onClick={handleRemove}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
            id={`remove-member-button-${member.id}`}
          >
            Remove from team
          </button>
        </div>
      )}

      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}