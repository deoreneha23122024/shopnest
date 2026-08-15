import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { socket } from './services/socket';
import { updateSeatCount } from './store/searchSlice';

// Components
import Navbar from './components/Navbar';
// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();
    
    socket.on('inventory-update', (data) => {
      // data format expected: { trainId: string, date: string, classType: string, count: number }
      dispatch(updateSeatCount(data));
    });

    return () => {
      socket.off('inventory-update');
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Toaster position="top-center" />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm">
        <p>&copy; 2026 RailOne. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
