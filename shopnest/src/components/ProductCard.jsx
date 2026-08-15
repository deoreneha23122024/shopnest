import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { addToCart, selectIsInCart, syncAddToCart } from '../store/cartSlice';
import { toggleWishlist, selectIsInWishlist, syncAddToWishlist, syncRemoveFromWishlist } from '../store/wishlistSlice';
import StarRating from './StarRating';
import toast from '../utils/toast';
import { useCurrency } from '../hooks/useCurrency';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const inCart = useSelector(selectIsInCart(product.id));
  const inWishlist = useSelector(selectIsInWishlist(product.id));
  const { formatPrice } = useCurrency();

  const originalPrice = product.price * 1.25;
  const discountPercent = Math.round((1 - (product.price / (product.price * 1.25))) * 100);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    }));
    if (inWishlist) {
      dispatch(syncRemoveFromWishlist(product.id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(syncAddToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
      }));
      toast.success('Added to wishlist ❤️');
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="card group flex flex-col p-4 relative"
    >
      {/* Heart Wishlist Icon */}
      <button
        onClick={handleWishlist}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:scale-110 transition-transform"
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
      </button>

      {/* Image Container */}
      <div className="w-full h-48 mb-4 relative flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide truncate mb-1">
          {product.category}
        </p>
        
        <h3 className="text-fk-text text-sm font-medium line-clamp-2 leading-tight mb-2 group-hover:text-fk-blue transition-colors">
          {product.title}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-green-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            {product.rating?.rate || 0} ★
          </div>
          <span className="text-gray-500 text-xs font-medium">({product.rating?.count || 0})</span>
          {/* F-Assured Logo Placeholder */}
          <div className="ml-auto w-16 h-4 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-fk-blue italic tracking-tighter border border-gray-200">
            F-Assured
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-sans font-bold text-fk-text text-[16px]">
            {formatPrice(product.price)}
          </span>
          <span className="text-gray-500 text-xs line-through font-medium">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-green-600 text-xs font-bold tracking-tight">
            {discountPercent}% off
          </span>
        </div>

        <p className="text-xs font-medium mt-2 text-green-600 truncate">
          Bank Offer Available
        </p>
      </div>
    </Link>
  );
}
