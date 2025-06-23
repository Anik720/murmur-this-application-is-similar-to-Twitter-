import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MurmurCard from '../components/MurmurCard';
import { murmurService } from '../features/murmur/murmurService';

function MurmurDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['murmur', id],
    queryFn: () => murmurService.getMurmur(id!),
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError || !data) return <div className="text-center text-red-500">Murmur not found</div>;

  return <MurmurCard murmur={data} />;
}

export default MurmurDetailPage;