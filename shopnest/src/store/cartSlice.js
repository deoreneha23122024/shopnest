import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthHeader } from './authSlice';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const syncAddToCart = createAsyncThunk(
  'cart/syncAddToCart',
  async (product, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ productId: product.id || product._id, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Failed to sync add to cart');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncRemoveFromCart = createAsyncThunk(
  'cart/syncRemoveFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to sync remove from cart');
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncClearCart = createAsyncThunk(
  'cart/syncClearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to sync clear cart');
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('shopnest_cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  localStorage.removeItem('shopnest_cart');
  return [];
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i => (i.id === item.id || i._id === item._id));
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      localStorage.setItem('shopnest_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(i => (i.id !== id && i._id !== id));
      localStorage.setItem('shopnest_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => (i.id === id || i._id === id));
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          state.items = state.items.filter(i => (i.id !== id && i._id !== id));
        }
      }
      localStorage.setItem('shopnest_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('shopnest_cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => Array.isArray(state.cart?.items) ? state.cart.items : [];
export const selectCartTotal = (state) => {
  const items = Array.isArray(state.cart?.items) ? state.cart.items : [];
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
export const selectCartItemCount = (state) => {
  const items = Array.isArray(state.cart?.items) ? state.cart.items : [];
  return items.reduce((count, item) => count + item.quantity, 0);
};
// Curried selector: selectIsInCart(productId)(state)
export const selectIsInCart = (productId) => (state) => {
  const items = Array.isArray(state.cart?.items) ? state.cart.items : [];
  return items.some((i) => i.id === productId || i._id === productId);
};

export default cartSlice.reducer;
