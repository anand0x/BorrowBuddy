import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Lock, Mail, AlertCircle, Sparkles, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const from = (location.state as any)?.from?.pathname || '/explore';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast({
        type: 'success',
        title: 'Welcome Back! 👋',
        message: 'Successfully logged in to BorrowBuddy.'
      });
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Failed to log in.');
    }
  };

  const handleFillDemo = (userIndex: 1 | 2) => {
    if (userIndex === 1) {
      setEmail('student1@demo.com');
      setPassword('Demo1234');
    } else {
      setEmail('student2@demo.com');
      setPassword('Demo1234');
    }
    setError(null);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast({ type: 'error', message: 'Please enter your email.' });
      return;
    }
    setIsForgotModalOpen(false);
    showToast({
      type: 'info',
      title: 'Password Reset Link Sent',
      message: `A password reset link was sent to ${forgotEmail}. (Prototype simulation)`
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-soft-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-soft">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              BorrowBuddy
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Campus Access
          </h2>
          <p className="text-xs text-slate-500">
            Why buy when you can borrow? Connect with students around you.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. rahul@gmail.com or student1@demo.com"
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-xs transition shadow-soft flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEMO ACCOUNTS QUICK-FILL SECTION (Requirement #52) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Design Thinking Demo Accounts</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            One-click fill demo student accounts to test peer-to-peer flows:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo(1)}
              className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-left transition"
            >
              <div className="font-bold text-xs text-indigo-900">Demo User 1</div>
              <div className="text-[10px] text-indigo-700 font-mono">Rahul (Owner)</div>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo(2)}
              className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-left transition"
            >
              <div className="font-bold text-xs text-indigo-900">Demo User 2</div>
              <div className="text-[10px] text-indigo-700 font-mono">Priya (Borrower)</div>
            </button>
          </div>
        </div>

        {/* Signup Link */}
        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-soft-xl border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Reset Password</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered email and we'll send you instructions to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-soft"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
