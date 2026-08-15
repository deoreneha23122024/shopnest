import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts } from '../store/productsSlice';

const AIRecommendations = ({ currentProduct }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (products.length > 0 && currentProduct) {
      setLoading(true);
      // Simulate AI thinking time
      setTimeout(() => {
        // Simple similarity algo: Same category first, then similar price
        let recs = products.filter(p => p.id !== currentProduct.id && p._id !== currentProduct._id);
        
        recs.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          if (a.category === currentProduct.category) scoreA += 10;
          if (b.category === currentProduct.category) scoreB += 10;
          
          const priceDiffA = Math.abs(a.price - currentProduct.price);
          const priceDiffB = Math.abs(b.price - currentProduct.price);
          
          scoreA -= (priceDiffA / currentProduct.price); // lower diff is better
          scoreB -= (priceDiffB / currentProduct.price);

          return scoreB - scoreA;
        });

        setRecommendations(recs.slice(0, 4));
        setLoading(false);
      }, 800);
    }
  }, [products, currentProduct]);

  if (!currentProduct) return null;

  return (
    <div className="mt-12 bg-dark-900 border-t border-dark-800 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold text-white">✨ AI Picks For You</h2>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-64 bg-dark-800 rounded-xl p-4 animate-pulse">
                <div className="w-full h-48 bg-dark-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-dark-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-dark-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-dark-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {recommendations.map((product) => (
              <Link 
                to={`/product/${product.id || product._id}`} 
                key={product.id || product._id}
                className="flex-none w-64 bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-accent transition-colors snap-start group"
              >
                <div className="h-48 bg-white p-4 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-200 font-medium truncate text-sm mb-1">{product.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-400">{product.rating?.rate || 4.5}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-white">${product.price}</span>
                    <button className="bg-dark-700 hover:bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;
