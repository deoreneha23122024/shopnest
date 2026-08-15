import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const pwdStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return;
    if (password !== confirm) { setMessage('Passwords do not match'); setStatus('error'); return; }

    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Auto-login the user
        dispatch(setCredentials({ user: data.user, token: data.token }));
        setStatus('success');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="glass p-10 text-center max-w-md w-full animate-fade-in-up">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCheck className="text-green-400" size={30} />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-3">Password Reset!</h2>
          <p className="text-gray-400 text-sm">You're now logged in. Redirecting to home...</p>
          <div className="mt-4 w-full bg-dark-700 rounded-full h-1.5">
            <div className="h-full bg-accent rounded-full animate-[grow_2s_ease-in-out]" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="glass p-8 sm:p-10 animate-fade-in-up">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-accent/30 mb-4">
              🔑
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Set New Password</h1>
            <p className="text-gray-400 text-sm mt-1">Choose a strong password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  id="reset-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="input-field pl-11 pr-11"
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPwd ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwdStrength ? strengthColors[pwdStrength] : 'bg-dark-600'}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${pwdStrength === 1 ? 'text-red-400' : pwdStrength === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {strengthLabels[pwdStrength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  id="reset-confirm"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  className={`input-field pl-11 ${confirm && confirm !== password ? 'border-red-500' : confirm && confirm === password ? 'border-green-500' : ''}`}
                  required
                />
                {confirm && confirm === password && (
                  <FiCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-400" size={17} />
                )}
              </div>
              {confirm && confirm !== password && <p className="mt-1 text-red-400 text-xs">⚠ Passwords don't match</p>}
            </div>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                <FiAlertCircle size={16} /> {message}
              </div>
            )}

            <button
              type="submit"
              id="reset-submit"
              disabled={status === 'loading' || password.length < 6 || password !== confirm}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === 'loading' ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiLock size={16} />}
              {status === 'loading' ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            <Link to="/login" className="text-accent hover:underline">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
