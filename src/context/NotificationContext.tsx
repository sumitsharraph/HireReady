import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface NotificationContextType {
  hasBrowserPermission: boolean;
  requestBrowserPermission: () => Promise<boolean>;
  sendLocalAlert: (title: string, message: string, type?: ToastItem['type']) => void;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasBrowserPermission, setHasBrowserPermission] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasBrowserPermission(Notification.permission === 'granted');
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }, []);

  const requestBrowserPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      sendLocalAlert('Notifications Unavailable', 'Browser does not support notifications or is in an iframe.', 'warning');
      return false;
    }

    try {
      const perm = await Notification.requestPermission();
      const granted = perm === 'granted';
      setHasBrowserPermission(granted);
      if (granted) {
        sendLocalAlert('Browser Notifications Enabled', 'You will receive timely alerts for upcoming placement drive deadlines and test dates.', 'success');
      }
      return granted;
    } catch {
      return false;
    }
  };

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const sendLocalAlert = useCallback((title: string, message: string, type: ToastItem['type'] = 'info') => {
    playNotificationSound();
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    // Add in-app toast
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);

    // Auto dismiss after 5s
    setTimeout(() => {
      dismissToast(id);
    }, 5000);

    // Also trigger Browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`HireReady: ${title}`, {
          body: message,
          icon: '/favicon.ico'
        });
      } catch {
        // Fallback gracefully
      }
    }
  }, [playNotificationSound, dismissToast]);

  return (
    <NotificationContext.Provider
      value={{
        hasBrowserPermission,
        requestBrowserPermission,
        sendLocalAlert,
        toasts,
        dismissToast,
        playNotificationSound
      }}
    >
      {children}

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100'
                : 'bg-slate-900/95 border-slate-700/60 text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
                <p className="text-xs mt-1 text-slate-300/90 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
