import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../store/searchSlice';
import { Search, MapPin, Calendar, Train } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [classType, setClassType] = useState('SL');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source || !destination || !date) return;
    
    dispatch(setSearchParams({ source, destination, date, class: classType }));
    navigate('/search');
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Train journey" 
          className="w-full h-[600px] object-cover opacity-30"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Book Your Next Journey with RailOne
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Fast, secure, and reliable train ticket booking across the country.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border-t-4 border-orange-500">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                  placeholder="NDLS, Delhi"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                  placeholder="CSMT, Mumbai"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium text-slate-900"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
              <div className="relative">
                <Train className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium text-slate-900 appearance-none"
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                >
                  <option value="All">All Classes</option>
                  <option value="1A">1AC</option>
                  <option value="2A">2AC</option>
                  <option value="3A">3AC</option>
                  <option value="SL">Sleeper</option>
                  <option value="CC">Chair Car</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-1">
              <button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 h-[50px]"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
