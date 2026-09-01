import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  FileText,
  User,
  PlusCircle,
  RotateCcw,
  Volume2,
  Calendar,
  Layers,
  ChevronDown,
  LogIn,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { ThemeToggle } from '../theme/ThemeToggle';
import { AuthModal } from '../auth/AuthModal';
import { ProfileModal } from '../profile/ProfileModal';
import { NotificationCenterModal } from '../notifications/NotificationCenterModal';
import { ReminderModal } from '../reminders/ReminderModal';

export const Navbar: React.FC = () => {
  const { user, profile, resetDemoData } = useAuth();
  const {
    hireReadyScore,
    unreadNotificationCount,
    resumes,
    activeResumeId,
    setActiveResumeId,
    setActiveView,
    isMobileMenuOpen,
    toggleMobileMenu
  } = useApp();
  const { hasBrowserPermission, requestBrowserPermission } = useNotification();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    if (
      confirm(
        'Reset application data to standard college placement demo state (Rohan Sharma, NIT Trichy)?'
      )
    ) {
      setIsResetting(true);
      await resetDemoData();
      setIsResetting(false);
    }
  };

  const score = hireReadyScore?.overallScore ?? 84;

  return (
    <>
      <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 px-2.5 sm:px-4 md:px-6 flex items-center justify-between gap-1.5 sm:gap-4 shadow-xs">
        {/* Left: Hamburger (mobile), Brand Identity & Active Resume Selector */}
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-6 min-w-0">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-indigo-600 dark:bg-indigo-600 shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-sans font-extrabold text-base sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  HireReady
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 hidden sm:inline-block">
                  Campus AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden md:block font-medium truncate">
                Placement Intelligence Platform
              </p>
            </div>
          </div>

          {/* Active Resume Selector Dropdown */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
            <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Active Resume:</span>
            <div className="relative">
              <select
                aria-label="Select Active Resume"
                value={activeResumeId}
                onChange={(e) => setActiveResumeId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 px-3 pr-7 appearance-none focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer max-w-[180px] truncate shadow-2xs"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} {r.isPrimary ? '(Primary)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Actions, Theme Toggle, Score Pill, Notification Bell, User Avatar */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
          {/* Quick Notice Paste CTA */}
          <button
            type="button"
            id="nav-quick-notice-btn"
            onClick={() => setActiveView('parser')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 dark:shadow-none transition-all active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Paste Notice</span>
          </button>

          {/* Set Reminder CTA */}
          <button
            type="button"
            id="nav-set-reminder-btn"
            onClick={() => setIsReminderModalOpen(true)}
            title="Set Custom Deadline Reminder"
            className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Add Reminder</span>
          </button>

          {/* HireReady Composite Score Badge */}
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            title="View HireReady Score Diagnostic"
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium shadow-2xs transition-all shrink-0"
          >
            <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide">
              Score
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <span
                className={`font-black text-xs sm:text-sm ${
                  score >= 80
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : score >= 65
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {score}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold">/100</span>
            </div>
          </button>

          {/* Theme Toggle (Light / Dark / System) */}
          <ThemeToggle />

          {/* Notification Bell */}
          <button
            type="button"
            id="nav-notification-bell-btn"
            onClick={() => setIsNotifsOpen(true)}
            className="relative p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors shrink-0"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            type="button"
            id="nav-reset-demo-btn"
            onClick={handleResetDemo}
            disabled={isResetting}
            title="Reset to Verified Demo State"
            className="hidden md:inline-flex p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors disabled:opacity-50 shrink-0"
            aria-label="Reset Demo"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          </button>

          {/* Sign In / Gmail Account Button */}
          <button
            type="button"
            id="nav-auth-modal-btn"
            onClick={() => setIsAuthOpen(true)}
            title="Sign In with Gmail / Account Management"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors shrink-0 whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{user?.authProvider === 'google' ? 'Google' : 'Sign In'}</span>
          </button>

          {/* Student Profile Avatar & Trigger */}
          <button
            type="button"
            id="nav-user-profile-btn"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:py-1 sm:pr-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors shrink-0"
          >
            <div className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0">
              {user?.avatarUrl || profile?.avatarUrl ? (
                <img
                  src={user?.avatarUrl || profile?.avatarUrl}
                  alt={user?.name || profile?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                'VK'
              )}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[110px]">
                {user?.name || profile?.name || 'Vikash'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[110px]">
                {user?.email || profile?.email || 'vikash607877@gmail.com'}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}

      {/* Profile Modal */}
      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}

      {/* Notification Center Modal */}
      {isNotifsOpen && <NotificationCenterModal onClose={() => setIsNotifsOpen(false)} />}

      {/* Reminder Creator Modal */}
      {isReminderModalOpen && <ReminderModal onClose={() => setIsReminderModalOpen(false)} />}
    </>
  );
};
