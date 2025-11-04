import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await getOrder(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
        <div className="mb-6">
          <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase</p>
        <p className="text-lg">Order Number: <span className="font-bold">#{order.id}</span></p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-700">{order.shipping_address}</p>
            <p className="text-gray-700">{order.shipping_city}, {order.shipping_postal_code}</p>
            <p className="text-gray-700">{order.shipping_country}</p>
            <p className="text-gray-700 mt-2">Phone: {order.phone_number}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Order Information</h3>
            <p className="text-gray-700">Status: <span className="capitalize font-semibold text-blue-600">{order.status}</span></p>
            <p className="text-gray-700">Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="text-gray-700">Total: <span className="font-bold text-green-600">${order.total_amount}</span></p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Items Ordered</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 border rounded">
              {item.product_image && (
                <img
                  src={`http://127.0.0.1:8000${item.product_image}`}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-grow">
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-x-4">
        <Link
          to="/orders"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Orders
        </Link>
        <Link
          to="/"
          className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;