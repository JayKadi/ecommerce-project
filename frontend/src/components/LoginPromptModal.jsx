import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPromptModal() {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Don't show if already authenticated
    if (isAuthenticated) {
      return;
    }

    // Check if user has dismissed the modal before
    const dismissed = localStorage.getItem('loginPromptDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const now = Date.now();
    
    // Show modal after 3 seconds if not dismissed in last 24 hours
    const oneDayInMs = 24 * 60 * 60 * 1000;
    if (!dismissed || (now - dismissedTime) > oneDayInMs) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds of browsing

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('loginPromptDismissed', Date.now().toString());
  };

  // Don't render if not visible or user is authenticated
  if (!isVisible || isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleDismiss}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-slide-up">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Login Prompt */}
            <div 
              className="p-8 text-white flex flex-col justify-center"
              style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
            >
              <div className="mb-6">
                <div className="w-20 h-20 mb-4 bg-white rounded-full flex items-center justify-center">
                  <img 
                    src="/logo.jpeg" 
                    alt="Kadi Thrift" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold mb-3">
                  Join Kadi Thrift! 🐆
                </h2>
                <p className="text-white text-opacity-90 text-lg mb-6">
                  Get personalized recommendations, track your orders, and enjoy exclusive deals.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3 flex-shrink-0 mt-1">✨</span>
                  <div>
                    <p className="font-semibold">Track Your Orders</p>
                    <p className="text-sm text-white text-opacity-80">Get real-time updates on your purchases</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 flex-shrink-0 mt-1">⚡</span>
                  <div>
                    <p className="font-semibold">Faster Checkout</p>
                    <p className="text-sm text-white text-opacity-80">Save your details for quick ordering</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 flex-shrink-0 mt-1">🎁</span>
                  <div>
                    <p className="font-semibold">Exclusive Deals</p>
                    <p className="text-sm text-white text-opacity-80">Get access to member-only offers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div 
              className="p-8 relative"
              style={{ backgroundColor: '#F5F5DC' }}
            >
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 transition-colors"
                style={{ color: '#E85D45' }}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col justify-center h-full space-y-4 max-w-sm mx-auto">
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{ color: '#E85D45' }}
                >
                  Get Started
                </h3>

                {/* Login Button */}
                <Link
                  to="/login"
                  onClick={handleDismiss}
                  className="w-full text-white py-3 px-6 rounded-lg transition-all font-semibold text-center shadow-lg hover:shadow-xl hover:scale-105 border-2 border-black"
                  style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
                >
                  Login to Your Account
                </Link>

                {/* Register Button */}
                <Link
                  to="/register"
                  onClick={handleDismiss}
                  className="w-full bg-white py-3 px-6 rounded-lg transition-all font-semibold text-center border-2 shadow-md hover:scale-105"
                  style={{ 
                    borderColor: '#E85D45',
                    color: '#E85D45'
                  }}
                >
                  Create New Account
                </Link>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: '#C19A6B' }}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className="px-2 text-gray-600"
                      style={{ backgroundColor: '#F5F5DC' }}
                    >
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleDismiss}
                    className="flex items-center justify-center px-4 py-2.5 bg-white rounded-lg transition-colors shadow-sm hover:shadow-md border-2"
                    style={{ borderColor: '#C19A6B' }}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Google</span>
                  </button>
                  <button 
                    onClick={handleDismiss}
                    className="flex items-center justify-center px-4 py-2.5 bg-white rounded-lg transition-colors shadow-sm hover:shadow-md border-2"
                    style={{ borderColor: '#C19A6B' }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                  </button>
                </div>

                <button
                  onClick={handleDismiss}
                  className="text-sm text-gray-600 hover:text-gray-800 text-center mt-4 underline"
                >
                  Continue browsing without account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default LoginPromptModal;