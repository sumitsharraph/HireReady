import React, { useState } from 'react';
import { X, User, GraduationCap, CheckCircle2, AlertCircle, Save, Mail, Phone, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { profile, user, updateProfile } = useAuth();
  const { sendLocalAlert } = useNotification();

  const [formData, setFormData] = useState({
    name: user?.name || profile?.name || 'Vikash',
    email: user?.email || profile?.email || 'vikash607877@gmail.com',
    phone: profile?.phone || '+91 98765 43210',
    college: profile?.college || 'National Institute of Technology',
    degree: profile?.degree || 'B.Tech',
    branch: profile?.branch || 'Computer Science and Engineering',
    passingBatch: profile?.passingBatch || 2027,
    cgpa: profile?.cgpa || 8.64,
    activeBacklogs: profile?.activeBacklogs || 0,
    historyOfBacklogs: profile?.historyOfBacklogs || 0,
    targetRoles: profile?.targetRoles?.join(', ') || 'Software Engineer, Full-Stack Developer, Backend Engineer'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        ...formData,
        passingBatch: Number(formData.passingBatch),
        cgpa: Number(formData.cgpa),
        activeBacklogs: Number(formData.activeBacklogs),
        historyOfBacklogs: Number(formData.historyOfBacklogs),
        targetRoles: formData.targetRoles.split(',').map((r) => r.trim()).filter(Boolean)
      });
      sendLocalAlert('Profile Updated', 'Placement eligibility and match calculations updated.', 'success');
      onClose();
    } catch (err: any) {
      sendLocalAlert('Update Failed', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-none">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Student Academic Profile & Credentials
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Used for automated college eligibility checks & placement matching
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Gmail / Official Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                College / University
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Degree & Branch */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Degree</label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              >
                <option value="B.Tech">B.Tech / B.E.</option>
                <option value="M.Tech">M.Tech / M.E.</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
                <option value="B.Sc CS">B.Sc Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Branch / Specialization
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              >
                <option value="Computer Science and Engineering">Computer Science & Engineering (CSE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science (AIDS)</option>
                <option value="AI & Machine Learning">AI & Machine Learning (AIML)</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                <option value="Electrical Engineering">Electrical Engineering (EEE)</option>
              </select>
            </div>

            {/* Passing Batch */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Passing Batch Year
              </label>
              <select
                value={formData.passingBatch}
                onChange={(e) => setFormData({ ...formData, passingBatch: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027 (Active Graduating)</option>
                <option value={2028}>2028</option>
              </select>
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Current CGPA (Scale of 10.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Active Backlogs */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Active Backlogs
              </label>
              <input
                type="number"
                min="0"
                max="20"
                required
                value={formData.activeBacklogs}
                onChange={(e) => setFormData({ ...formData, activeBacklogs: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* History of Backlogs */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                History of Backlogs (Cleared)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.historyOfBacklogs}
                onChange={(e) => setFormData({ ...formData, historyOfBacklogs: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Target Roles */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Target Placement Roles (comma-separated)
            </label>
            <input
              type="text"
              value={formData.targetRoles}
              onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
              placeholder="e.g. Software Engineer, Full-Stack Developer, Backend Engineer"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
