// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import TimelinePage from '../pages/TimelinePage';
import MurmurDetailPage from '../pages/MurmurDetailPage';
import UserDetailPage from '../pages/UserDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute'; // ✅ import

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <TimelinePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/murmurs/:id',
        element: (
          <ProtectedRoute>
            <MurmurDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/users/:id',
        element: (
          <ProtectedRoute>
            <UserDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
]);

export const Routes = () => <RouterProvider router={router} />;
