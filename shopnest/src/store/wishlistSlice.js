import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthHeader } from './authSlice';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const syncAddToWishlist = createAsyncThunk(
  'wishlist/syncAddToWishlist',
  async (product, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ productId: product.id || product._id }),
      });
      if (!response.ok) throw new Error('Failed to sync add to wishlist');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncRemoveFromWishlist = createAsyncThunk(
  'wishlist/syncRemoveFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to sync remove from wishlist');
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loadWishlistFromStorage = () => {
  const saved = localStorage.getItem('shopnest_wishlist');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(i => (i.id === product.id || i._id === product._id));
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('shopnest_wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('shopnest_wishlist');
    }
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => Array.isArray(state.wishlist?.items) ? state.wishlist.items : [];
// Curried selector: selectIsInWishlist(productId)(state)
export const selectIsInWishlist = (productId) => (state) => {
  const items = Array.isArray(state.wishlist?.items) ? state.wishlist.items : [];
  return items.some(item => (item.id === productId || item._id === productId));
};

export default wishlistSlice.reducer;
