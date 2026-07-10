import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-champagne border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated && user?.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
