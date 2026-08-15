import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItems, selectCartTotal,
  removeFromCart, updateQuantity, clearCart,
} from '../store/cartSlice';
import { FiShield, FiMinus, FiPlus } from 'react-icons/fi';
import { useCurrency } from '../hooks/useCurrency';
import { useTranslation } from 'react-i18next';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-fk-bg pt-8">
        <div className="max-w-[1248px] mx-auto px-2">
          <div className="bg-white shadow-sm flex flex-col items-center justify-center py-20 text-center rounded-sm">
            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-64 h-auto mb-6" />
            <h2 className="text-xl font-medium text-black mb-2">{t('your_cart')}</h2>
            <p className="text-gray-500 mb-6 text-sm">{t('add_items')}</p>
            <Link to="/" className="bg-fk-blue text-white px-16 py-3 rounded-sm font-semibold shadow-sm">
              {t('shop_now')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Flipkart calculates discounts on the original price. We'll simulate 20% flat discount on total original.
  const totalOriginal = total * 1.25;
  const discount = totalOriginal - total;
  const delivery = total > 500 ? 0 : 40;
  const grandTotal = total + delivery;

  return (
    <div className="min-h-screen bg-fk-bg pt-4 pb-16 font-sans">
      <div className="max-w-[1248px] mx-auto px-2 flex flex-col lg:flex-row gap-4 relative">
        
        {/* Left Column: Cart Items */}
        <div className="flex-1">
          <div className="bg-white shadow-sm rounded-sm mb-4">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="text-[18px] font-medium text-black flex items-center gap-2">
              ShopNest ({items.length})
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => dispatch(clearCart())}
                  className="text-red-500 font-medium text-[14px] hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col">
              {items.map((item, index) => (
                <div key={item.id} className={`p-6 flex flex-col md:flex-row gap-6 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  
                  {/* Image & Controls */}
                  <div className="flex flex-col items-center w-28">
                    <div className="h-28 w-28 flex items-center justify-center mb-4">
                      <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-sm">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-black border-r border-gray-200"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-black border-l border-gray-200"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`} className="text-[16px] text-fk-text hover:text-fk-blue line-clamp-1 mb-1">
                      {item.title}
                    </Link>
                    <p className="text-gray-500 text-sm mb-3 capitalize">{item.category}</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-gray-500 line-through text-sm">{formatPrice(item.price * 1.25)}</span>
                      <span className="font-bold text-[18px] text-black">{formatPrice(item.price)}</span>
                      <span className="text-green-600 font-bold text-sm">20% Off</span>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <button className="font-medium text-[16px] text-black hover:text-fk-blue transition-colors uppercase">
                        Save for later
                      </button>
                      <button 
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="font-medium text-[16px] text-black hover:text-fk-blue transition-colors uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
            
            {/* Place Order Bar */}
            <div className="p-4 border-t border-gray-100 flex justify-end bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
              <button 
                onClick={() => navigate('/checkout')}
                className="bg-[#fb641b] text-white px-12 py-4 rounded-sm font-bold text-[16px] shadow hover:bg-[#f25f18] uppercase"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Price Details */}
        <div className="w-full lg:w-[30%]">
          <div className="bg-white shadow-sm rounded-sm sticky top-20">
            <h2 className="text-gray-500 font-semibold text-[16px] uppercase px-6 py-4 border-b border-gray-100">
              {t('price_details')}
            </h2>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-[16px] text-black">
                <span>{t('price')} ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(totalOriginal)}</span>
              </div>
              <div className="flex justify-between text-[16px] text-black">
                <span>{t('discount')}</span>
                <span className="text-green-600">- {formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between text-[16px] text-black">
                <span>{t('delivery_charges')}</span>
                <span className="text-green-600">
                  {delivery === 0 ? 'Free' : formatPrice(delivery)}
                </span>
              </div>
              
              <div className="border-t border-dashed border-gray-300 my-2 pt-4 flex justify-between text-[18px] font-bold text-black">
                <span>{t('total_amount')}</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-300 pt-4 text-green-600 font-bold text-[16px]">
                {t('save_on_order', { amount: formatPrice(discount) })}
              </div>
            </div>
          </div>

          {/* Safe & Secure */}
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm font-medium">
            <FiShield size={24} className="text-gray-400" />
            {t('safe_secure')}
          </div>
        </div>

      </div>
    </div>
  );
}
