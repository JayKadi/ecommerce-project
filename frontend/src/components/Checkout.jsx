import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, getDeliveryZones } from '../services/api';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  
  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_country: 'Kenya',
    phone_number: '',
    whatsapp_number: '',
  });

  useEffect(() => {
    if (user) {
      fetchDeliveryZones();
    }
  }, [user]);

  const fetchDeliveryZones = async () => {
    try {
      const response = await getDeliveryZones();
      setDeliveryZones(response.data);
    } catch (error) {
      console.error('Error fetching delivery zones:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'shipping_city') {
      const zone = deliveryZones.find(z => z.city === value);
      setSelectedZone(zone || null);
    }
  };

  const getSubtotal = () => {
    return getCartTotal();
  };

  const getDeliveryFee = () => {
    return selectedZone ? parseFloat(selectedZone.delivery_fee) : 0;
  };

  const getTotalWithDelivery = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: getTotalWithDelivery()
      };

      console.log('Submitting order:', orderData);

      const response = await createOrder(orderData);
      
      console.log('Order created:', response.data);

      // Redirect to Pesapal payment page
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        setError('Payment URL not received. Please contact support.');
      }
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.error || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Empty cart check
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Login required check
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold mb-4">Almost there!</h2>
            <p className="text-gray-600 mb-2">
              Please login or create an account to complete your purchase.
            </p>
            <p className="text-sm text-gray-500">
              Your cart items are saved and will be here when you return!
            </p>
          </div>
          
          {/* Cart Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Your Cart ({cartItems.length} items)</h3>
            <div className="space-y-2">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>KES {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {cartItems.length > 3 && (
                <p className="text-xs text-gray-500">...and {cartItems.length - 3} more items</p>
              )}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-green-600">KES {getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login', { state: { from: '/checkout' } })}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
            >
              Login to Existing Account
            </button>
            
            <button
              onClick={() => navigate('/register', { state: { from: '/checkout' } })}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
            >
              Create New Account (Free)
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              ← Continue Shopping
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              ✨ Why create an account?
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Track your orders in real-time</li>
              <li>• Faster checkout next time</li>
              <li>• Access order history</li>
              <li>• Get exclusive deals & updates</li>
              <li>• Save favorite items</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout form (for logged-in users)
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Shipping Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (M-Pesa) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="0712345678"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: 0712345678</p>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="0712345678"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">We'll contact you here for delivery coordination</p>
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery City <span className="text-red-500">*</span>
                </label>
                <select
                  name="shipping_city"
                  value={formData.shipping_city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select your city</option>
                  {deliveryZones.map((zone) => (
                    <option key={zone.city} value={zone.city}>
                      {zone.city} - KES {zone.delivery_fee} ({zone.estimated_days} days)
                    </option>
                  ))}
                </select>
                {selectedZone && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Delivery fee: KES {selectedZone.delivery_fee} | 
                    Estimated: {selectedZone.estimated_days} business days
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specific Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Building name, street, landmark, etc."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Postal Code and Country */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={handleChange}
                    placeholder="00100"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipping_country"
                    value={formData.shipping_country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedZone}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:bg-gray-400 mt-6"
              >
                {loading ? 'Processing...' : `💳 Pay KES ${getTotalWithDelivery().toFixed(2)} with M-Pesa`}
              </button>

              {!selectedZone && formData.shipping_city === '' && (
                <p className="text-sm text-gray-500 text-center">Please select a delivery city</p>
              )}
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image?.replace('http://localhost:8000', 'http://127.0.0.1:8000')}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-green-600">
                      KES {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>KES {getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                {selectedZone ? (
                  <span className="text-blue-600 font-semibold">
                    KES {getDeliveryFee().toFixed(2)}
                  </span>
                ) : (
                  <span className="text-gray-400">Select city</span>
                )}
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-green-600">KES {getTotalWithDelivery().toFixed(2)}</span>
              </div>
            </div>

            {/* Payment & Delivery Info */}
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-1">
                  💳 Payment Method
                </p>
                <p className="text-xs text-blue-700">
                  M-Pesa STK push to your phone
                </p>
              </div>

              {selectedZone && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold mb-1">
                    📦 Delivery
                  </p>
                  <p className="text-xs text-green-700">
                    Expected in {selectedZone.estimated_days} business days to {formData.shipping_city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;