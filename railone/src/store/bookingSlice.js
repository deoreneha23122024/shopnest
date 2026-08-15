import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTrain: null,
  selectedClass: null,
  passengers: [],
  bookingStatus: 'idle', // idle, locked, paid, confirmed, failed
  pnr: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    startBooking(state, action) {
      state.selectedTrain = action.payload.train;
      state.selectedClass = action.payload.trainClass;
      state.bookingStatus = 'idle';
    },
    setPassengers(state, action) {
      state.passengers = action.payload;
    },
    lockSeats(state) {
      state.bookingStatus = 'locked';
    },
    confirmBooking(state, action) {
      state.bookingStatus = 'confirmed';
      state.pnr = action.payload.pnr;
    },
    clearBooking(state) {
      state.selectedTrain = null;
      state.selectedClass = null;
      state.passengers = [];
      state.bookingStatus = 'idle';
      state.pnr = null;
    }
  }
});

export const { startBooking, setPassengers, lockSeats, confirmBooking, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
