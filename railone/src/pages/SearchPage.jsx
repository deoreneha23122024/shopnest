import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startBooking } from '../store/bookingSlice';
import { setSearchResults } from '../store/searchSlice';
import { Train, Clock, MapPin, ArrowRight } from 'lucide-react';

const MOCK_TRAINS = [
  {
    id: '12951',
    name: 'Mumbai Rajdhani',
    departure: '17:00',
    arrival: '08:32',
    duration: '15h 32m',
    classes: [
      { type: '1A', price: 4500, availableSeats: 5 },
      { type: '2A', price: 2800, availableSeats: 12 },
      { type: '3A', price: 1900, availableSeats: 45 },
    ]
  },
  {
    id: '12903',
    name: 'Golden Temple Mail',
    departure: '21:25',
    arrival: '13:45',
    duration: '16h 20m',
    classes: [
      { type: '1A', price: 3800, availableSeats: 2 },
      { type: '2A', price: 2100, availableSeats: 8 },
      { type: '3A', price: 1400, availableSeats: 110 },
      { type: 'SL', price: 500, availableSeats: 250 },
    ]
  }
];

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchParams, searchResults } = useSelector(state => state.search);

  useEffect(() => {
    // In a real app, fetch from backend here.
    dispatch(setSearchResults(MOCK_TRAINS));
  }, [dispatch]);

  const handleBook = (train, trainClass) => {
    dispatch(startBooking({ train, trainClass }));
    navigate('/book');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center border border-slate-200">
        <div className="flex items-center gap-4 text-slate-700">
          <div className="font-bold text-lg">{searchParams.source || 'NDLS'}</div>
          <ArrowRight className="w-5 h-5 text-orange-500" />
          <div className="font-bold text-lg">{searchParams.destination || 'CSMT'}</div>
        </div>
        <div className="text-slate-600 font-medium">
          {searchParams.date || new Date().toISOString().split('T')[0]} | Class: {searchParams.class || 'All'}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="text-orange-600 hover:text-orange-800 font-semibold text-sm underline"
        >
          Modify Search
        </button>
      </div>

      <div className="space-y-6">
        {searchResults.map((train) => (
          <div key={train.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:border-orange-300 transition-colors">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Train className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{train.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">#{train.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-center">
                <div>
                  <div className="text-xl font-bold text-slate-900">{train.departure}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-1 justify-center"><MapPin className="w-3 h-3"/> {searchParams.source || 'Origin'}</div>
                </div>
                <div className="flex flex-col items-center w-24">
                  <div className="text-xs font-semibold text-slate-400 mb-1">{train.duration}</div>
                  <div className="w-full h-px bg-slate-300 relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-0.5" />
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{train.arrival}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-1 justify-center"><MapPin className="w-3 h-3"/> {searchParams.destination || 'Dest'}</div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {train.classes.map((cls) => (
                <div 
                  key={cls.type} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${cls.availableSeats > 0 ? 'border-green-200 bg-green-50/30 hover:shadow-md hover:border-green-400' : 'border-slate-200 bg-slate-50 opacity-60'}`}
                  onClick={() => cls.availableSeats > 0 && handleBook(train, cls)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">{cls.type}</span>
                    <span className="font-bold text-orange-600">₹{cls.price}</span>
                  </div>
                  <div className={`text-sm font-semibold ${cls.availableSeats > 20 ? 'text-green-600' : cls.availableSeats > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                    {cls.availableSeats > 0 ? `AVAILABLE - ${cls.availableSeats}` : 'WL/REGRET'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
