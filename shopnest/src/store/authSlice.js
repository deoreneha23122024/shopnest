import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const getAuthHeader = () => {
  const token = localStorage.getItem('shopnest_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || 'Login failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || 'Registration failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const firebaseLoginUser = createAsyncThunk(
  'auth/firebaseLogin',
  async ({ idToken, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, role }),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || 'Firebase login failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const devPhoneLoginUser = createAsyncThunk(
  'auth/devPhoneLogin',
  async ({ phone, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/dev-phone-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role }),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || 'Dev Phone login failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setupStore = createAsyncThunk(
  'auth/setupStore',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/setup-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(storeData),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || 'Store setup failed');
      }
      const data = await response.json();
      return data; // Returns updated user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || 'Failed to fetch user');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('shopnest_token') || null,
  isLoggedIn: !!localStorage.getItem('shopnest_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('shopnest_token');
    },
    setAuthFromStorage(state, action) {
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isLoggedIn = true;
      }
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    setCredentials(state, action) {
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('shopnest_token', action.payload.token);
      }
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('shopnest_token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('shopnest_token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(firebaseLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(firebaseLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('shopnest_token', action.payload.token);
      })
      .addCase(firebaseLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(devPhoneLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(devPhoneLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('shopnest_token', action.payload.token);
      })
      .addCase(devPhoneLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setupStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setupStore.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(setupStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem('shopnest_token');
      });
  },
});

export const { logoutUser, setAuthFromStorage, setCredentials } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
