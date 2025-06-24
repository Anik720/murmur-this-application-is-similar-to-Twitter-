import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { murmurService } from '../features/murmur/murmurService';
import { useAuthStore } from '../store/AuthStore';

function MurmurCard({ murmur }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const currentUserId =
    user?.id || JSON.parse(localStorage.getItem('user_info') as string)?.id;

  const isLiked = murmur.likedUserIds?.includes(currentUserId);

  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked
        ? murmurService.unlikeMurmur(murmur.id)
        : murmurService.likeMurmur(murmur.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
      queryClient.invalidateQueries({ queryKey: ['userMurmurs'] });
      queryClient.invalidateQueries({ queryKey: ['murmur'] });
    },
    onError: () => toast.error('Failed to update like'),
  });

  const deleteMutation = useMutation({
    mutationFn: murmurService.deleteMurmur,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
      queryClient.invalidateQueries({ queryKey: ['userMurmurs'] });
      queryClient.invalidateQueries({ queryKey: ['murmur'] });
      toast.success('Murmur deleted');
    },
    onError: () => toast.error('Failed to delete murmur'),
  });

  const confirmDelete = () => {
    deleteMutation.mutate(murmur?.id);
    setShowConfirm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 relative">
      <Link to={`/users/${murmur.user?.id}`}>
        <p className="text-light dark:text-gray-300">@{murmur.user?.username || 'unknown'}</p>
      </Link>

      <Link to={`/murmurs/${murmur.id}`}>
        <p className="my-2 text-dark dark:text-white">{murmur.content}</p>
      </Link>

      <div className="flex items-center space-x-4 mt-2">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className={`flex items-center px-3 py-1 rounded-full transition ${isLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <span className="material-icons mr-1">
            {/* {isLiked ? 'favorite' : 'favorite_border'} */}
          </span>
          {isLiked ? 'Liked' : 'Like'} • {murmur.likeCount}
        </button>

        {currentUserId === murmur.user?.id && (
          <>
            <button
              onClick={() => setShowConfirm(true)}
              className="text-gray-500 hover:text-red-500"
              disabled={deleteMutation.isPending}
            >
              <span className="material-icons">delete</span>
            </button>
          </>
        )}
      </div>

      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-lg">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-dark dark:text-white">Are you sure you want to delete this murmur?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-dark dark:text-white rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MurmurCard;
