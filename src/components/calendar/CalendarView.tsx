import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { ReminderModal } from '../reminders/ReminderModal';

export const CalendarView: React.FC = () => {
  const { calendarEvents, reminders, deleteCalendarEvent, deleteReminder } = useApp();
  const { sendLocalAlert } = useNotification();

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Application Deadline', 'Coding Test', 'Interview Round', 'Preparation Task'];

  const filteredEvents = calendarEvents.filter(e => filterCategory === 'All' || e.category === filterCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Schedule & Deadlines Hub</span>
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
            Placement Deadlines & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
            Never miss a campus recruitment deadline, online coding assessment slot, or technical interview round.
          </p>
        </div>

        <button
          onClick={() => setIsReminderModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-100 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deadline Reminder</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid: Events Agenda + Active Reminders List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Events Agenda (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Events & Deadlines</h3>
            </div>
            <span className="text-xs text-slate-500 font-sans font-bold">{filteredEvents.length} Scheduled</span>
          </div>

          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No events found under this category.
              </div>
            ) : (
              filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 hover:border-indigo-300 hover:bg-white transition-all text-xs shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2.5 h-10 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: event.color || '#4f46e5' }}
                    ></div>
                    <div>
                      <span className="text-[10px] font-sans uppercase font-bold text-indigo-700 block mb-0.5">
                        {event.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{event.title}</h4>
                      <p className="text-slate-600 text-[11px] mt-1 font-medium">{event.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-sans font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(event.startDateTime).toLocaleDateString()} at {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCalendarEvent(event.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders & Browser Push Triggers (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Active Alarm Reminders</h3>
            </div>
            <span className="text-xs text-slate-500 font-sans font-bold">{reminders.length} Active</span>
          </div>

          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No active alarms configured.
              </div>
            ) : (
              reminders.map(r => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{r.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{r.message}</p>
                    </div>
                    <button
                      onClick={() => deleteReminder(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Dismiss Reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans font-semibold pt-2 border-t border-slate-200">
                    <span>Trigger: {r.timingType}</span>
                    <span>{new Date(r.targetDateTime).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isReminderModalOpen && <ReminderModal onClose={() => setIsReminderModalOpen(false)} />}
    </div>
  );
};
