import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, selectAuthError, selectIsLoggedIn, selectAuthLoading } from '../store/authSlice';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiPackage, FiCheck } from 'react-icons/fi';

const ROLES = [
  { id: 'buyer', icon: FiShoppingBag, title: 'Buyer', desc: 'Shop products, manage cart & wishlist', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/40', iconCls: 'text-green-400' },
  { id: 'seller', icon: FiPackage, title: 'Seller', desc: 'List products & manage your store', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/40', iconCls: 'text-blue-400' },
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState({});

  if (isLoggedIn) { navigate('/'); return null; }

  const emailErr = touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email' : '';
  const pwdErr = touched.pwd && password.length < 6 ? 'Min 6 characters' : '';
  const confirmErr = touched.confirm && password !== confirmPwd ? 'Passwords do not match' : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, pwd: true, confirm: true });
    if (emailErr || pwdErr || confirmErr || !email || !password || !confirmPwd) return;
    dispatch(registerUser({ name: email.split('@')[0], email, password, role: selectedRole }));
    if (selectedRole === 'seller') navigate('/seller/onboarding');
    else navigate('/');
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="glass p-8 sm:p-10 animate-fade-in-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary-400 flex items-center justify-center font-display font-bold text-white text-2xl shadow-xl shadow-accent/30 mb-4">S</div>
            <h1 className="font-display font-bold text-2xl text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Join ShopNest today</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-accent text-white' : 'bg-dark-700 text-gray-500'}`}>
                  {step > s ? <FiCheck size={14} /> : s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? 'text-white' : 'text-gray-500'}`}>{s === 1 ? 'Choose Role' : 'Your Details'}</span>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-accent' : 'bg-dark-600'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-gray-300 text-sm text-center mb-4">How do you want to use ShopNest?</p>
              <div className="grid grid-cols-2 gap-4">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`card p-5 text-left transition-all duration-200 bg-gradient-to-br ${r.color} border-2 ${selectedRole === r.id ? r.border + ' scale-[1.02] shadow-lg' : 'border-dark-600'}`}
                  >
                    <r.icon size={24} className={`${r.iconCls} mb-3`} />
                    <h3 className="text-white font-semibold mb-1">{r.title}</h3>
                    <p className="text-gray-400 text-xs">{r.desc}</p>
                    {selectedRole === r.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                        <FiCheck size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedRole === 'seller' && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-blue-300 text-xs">
                  ℹ️ As a seller, you'll submit store details and wait for <strong>Admin approval</strong> before accessing your dashboard.
                </div>
              )}
              <button
                onClick={() => { if (selectedRole) setStep(2); }}
                disabled={!selectedRole}
                className="btn-primary w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}
              </button>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(t => ({ ...t, email: true }))} placeholder="you@example.com" className={`input-field pl-11 ${emailErr ? 'border-red-500' : ''}`} />
                </div>
                {emailErr && <p className="mt-1 text-red-400 text-xs">⚠ {emailErr}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input id="reg-password" type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onBlur={() => setTouched(t => ({ ...t, pwd: true }))} placeholder="Min 6 characters" className={`input-field pl-11 pr-11 ${pwdErr ? 'border-red-500' : ''}`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">{showPwd ? <FiEyeOff size={17} /> : <FiEye size={17} />}</button>
                </div>
                {pwdErr && <p className="mt-1 text-red-400 text-xs">⚠ {pwdErr}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input id="reg-confirm" type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} onBlur={() => setTouched(t => ({ ...t, confirm: true }))} placeholder="Repeat password" className={`input-field pl-11 ${confirmErr ? 'border-red-500' : ''}`} />
                </div>
                {confirmErr && <p className="mt-1 text-red-400 text-xs">⚠ {confirmErr}</p>}
              </div>
              {authError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{authError}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
                <button type="submit" id="reg-submit" className="btn-primary flex-1 py-3">Create Account</button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-400 text-sm mt-5">
            Already have an account? <Link to="/login" className="text-accent hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
