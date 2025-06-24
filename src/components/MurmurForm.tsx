import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { murmurService } from '../features/murmur/murmurService';

function MurmurForm() {
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);
  const queryClient = useQueryClient();

  const mutation: any = useMutation({
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
      setTouched(false);
      toast.success('Murmur posted!');
    },
    onError: () => {
      toast.error('Failed to post murmur');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (text.trim()) {
      mutation.mutate({ content: text });
    }
  };

  const isDisabled = mutation.isPending || !text.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md mb-6 transition-all"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        What's murmuring?
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="Share your thoughts..."
        className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        rows={4}
        maxLength={280}
      />

      {touched && !text.trim() && (
        <p className="text-sm text-red-500 mt-1">Murmur cannot be empty.</p>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isDisabled}
          className={`px-6 py-2 rounded-full text-white transition-colors font-medium ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-blue-600'
          }`}
        >
          {mutation.isPending ? 'Posting...' : 'Murmur'}
        </button>
      </div>
    </form>
  );
}

export default MurmurForm;
