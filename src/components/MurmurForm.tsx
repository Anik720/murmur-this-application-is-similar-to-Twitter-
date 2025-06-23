import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { murmurService } from '../features/murmur/murmurService'; // ✅ now valid

function MurmurForm() {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

const mutation :any = useMutation({
  mutationFn: murmurService.createMurmur,
  onSuccess: (newMurmur) => {
    queryClient.setQueryData(['timeline', 1], (old: any) => {
      if (!old) return { murmurs: [newMurmur], total: 1 };

      return {
        ...old,
        murmurs: [newMurmur, ...old.murmurs],
        total: old.total + 1,
      };
    });

    setText('');
    toast.success('Murmur posted!');
  },
  onError: () => {
    toast.error('Failed to post murmur');
  },
});


  const handleSubmit = (e: React.FormEvent) => {
    console.log('Submitting:', text);
    e.preventDefault();
    if (text.trim()) {
      mutation.mutate({ content: text }); // ✅ correct
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's murmuring?"
        className="w-full p-2 border rounded resize-none"
        rows={3}
        maxLength={280}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600"
          disabled={mutation.isPending || !text.trim()}
        >
          {mutation.isPending ? 'Posting...' : 'Murmur'}
        </button>
      </div>
    </form>
  );
}

export default MurmurForm;
