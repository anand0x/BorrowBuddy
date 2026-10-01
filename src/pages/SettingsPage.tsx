import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  RotateCcw, 
  LogOut, 
  Shield, 
  Smartphone, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { resetDemoData, showToast } = useApp();

  const [returnReminders, setReturnReminders] = useState(true);
  const [requestAlerts, setRequestAlerts] = useState(true);
  const [chatSounds, setChatSounds] = useState(true);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Your notification and account settings have been updated.'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-indigo-600" />
          <span>Account Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage notification alerts, borrowing preferences, and demo environment settings.
        </p>
      </div>

      {/* Notification Preferences */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <span>Notification Alerts</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block">Automatic Due Date Reminders</span>
              <span className="text-slate-500 text-xs">Notify me 24 hours and on the morning of item return deadlines.</span>
            </div>
            <input
              type="checkbox"
              checked={returnReminders}
              onChange={e => setReturnReminders(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block">Incoming Borrow Requests</span>
              <span className="text-slate-500 text-xs">Send instant notifications when a student requests your listed gear.</span>
            </div>
            <input
              type="checkbox"
              checked={requestAlerts}
              onChange={e => setRequestAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block">Campus Chat Notifications</span>
              <span className="text-slate-500 text-xs">Alert me on new messages from borrowers and owners.</span>
            </div>
            <input
              type="checkbox"
              checked={chatSounds}
              onChange={e => setChatSounds(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </label>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-soft transition"
        >
          Save Preferences
        </button>
      </form>

      {/* Demo Prototype Tools */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-indigo-600" />
          <span>Demo Environment Controls</span>
        </h2>
        <p className="text-xs text-slate-500">
          Reset all mock data, seeded users, items, and requests back to initial values for a clean presentation demo.
        </p>

        <button
          type="button"
          onClick={resetDemoData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Prototype Data</span>
        </button>
      </div>

      {/* Session Logout */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-800">Sign Out of BorrowBuddy</h3>
          <p className="text-xs text-slate-500">Active session on {user.university}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-soft transition flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
