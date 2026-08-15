import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectWishlistItems, toggleWishlist } from '../store/wishlistSlice';
import { addToCart, selectIsInCart } from '../store/cartSlice';
import { useCurrency } from '../hooks/useCurrency';
import { FiTrash2, FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';

function WishlistRow({ item }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inCart = useSelector(selectIsInCart(item.id));
  const { formatPrice } = useCurrency();

  const handleAddToCart = () => {
    if (!inCart) {
      dispatch(addToCart({ ...item, quantity: 1 }));
    } else {
      navigate('/cart');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors" id={`wishlist-item-${item.id}`}>
      {/* Image */}
      <Link to={`/product/${item.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 border border-gray-100 rounded-sm flex items-center justify-center overflow-hidden bg-white p-1">
          <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.id}`} className="text-[14px] text-gray-800 font-medium hover:text-[#2874f0] line-clamp-2">
          {item.title}
        </Link>
        <p className="text-[12px] text-gray-500 mt-1 capitalize">{item.category}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[16px] font-bold text-gray-900">{formatPrice(item.price)}</span>
          <span className="text-[13px] text-gray-400 line-through">{formatPrice(item.price * 1.25)}</span>
          <span className="text-green-600 text-[12px] font-medium">20% off</span>
        </div>
        <span className="inline-flex items-center gap-1 text-green-600 text-[12px] font-medium mt-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          In Stock
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-[13px] font-semibold transition-all ${
            inCart
              ? 'bg-white border border-[#2874f0] text-[#2874f0] hover:bg-[#2874f0] hover:text-white'
              : 'bg-[#ff9f00] hover:bg-[#f39800] text-white shadow-sm'
          }`}
          id={`wl-cart-${item.id}`}
        >
          {inCart ? <><FiCheck size={14} /> GO TO CART</> : <><FiShoppingCart size={14} /> ADD TO CART</>}
        </button>
        <button
          onClick={() => dispatch(toggleWishlist(item))}
          className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-red-500 transition-colors"
          id={`wl-remove-${item.id}`}
        >
          <FiTrash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const items = useSelector(selectWishlistItems);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="bg-white shadow-sm rounded-sm p-12 text-center max-w-sm w-full mx-4">
          <FiHeart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-[18px] font-semibold text-gray-700 mb-2">Empty Wishlist</h2>
          <p className="text-gray-400 text-[14px] mb-6">You have no items in your wishlist. Start adding!</p>
          <Link to="/" className="inline-block bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium text-[14px] hover:bg-[#1a65d6]">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-6 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>/</span>
          <span className="text-gray-800">My Wishlist</span>
        </div>

        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h1 className="text-[18px] font-semibold text-gray-800">
              My Wishlist <span className="text-[14px] text-gray-400 font-normal">({items.length} items)</span>
            </h1>
          </div>

          {/* Items */}
          <div>
            {items.map((item) => (
              <WishlistRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
