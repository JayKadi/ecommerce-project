import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/api';

function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getUserOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      processing: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
    };
    return emojis[status] || '📋';
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    if (paymentStatus === 'completed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border-2 border-green-300">
          ✅ Paid
        </span>
      );
    } else if (paymentStatus === 'pending') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
          ⏳ Pending Payment
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border-2 border-red-300">
          ❌ Failed
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section with Leopard Pattern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-stone-900 to-black">
        {/* Leopard Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, transparent 8%, #C19A6B 9%, #C19A6B 12%, transparent 13%),
                             radial-gradient(circle at 80% 20%, transparent 8%, #C19A6B 9%, #C19A6B 12%, transparent 13%),
                             radial-gradient(circle at 40% 70%, transparent 8%, #C19A6B 9%, #C19A6B 12%, transparent 13%)`,
            backgroundSize: '100px 100px',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-3xl shadow-xl border-4 border-white"
              style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            
            {/* Welcome Text */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Welcome back, {user?.first_name || user?.username}! 🐆
              </h1>
              <p className="text-amber-200">
                Ready to find your next fierce look?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-stone-200 hover:border-amber-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm font-semibold mb-1">Total Orders</p>
                <p className="text-4xl font-bold text-stone-900">{orders.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-stone-200 hover:border-amber-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm font-semibold mb-1">Delivered</p>
                <p className="text-4xl font-bold text-stone-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-stone-200 hover:border-amber-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm font-semibold mb-1">In Progress</p>
                <p className="text-4xl font-bold text-stone-900">
                  {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-3xl">🚚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-stone-200">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-amber-200 hover:border-amber-700 hover:bg-amber-50 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛍️</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">Shop Now</span>
            </Link>

            <Link
              to="/orders"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-blue-200 hover:border-blue-700 hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📦</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">Track Orders</span>
            </Link>

            <Link
              to="/cart"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-pink-200 hover:border-pink-700 hover:bg-pink-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                   style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}>
                <span className="text-2xl">🛒</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">View Cart</span>
            </Link>

            <a
              href="https://wa.me/254705807643?text=Hi%20Kadi%20Thrift!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-green-200 hover:border-green-700 hover:bg-green-50 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">Contact Us</span>
            </a>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900">Recent Orders</h2>
            <Link 
              to="/orders"
              className="text-sm font-semibold hover:underline"
              style={{ color: '#E85D45' }}
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-700 mx-auto mb-4"></div>
              <p className="text-stone-600">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-xl text-stone-700 font-semibold mb-2">No orders yet</p>
              <p className="text-stone-500 mb-6">Start shopping for unique finds!</p>
              <Link
                to="/"
                className="inline-block px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform border-2 border-black"
                style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
              >
                Shop Now 🐆
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div 
                  key={order.id}
                  className="border-2 border-stone-200 rounded-xl p-4 hover:border-amber-700 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getStatusEmoji(order.status)}</span>
                        <div>
                          <p className="font-bold text-stone-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-stone-600">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                    </div>

                    {/* Order Total & Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-stone-600">Total</p>
                        <p className="text-2xl font-bold text-amber-800">
                          KES {parseFloat(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <Link
                        to={`/orders/${order.id}`}
                        className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 font-semibold transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="mt-8 bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl shadow-lg p-6 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Account Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-stone-600 font-semibold mb-1">Full Name</p>
              <p className="text-lg text-stone-900">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-600 font-semibold mb-1">Username</p>
              <p className="text-lg text-stone-900">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600 font-semibold mb-1">Email</p>
              <p className="text-lg text-stone-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600 font-semibold mb-1">Member Since</p>
              <p className="text-lg text-stone-900">
                {new Date(user?.date_joined).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;