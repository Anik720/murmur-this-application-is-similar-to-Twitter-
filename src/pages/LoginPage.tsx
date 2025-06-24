import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify'; // Replace vite-toast
import { authService } from '../features/auth/authService';
import { AuthCredentials } from '../features/auth/types';
import { useAuthStore } from '../store/AuthStore';

function LoginPage() {
  const [form, setForm] = useState<any>({ email: '', password: '' });

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', JSON.stringify(data?.access_token));
      localStorage.setItem('user_info', JSON.stringify(data?.user));
      setAuth(data.access_token, data.user);
      toast.success('Logged in successfully!'); // Use react-toastify
      navigate('/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-dark mb-1">Email</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-dark mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;