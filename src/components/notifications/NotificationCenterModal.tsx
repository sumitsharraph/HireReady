import React, { useState } from 'react';
import { X, Bell, Check, Clock, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationCenterModalProps {
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, setActiveView } = useApp();
  const [filter, setFilter] = useState<'All' | 'Deadline Approaching' | 'Skill Gap Alert' | 'Interview Performance'>('All');

  const filteredNotifs = notifications.filter(n => filter === 'All' || n.category === filter);

  const handleAction = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.actionLink) {
      const viewMap: Record<string, any> = {
        '/tracker': 'tracker',
        '/roadmap': 'roadmap',
        '/interview': 'mock-ai',
        '/matching': 'matching'
      };
      if (viewMap[notif.actionLink]) {
        setActiveView(viewMap[notif.actionLink]);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Placement Notifications</h3>
              <p className="text-xs text-slate-400">Deadlines, test alerts, and AI performance updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => markAllNotificationsRead()}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/20 flex gap-2 overflow-x-auto text-xs">
          {(['All', 'Deadline Approaching', 'Skill Gap Alert', 'Interview Performance'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                filter === tab
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No notifications found in this category.
            </div>
          ) : (
            filteredNotifs.map(n => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all ${
                  n.isRead
                    ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                    : 'bg-indigo-950/20 border-indigo-500/30 text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      n.category === 'Deadline Approaching'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : n.category === 'Skill Gap Alert'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {n.category === 'Deadline Approaching' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : n.category === 'Skill Gap Alert' ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold leading-tight">{n.title}</h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {n.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {n.actionLink && (
                    <button
                      onClick={() => handleAction(n)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
