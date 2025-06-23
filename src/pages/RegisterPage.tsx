import { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useMutation } from '@tanstack/react-query';
   import { toast } from 'react-toastify'; // Replace vite-toast
   import { authService } from '../features/auth/authService';
   import { RegisterCredentials } from '../features/auth/types';
import { useAuthStore } from '../store/AuthStore';

   function RegisterPage() {
     const [form, setForm] = useState<any>({ email: '', username: '', password: '' });
     const navigate = useNavigate();
     const { setAuth } = useAuthStore();

     const mutation = useMutation({
       mutationFn: authService.register,
       onSuccess: (data) => {
         setAuth(data.token, data.user);
         toast.success('Registered successfully!'); // Use react-toastify
         navigate('/');
       },
       onError: () => toast.error('Registration failed'), // Use react-toastify
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
             className="w-full bg-gray text-white p-2 rounded"
             disabled={mutation.isPending}
           >
             {mutation.isPending ? 'Registering...' : 'Register'}
           </button>
         </form>
       </div>
     );
   }

   export default RegisterPage;