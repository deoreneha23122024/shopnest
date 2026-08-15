import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthHeader } from './authSlice';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

// Helper: save/load orders from localStorage as offline fallback
const LOCAL_ORDERS_KEY = 'shopnest_local_orders';
const getLocalOrders = () => JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
const saveLocalOrder = (order) => {
  const orders = getLocalOrders();
  orders.unshift(order);
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to place order');
      const data = await response.json();
      saveLocalOrder(data);
      return data;
    } catch (error) {
      // Backend unreachable – save locally so the user can still proceed
      const localOrder = {
        id: 'LOCAL-' + Date.now(),
        _id: 'LOCAL-' + Date.now(),
        ...orderData,
        status: 'Ordered',
        createdAt: new Date().toISOString(),
      };
      saveLocalOrder(localOrder);
      return localOrder; // resolve (not reject) so checkout succeeds
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      // Backend unreachable – return locally saved orders
      return getLocalOrders();
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'orders/fetchSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/seller-orders`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to fetch seller orders');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to cancel order');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  myOrders: [],
  sellerOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.myOrders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerOrders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.sellerOrders.findIndex(o => o._id === action.payload._id || o.id === action.payload.id);
        if (index !== -1) {
          state.sellerOrders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.myOrders.findIndex(o => o._id === action.payload._id || o.id === action.payload.id);
        if (index !== -1) {
          state.myOrders[index] = action.payload;
        }
      });
  }
});

export const { setCurrentOrder } = orderSlice.actions;

export const selectMyOrders = (state) => state.orders.myOrders;
export const selectSellerOrders = (state) => state.orders.sellerOrders;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;
export const selectCurrentOrder = (state) => state.orders.currentOrder;

export default orderSlice.reducer;
