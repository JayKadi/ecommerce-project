import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkAdmin } from '../services/adminApi';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (isAuthenticated) {
        try {
          const response = await checkAdmin();
          setIsAdmin(response.data.is_admin);
        } catch (error) {
          console.error('Admin check failed:', error);
          setIsAdmin(false);
        }
      }
      setChecking(false);
    };

    if (!loading) {
      verifyAdmin();
    }
  }, [isAuthenticated, loading]);

  if (loading || checking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin === false) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedAdminRoute;