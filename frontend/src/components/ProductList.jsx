import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      new: 'bg-pink-100 text-pink-800 border-pink-300',
      like_new: 'bg-orange-100 text-orange-800 border-orange-300',
      good: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      fair: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[condition] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getConditionLabel = (condition) => {
    const labels = {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair',
    };
    return labels[condition] || condition;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: '#FFB6C1' }}></div>
          <p className="text-gray-700 font-medium">Loading Kadi Thrift...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      {/* Hero Section with Leopard Print Overlay */}
      <div className="relative overflow-hidden">
        {/* Leopard Print Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, transparent 12%, #000 13%, #000 17%, transparent 18%),
                             radial-gradient(circle at 80% 50%, transparent 12%, #000 13%, #000 17%, transparent 18%),
                             radial-gradient(circle at 50% 80%, transparent 12%, #000 13%, #000 17%, transparent 18%),
                             radial-gradient(circle at 50% 20%, transparent 12%, #000 13%, #000 17%, transparent 18%)`,
            backgroundColor: '#C19A6B',
            backgroundSize: '80px 80px',
          }}
        />
        
        <div className="relative" style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 50%, #C19A6B 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            {/* Logo Text */}
            <div className="mb-6">
              <h1 
                className="text-6xl md:text-7xl font-bold mb-2"
                style={{
                  color: '#FFB6C1',
                  textShadow: '3px 3px 0px #E85D45, 6px 6px 0px rgba(0,0,0,0.2)',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '2px'
                }}
              >
                Kadi
              </h1>
              <h2 
                className="text-6xl md:text-7xl font-bold"
                style={{
                  color: '#FFB6C1',
                  textShadow: '3px 3px 0px #E85D45, 6px 6px 0px rgba(0,0,0,0.2)',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '2px'
                }}
              >
                Thrift
              </h2>
            </div>
            
            <p className="text-xl md:text-2xl mb-2 text-white font-semibold drop-shadow-lg">
              🐆 Wild About Fashion 🐆
            </p>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
              Discover unique, pre-loved pieces with fierce style
            </p>
            
            {/* Stats Bar */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border-2" style={{ borderColor: '#FFB6C1' }}>
                <div className="text-3xl font-bold text-white">{products.length}</div>
                <div className="text-sm text-white/90">Unique Pieces</div>
              </div>
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border-2" style={{ borderColor: '#FFB6C1' }}>
                <div className="text-3xl font-bold text-white">💯</div>
                <div className="text-sm text-white/90">Quality Checked</div>
              </div>
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border-2" style={{ borderColor: '#FFB6C1' }}>
                <div className="text-3xl font-bold text-white">🚚</div>
                <div className="text-sm text-white/90">Fast Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold" style={{ color: '#E85D45' }}>
              Shop The Collection
            </h2>
            <div className="h-1 w-24 mt-2 rounded" style={{ backgroundColor: '#FFB6C1' }}></div>
          </div>
          <div className="text-sm px-4 py-2 rounded-full" style={{ backgroundColor: '#FFB6C1', color: '#000' }}>
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-xl text-gray-700 font-medium mb-2">No products available yet</p>
            <p className="text-gray-500">Check back soon for amazing finds!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-300">
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-square bg-gray-100">
                    <img
                      src={product.image?.replace('http://localhost:8000', 'http://127.0.0.1:8000')}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                    
                    {/* Leopard Print Border Overlay on Hover */}
                    <div className="absolute inset-0 border-8 border-transparent group-hover:border-opacity-50 transition-all duration-300 pointer-events-none" 
                         style={{ 
                           borderImage: 'repeating-linear-gradient(45deg, #C19A6B, #C19A6B 10px, #000 10px, #000 20px) 8',
                           opacity: 0 
                         }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.condition && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 ${getConditionColor(product.condition)}`}>
                          {getConditionLabel(product.condition)}
                        </span>
                      )}
                      {product.stock <= 2 && product.stock > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg animate-pulse border-2" 
                              style={{ backgroundColor: '#E85D45', borderColor: '#FFB6C1' }}>
                          Only {product.stock} left!
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white shadow-lg border-2" 
                              style={{ borderColor: '#FFB6C1' }}>
                          SOLD OUT
                        </span>
                      )}
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        View Details →
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Category */}
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" 
                         style={{ color: '#E85D45' }}>
                      {product.category}
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 text-lg group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-2xl font-bold" style={{ color: '#E85D45' }}>
                          KES {product.price}
                        </span>
                      </div>
                      
                      {product.stock > 0 ? (
                        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#C19A6B' }}>
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C19A6B' }}></span>
                          In Stock
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Sold Out
                        </div>
                      )}
                    </div>

                    {/* Size if available */}
                    {product.size && (
                      <div className="text-xs text-gray-600 font-medium">
                        Size: <span className="font-bold" style={{ color: '#E85D45' }}>
                          {product.size.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover CTA Button */}
                  <div className="px-5 pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      className="w-full py-3 text-white rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all border-2 border-black"
                      style={{ 
                        background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)'
                      }}
                    >
                      Quick View 🐆
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Trust Section with Leopard Accents */}
      <div className="bg-white border-t-4 py-16" style={{ borderColor: '#E85D45' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: '#E85D45' }}>
            Why Shop Kadi Thrift?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">✨</div>
              <div className="font-bold text-gray-800 mb-1">Quality Assured</div>
              <div className="text-sm text-gray-600">Hand-picked pieces</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">🚚</div>
              <div className="font-bold text-gray-800 mb-1">Fast Delivery</div>
              <div className="text-sm text-gray-600">Nationwide shipping</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">💳</div>
              <div className="font-bold text-gray-800 mb-1">Secure Payment</div>
              <div className="text-sm text-gray-600">M-Pesa & more</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">💬</div>
              <div className="font-bold text-gray-800 mb-1">24/7 Support</div>
              <div className="text-sm text-gray-600">We're here for you</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center py-12">
        <p className="text-xl font-semibold mb-4" style={{ color: '#E85D45' }}>
          🐆 Unleash Your Wild Side with Kadi Thrift 🐆
        </p>
        <p className="text-gray-600">Follow us on Instagram & TikTok for daily drops!</p>
      </div>

      {/* Floating WhatsApp Button - Leopard Theme */}
      <a
        href="https://wa.me/254705807643?text=Hi%20Kadi%20Thrift!%20I%27m%20interested%20in%20your%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Pulsing Ring Animation - Pink */}
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: '#FFB6C1' }}
          ></div>
          
          {/* Button with Gradient */}
          <div 
            className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 border-4 border-white"
            style={{ 
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
            }}
          >
            <svg 
              className="w-9 h-9 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>

          {/* Tooltip on Hover */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div 
              className="text-white text-sm font-bold px-4 py-2 rounded-lg shadow-xl whitespace-nowrap border-2"
              style={{ 
                background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)',
                borderColor: '#000'
              }}
            >
              Chat with Kadi Thrift! 🐆
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8"
                style={{ borderLeftColor: '#FFB6C1' }}
              ></div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default ProductList;