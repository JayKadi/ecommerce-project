import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'one_size'];
  const conditions = ['new', 'like_new', 'good', 'fair'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, selectedSizes, selectedConditions, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => selectedSizes.includes(product.size));
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(product => selectedConditions.includes(product.condition));
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleConditionToggle = (condition) => {
    setSelectedConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedConditions([]);
    setPriceRange({ min: 0, max: 10000 });
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedSizes.length > 0 || 
                          selectedConditions.length > 0 || priceRange.min > 0 || priceRange.max < 10000;

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

  const getSizeLabel = (size) => {
    const labels = {
      xs: 'XS', s: 'S', m: 'M', l: 'L', xl: 'XL', xxl: 'XXL',
      one_size: 'One Size', various: 'Various'
    };
    return labels[size] || size?.toUpperCase();
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

      {/* Search & Filter Bar */}
      <div className="bg-white border-b-4 sticky top-20 z-10 shadow-lg" style={{ borderColor: '#E85D45' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                  style={{ borderColor: '#C19A6B' }}
                />
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 rounded-xl focus:outline-none bg-white font-semibold"
              style={{ borderColor: '#C19A6B', color: '#E85D45' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-xl font-bold transition-all border-2 border-black flex items-center justify-center gap-2"
              style={{ 
                background: hasActiveFilters 
                  ? 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)'
                  : 'white',
                color: hasActiveFilters ? 'white' : '#000'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters {hasActiveFilters && `(${
                (selectedCategory !== 'all' ? 1 : 0) +
                selectedSizes.length +
                selectedConditions.length +
                (searchQuery ? 1 : 0)
              })`}
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-6 rounded-xl border-2" style={{ backgroundColor: '#F5F5DC', borderColor: '#C19A6B' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#E85D45' }}>Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{ borderColor: '#C19A6B' }}
                  >
                    <option value="all">All Categories</option>
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#E85D45' }}>Size</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold border-2 transition-all`}
                        style={{
                          backgroundColor: selectedSizes.includes(size) ? '#E85D45' : 'white',
                          color: selectedSizes.includes(size) ? 'white' : '#000',
                          borderColor: selectedSizes.includes(size) ? '#000' : '#C19A6B'
                        }}
                      >
                        {getSizeLabel(size)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#E85D45' }}>Condition</label>
                  <div className="space-y-2">
                    {conditions.map(condition => (
                      <label key={condition} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedConditions.includes(condition)}
                          onChange={() => handleConditionToggle(condition)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm font-medium">
                          {getConditionLabel(condition)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#E85D45' }}>
                    Price (KES {priceRange.min} - {priceRange.max})
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPriceRange({ min: 0, max: 500 })}
                        className="flex-1 px-2 py-1 text-xs rounded bg-white border-2"
                        style={{ borderColor: '#C19A6B' }}
                      >
                        Under 500
                      </button>
                      <button
                        onClick={() => setPriceRange({ min: 500, max: 1500 })}
                        className="flex-1 px-2 py-1 text-xs rounded bg-white border-2"
                        style={{ borderColor: '#C19A6B' }}
                      >
                        500-1500
                      </button>
                      <button
                        onClick={() => setPriceRange({ min: 1500, max: 10000 })}
                        className="flex-1 px-2 py-1 text-xs rounded bg-white border-2"
                        style={{ borderColor: '#C19A6B' }}
                      >
                        1500+
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 text-center">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold" style={{ color: '#E85D45' }}>
              {hasActiveFilters ? 'Filtered Results' : 'Shop The Collection'}
            </h2>
            <div className="h-1 w-24 mt-2 rounded" style={{ backgroundColor: '#FFB6C1' }}></div>
          </div>
          <div className="text-sm px-4 py-2 rounded-full" style={{ backgroundColor: '#FFB6C1', color: '#000' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-700 font-medium mb-2">No items found</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform border-2 border-black"
                style={{ background: 'linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%)' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-300">
                  <div className="relative overflow-hidden aspect-square bg-gray-100">
                    <img
                      src={product.image?.replace('http://localhost:8000', 'http://127.0.0.1:8000')}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                    
                    <div className="absolute inset-0 border-8 border-transparent group-hover:border-opacity-50 transition-all duration-300 pointer-events-none" 
                         style={{ 
                           borderImage: 'repeating-linear-gradient(45deg, #C19A6B, #C19A6B 10px, #000 10px, #000 20px) 8',
                           opacity: 0 
                         }}
                    />
                    
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        View Details →
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" 
                         style={{ color: '#E85D45' }}>
                      {product.category}
                    </div>

                    <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 text-lg group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>

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

                    {product.size && (
                      <div className="text-xs text-gray-600 font-medium">
                        Size: <span className="font-bold" style={{ color: '#E85D45' }}>
                          {product.size.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

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

      {/* Trust Section */}
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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/254705807643?text=Hi%20Kadi%20Thrift!%20I%27m%20interested%20in%20your%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: '#FFB6C1' }}
          ></div>
          
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