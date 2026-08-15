import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn, selectCurrentUser, logoutUser } from '../store/authSlice';
import { selectCartItemCount } from '../store/cartSlice';
import { Search, ShoppingCart, Heart, LogOut, ChevronDown, User, Package, Store, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  { name: 'Grocery', icon: '🛒' },
  { name: 'Mobiles', icon: '📱' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Home & Furniture', icon: '🛋️' },
  { name: 'Appliances', icon: '📺' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Beauty, Toys & More', icon: '🧸' },
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartItemCount);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangDropdown(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const isSeller = user?.role === 'seller';

  return (
    <div className="sticky top-0 z-50 shadow-sm">
      {/* Main Header (Blue) */}
      <header className="bg-fk-blue h-[56px] flex items-center">
        <div className="max-w-[1248px] w-full mx-auto px-4 flex items-center gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex flex-col flex-shrink-0">
            <span className="text-[20px] font-bold text-white italic tracking-tight leading-none">
              ShopNest
            </span>
            <span className="text-[11px] text-white italic hover:underline flex items-center gap-1 mt-[2px]">
              Explore <span className="text-fk-yellow font-bold">Plus</span>
              <span className="text-fk-yellow text-xs leading-none">✦</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-[550px] relative">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="w-full h-9 pl-4 pr-10 text-sm text-black rounded-sm focus:outline-none shadow-sm placeholder-gray-500"
            />
            <Search className="absolute right-3 top-2 h-5 w-5 text-fk-blue cursor-pointer" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-8 ml-4">
            
            {/* Language Switcher */}
            <div className="relative group cursor-pointer"
                 onMouseEnter={() => setShowLangDropdown(true)}
                 onMouseLeave={() => setShowLangDropdown(false)}>
              <div className="flex items-center text-white font-medium text-[15px] hover:text-gray-100">
                <Globe className="w-4 h-4 mr-1" />
                {i18n.language === 'hi' ? 'HI' : 'EN'}
                <ChevronDown className="w-4 h-4 ml-1" />
              </div>
              {showLangDropdown && (
                <div className="absolute top-full -right-2 pt-4 w-32 z-50">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-sm flex flex-col text-[14px]">
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
                    <button onClick={() => changeLanguage('en')} className={`px-4 py-2 text-left hover:bg-gray-50 ${i18n.language === 'en' ? 'font-bold text-fk-blue' : 'text-fk-text'}`}>English</button>
                    <button onClick={() => changeLanguage('hi')} className={`px-4 py-2 text-left hover:bg-gray-50 ${i18n.language === 'hi' ? 'font-bold text-fk-blue' : 'text-fk-text'}`}>हिंदी</button>
                  </div>
                </div>
              )}
            </div>

            {!isLoggedIn ? (
              <Link to="/login" className="bg-white text-fk-blue font-bold px-10 py-1 rounded-sm text-[15px] hover:shadow-md transition-shadow">
                {t('login')}
              </Link>
            ) : (
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="flex items-center text-white font-medium text-[15px] hover:text-gray-100">
                  {user?.name || user?.email?.split('@')[0]}
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute top-full -right-4 pt-4 w-60">
                    <div className="bg-white border border-gray-200 shadow-xl rounded-sm flex flex-col text-[14px]">
                      <div className="absolute -top-2 right-10 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
                      
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-gray-500 font-semibold text-xs uppercase">New Customer?</span>
                        <Link to="/register" className="text-fk-blue font-semibold hover:underline">Sign Up</Link>
                      </div>
                      
                      <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-gray-50 text-fk-text">
                        <User className="w-4 h-4 mr-4 text-fk-blue" /> My Profile
                      </Link>
                      
                      {isSeller ? (
                        <Link to="/seller/dashboard" className="flex items-center px-4 py-3 hover:bg-gray-50 text-fk-text">
                          <Store className="w-4 h-4 mr-4 text-fk-blue" /> My Store Dashboard
                        </Link>
                      ) : (
                        <Link to="/orders" className="flex items-center px-4 py-3 hover:bg-gray-50 text-fk-text">
                          <Package className="w-4 h-4 mr-4 text-fk-blue" /> {t('orders')}
                        </Link>
                      )}
                      
                      <Link to="/wishlist" className="flex items-center px-4 py-3 hover:bg-gray-50 text-fk-text">
                        <Heart className="w-4 h-4 mr-4 text-fk-blue" /> Wishlist
                      </Link>
                      
                      <button onClick={handleLogout} className="flex items-center px-4 py-3 hover:bg-gray-50 text-fk-text text-left w-full border-t border-gray-100">
                        <LogOut className="w-4 h-4 mr-4 text-gray-400" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isSeller && (
              <>
                <Link to="/seller/onboarding" className="text-white font-medium text-[15px] hover:text-gray-100 whitespace-nowrap hidden lg:block">
                  Become a Seller
                </Link>

                <Link to="/cart" className="flex items-center text-white font-medium text-[15px] hover:text-gray-100">
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 mr-1.5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2.5 left-2 bg-red-500 border border-white text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-xl">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  {t('cart')}
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Categories Sub-nav (White) */}
      <div className="bg-white shadow-sm hidden md:block">
        <div className="max-w-[1248px] mx-auto px-4 py-2 flex items-center justify-between">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="flex flex-col items-center justify-center cursor-pointer group px-2 py-1">
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-[13px] font-medium text-fk-text group-hover:text-fk-blue">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
