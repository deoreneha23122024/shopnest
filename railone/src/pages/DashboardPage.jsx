import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { pnr, selectedTrain, selectedClass } = useSelector(state => state.booking);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>

      {pnr ? (
        <div className="bg-white rounded-xl shadow-md border border-green-200 overflow-hidden mb-8">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-green-800">Booking Confirmed</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">PNR Number</p>
                <p className="text-3xl font-bold text-slate-900 tracking-widest">{pnr}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Status</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">CNF</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-slate-500 text-sm mb-1">Train</p>
                <p className="font-bold text-slate-900">{selectedTrain?.name}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Train No</p>
                <p className="font-bold text-slate-900">{selectedTrain?.id}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Class</p>
                <p className="font-bold text-slate-900">{selectedClass?.type}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Date</p>
                <p className="font-bold text-slate-900">Today</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No active bookings</h2>
          <p className="text-slate-500 mb-6">You haven't booked any tickets yet. Ready for a journey?</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Book a Ticket
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
