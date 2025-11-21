import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminOrders, updateOrderStatus } from '../../services/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAdminOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert('Order status updated successfully!');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
    };
    return icons[status] || '📋';
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      (order.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shipping_address || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: '#FFB6C1' }}></div>
          <p className="text-gray-700 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      {/* Header with Kadi Thrift Theme */}
      <div className="bg-white border-b-4 shadow-md" style={{ borderColor: '#E85D45' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#E85D45' }}>
            📦 Order Management
          </h1>
          <p className="text-gray-600">Manage customer orders and track deliveries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 hover:shadow-xl transition-shadow" style={{ borderColor: '#C19A6B' }}>
            <p className="text-sm text-gray-600 font-semibold">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-400 hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 font-semibold">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-400 hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 font-semibold">Processing</p>
            <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-400 hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 font-semibold">Shipped</p>
            <p className="text-3xl font-bold text-purple-600">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-400 hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 font-semibold">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-400 hover:shadow-xl transition-shadow">
            <p className="text-sm text-gray-600 font-semibold">Cancelled</p>
            <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2" style={{ borderColor: '#C19A6B' }}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#E85D45' }}>
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by order ID, customer, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: '#C19A6B' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#E85D45' }}>
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: '#C19A6B' }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 font-medium">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2" style={{ borderColor: '#C19A6B' }}>
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg font-semibold">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 hover:shadow-2xl transition-all" style={{ borderColor: '#C19A6B' }}>
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: '#E85D45' }}>
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Customer: <span className="font-semibold">{order.user?.username || 'N/A'}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(order.created_at).toLocaleDateString('en-KE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                        <span>{getStatusIcon(order.status)}</span>
                        <span className="capitalize">{order.status}</span>
                      </span>
                      <p className="text-3xl font-bold" style={{ color: '#E85D45' }}>
                        KES {parseFloat(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-4 p-4 rounded-lg" style={{ backgroundColor: '#F5F5DC' }}>
                    <div>
                      <h4 className="font-bold mb-2" style={{ color: '#E85D45' }}>📍 Shipping Address</h4>
                      <p className="text-sm text-gray-700">{order.shipping_address}</p>
                      <p className="text-sm text-gray-700">{order.shipping_city}, {order.shipping_postal_code}</p>
                      <p className="text-sm text-gray-700">{order.shipping_country}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2" style={{ color: '#E85D45' }}>📞 Contact</h4>
                      <p className="text-sm text-gray-700">Phone: {order.phone_number}</p>
                      {order.whatsapp_number && (
                        <p className="text-sm text-gray-700">WhatsApp: {order.whatsapp_number}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-bold mb-3" style={{ color: '#E85D45' }}>
                      📦 Items ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {order.items && order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border-2" style={{ borderColor: '#C19A6B' }}>
                          {item.product?.image ? (
                            <img
                              src={item.product.image.replace('http://localhost:8000', 'http://127.0.0.1:8000')}
                              alt={item.product?.name || 'Product'}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No img</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.product?.name || 'Product'}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            {item.product?.size && (
                              <p className="text-sm text-gray-600">Size: {item.product.size.toUpperCase()}</p>
                            )}
                          </div>
                          <p className="font-bold" style={{ color: '#E85D45' }}>
                            KES {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t-2" style={{ borderColor: '#C19A6B' }}>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'processing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        ➡️ Mark as Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                      >
                        🚚 Mark as Shipped
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        ✅ Mark as Delivered
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-4 py-2 rounded-lg font-semibold transition-colors border-2 border-black text-white"
                      style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
                    >
                      👁️ View Details
                    </Link>
                    <a
                      href={`https://wa.me/${order.phone_number?.replace(/[^0-9]/g, '')}?text=Hi!%20This%20is%20Kadi%20Thrift.%20Your%20order%20%23${order.id}%20update...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                    >
                      💬 WhatsApp Customer
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 font-semibold hover:underline"
            style={{ color: '#E85D45' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;