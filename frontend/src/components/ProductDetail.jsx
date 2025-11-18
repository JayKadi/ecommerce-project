import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
  try {
    setLoading(true);
    const response = await getProduct(id);
    const productData = response.data;
    
    console.log('Product data:', productData);
    
    setProduct(productData);
    
      // Collect all images (main + additional)
      const images = [];
      if (productData.image) {
        images.push({
          type: 'image',
          url: productData.image.replace('http://localhost:8000', 'http://127.0.0.1:8000')
        });
      }
      
      if (productData.additional_images && productData.additional_images.length > 0) {
        productData.additional_images.forEach(img => {
          images.push({
            type: 'image',
            url: img.image.replace('http://localhost:8000', 'http://127.0.0.1:8000')
          });
        });
      }
      
      // Add video if exists
      if (productData.video) {
        images.push({
          type: 'video',
          url: productData.video.video.replace('http://localhost:8000', 'http://127.0.0.1:8000'),
          thumbnail: productData.video.thumbnail 
            ? productData.video.thumbnail.replace('http://localhost:8000', 'http://127.0.0.1:8000') 
            : null
        });
      }
      
      setAllImages(images);
      setSelectedImageIndex(0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
  // Check stock
  if (product.stock === 0) {
    alert('This item is out of stock');
    return;
  }
  
  if (quantity > product.stock) {
    alert(`Only ${product.stock} items available`);
    return;
  }
  
  // Add to cart (works for both guests and logged-in users)
  addToCart(product);
  
  // Show success message
  alert(`Added ${quantity} item(s) to cart!`);
};

  const getConditionColor = (condition) => {
    const colors = {
      new: 'bg-green-100 text-green-800 border-green-300',
      like_new: 'bg-blue-100 text-blue-800 border-blue-300',
      good: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      fair: 'bg-orange-100 text-orange-800 border-orange-300',
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
      xs: 'XS',
      s: 'S',
      m: 'M',
      l: 'L',
      xl: 'XL',
      xxl: 'XXL',
      one_size: 'One Size',
      various: 'Various',
    };
    return labels[size] || size;
  };

  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in: ${product.name} (KES ${product.price})`;
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Error: {error || 'Product not found'}</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const currentMedia = allImages[selectedImageIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Images/Video Carousel */}
        <div>
          {/* Main Media Display */}
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden mb-4 group">
            {/* SOLD OUT Overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center">
                <div className="transform -rotate-12">
                  <span className="text-white text-5xl font-bold border-4 border-white px-12 py-6">
                    SOLD OUT
                  </span>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              {product.condition && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getConditionColor(product.condition)}`}>
                  {getConditionLabel(product.condition)}
                </span>
              )}
              {product.size && (
                <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-lg border-2 border-gray-300">
                  Size: {getSizeLabel(product.size)}
                </span>
              )}
            </div>

            {/* Navigation Arrows - Always visible when hovering */}
            {allImages.length > 1 && (
              <>
                {/* Previous Arrow */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 w-12 h-12 rounded-full shadow-xl transition-all opacity-100 flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Arrow */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 w-12 h-12 rounded-full shadow-xl transition-all opacity-100 flex items-center justify-center"
                  aria-label="Next image"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Media Counter Dots (Instagram Style) */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImageIndex === index 
                        ? 'bg-white w-6' 
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Display Current Media */}
            {currentMedia ? (
              currentMedia.type === 'video' ? (
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  controls
                  poster={currentMedia.thumbnail}
                  className="w-full h-96 object-contain bg-black"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={currentMedia.url}
                  alt={product.name}
                  className="w-full h-96 object-contain bg-gray-100"
                  onError={(e) => {
                    console.error('Image failed to load:', currentMedia.url);
                  }}
                />
              )
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-400 text-6xl block mb-4">📷</span>
                  <span className="text-gray-500">No media available</span>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative border-2 rounded-lg overflow-hidden ${
                    selectedImageIndex === index
                      ? 'border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="relative w-full h-20 bg-black flex items-center justify-center">
                      {media.thumbnail ? (
                        <img
                          src={media.thumbnail}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

            {/* Category */}
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
                {product.category}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-green-600">KES {product.price}</span>
            </div>

            {/* Stock Info */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">
                    {product.stock === 1 ? 'Last one available!' : `${product.stock} items available`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-semibold">Out of stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Product Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.size && (
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 font-semibold">{getSizeLabel(product.size)}</span>
                  </div>
                )}
                {product.condition && (
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <span className="ml-2 font-semibold">{getConditionLabel(product.condition)}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-semibold">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <span className="ml-2 font-semibold">{product.stock}</span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            {(product.instagram_link || product.tiktok_link) && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">See this item on social media:</h3>
                <div className="flex gap-3">
                  {product.instagram_link && (
                    <a
                      href={product.instagram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {product.tiktok_link && (
                    <a
                      href={product.tiktok_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      TikTok
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center border rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>

              <button
                onClick={handleWhatsAppContact}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Ask about this item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;