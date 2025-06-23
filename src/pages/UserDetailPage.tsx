import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query'; // Import keepPreviousData
import MurmurCard from '../components/MurmurCard';
import UserProfile from '../components/UserProfile';
import { userService } from '../features/user/userService';
import { usePagination } from '../hooks/usePagination';
import { PaginatedResponse, Murmur, User } from '../types';
import { PAGE_SIZE } from '../lib/constants';
import { useAuthStore } from '../store/AuthStore';

function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();
  const { page, nextPage, prevPage, pageSize } = usePagination(1, PAGE_SIZE);

  const { data: user, isLoading: userLoading } = useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id!),
  });

  const { data: murmurs, isLoading: murmursLoading } = useQuery<PaginatedResponse<Murmur>, Error>({
    queryKey: ['userMurmurs', id, page],
    queryFn: () => userService.getUserMurmurs(id!, page, pageSize),
    placeholderData: keepPreviousData, // Replace keepPreviousData
  });

  if (userLoading) return <div className="text-center">Loading...</div>;
  if (!user) return <div className="text-center text-red-500">User not found</div>;

  const isOwnProfile = currentUser?.id === user.id;

  console.log('murmurs', murmurs);
  console.log('isOwnProfile', user);

  return (
    <div>
      <UserProfile user={user} isOwnProfile={isOwnProfile} />
      {murmursLoading ? (
        <div className="text-center">Loading murmurs...</div>
      ) : (
        <>
          {murmurs?.data.map((murmur) => (
            <MurmurCard key={murmur.id} murmur={murmur} />
          ))}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={page * pageSize >= (murmurs?.total || 0)}
              className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDetailPage;