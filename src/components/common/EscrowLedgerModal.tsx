import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { BorrowRequest } from '../../types';
import { formatCurrency, formatDate } from '../../utils/cn';

interface EscrowLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRequests: BorrowRequest[];
}

export const EscrowLedgerModal: React.FC<EscrowLedgerModalProps> = ({
  isOpen,
  onClose,
  activeRequests,
}) => {
  if (!isOpen) return null;

  const totalLockedDeposit = activeRequests.reduce((sum, r) => sum + (r.deposit || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                Peer Deposit Escrow Ledger
              </h3>
              <p className="text-[11px] text-slate-500">
                100% protected student deposits with automatic return release
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Escrow Balance Card */}
        <div className="p-5 my-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              Currently Locked in Peer Escrow
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-bold">
              Autonomous Safety Lock
            </span>
          </div>
          <div className="text-3xl font-black mt-2">
            {formatCurrency(totalLockedDeposit)}
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Held securely between borrower & lender. Released in 1 second upon verified return.
          </p>
        </div>

        {/* Active Transactions Ledger */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Active Escrow Contracts ({activeRequests.length})
          </span>

          {activeRequests.length > 0 ? (
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {activeRequests.map(req => (
                <div key={req.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 truncate max-w-[200px]">{req.itemTitle}</h4>
                    <span className="text-[11px] text-slate-400">
                      Lender: {req.ownerName} • Due: {formatDate(req.endDate)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">{formatCurrency(req.deposit)}</span>
                    <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-600" /> Locked
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
              No active security deposits currently held.
            </div>
          )}
        </div>

        {/* Trust Guarantee */}
        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Escrow Return Guarantee</span>
          </div>
          <p className="text-[11px] text-indigo-900 leading-relaxed">
            Neither party can unfairly keep the security deposit. Handover scans trigger verified refunds directly to the borrower's payment method or UPI.
          </p>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-soft"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
