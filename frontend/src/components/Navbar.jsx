import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const cartCount = getCartCount();
  const location = useLocation();
  
  // Check if on dashboard
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4" style={{ borderColor: '#E85D45' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div 
                className="absolute -inset-1 rounded-full transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 50%, #C19A6B 100%)'
                }}
              />
              <div className="absolute -inset-0.5 bg-white rounded-full" />
              <img 
                src="/logo.jpeg"
                alt="Kadi Thrift" 
                className="relative h-14 w-14 md:h-16 md:w-16 rounded-full object-cover transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Show these links only when NOT on dashboard */}
            {!isDashboard && (
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-pink-600 font-semibold transition-colors relative group"
                >
                  Products
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" 
                        style={{ backgroundColor: '#FFB6C1' }}></span>
                </Link>

                {isAuthenticated && (
                  <Link 
                    to="/orders" 
                    className="text-gray-700 hover:text-pink-600 font-semibold transition-colors relative group"
                  >
                    Orders
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" 
                          style={{ backgroundColor: '#FFB6C1' }}></span>
                  </Link>
                )}
              </>
            )}

            {/* Dashboard Link - Show only when logged in and NOT on dashboard */}
            {isAuthenticated && !isDashboard && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-pink-600 font-semibold transition-colors relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" 
                      style={{ backgroundColor: '#FFB6C1' }}></span>
              </Link>
            )}

            {/* Admin Link - Only for Admin Users */}
            {isAuthenticated && user?.is_staff && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 border-2"
                style={{ 
                  background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)',
                  color: '#fff',
                  borderColor: '#000'
                }}
              >
                <span>⚙️</span>
                <span>Admin</span>
              </Link>
            )}
            
            {/* Cart Link - Always visible */}
            <Link 
              to="/cart" 
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 border-2"
              style={{
                backgroundColor: '#FFB6C1',
                color: '#000',
                borderColor: '#E85D45'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span>Cart</span>
              {cartCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse border-2 border-white"
                  style={{ backgroundColor: '#E85D45' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md"
                    style={{ backgroundColor: '#E85D45' }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium hidden md:block">
                    <span className="text-sm text-gray-500">Hi, </span>
                    <span className="font-bold" style={{ color: '#E85D45' }}>
                      {user?.username}
                    </span>
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold border-2"
                  style={{ borderColor: '#E85D45' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 font-semibold transition-colors hover:underline"
                  style={{ color: '#E85D45' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md border-2 border-black"
                  style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;