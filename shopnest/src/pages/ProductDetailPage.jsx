import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelectedProduct, selectSelectedProduct, selectProductsStatus } from '../store/productsSlice';
import { addToCart, selectIsInCart, syncAddToCart } from '../store/cartSlice';
import { toggleWishlist, selectIsInWishlist, syncAddToWishlist, syncRemoveFromWishlist } from '../store/wishlistSlice';
import StarRating from '../components/StarRating';
import AIRecommendations from '../components/AIRecommendations';
import toast from '../utils/toast';
import {
  FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiTruck,
  FiRefreshCw, FiShield, FiLoader, FiStar, FiZap, FiVideo, FiBox
} from 'react-icons/fi';
import { useCurrency } from '../hooks/useCurrency';
import '@google/model-viewer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectProductsStatus);
  const inCart = useSelector(selectIsInCart(Number(id)));
  const inWishlist = useSelector(selectIsInWishlist(Number(id)));
  const [selectedImg, setSelectedImg] = useState(0);
  const [activeMedia, setActiveMedia] = useState('image'); // 'image' | 'video' | '3d'
  const { formatPrice } = useCurrency();

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [id, dispatch]);

  const handleCart = () => {
    if (inCart) {
      navigate('/cart');
    } else if (product) {
      dispatch(addToCart({
        id: product.id, title: product.title, price: product.price,
        image: product.image, category: product.category, quantity: 1,
      }));
      dispatch(syncAddToCart({
        id: product.id, title: product.title, price: product.price,
        image: product.image, category: product.category, quantity: 1,
      }));
      toast.success(`Added to cart 🛒`);
    }
  };

  const handleBuyNow = () => {
    if (!inCart && product) {
      dispatch(addToCart({
        id: product.id, title: product.title, price: product.price,
        image: product.image, category: product.category, quantity: 1,
      }));
      dispatch(syncAddToCart({
        id: product.id, title: product.title, price: product.price,
        image: product.image, category: product.category, quantity: 1,
      }));
    }
    navigate('/cart'); // or checkout depending on flow
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist({
      id: product.id, title: product.title, price: product.price,
      image: product.image, category: product.category, rating: product.rating,
    }));
    if (inWishlist) {
      dispatch(syncRemoveFromWishlist(product.id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(syncAddToWishlist({
        id: product.id, title: product.title, price: product.price,
        image: product.image, category: product.category, rating: product.rating,
      }));
      toast.success('Added to wishlist ❤️');
    }
  };

  if (status === 'loading' || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-fk-bg">
        <FiLoader size={48} className="text-fk-blue animate-spin" />
      </div>
    );
  }

  const originalPrice = product.price * 1.25;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const thumbnails = [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-fk-bg pt-4 pb-16 font-sans text-fk-text">
      <div className="max-w-[1248px] mx-auto px-2">
        
        <div className="bg-white shadow-sm flex flex-col md:flex-row relative">
          {/* Left Column: Images & Buttons */}
          <div className="w-full md:w-[40%] p-4 sticky top-16 h-max">
            <div className="flex gap-4">
              {/* Thumbnails (Vertical) */}
              <div className="flex flex-col gap-2 w-16">
                {thumbnails.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImg(i); setActiveMedia('image'); }}
                    className={`w-16 h-16 border rounded-sm overflow-hidden flex-shrink-0 transition-all ${
                      selectedImg === i && activeMedia === 'image' ? 'border-fk-blue' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
                
                {/* Video Thumbnail */}
                {product.videoUrl && (
                  <button
                    onClick={() => setActiveMedia('video')}
                    className={`w-16 h-16 border rounded-sm flex flex-col items-center justify-center transition-all ${
                      activeMedia === 'video' ? 'border-fk-blue bg-blue-50' : 'border-gray-200 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    <FiVideo size={20} className="text-gray-600 mb-1" />
                    <span className="text-[10px] font-medium text-gray-600">Video</span>
                  </button>
                )}

                {/* 3D Model Thumbnail */}
                {product.model3dUrl && (
                  <button
                    onClick={() => setActiveMedia('3d')}
                    className={`w-16 h-16 border rounded-sm flex flex-col items-center justify-center transition-all ${
                      activeMedia === '3d' ? 'border-fk-blue bg-blue-50' : 'border-gray-200 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    <FiBox size={20} className="text-gray-600 mb-1" />
                    <span className="text-[10px] font-medium text-gray-600">3D View</span>
                  </button>
                )}
              </div>

              {/* Main Image / Media */}
              <div className="flex-1 border border-gray-100 rounded-sm relative p-4 flex items-center justify-center min-h-[400px]">
                <button
                  onClick={handleWishlist}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow bg-white z-10"
                >
                  <FiHeart size={20} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                
                {activeMedia === 'image' && (
                  <img
                    src={thumbnails[selectedImg]}
                    alt={product.title}
                    className="max-h-[350px] object-contain transition-transform duration-300 hover:scale-[1.02] cursor-crosshair"
                  />
                )}
                
                {activeMedia === 'video' && product.videoUrl && (
                  <video 
                    src={product.videoUrl} 
                    controls 
                    autoPlay 
                    muted 
                    className="max-w-full max-h-[350px] object-contain"
                  />
                )}

                {activeMedia === '3d' && product.model3dUrl && (
                  <model-viewer 
                    src={product.model3dUrl} 
                    alt="3D model of product"
                    auto-rotate 
                    camera-controls
                    ar
                    shadow-intensity="1"
                    style={{ width: '100%', height: '350px' }}
                  ></model-viewer>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-sm font-bold text-white text-[16px] transition-all shadow-md active:scale-95 ${
                  inCart ? 'bg-green-500 hover:bg-green-600' : 'bg-[#ff9f00] hover:bg-[#f39800]'
                }`}
              >
                {inCart ? <><FiCheck size={20} /> GO TO CART</> : <><FiShoppingCart size={20} /> ADD TO CART</>}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-sm font-bold text-white text-[16px] transition-all shadow-md bg-[#fb641b] hover:bg-[#f25f18] active:scale-95"
              >
                <FiZap size={20} /> BUY NOW
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full md:w-[60%] p-6 md:pl-8 border-l border-gray-100">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 truncate">
              <Link to="/" className="hover:text-fk-blue transition-colors">Home</Link>
              <span>{'>'}</span>
              <span className="capitalize hover:text-fk-blue cursor-pointer">{product.category}</span>
              <span>{'>'}</span>
              <span className="truncate max-w-[200px]">{product.title}</span>
            </div>

            <h1 className="text-[18px] font-medium text-fk-text mb-2 leading-relaxed">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1">
                {product.rating?.rate || 0} <FiStar size={10} className="fill-white" />
              </div>
              <span className="text-gray-500 text-[14px] font-medium">{product.rating?.count || 0} Ratings & Reviews</span>
              {/* F-Assured Logo Placeholder */}
              <div className="w-20 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-fk-blue italic tracking-tighter border border-gray-200 ml-2">
                F-Assured
              </div>
            </div>

            <p className="text-green-600 text-sm font-medium mb-1">Special price</p>
            {/* Price */}
            <div className="flex items-end gap-3 mb-4">
              <span className="font-bold text-3xl text-fk-text">{formatPrice(product.price)}</span>
              <span className="text-gray-500 line-through text-[16px] font-medium mb-1">{formatPrice(originalPrice)}</span>
              <span className="text-green-600 text-[16px] font-bold tracking-tight mb-1">{discount}% off</span>
            </div>

            {/* Available Offers */}
            <div className="mb-6">
              <h3 className="text-[16px] font-medium mb-3">Available offers</h3>
              <ul className="space-y-3 text-[14px]">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">🏷️</span>
                  <span><strong className="font-medium">Bank Offer:</strong> 5% Cashback on Flipkart Axis Bank Card <span className="text-fk-blue cursor-pointer font-medium">T&C</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">🏷️</span>
                  <span><strong className="font-medium">Special Price:</strong> Get extra 10% off (price inclusive of cashback/coupon) <span className="text-fk-blue cursor-pointer font-medium">T&C</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">🏷️</span>
                  <span><strong className="font-medium">Partner Offer:</strong> Sign up for Flipkart Pay Later and get Flipkart Gift Card worth up to ₹500 <span className="text-fk-blue cursor-pointer font-medium">Know More</span></span>
                </li>
              </ul>
            </div>

            {/* Delivery/Warranty info */}
            <div className="flex flex-col gap-4 py-4 border-t border-b border-gray-100 mb-6">
              <div className="flex gap-4 items-start text-[14px]">
                <span className="text-gray-500 w-24 font-medium">Delivery</span>
                <div>
                  <p className="font-medium">Delivery by {new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | <span className="text-green-600">Free</span> <span className="line-through text-gray-500">{formatPrice(5)}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Order within 12 hrs 30 mins</p>
                </div>
              </div>
              <div className="flex gap-4 items-start text-[14px]">
                <span className="text-gray-500 w-24 font-medium">Warranty</span>
                <span>1 Year Warranty against manufacturing defects</span>
              </div>
            </div>

            {/* Specifications / Highlights */}
            <div className="flex gap-4 items-start text-[14px] mb-8">
              <span className="text-gray-500 w-24 font-medium">Highlights</span>
              <ul className="list-disc pl-4 space-y-2 text-gray-800">
                <li className="capitalize">Category: {product.category}</li>
                <li>Premium build quality</li>
                <li>Highly rated by {product.rating?.count} customers</li>
                <li>7 Days Replacement Policy</li>
              </ul>
            </div>

            {/* Description Details */}
            <div className="border border-gray-200 rounded-sm">
              <div className="text-[18px] font-medium p-4 border-b border-gray-200">
                Product Description
              </div>
              <div className="p-4 text-[14px] text-gray-800 leading-relaxed">
                {product.description}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-4">
          <AIRecommendations currentProduct={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
