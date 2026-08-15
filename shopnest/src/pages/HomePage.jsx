import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  fetchProducts, fetchCategories,
  selectFilteredProducts, selectCategories,
  selectProductsStatus,
} from '../store/productsSlice';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import { FiLoader, FiChevronRight, FiX } from 'react-icons/fi';
import { useCurrency } from '../hooks/useCurrency';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductsStatus);
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isFiltered = searchQuery || selectedCategory;

  // Group products by category for horizontal scrolling sections
  const electronics = products.filter(p => p.category === 'electronics').slice(0, 7);
  const fashion = products.filter(p => p.category.includes('clothing')).slice(0, 7);
  const jewelery = products.filter(p => p.category === 'jewelery').slice(0, 7);

  const HorizontalScrollSection = ({ title, items, subtitle }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="bg-white shadow-sm my-4 rounded-sm flex">
        {/* Left Title Block (Desktop) */}
        <div className="hidden md:flex flex-col items-center justify-end w-[230px] p-6 text-center border-r border-gray-100 bg-[url('https://rukminim2.flixcart.com/fk-p-flap/278/278/image/759389b024252d7b.jpg?q=90')] bg-cover bg-bottom">
          <h2 className="text-[22px] font-sans font-medium text-black mb-4">{title}</h2>
          <button className="bg-fk-blue text-white px-5 py-2 rounded-sm text-[13px] font-semibold shadow-md flex items-center">
            {t('view_all')}
          </button>
        </div>

        {/* Products Scroll */}
        <div className="flex-1 overflow-x-auto hide-scrollbar p-4 flex gap-4">
          <div className="md:hidden w-full flex justify-between items-center mb-4 min-w-full">
            <h2 className="text-[18px] font-medium text-black">{title}</h2>
            <button className="bg-fk-blue text-white w-6 h-6 rounded-full flex items-center justify-center">
              <FiChevronRight size={14}/>
            </button>
          </div>
          
          <div className="flex gap-4 pb-2">
            {items.map(product => (
              <div key={product.id} className="min-w-[180px] w-[180px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-fk-bg min-h-screen pb-8">
      {/* Hero Banner Area */}
      <div className="max-w-[1248px] mx-auto pt-2 px-2">
        <Banner />
      </div>

      <div className="max-w-[1248px] mx-auto px-2">
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FiLoader size={40} className="text-fk-blue animate-spin" />
          </div>
        ) : status === 'failed' ? (
          <div className="bg-white p-8 text-center my-4 shadow-sm rounded-sm">
            <p className="text-red-500 font-semibold mb-4">Something went wrong!</p>
            <button onClick={() => dispatch(fetchProducts())} className="bg-fk-blue text-white px-6 py-2 rounded-sm font-semibold shadow">
              Retry
            </button>
          </div>
        ) : isFiltered ? (
          // Search / Category Results
          <div className="bg-white shadow-sm my-4 rounded-sm p-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-[18px] font-medium">
                {searchQuery ? `Results for "${searchQuery}"` : `Category: ${selectedCategory}`}
                <span className="text-[14px] text-gray-400 ml-2">({filteredProducts.length} items)</span>
              </h2>
              <button
                onClick={() => { setSearchParams({}); setSelectedCategory(''); }}
                className="flex items-center gap-1 text-[13px] text-[#2874f0] hover:underline"
              >
                <FiX size={14} /> Clear filter
              </button>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-[16px] font-medium mb-2">No products found</p>
                <p className="text-[13px]">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Horizontal Sections */}
            <HorizontalScrollSection title={t('best_of_electronics')} items={electronics} />
            <HorizontalScrollSection title={t('top_styles')} items={fashion} />
            
            {/* 3-Column Bento Box Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              
              {/* Box 1 */}
              <div className="bg-white shadow-sm p-4 rounded-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Top Picks on Men's Fashion</h2>
                  <button className="w-6 h-6 rounded-full bg-fk-blue text-white flex items-center justify-center shadow"><FiChevronRight size={16}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {fashion.slice(0, 4).map(p => (
                    <div key={p.id} className="border border-gray-100 rounded p-2 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow">
                      <img src={p.image} className="h-24 w-auto object-contain mb-2" alt="" />
                      <p className="text-sm text-black truncate w-full text-center">{p.category}</p>
                      <p className="text-green-600 text-sm font-semibold">Min 50% Off</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white shadow-sm p-4 rounded-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Sparkling Jewellery</h2>
                  <button className="w-6 h-6 rounded-full bg-fk-blue text-white flex items-center justify-center shadow"><FiChevronRight size={16}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {jewelery.slice(0, 4).map(p => (
                    <div key={p.id} className="border border-gray-100 rounded p-2 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow">
                      <img src={p.image} className="h-24 w-auto object-contain mb-2" alt="" />
                      <p className="text-sm text-black truncate w-full text-center">{t('trending_now')}</p>
                      <p className="text-green-600 text-sm font-semibold">{t('under')} {formatPrice(100)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: Single Ad Banner */}
              <div className="bg-white shadow-sm rounded-sm overflow-hidden cursor-pointer">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Ad" />
              </div>

            </div>

            <HorizontalScrollSection title={t('premium_jewellery')} items={jewelery} />
            
            {/* All Products Fallback */}
            <div className="bg-white shadow-sm my-4 rounded-sm p-4">
              <h2 className="text-xl font-medium border-b border-gray-100 pb-4 mb-4">{t('all_products')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

          </>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
