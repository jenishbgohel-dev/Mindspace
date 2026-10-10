import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Headphones,
  Flag,
  ShieldCheck,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, signup, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setErrorMessage(res.error || 'Google sign in failed. Please try again.');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to sign in with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        if (!email.trim()) {
          setErrorMessage('Please enter your university or academic email.');
          setIsSubmitting(false);
          return;
        }
        if (!password.trim()) {
          setErrorMessage('Please enter your password.');
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
        if (!password.trim() || password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }
        const res = await signup({ name, email, major, password });
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create student account.');
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-800 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <header className="px-6 sm:px-12 py-5 flex items-center justify-between border-b border-slate-200/60 bg-white/60 backdrop-blur-md">
        <BrandLogo size="md" tagline={true} />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold text-slate-700">MindSpace Student Portal</span>
        </div>
      </header>

      {/* Main Hero & Login Split Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Platform Value & Highlights */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Academic Horizon & Wellness Sanctuary</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Where Rigorous Study Meets{' '}
              <span className="text-[#2E6B4D] underline decoration-emerald-300 decoration-wavy decoration-2">
                Inner Balance.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              MindSpace unites Pomodoro focus sessions, ambient audio, semester milestone tracking, and daily emotional journaling into a single disciplined workspace.
            </p>

            {/* 3 Value Pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Procedural Ambient Audio & Pomodoro
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Real-time soundscapes (Rain, Pine Forest, Cafe, Ocean) calibrated for deep cognitive flow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Semester Velocity & Milestones
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Deconstruct complex syllabi into trackable deliverables and pace indicators.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Mood Journal & Guided Box Breathing
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Daily check-ins, stress logs, and rhythmic 4-4-4-4 nervous system resets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
              {/* Card Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {mode === 'signin' ? 'Sign In to Your Workspace' : 'Create Student Account'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === 'signin'
                    ? 'Authenticate securely with Google or your academic email.'
                    : 'Register your student profile to begin tracking coursework.'}
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-3 px-4 mb-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs flex items-center justify-center gap-3 cursor-pointer hover:border-slate-300 disabled:opacity-60"
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
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
              </button>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider relative">
                  or email sign in
                </span>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className={`py-2 rounded-xl transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium text-left">
                  {errorMessage}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                {mode === 'signup' && (
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
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Major / Academic Department
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Cognitive Science, Computer Science"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <span className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer">
                        Forgot Password?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
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

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2E6B4D] hover:bg-[#25573e] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <span>{mode === 'signin' ? 'Sign In to MindSpace' : 'Create Student Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Security Footnote */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Powered by Firebase Authentication & Firestore real-time cloud persistence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/50">
        MindSpace Academic & Well-Being Platform • Fall Term 2026
      </footer>
    </div>
  );
};
