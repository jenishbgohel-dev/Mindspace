import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    signInWithGoogle,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setErrorMessage(res.error || 'Google sign in failed.');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Google sign in failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        if (!email.trim()) {
          setErrorMessage('Please enter your student or academic email.');
          setIsSubmitting(false);
          return;
        }
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in.');
        }
      } else {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Please enter a valid university or personal email.');
          setIsSubmitting(false);
          return;
        }
        const res = await signup({ name, email, major, password });
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create account.');
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-[#F4F8F5] to-white border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showText={false} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {authModalMode === 'login' ? 'Welcome Back to MindSpace' : 'Join MindSpace Community'}
              </h2>
              <p className="text-xs text-slate-500">
                {authModalMode === 'login'
                  ? 'Sign in to access your study pipeline, wellness streak & notes.'
                  : 'Start tracking academic milestones & cognitive well-being.'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Sign In Quick Button */}
        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs flex items-center justify-center gap-3 cursor-pointer hover:border-slate-300 disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative px-6 py-2 flex items-center justify-center">
          <div className="border-t border-slate-100 w-full" />
          <span className="bg-white px-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider relative">
            or
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pb-1">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signup');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-all ${
                authModalMode === 'signup'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-3.5">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Major / Field of Study
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Cognitive Science, Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password
              </label>
              {authModalMode === 'login' && (
                <span className="text-[11px] text-emerald-700 hover:text-emerald-900 cursor-pointer">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2E6B4D] hover:bg-[#25573e] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <span>{authModalMode === 'login' ? 'Sign In to MindSpace' : 'Create Student Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
