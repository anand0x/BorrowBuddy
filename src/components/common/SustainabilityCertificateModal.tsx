import React from 'react';
import { 
  Award, 
  Leaf, 
  Download, 
  Printer, 
  Share2, 
  X, 
  CheckCircle2, 
  Sparkles,
  PiggyBank
} from 'lucide-react';
import { User } from '../../types';
import { formatCurrency } from '../../utils/cn';
import { useApp } from '../../context/AppContext';

interface SustainabilityCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const SustainabilityCertificateModal: React.FC<SustainabilityCertificateModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { showToast } = useApp();

  if (!isOpen) return null;

  const estimatedSaved = user.itemsLent * 750 + user.itemsBorrowed * 600;
  const wasteDivertedKg = ((user.itemsLent + user.itemsBorrowed) * 0.85).toFixed(1);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.fullName}'s Campus Sustainability Certificate`,
        text: `I've saved ₹${estimatedSaved.toLocaleString()} and diverted ${wasteDivertedKg}kg of college waste by sharing on BorrowBuddy!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast({ type: 'success', message: 'Certificate link copied to clipboard!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200 my-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                Sustainability & Sharing Certificate
              </h3>
              <p className="text-[11px] text-slate-500">
                Official recognition of circular campus impact
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card Canvas */}
        <div className="mt-4 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50/50 border-2 border-emerald-300/80 shadow-soft text-center space-y-4 relative overflow-hidden">
          {/* Subtle watermark badge */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-200/40 blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Design Thinking Green Campus Award</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Certificate of Peer Sharing & Sustainability
          </h2>

          <p className="text-xs text-slate-600">
            This certifies that campus innovator
          </p>

          <div className="py-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-900 font-serif border-b-2 border-indigo-400 pb-1 inline-block">
              {user.fullName}
            </span>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              {user.university} • {user.rank}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            has actively championed a zero-waste campus sharing economy by lending and borrowing college essentials, significantly reducing student expenses.
          </p>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Items Shared</span>
              <span className="text-lg font-black text-slate-900">{user.itemsLent + user.itemsBorrowed}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">₹ Saved</span>
              <span className="text-lg font-black text-emerald-600">₹{estimatedSaved.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Waste Avoided</span>
              <span className="text-lg font-black text-teal-600">{wasteDivertedKg} kg</span>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-200/80 flex items-center justify-between text-[10px] text-slate-500">
            <div>
              <span>Verified Date: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>BorrowBuddy Campus Council</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-soft"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
