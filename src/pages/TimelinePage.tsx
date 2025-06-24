import { useQuery } from '@tanstack/react-query';
import MurmurCard from '../components/MurmurCard';
import MurmurForm from '../components/MurmurForm';
import { murmurService } from '../features/murmur/murmurService';

import { usePagination } from '../hooks/usePagination';
import { PAGE_SIZE } from '../lib/constants';
import { useAuthStore } from '../store/AuthStore';

function TimelinePage() {
  const { user } = useAuthStore();
  const { page, nextPage, prevPage, pageSize } = usePagination(1, PAGE_SIZE);

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ['timeline', page],
    queryFn: () => murmurService.getTimeline(page, pageSize),
    refetchOnMount: true,          // Always refetch when this component mounts
    refetchOnWindowFocus: true,    // Refetch if user switches back to the tab
  });

  if (isError) return <div className="text-center text-red-500">Error loading timeline</div>;

  return (
    <div>
      {(user || JSON.parse(localStorage.getItem('access_token') as string) !== null) && <MurmurForm />}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {data?.murmurs?.length ? (
            data.murmurs.map((murmur) => <MurmurCard key={murmur.id} murmur={murmur} />)
          ) : (
            <p className="text-center text-gray-500">No murmurs found.</p>
          )}
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
              disabled={page * pageSize >= (data?.total || 0)}
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

export default TimelinePage;
