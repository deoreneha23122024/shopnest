import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Realistic fallback exchange rates from USD to other currencies
const FALLBACK_RATES = {
  'USD': 1,
  'INR': 83.5,
  'EUR': 0.93,
  'GBP': 0.79,
  'AUD': 1.52,
  'CAD': 1.36,
  'JPY': 151.2,
};

export const fetchLocaleSettings = createAsyncThunk(
  'settings/fetchLocale',
  async (_, { rejectWithValue }) => {
    try {
      // Free IP Geolocation API without keys
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('Failed to fetch IP details');
      const data = await res.json();
      
      const currency = data.currency || 'USD';
      const country = data.country_code || 'US';
      
      // Try to get exchange rate, fallback if not found
      // We could use an exchange rate API here, but for simplicity/reliability we use our fallback map
      const exchangeRate = FALLBACK_RATES[currency] || 1;
      
      return {
        countryCode: country,
        currency,
        exchangeRate,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  countryCode: 'IN',
  currency: 'INR',
  exchangeRate: 83.5,
  status: 'idle',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrencyManually(state, action) {
      const { currency, exchangeRate } = action.payload;
      state.currency = currency;
      state.exchangeRate = exchangeRate || FALLBACK_RATES[currency] || 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocaleSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLocaleSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countryCode = action.payload.countryCode;
        state.currency = action.payload.currency;
        state.exchangeRate = action.payload.exchangeRate;
      })
      .addCase(fetchLocaleSettings.rejected, (state) => {
        state.status = 'failed';
        // Fallback to defaults on failure
      });
  },
});

export const { setCurrencyManually } = settingsSlice.actions;

export const selectSettings = (state) => state.settings;

export default settingsSlice.reducer;
