import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { authService } from '../features/auth/authService';
import { useAuthStore } from '../store/AuthStore';

function RegisterPage() {
  const [form, setForm] = useState<any>({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      const { access_token, user } = data;

      // Save to Zustand store
      setAuth(access_token, user);

      // Save to localStorage
      localStorage.setItem('access_token', JSON.stringify(access_token));
      localStorage.setItem('user_info', JSON.stringify(user));

      toast.success('Registered successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;

      // Handle string or array of messages
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Registration failed');
      }
    },

  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-dark mb-1">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-dark mb-1">Email</label>
          <input
            type="email"
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
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
