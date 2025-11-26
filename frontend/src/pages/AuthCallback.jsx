import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL query parameter
      const token = searchParams.get('token');
      
      if (token) {
        // Save token
        localStorage.setItem('token', token);
        
        // Fetch user data
        try {
          const response = await api.get('/auth/user/');
          setUser(response.data);
          setIsAuthenticated(true);
          
          // Get redirect path or default to home
          const redirectTo = sessionStorage.getItem('redirect_after_login') || '/';
          sessionStorage.removeItem('redirect_after_login');
          
          navigate(redirectTo);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          navigate('/login');
        }
      } else {
        // No token, login failed
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setIsAuthenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}

export default AuthCallback;