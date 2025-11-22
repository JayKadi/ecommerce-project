import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function SideLoginPrompt() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/google/', {
        access_token: credentialResponse.credential,
      });
      const { key: token, user } = response.data;
      localStorage.setItem('token', token);
      
      setIsDismissed(true);
      window.location.reload();
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    alert('Google login failed. Please try again.');
  };

  // Don't show if authenticated or dismissed
  if (isAuthenticated || isDismissed) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => setIsMinimized(false)}
          className="text-white px-2 py-6 rounded-r-lg shadow-lg hover:scale-105 transition-all transform flex items-center border-2 border-black"
          style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
        >
          <span className="text-xs font-semibold writing-vertical-lr">Login</span>
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-20">
      <div 
        className="rounded-r-xl shadow-2xl w-64 p-4 border-l-4"
        style={{ 
          backgroundColor: '#F5F5DC',
          borderColor: '#E85D45'
        }}
      >
        {/* Close and Minimize Buttons */}
        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
            title="Minimize"
            style={{ color: '#E85D45' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
            title="Close"
            style={{ color: '#E85D45' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Logo/Brand */}
<div className="text-center mb-3">
  {/* YOUR LOGO IMAGE */}
  <div className="mb-2">
    <img 
      src="/logo.jpeg" 
      alt="Kadi Thrift Logo" 
      className="w-16 h-16 mx-auto rounded-full object-cover border-2 shadow-md"
      style={{ borderColor: '#E85D45' }}
    />
  </div>
  
  <h3 className="text-base font-bold mb-1" style={{ color: '#E85D45' }}>
    Join Us! 🐆
  </h3>
  <p className="text-xs text-gray-700">
    Login for exclusive deals
  </p>
</div>


        {/* Google Login Button */}
        <div className="mb-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="medium"
            text="continue_with"
            shape="rectangular"
            width="240"
          />
        </div>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: '#C19A6B' }}></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 text-gray-600" style={{ backgroundColor: '#F5F5DC' }}>Or</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <Link
            to="/login"
            className="block w-full text-white py-2 px-3 rounded-lg hover:scale-105 transition-all font-semibold text-center text-sm border-2 border-black shadow-md"
            style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full bg-white py-2 px-3 rounded-lg hover:scale-105 transition-all font-semibold text-center text-sm border-2 shadow-md"
            style={{ 
              borderColor: '#E85D45',
              color: '#E85D45'
            }}
          >
            Register
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: '#C19A6B' }}>
          <div className="space-y-1 text-xs text-gray-700">
            <div className="flex items-center">
              <span className="text-sm mr-2">✨</span>
              <span>Track orders</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">🎁</span>
              <span>Exclusive offers</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">⚡</span>
              <span>Faster checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideLoginPrompt;