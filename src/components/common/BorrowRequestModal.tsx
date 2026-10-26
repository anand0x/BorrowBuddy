import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ShieldCheck, AlertCircle, Sparkles, Send } from 'lucide-react';
import { Item } from '../../types';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/cn';

interface BorrowRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  onSuccess?: () => void;
}

export const BorrowRequestModal: React.FC<BorrowRequestModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();

  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatLocalDate(new Date());

  // Default dates: tomorrow to day after tomorrow (2 days)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [startDate, setStartDate] = useState(formatLocalDate(tomorrow));
  const [endDate, setEndDate] = useState(formatLocalDate(dayAfter));
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalAmount = item.borrowFee + item.deposit;

  const handleDateRangeSelect = (startD: string, endD: string) => {
    setStartDate(startD);
    if (endD) {
      setEndDate(endD);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({
        type: 'error',
        message: 'Please log in to submit a borrow request.'
      });
      return;
    }

    if (user.id === item.ownerId) {
      setError("You cannot borrow your own item!");
      return;
    }

    if (!startDate || !endDate) {
      setError('Please choose both start and return dates.');
      return;
    }

    if (startDate < todayStr) {
      setError('Start date cannot be in the past.');
      return;
    }

    if (startDate > endDate) {
      setError('Return date must be on or after start date.');
      return;
    }

    // Check availability conflicts
    const available = StorageService.isDateRangeAvailable(item.id, startDate, endDate);
    if (!available) {
      setError('Selected dates are already booked or unavailable. Please choose another date range.');
      return;
    }

    setIsSubmitting(true);
    try {
      StorageService.createBorrowRequest({
        itemId: item.id,
        borrowerId: user.id,
        startDate,
        endDate,
        message: message.trim() || undefined,
      });

      showToast({
        type: 'success',
        title: 'Borrow Request Sent! 📬',
        message: `Your request was sent to ${item.ownerName}. You'll be notified when they accept!`
      });

      refreshAppData();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-soft-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5">
              Request to Borrow
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinating with owner <span className="font-semibold text-slate-700">{item.ownerName}</span> (⭐ {item.ownerRating})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item summary banner */}
        <div className="flex items-center gap-3 p-3 mt-4 rounded-2xl bg-slate-50 border border-slate-100">
          <img
            src={item.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'}
            alt={item.title}
            className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">{item.title}</h4>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>📍 {item.pickupLocation}</span>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">{item.categoryName}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Calendar Date Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Select Borrowing Window</span>
              <span className="text-indigo-600 font-normal">
                {startDate && endDate ? `${diffDays} Day(s) Selected` : 'Click dates below'}
              </span>
            </label>
            <AvailabilityCalendar
              bookedRanges={item.bookedDateRanges}
              selectedStartDate={startDate}
              selectedEndDate={endDate}
              onSelectRange={handleDateRangeSelect}
            />
          </div>

          {/* Quick Date Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Return Date
              </label>
              <input
                type="date"
                required
                min={startDate || todayStr}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Message to Owner (Optional)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Need this for my mid-semester Digital Lab exam. Can meet right after class!"
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Borrowing Duration</span>
              <span className="font-semibold text-slate-800">{diffDays} Days</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Borrow Fee</span>
              <span className="font-semibold text-slate-800">
                {item.borrowFee === 0 ? 'FREE (₹0)' : formatCurrency(item.borrowFee)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Security Deposit</span>
              </span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(item.deposit)} <span className="text-[10px] text-emerald-600">(100% Refundable)</span>
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
              <span>Total at Handover</span>
              <span className="text-indigo-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-soft disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending Request...' : 'Send Borrow Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

