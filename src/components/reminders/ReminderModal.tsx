import React, { useState } from 'react';
import { X, Calendar, Clock, Bell, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';

interface ReminderModalProps {
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ onClose }) => {
  const { drives, addCustomReminder, addCalendarEvent } = useApp();
  const { hasBrowserPermission, requestBrowserPermission, sendLocalAlert } = useNotification();

  const [title, setTitle] = useState('');
  const [driveId, setDriveId] = useState(drives[0]?.id || '');
  const [date, setDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [category, setCategory] = useState<'Application Deadline' | 'Online Test' | 'Interview' | 'Preparation Milestone' | 'Document Submission'>('Application Deadline');
  const [timingType, setTimingType] = useState<'1 day before' | '12 hours before' | '6 hours before' | '1 hour before' | 'Custom'>('1 day before');
  const [message, setMessage] = useState('');
  const [isSyncToCalendar, setIsSyncToCalendar] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDriveChange = (selectedDriveId: string) => {
    setDriveId(selectedDriveId);
    const drive = drives.find(d => d.id === selectedDriveId);
    if (drive) {
      setTitle(`${drive.opportunity.company.name} ${category}`);
      if (drive.opportunity.applicationDeadline?.date) {
        setDate(drive.opportunity.applicationDeadline.date);
      }
      if (drive.opportunity.applicationDeadline?.time) {
        setTime(drive.opportunity.applicationDeadline.time.includes(':') ? drive.opportunity.applicationDeadline.time : '10:00');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetDateTime = `${date}T${time}:00`;
      const finalTitle = title || 'Placement Drive Deadline';
      const finalMsg = message || `Reminder for ${finalTitle} scheduled at ${time}, ${date}.`;

      await addCustomReminder({
        driveId: driveId || undefined,
        title: finalTitle,
        message: finalMsg,
        targetDateTime,
        timingType,
        category: category as any
      });

      if (isSyncToCalendar) {
        await addCalendarEvent({
          driveId: driveId || undefined,
          title: finalTitle,
          startDateTime: targetDateTime,
          category: category === 'Application Deadline' ? 'Application Deadline' : category === 'Online Test' ? 'Coding Test' : 'Interview',

          color: category === 'Application Deadline' ? '#ef4444' : category === 'Online Test' ? '#6366f1' : '#10b981',
          description: finalMsg
        });
      }

      onClose();
    } catch (err: any) {
      sendLocalAlert('Failed to Add Reminder', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Add Placement Reminder</h3>
              <p className="text-xs text-slate-500 font-medium">Timely alerts for drive registrations & test slots</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Alert Notice */}
        {!hasBrowserPermission && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-800">
            <div className="flex items-center gap-2 font-medium">
              <Volume2 className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Enable browser push notifications to get alerts when tabs are closed.</span>
            </div>
            <button
              type="button"
              onClick={requestBrowserPermission}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 shrink-0 shadow-xs"
            >
              Enable
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Link to Active Drive */}
          {drives.length > 0 && (
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Attach to Saved Placement Drive</label>
              <select
                value={driveId}
                onChange={e => handleDriveChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value="">-- General Campus Reminder --</option>
                {drives.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.opportunity.company.name} ({d.opportunity.jobRole})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Reminder Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Great Developers InfoTech Application Closes"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value="Application Deadline">Application Deadline</option>
                <option value="Online Test">Online Test / Assessment</option>
                <option value="Interview">Interview Round</option>
                <option value="Preparation Milestone">Preparation Milestone</option>
                <option value="Document Submission">Document Submission</option>
              </select>
            </div>

            {/* Timing Alert Trigger */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Alert Trigger Timing</label>
              <select
                value={timingType}
                onChange={e => setTimingType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value="1 day before">1 Day Before</option>
                <option value="12 hours before">12 Hours Before</option>
                <option value="6 hours before">6 Hours Before</option>
                <option value="1 hour before">1 Hour Before</option>
                <option value="Custom">At Event Time</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Target Date</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Target Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500 font-sans"
              />
            </div>
          </div>

          {/* Notes / Message */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Custom Notes / Checklist</label>
            <textarea
              rows={2}
              placeholder="e.g. Ensure resume is updated with LeetCode rating and formal dress code is ready."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Sync to Calendar Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sync-cal"
              checked={isSyncToCalendar}
              onChange={e => setIsSyncToCalendar(e.target.checked)}
              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="sync-cal" className="text-slate-700 text-xs font-semibold cursor-pointer">
              Also create an event on my Placement Calendar
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md shadow-indigo-100 disabled:opacity-50 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating...' : 'Set Reminder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
