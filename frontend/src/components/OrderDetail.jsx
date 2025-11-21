import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrder } from '../services/api';

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
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

  const getStatusSteps = () => {
    const allSteps = [
      { key: 'pending', label: 'Order Placed', icon: '📋' },
      { key: 'processing', label: 'Processing', icon: '⚙️' },
      { key: 'shipped', label: 'Shipped', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '✅' },
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status);

    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    if (paymentStatus === 'completed') {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border-2 border-green-300">
          ✅ Payment Completed
        </span>
      );
    } else if (paymentStatus === 'pending') {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
          ⏳ Payment Pending
        </span>
      );
    } else {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border-2 border-red-300">
          ❌ Payment Failed
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: '#FFB6C1' }}></div>
          <p className="text-gray-700 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border-2" style={{ borderColor: '#E85D45' }}>
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#E85D45' }}>Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This order does not exist or you do not have access to it.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 text-white rounded-lg font-semibold transition-all border-2 border-black"
            style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      {/* Header */}
      <div className="bg-white border-b-4 shadow-md" style={{ borderColor: '#E85D45' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#E85D45' }}>
                Order #{order.id}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {getPaymentStatusBadge(order.payment_status)}
              <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#E85D45' }}>
                  Order Status
                </h2>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${(statusSteps.filter(s => s.completed).length - 1) * 33.33}%`,
                        background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)'
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative grid grid-cols-4 gap-2">
                    {statusSteps.map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-4 transition-all ${
                            step.completed 
                              ? 'border-white shadow-lg' 
                              : 'bg-gray-200 border-gray-300'
                          }`}
                          style={step.completed ? { 
                            background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)'
                          } : {}}
                        >
                          {step.icon}
                        </div>
                        <p className={`text-xs font-semibold mt-2 text-center ${
                          step.completed ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {step.current && (
                          <p className="text-xs text-gray-500 mt-1">Current</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {order.estimated_delivery_days && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-blue-800">
                      <span className="font-bold">📅 Estimated Delivery:</span> {order.estimated_delivery_days} business days
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Items Ordered */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#E85D45' }}>
                Items Ordered
              </h2>

              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product?.image?.replace('http://localhost:8000', 'http://127.0.0.1:8000')}
                        alt={item.product?.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {item.product?.name || 'Product'}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-600 mb-2">
                        {item.product?.size && (
                          <span>Size: <span className="font-semibold">{item.product.size.toUpperCase()}</span></span>
                        )}
                        <span>Qty: <span className="font-semibold">{item.quantity}</span></span>
                      </div>
                      <p className="text-xl font-bold" style={{ color: '#E85D45' }}>
                        KES {parseFloat(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#E85D45' }}>
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-800">Shipping Address</p>
                    <p className="text-gray-600">{order.shipping_address}</p>
                    <p className="text-gray-600">{order.shipping_city}, {order.shipping_country}</p>
                    {order.shipping_postal_code && (
                      <p className="text-gray-600">{order.shipping_postal_code}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold text-gray-800">Contact Number</p>
                    <p className="text-gray-600">{order.phone_number}</p>
                  </div>
                </div>

                {order.whatsapp_number && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-semibold text-gray-800">WhatsApp</p>
                      <p className="text-gray-600">{order.whatsapp_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#E85D45' }}>
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KES {(parseFloat(order.total_amount) - parseFloat(order.delivery_fee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>KES {parseFloat(order.delivery_fee || 0).toFixed(2)}</span>
                </div>
                <div className="border-t-2 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span style={{ color: '#E85D45' }}>KES {parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {order.payment_method && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Payment Method:</span> {order.payment_method}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 space-y-3">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#E85D45' }}>
                Actions
              </h2>

              <a
                href={`https://wa.me/254705807643?text=Hi!%20I%20need%20help%20with%20Order%20%23${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contact Support
              </a>

              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-semibold transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E85D45', color: '#E85D45' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>

              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg font-semibold transition-all border-2 border-black"
                style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
              >
                Continue Shopping 🐆
              </Link>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2" style={{ borderColor: '#FFB6C1' }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#E85D45' }}>
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Our customer support team is here for you!
              </p>
              <p className="text-xs text-gray-500">
                📧 Email: support@kadithrift.com<br/>
                📱 WhatsApp: +254 705 807 643<br/>
                ⏰ Mon-Sat: 9AM - 6PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;