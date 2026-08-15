import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchParams: {
    source: '',
    destination: '',
    date: '',
    class: 'SL', // Default Sleeper
  },
  searchResults: [],
  loading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams(state, action) {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    setSearchResults(state, action) {
      state.searchResults = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    updateSeatCount(state, action) {
      const { trainId, date, classType, count } = action.payload;
      const train = state.searchResults.find(t => t.id === trainId);
      if (train) {
        const cls = train.classes.find(c => c.type === classType);
        if (cls) {
          cls.availableSeats = count;
        }
      }
    }
  },
});

export const { setSearchParams, setSearchResults, setLoading, updateSeatCount } = searchSlice.actions;
export default searchSlice.reducer;
