import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import TimelinePage from '../pages/TimelinePage';
import MurmurDetailPage from '../pages/MurmurDetailPage';
import UserDetailPage from '../pages/UserDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <TimelinePage /> },
      { path: '/murmurs/:id', element: <MurmurDetailPage /> },
      { path: '/users/:id', element: <UserDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
]);

export const Routes = () => <RouterProvider router={router} />;