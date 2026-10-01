import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId?: string;
  itemTitle?: string;
  reportedUserId?: string;
  reportedUserName?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemTitle,
  reportedUserId,
  reportedUserName,
}) => {
  const { user } = useAuth();
  const { showToast } = useApp();
  const [reason, setReason] = useState<
    'Item damaged' | 'Item not returned' | "User didn't show up" | 'Wrong item' | 'Misleading listing' | 'Other'
  >('Item damaged');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({ type: 'error', message: 'Please log in to report an issue.' });
      return;
    }

    if (!details.trim()) {
      showToast({ type: 'error', message: 'Please provide details about the issue.' });
      return;
    }

    setIsSubmitting(true);
    try {
      StorageService.submitDispute({
        reporterId: user.id,
        reportedUserId,
        itemId,
        reason,
        details: details.trim(),
      });

      showToast({
        type: 'success',
        title: 'Report Submitted to Safety Desk 🛡️',
        message: 'Our campus moderation team will review this case and follow up with both parties.'
      });

      onClose();
    } catch {
      showToast({ type: 'error', message: 'Failed to submit report.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-soft-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">Report an Issue</h3>
              <p className="text-xs text-slate-500">
                {itemTitle ? `Regarding "${itemTitle}"` : reportedUserName ? `Regarding user ${reportedUserName}` : 'Campus Trust & Safety'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for report</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Item damaged">Item damaged / not in stated condition</option>
              <option value="Item not returned">Item not returned on due date</option>
              <option value="User didn't show up">User didn't show up at pickup point</option>
              <option value="Wrong item">Wrong item handed over</option>
              <option value="Misleading listing">Misleading listing or photos</option>
              <option value="Other">Other dispute</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Explanation</label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Explain what happened at the pickup location or during the borrowing period. Include date and time..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            Campus safety reports are confidential and investigated by peer moderators to protect student security.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
