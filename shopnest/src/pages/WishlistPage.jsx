import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectWishlistItems, toggleWishlist } from '../store/wishlistSlice';
import { addToCart, selectIsInCart } from '../store/cartSlice';
import { FiTrash2, FiHeart, FiShoppingCart, FiCheck, FiHome } from 'react-icons/fi';

function WishlistRow({ item }) {
  const dispatch = useDispatch();
  const inCart = useSelector(selectIsInCart(item.id));

  return (
    <tr className="border-b border-dark-600 hover:bg-dark-700/30 transition-colors" id={`wishlist-item-${item.id}`}>
      {/* Product */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <Link to={`/product/${item.id}`} className="flex-shrink-0">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-dark-600">
              <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
            </div>
          </Link>
          <Link to={`/product/${item.id}`} className="text-white text-sm font-medium hover:text-accent transition-colors line-clamp-2 max-w-xs">
            {item.title}
          </Link>
        </div>
      </td>
      {/* Price */}
      <td className="py-4 px-4">
        <span className="text-white font-bold text-base">${item.price}</span>
      </td>
      {/* Stock Status */}
      <td className="py-4 px-4">
        <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-medium">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          In Stock
        </span>
      </td>
      {/* Action */}
      <td className="py-4 px-4">
        <button
          onClick={() => !inCart && dispatch(addToCart({ ...item, quantity: 1 }))}
          disabled={inCart}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
            inCart
              ? 'bg-green-500/10 text-green-400 border-green-500/30 cursor-default'
              : 'bg-accent hover:bg-accent-dark text-white border-transparent shadow-md shadow-accent/20'
          }`}
          id={`wl-cart-${item.id}`}
        >
          {inCart ? <><FiCheck size={14} /> In Cart</> : <><FiShoppingCart size={14} /> Add to Cart</>}
        </button>
      </td>
      {/* Remove */}
      <td className="py-4 px-4">
        <button
          onClick={() => dispatch(toggleWishlist(item))}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
          id={`wl-remove-${item.id}`}
          title="Remove"
        >
          <FiTrash2 size={15} />
        </button>
      </td>
    </tr>
  );
}


export default function WishlistPage() {
  const items = useSelector(selectWishlistItems);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">💝</div>
        <h2 className="font-display text-3xl font-bold text-white mb-3">Your wishlist is empty</h2>
        <p className="text-gray-400 mb-8">Save your favourites and come back to purchase later.</p>
        <Link to="/" className="btn-primary flex items-center gap-2">
          <FiHeart /> Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-dark-800 to-dark-700 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Wishlist</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-accent transition-colors flex items-center gap-1">
              <FiHome size={13} /> Home
            </Link>
            <span>/</span>
            <span className="text-accent">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-gray-400 text-sm">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-white">Wishlist</span>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600 bg-dark-700/50">
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock Status</th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <WishlistRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Link to="/" className="btn-outline flex items-center gap-2 text-sm py-2.5">
            ← Continue Shopping
          </Link>
          <p className="text-gray-400 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} in wishlist</p>
        </div>
      </div>
    </div>
  );
}
