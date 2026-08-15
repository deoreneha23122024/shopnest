import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { placeOrder } from '../store/orderSlice';
import { toast } from 'react-hot-toast';
import { CheckCircle2, ChevronRight, CreditCard, Wallet, Truck, MapPin, Navigation } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { useTranslation } from 'react-i18next';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();

  const [address, setAddress] = useState({
    name: '', mobile: '', pincode: '', locality: '', addressLine: '', city: '', state: '', landmark: '', alternatePhone: '', addressType: 'home'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLocating, setIsLocating] = useState(false);

  if (cartItems.length === 0 && step === 1) {
    navigate('/cart');
    return null;
  }

  const handleNextStep = () => {
    if (step === 1) {
      const { name, mobile, pincode, locality, addressLine, city, state } = address;
      if (!name || !mobile || !pincode || !locality || !addressLine || !city || !state) {
        toast.error('Please fill all required address fields');
        return;
      }
      if (mobile.length !== 10) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error('Geocoding failed');
          const data = await res.json();
          const p = data.address;
          setAddress(prev => ({
            ...prev,
            pincode: p.postcode || prev.pincode,
            city: p.city || p.town || p.county || prev.city,
            state: p.state || prev.state,
          }));
          toast.success('Location fetched successfully!');
        } catch (err) {
          toast.error('Failed to fetch location details');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        toast.error('Location permission denied');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const orderData = { items: cartItems, total: cartTotal, address, paymentMethod };

    if (paymentMethod === 'cod') {
      try {
        await dispatch(placeOrder(orderData)).unwrap();
        dispatch(clearCart());
        toast.success('Order placed successfully! 🎉');
        navigate('/orders');
      } catch (error) {
        toast.error('Failed to place order. Please try again.');
      }
      return;
    }

    // Card / UPI via Razorpay
    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    if (!RAZORPAY_KEY) {
      toast('💳 Online payments coming soon! Please use Cash on Delivery for now.', { icon: 'ℹ️', duration: 4000 });
      return;
    }
    const res = await loadRazorpayScript();
    if (!res) { toast.error('Razorpay SDK failed to load.'); return; }
    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(cartTotal * 100),
      currency: 'INR',
      name: 'ShopNest',
      description: 'Order Payment',
      handler: async function (response) {
        try {
          await dispatch(placeOrder({ ...orderData, paymentId: response.razorpay_payment_id })).unwrap();
          dispatch(clearCart());
          toast.success('Payment successful & Order placed!');
          navigate('/orders');
        } catch (error) { toast.error('Failed to save order'); }
      },
      prefill: { name: address.name, email: 'customer@shopnest.com', contact: address.mobile || '9999999999' },
      theme: { color: '#2874f0' },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
    paymentObject.open();
  };

  const AccordionHeader = ({ num, title, isActive, isCompleted }) => (
    <div className={`flex items-center px-6 py-4 ${isActive ? 'bg-fk-blue text-white' : 'bg-white text-gray-500'} transition-colors`}>
      <div className={`w-6 h-6 rounded-sm text-sm font-medium flex items-center justify-center mr-4 ${isActive ? 'bg-white text-fk-blue' : isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-gray-200 text-gray-500'}`}>
        {isCompleted ? <CheckCircle2 size={16} className="text-fk-blue" /> : num}
      </div>
      <h2 className="text-[16px] font-medium uppercase tracking-wide">{title}</h2>
    </div>
  );

  return (
    <div className="bg-fk-bg min-h-screen py-8 font-sans">
      <div className="max-w-[1000px] mx-auto px-4 flex flex-col lg:flex-row gap-4">
        
        {/* Left Column: Steps */}
        <div className="flex-1 space-y-4">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            <AccordionHeader num="1" title={t('delivery_address')} isActive={step === 1} isCompleted={step > 1} />
            
            {step === 1 && (
              <div className="p-6 bg-gray-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[14px] text-fk-blue font-medium flex items-center cursor-pointer hover:underline" onClick={handleFetchLocation}>
                    <Navigation className="w-4 h-4 mr-1" />
                    {isLocating ? 'Locating...' : 'Use my current location'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <input type="text" placeholder="Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input type="tel" maxLength="10" placeholder="10-digit mobile number" value={address.mobile} onChange={(e) => setAddress({ ...address, mobile: e.target.value.replace(/\D/g,'') })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input type="text" placeholder="Locality" value={address.locality} onChange={(e) => setAddress({ ...address, locality: e.target.value })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <textarea placeholder="Address (Area and Street)" value={address.addressLine} onChange={(e) => setAddress({ ...address, addressLine: e.target.value })} rows="3" className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue resize-none"></textarea>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input type="text" placeholder="City/District/Town" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <select value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue bg-white">
                      <option value="" disabled>--Select State--</option>
                      {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input type="text" placeholder="Landmark (Optional)" value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input type="tel" maxLength="10" placeholder="Alternate Phone (Optional)" value={address.alternatePhone} onChange={(e) => setAddress({ ...address, alternatePhone: e.target.value.replace(/\D/g,'') })} className="border border-gray-300 rounded-sm p-3 text-[14px] focus:outline-none focus:border-fk-blue" />
                  </div>
                </div>

                <div className="mt-4 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={address.addressType === 'home'} onChange={() => setAddress({ ...address, addressType: 'home' })} className="accent-fk-blue" />
                    <span className="text-[14px]">Home</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={address.addressType === 'work'} onChange={() => setAddress({ ...address, addressType: 'work' })} className="accent-fk-blue" />
                    <span className="text-[14px]">Work</span>
                  </label>
                </div>

                <button onClick={handleNextStep} className="mt-6 bg-[#fb641b] hover:bg-[#f25f18] text-white px-8 py-3 rounded-sm font-medium uppercase text-[14px] shadow">
                  {t('save_deliver')}
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Order Summary */}
          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            <AccordionHeader num="2" title={t('order_summary')} isActive={step === 2} isCompleted={step > 2} />
            {step === 2 && (
              <div className="bg-white">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-100 flex gap-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                    <div>
                      <h3 className="text-[14px] text-fk-text mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-[12px] text-gray-500 mb-2">Qty: {item.quantity}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 line-through text-[12px]">{formatPrice(item.price * 1.25)}</span>
                        <span className="font-bold text-[16px]">{formatPrice(item.price)}</span>
                        <span className="text-green-600 font-bold text-[12px]">20% Off</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 flex justify-between items-center bg-gray-50">
                  <span className="text-[14px] text-gray-600">Order confirmation email will be sent to your email.</span>
                  <button onClick={handleNextStep} className="bg-[#fb641b] hover:bg-[#f25f18] text-white px-8 py-3 rounded-sm font-medium uppercase text-[14px] shadow">
                    {t('continue')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Payment */}
          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            <AccordionHeader num="3" title={t('payment_options')} isActive={step === 3} isCompleted={false} />
            {step === 3 && (
              <div className="p-4 space-y-2 bg-white">

                {/* Card */}
                <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-fk-blue" />
                  <CreditCard className="text-fk-blue w-5 h-5" />
                  <div className="flex-1">
                    <span className="text-[14px] font-medium">Credit / Debit / ATM Card</span>
                    <span className="ml-2 text-[11px] text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-sm">Coming Soon</span>
                  </div>
                </label>

                {/* UPI */}
                <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-fk-blue" />
                  <Wallet className="text-fk-blue w-5 h-5" />
                  <div className="flex-1">
                    <span className="text-[14px] font-medium">UPI</span>
                    <span className="ml-2 text-[11px] text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-sm">Coming Soon</span>
                  </div>
                </label>

                {/* COD */}
                <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-fk-blue" />
                  <Truck className="text-fk-blue w-5 h-5" />
                  <div className="flex-1">
                    <span className="text-[14px] font-medium">Cash on Delivery</span>
                    <span className="ml-2 text-[11px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-sm">✓ Available</span>
                  </div>
                </label>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handlePayment}
                    className="bg-[#fb641b] hover:bg-[#f25f18] active:scale-95 text-white px-10 py-3 rounded-sm font-bold uppercase text-[14px] shadow transition-all"
                  >
                    {t('pay', { amount: formatPrice(cartTotal) })}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Price Details */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-white shadow-sm rounded-sm sticky top-20">
            <h2 className="text-gray-500 font-semibold text-[16px] uppercase px-6 py-4 border-b border-gray-100">
              Price Details
            </h2>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-[14px] text-black">
                <span>Price ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(cartTotal * 1.25)}</span>
              </div>
              <div className="flex justify-between text-[14px] text-black">
                <span>Discount</span>
                <span className="text-green-600">- {formatPrice(cartTotal * 0.25)}</span>
              </div>
              <div className="flex justify-between text-[14px] text-black">
                <span>Delivery Charges</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between text-[16px] font-bold text-black">
                <span>Total Amount</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 text-green-600 font-medium text-[14px]">
                You will save {formatPrice(cartTotal * 0.25)} on this order
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
