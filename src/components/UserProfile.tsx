import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { followService } from '../features/follow/followService';

import { User } from '../types';
import { useAuthStore } from '../store/AuthStore';

interface UserProfileProps {
  user: User;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOwnProfile }) => {
  const queryClient = useQueryClient();

  // Load access token
  const access_token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  // Load user info from Zustand first, fallback to localStorage
  const authStoreUser = useAuthStore((state) => state.user);
  const [currentUser, setCurrentUser] = useState<any>(authStoreUser);
  const [localUser, setLocalUser] = useState<any>(user); // local copy to update UI immediately

  useEffect(() => {
    if (!authStoreUser) {
      const storedUser = localStorage.getItem('user_info');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentUser(parsed);
        } catch (e) {
          console.error('Failed to parse user_info from localStorage', e);
        }
      }
    }
  }, [authStoreUser]);

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: () => {
      if (!access_token) throw new Error('Not authenticated');
      return followService.followUser(localUser.id);
    },
    onSuccess: () => {
      // Update local user followersIds and count immediately for instant UI update
      setLocalUser((prev) => ({
        ...prev,
        followersIds: [...(prev.followersIds || []), currentUser?.id],
        followCount: (prev.followCount || 0) + 1,
      }));

      queryClient.invalidateQueries({ queryKey: ['user', localUser.id] });
      queryClient.invalidateQueries({ queryKey: ['timeline'] }); // REFRESH timeline query
      toast.success('Followed user');
    },
    onError: () => toast.error('Failed to follow user'),
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: () => {
      if (!access_token) throw new Error('Not authenticated');
      return followService.unfollowUser(localUser.id);
    },
    onSuccess: () => {
      setLocalUser((prev) => ({
        ...prev,
        followersIds: (prev.followersIds || []).filter((id) => id !== currentUser?.id),
        followCount: Math.max((prev.followCount || 1) - 1, 0),
      }));

      queryClient.invalidateQueries({ queryKey: ['user', localUser.id] });
      queryClient.invalidateQueries({ queryKey: ['timeline'] }); // REFRESH timeline query
      toast.success('Unfollowed user');
    },
    onError: () => toast.error('Failed to unfollow user'),
  });

  const handleFollow = useCallback(() => {
    followMutation.mutate();
  }, [followMutation]);

  const handleUnfollow = useCallback(() => {
    unfollowMutation.mutate();
  }, [unfollowMutation]);

  const isSelf = currentUser?.id === localUser.id;
  const isFollowed = localUser.followersIds?.includes(currentUser?.id);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold text-dark dark:text-white">{localUser.name}</h2>
      <p className="text-light dark:text-gray-400">@{localUser.username}</p>
      <div className="flex space-x-4 mt-2 text-dark dark:text-white">
        <span>Following: {localUser.followedCount}</span>
        <span>Followers: {localUser.followCount}</span>
      </div>

      {!isSelf && currentUser && access_token && typeof isFollowed === 'boolean' && (
        <button
          onClick={isFollowed ? handleUnfollow : handleFollow}
          className="mt-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
          disabled={followMutation.isPending || unfollowMutation.isPending}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserProfile;
