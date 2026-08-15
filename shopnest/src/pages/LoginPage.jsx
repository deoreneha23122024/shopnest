import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser, selectAuthError, selectIsLoggedIn, selectUserRole, selectAuthLoading, firebaseLoginUser, devPhoneLoginUser } from '../store/authSlice';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

// Tab types
const TABS = { EMAIL: 'email', PHONE: 'phone' };

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const role = useSelector(selectUserRole);
  const loading = useSelector(selectAuthLoading);

  const [tab, setTab] = useState(TABS.EMAIL);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState({});

  // Phone OTP states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneStep, setPhoneStep] = useState(1); // 1 = enter phone, 2 = enter OTP
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Google loading & error
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  if (isLoggedIn) {
    if (role === 'seller') navigate('/seller/dashboard');
    else navigate('/');
    return null;
  }

  const emailErr = touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email' : '';
  const pwdErr = touched.pwd && password.length < 6 ? 'Min 6 characters' : '';

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, pwd: true });
    if (emailErr || pwdErr || !email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setGoogleError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      dispatch(firebaseLoginUser({ idToken }));
    } catch (err) {
      setGoogleError(err.message);
      console.error('Google login error:', err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) { setPhoneError('Enter a valid phone number'); return; }
    setPhoneLoading(true);
    setPhoneError('');
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      const result = await signInWithPhoneNumber(auth, `+91${phone.replace(/\D/g, '')}`, window.recaptchaVerifier);
      setConfirmationResult(result);
      setPhoneStep(2);
    } catch (err) {
      setPhoneError('Failed to send OTP. Check your number and try again.');
      console.error(err.message);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setPhoneError('Enter the 6-digit OTP'); return; }
    setPhoneLoading(true);
    setPhoneError('');
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      dispatch(firebaseLoginUser({ idToken }));
    } catch (err) {
      setPhoneError('Invalid OTP. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-10">
      <div id="recaptcha-container" />
      <div className="w-full max-w-md">
        <div className="glass p-8 sm:p-10 animate-fade-in-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center font-bold text-white text-2xl shadow-xl shadow-accent/30 mb-4">
              S
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Welcome Back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-medium transition-all mb-4 disabled:opacity-60"
            id="google-login-btn"
          >
            <FcGoogle size={22} />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {googleError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
              {googleError}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="text-gray-500 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          {/* Tabs */}
          <div className="flex bg-dark-800 rounded-xl p-1 mb-6">
            {[{ id: TABS.EMAIL, label: '📧 Email' }, { id: TABS.PHONE, label: '📱 Phone OTP' }].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setPhoneStep(1); setPhoneError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-accent text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Email Tab */}
          {tab === TABS.EMAIL && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input
                    id="login-email" type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                    placeholder="you@example.com"
                    className={`input-field pl-11 ${emailErr ? 'border-red-500' : ''}`}
                  />
                </div>
                {emailErr && <p className="mt-1 text-red-400 text-xs">⚠ {emailErr}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input
                    id="login-password" type={showPwd ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, pwd: true }))}
                    placeholder="Min 6 characters"
                    className={`input-field pl-11 pr-11 ${pwdErr ? 'border-red-500' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPwd ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {pwdErr && <p className="mt-1 text-red-400 text-xs">⚠ {pwdErr}</p>}
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {authError}
                </div>
              )}

              <button type="submit" id="login-submit" disabled={loading} className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Phone OTP Tab */}
          {tab === TABS.PHONE && (
            <div className="animate-fade-in">
              {phoneStep === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                    <div className="relative flex">
                      <span className="flex items-center px-3.5 bg-dark-700 border border-r-0 border-dark-600 rounded-l-xl text-gray-300 text-sm font-medium">🇮🇳 +91</span>
                      <input
                        id="phone-input"
                        type="tel" value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="input-field rounded-l-none flex-1"
                      />
                    </div>
                  </div>
                  {phoneError && <p className="text-red-400 text-xs">⚠ {phoneError}</p>}
                  <button type="submit" disabled={phoneLoading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    {phoneLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiPhone size={16} />}
                    {phoneLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiPhone className="text-accent" size={22} />
                    </div>
                    <p className="text-gray-300 text-sm">OTP sent to <span className="text-white font-semibold">+91 {phone}</span></p>
                    <button type="button" onClick={() => setPhoneStep(1)} className="text-accent text-xs hover:underline mt-1">Change number</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Enter 6-Digit OTP</label>
                    <input
                      id="otp-input"
                      type="text" maxLength={6} value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                    />
                  </div>
                  {phoneError && <p className="text-red-400 text-xs text-center">⚠ {phoneError}</p>}
                  <button type="submit" disabled={phoneLoading || otp.length !== 6} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                    {phoneLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={16} />}
                    {phoneLoading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
