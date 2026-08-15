import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setupStore, selectCurrentUser, selectAuthLoading } from '../store/authSlice';
import { FiPackage, FiPhone, FiFileText, FiTag, FiArrowRight } from 'react-icons/fi';

const CATEGORIES = ['Electronics', "Men's Clothing", "Women's Clothing", 'Jewelery', 'Home & Garden', 'Sports & Outdoors', 'Books', 'Toys & Games'];

export default function SellerOnboardingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [form, setForm] = useState({ storeName: '', category: '', description: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  if (!user || user.role !== 'seller') { navigate('/'); return null; }
  if (user.storeSetup) { navigate('/seller/dashboard'); return null; }

  const validate = (f) => {
    const e = {};
    if (!f.storeName.trim()) e.storeName = 'Store name is required';
    else if (f.storeName.length < 3) e.storeName = 'Min 3 characters';
    if (!f.category) e.category = 'Please select a category';
    if (!f.description.trim()) e.description = 'Description is required';
    else if (f.description.length < 20) e.description = 'Min 20 characters';
    if (!f.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{8,}$/.test(f.phone)) e.phone = 'Enter a valid phone number';
    return e;
  };

  const handleChange = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (touched[k]) setErrors(validate({ ...form, [k]: v })); };
  const handleBlur = (k) => { setTouched(t => ({ ...t, [k]: true })); setErrors(validate(form)); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ storeName: true, category: true, description: true, phone: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    dispatch(setupStore({ storeName: form.storeName, storeDescription: form.description, storeCategory: form.category, phone: form.phone }));
    navigate('/seller/dashboard');
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <FiPackage size={30} className="text-blue-400" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Seller Onboarding</h1>
          <p className="text-gray-400">Tell us about your store. Our admin team will review and approve within 24–48 hours.</p>
        </div>

        <div className="glass p-8 animate-fade-in-up">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-dark-700/50 rounded-xl">
            {['Register', 'Store Details', 'Admin Review', 'Go Live!'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < 2 ? 'bg-blue-500 text-white' : i === 2 ? 'bg-dark-600 text-gray-400 border-2 border-dashed border-gray-600' : 'bg-dark-600 text-gray-500'}`}>{i < 2 ? '✓' : i + 1}</div>
                <span className={`text-xs hidden sm:block ${i < 2 ? 'text-blue-400' : 'text-gray-500'}`}>{step}</span>
                {i < 3 && <div className={`flex-1 h-0.5 ${i < 1 ? 'bg-blue-500' : 'bg-dark-600'} rounded-full hidden sm:block`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Store Name *</label>
              <div className="relative">
                <FiPackage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input id="store-name" type="text" value={form.storeName} onChange={e => handleChange('storeName', e.target.value)} onBlur={() => handleBlur('storeName')} placeholder="e.g. Tech Galaxy Store" className={`input-field pl-11 ${errors.storeName ? 'border-red-500' : ''}`} />
              </div>
              {errors.storeName && <p className="mt-1 text-red-400 text-xs">⚠ {errors.storeName}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Category *</label>
              <div className="relative">
                <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={17} />
                <select id="store-category" value={form.category} onChange={e => handleChange('category', e.target.value)} onBlur={() => handleBlur('category')} className={`input-field pl-11 appearance-none ${errors.category ? 'border-red-500' : ''}`}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.category && <p className="mt-1 text-red-400 text-xs">⚠ {errors.category}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Description * <span className="text-gray-500 font-normal">(min 20 chars)</span></label>
              <div className="relative">
                <FiFileText className="absolute left-3.5 top-3.5 text-gray-400" size={17} />
                <textarea id="store-desc" value={form.description} onChange={e => handleChange('description', e.target.value)} onBlur={() => handleBlur('description')} placeholder="Tell us about your business, products you sell, and what makes your store unique..." rows={4} className={`input-field pl-11 resize-none ${errors.description ? 'border-red-500' : ''}`} />
              </div>
              <div className="flex justify-between mt-1">
                {errors.description ? <p className="text-red-400 text-xs">⚠ {errors.description}</p> : <span />}
                <span className="text-gray-500 text-xs">{form.description.length} chars</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Phone *</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input id="store-phone" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} placeholder="+1 234 567 8900" className={`input-field pl-11 ${errors.phone ? 'border-red-500' : ''}`} />
              </div>
              {errors.phone && <p className="mt-1 text-red-400 text-xs">⚠ {errors.phone}</p>}
            </div>

            {/* Info box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
              <p className="font-semibold mb-1">📋 What happens next?</p>
              <ul className="space-y-1 text-xs text-blue-200/80">
                <li>✓ Your application is submitted to our admin team</li>
                <li>✓ Review typically takes 24–48 hours</li>
                <li>✓ You'll get access to your Seller Dashboard upon approval</li>
              </ul>
            </div>

            <button type="submit" id="onboarding-submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
              Submit for Admin Approval <FiArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
