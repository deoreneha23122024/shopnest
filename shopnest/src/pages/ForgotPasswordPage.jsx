import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="glass p-8 sm:p-10 animate-fade-in-up">
          {status === 'sent' ? (
            /* Success state */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiCheck className="text-green-400" size={30} />
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-3">Check Your Email</h2>
              <p className="text-gray-400 text-sm mb-2">{message}</p>
              <p className="text-gray-500 text-xs mb-8">The link expires in <span className="text-white">30 minutes</span>.</p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <FiArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-accent/30 mb-4">
                  🔐
                </div>
                <h1 className="font-display font-bold text-2xl text-white">Forgot Password</h1>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  Enter your email and we'll send a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field pl-11"
                      required
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  id="forgot-submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-accent hover:underline font-medium">Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
