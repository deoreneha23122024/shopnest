import { useDispatch } from 'react-redux';
import { setSelectedCategory, fetchProducts, fetchProductsByCategory } from '../store/productsSlice';

const CATEGORY_MAP = {
  all: 'All',
  electronics: 'Electronics',
  "men's clothing": "Men's Fashion",
  "women's clothing": "Women's Fashion",
  jewelery: 'Jewellery',
};

export default function CategoryFilter({ selectedCategory, categories }) {
  const dispatch = useDispatch();
  const all = ['all', ...categories];

  const handleCategoryClick = (cat) => {
    dispatch(setSelectedCategory(cat));
    // Fetch from our backend API
    if (cat === 'all') {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchProductsByCategory(cat));
    }
  };

  return (
    <div id="categories" className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {all.map((cat) => {
        const active = selectedCategory === cat;
        return (
          <button
            key={cat}
            id={`cat-${cat}`}
            onClick={() => handleCategoryClick(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
              active
                ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
            }`}
          >
            {CATEGORY_MAP[cat] || cat}
          </button>
        );
      })}
    </div>
  );
}
