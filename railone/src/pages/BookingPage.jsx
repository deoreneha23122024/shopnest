import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { lockSeats, confirmBooking, clearBooking } from '../store/bookingSlice';
import toast from 'react-hot-toast';
import { Clock, Users, ShieldCheck } from 'lucide-react';

const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTrain, selectedClass, bookingStatus } = useSelector(state => state.booking);
  
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'M' }]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!selectedTrain) {
      navigate('/search');
      return;
    }

    // Start timer for seat lock
    dispatch(lockSeats());
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Booking session expired!');
          dispatch(clearBooking());
          navigate('/search');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTrain, navigate, dispatch]);

  const handleAddPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: '', age: '', gender: 'M' }]);
    } else {
      toast.error('Maximum 6 passengers allowed');
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isValid = passengers.every(p => p.name && p.age);
    if (!isValid) {
      toast.error('Please fill all passenger details');
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const amount = (selectedClass?.price || 0) * passengers.length * 100;

    const options = {
      key: 'rzp_test_dummy_key_use_real_one_for_prod', 
      amount: amount.toString(),
      currency: 'INR',
      name: 'RailOne Booking',
      description: `Payment for ${selectedTrain?.name} - ${selectedClass?.type}`,
      handler: function (response) {
        toast.success('Payment successful!');
        const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10 digit PNR
        dispatch(confirmBooking({ pnr, paymentId: response.razorpay_payment_id }));
        navigate('/dashboard');
      },
      prefill: {
        name: passengers[0].name,
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#f97316' // orange-500
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (!selectedTrain) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-orange-800 font-semibold">
          <Clock className="w-5 h-5" />
          <span>Session expires in:</span>
        </div>
        <div className="text-2xl font-bold text-orange-600 font-mono tracking-wider">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-800 px-6 py-4 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Train className="w-6 h-6" />
            Journey Details
          </h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">{selectedTrain.name} ({selectedTrain.id})</h3>
              <p className="text-slate-500">Class: <span className="font-semibold text-slate-700">{selectedClass.type}</span></p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">₹{selectedClass.price}</div>
              <p className="text-sm text-slate-500">per passenger</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-600" />
            Passenger Details
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {passengers.map((p, i) => (
            <div key={i} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex-grow">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={p.name}
                  onChange={(e) => handlePassengerChange(i, 'name', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Passenger Name"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  value={p.age}
                  onChange={(e) => handlePassengerChange(i, 'age', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Age"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Gender</label>
                <select 
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(i, 'gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
          ))}
          
          <button 
            onClick={handleAddPassenger}
            className="text-orange-600 font-semibold hover:text-orange-700 transition-colors mt-2 inline-block"
          >
            + Add Another Passenger
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex justify-between items-center">
        <div>
          <div className="text-slate-500 font-medium">Total Amount</div>
          <div className="text-3xl font-bold text-slate-900">
            ₹{selectedClass.price * passengers.length}
          </div>
        </div>
        <button 
          onClick={handlePayment}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          Pay Securely
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
