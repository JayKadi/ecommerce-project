import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const merchantRef = searchParams.get('OrderMerchantReference');

    if (!orderTrackingId) {
      setStatus('error');
      setMessage('Invalid payment callback. Missing tracking ID.');
      return;
    }

    try {
      // Extract order ID from merchant reference (format: KT-{order_id}-{timestamp})
      const orderId = merchantRef?.split('-')[1];

      if (!orderId) {
        setStatus('error');
        setMessage('Invalid order reference.');
        return;
      }

      // Verify payment with backend
      const response = await api.get(`/orders/${orderId}/verify-payment/`);

      if (response.data.order.payment_status === 'completed') {
        setStatus('success');
        setMessage('Payment successful! Your order has been confirmed.');
        
        // Clear cart
        clearCart();

        // Redirect to order confirmation after 2 seconds
        setTimeout(() => {
          navigate(`/order-confirmation/${orderId}`);
        }, 2000);
      } else {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support if money was deducted.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage('Error verifying payment. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to order confirmation...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Return to Home
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-orange-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentCallback;