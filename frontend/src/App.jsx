import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import Orders from './components/Orders';
import LoginPromptModal from './components/LoginPromptModal';
import SideLoginPrompt from './components/SideLoginPrompt';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';
import PaymentCallback from './components/PaymentCallback';
import UserDashboard from './components/UserDashboard';

// Admin components
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <LoginPromptModal />
        <SideLoginPrompt />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdminRoute>
                <AdminProducts />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedAdminRoute>
                <AdminOrders />
              </ProtectedAdminRoute>
            }
          />
          <Route
  path="/admin/products/new"
  element={
    <ProtectedAdminRoute>
      <AddProduct />
    </ProtectedAdminRoute>
  }
/>
<Route
  path="/admin/products/:id/edit"
  element={
    <ProtectedAdminRoute>
      <EditProduct />
    </ProtectedAdminRoute>
  }
/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;