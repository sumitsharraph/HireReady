import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'google';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'signin' }) => {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useAuth();
  const { sendLocalAlert } = useNotification();

  const [mode, setMode] = useState<'signin' | 'signup'>(
    initialMode === 'signup' ? 'signup' : 'signin'
  );

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState(user?.email || 'vikash607877@gmail.com');
  const [signInPassword, setSignInPassword] = useState('••••••••');

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    name: user?.name && user.name !== 'Rohan Sharma' ? user.name : 'Vikash',
    email: 'vikash607877@gmail.com',
    password: '',
    college: 'National Institute of Technology',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    passingBatch: 2027,
    cgpa: 8.5,
    phone: '+91 98765 43210'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async (customEmail?: string) => {
    setIsGoogleLoading(true);
    try {
      const emailToUse = customEmail || 'vikash607877@gmail.com';
      const signedInUser = await signInWithGoogle(emailToUse);
      sendLocalAlert(
        'Google Authentication Successful',
        `Signed in as ${signedInUser.email} via Google Account.`,
        'success'
      );
      onClose();
    } catch (err: any) {
      sendLocalAlert('Google Sign In Failed', err.message, 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const authUser = await signInWithEmail(signInEmail, signInPassword);
      sendLocalAlert('Welcome back!', `Logged in successfully as ${authUser.email}`, 'success');
      onClose();
    } catch (err: any) {
      sendLocalAlert('Sign In Failed', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.name.trim() || !signUpData.email.trim()) return;

    setIsSubmitting(true);
    try {
      const authUser = await signUpWithEmail({
        ...signUpData,
        passingBatch: Number(signUpData.passingBatch),
        cgpa: Number(signUpData.cgpa)
      });
      sendLocalAlert('Account Created', `Welcome to HireReady, ${authUser.name}!`, 'success');
      onClose();
    } catch (err: any) {
      sendLocalAlert('Registration Failed', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-none">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {mode === 'signin' ? 'Sign In to HireReady' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Campus Placement & AI Intelligence Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Google / Gmail 1-Click Sign-in Button */}
          <div className="space-y-2">
            <button
              type="button"
              id="google-signin-btn"
              disabled={isGoogleLoading}
              onClick={() => handleGoogleSignIn('vikash607877@gmail.com')}
              className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50"
            >
              {/* Google Colored Vector Icon */}
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
              <span>
                {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google (Gmail)'}
              </span>
            </button>

            {/* Quick Gmail Preset Tag */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 font-medium">
              <span>Sign in with your Google Account:</span>
              <button
                type="button"
                onClick={() => handleGoogleSignIn('vikash607877@gmail.com')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                vikash607877@gmail.com
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider relative">
              Or with email credentials
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Email / Gmail Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikash607877@gmail.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">Password</label>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'Signing In...' : 'Sign In with Credentials'}</span>
              </button>
            </form>
          )}

          {/* Create Account Form */}
          {mode === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikash"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Gmail / College Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikash607877@gmail.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIT Trichy"
                    value={signUpData.college}
                    onChange={(e) => setSignUpData({ ...signUpData, college: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Branch / Specialization
                  </label>
                  <select
                    value={signUpData.branch}
                    onChange={(e) => setSignUpData({ ...signUpData, branch: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  >
                    <option value="Computer Science and Engineering">Computer Science & Eng (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="AI & Data Science">AI & Data Science (AIDS)</option>
                    <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                    <option value="Electrical Engineering">Electrical Engineering (EEE)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Passing Batch Year
                  </label>
                  <select
                    value={signUpData.passingBatch}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, passingBatch: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  >
                    <option value={2026}>2026</option>
                    <option value={2027}>2027 (Active Graduating)</option>
                    <option value={2028}>2028</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Current CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={signUpData.cgpa}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, cgpa: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating Profile...' : 'Create Account & Sync Placement Data'}</span>
              </button>
            </form>
          )}

          {/* Current Session Indicator */}
          {user && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                    Active: {user.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  sendLocalAlert('Signed Out', 'You have signed out of your session.', 'info');
                }}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
