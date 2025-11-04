import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SideLoginPrompt() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isAuthenticated } = useAuth();

  // Don't show if authenticated or dismissed
  if (isAuthenticated || isDismissed) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white px-3 py-8 rounded-r-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center"
        >
          <span className="text-sm font-semibold writing-vertical-lr">Login</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30">
      <div className="bg-white rounded-r-2xl shadow-2xl w-72 p-6 border-l-4 border-blue-600">
        {/* Close and Minimize Buttons */}
        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600"
            title="Minimize"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Icon */}
        <div className="text-center mb-4">
          <div className="inline-block bg-blue-100 rounded-full p-3 mb-3">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Welcome to ShopHub!
          </h3>
          <p className="text-sm text-gray-600">
            Login for exclusive deals and faster checkout
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center text-sm"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="block w-full bg-white border-2 border-blue-600 text-blue-600 py-2.5 px-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center text-sm"
          >
            Register
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-4 pt-4 border-t">
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Track orders easily
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Get exclusive offers
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Faster checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideLoginPrompt;