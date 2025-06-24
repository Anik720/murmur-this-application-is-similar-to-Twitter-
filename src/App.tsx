import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-lighter flex">
        <Sidebar />
        <div className="flex-1 ml-64"> {/* Offset for sidebar width */}
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Outlet />
          </main>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </QueryClientProvider>
  );
}

export default App;