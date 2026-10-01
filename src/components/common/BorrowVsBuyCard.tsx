import React from 'react';
import { PiggyBank, Sparkles, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/cn';

interface BorrowVsBuyCardProps {
  retailPrice: number;
  borrowFee: number;
  className?: string;
}

export const BorrowVsBuyCard: React.FC<BorrowVsBuyCardProps> = ({
  retailPrice,
  borrowFee,
  className = '',
}) => {
  const savings = Math.max(0, retailPrice - borrowFee);
  const percentageSaved = Math.round((savings / (retailPrice || 1)) * 100);

  return (
    <div
      className={`rounded-2xl p-4 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-indigo-50/30 border border-emerald-200/80 shadow-soft ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              Borrow vs Buy Advantage
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <p className="text-[11px] text-slate-500">Student wallet financial impact</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Save {percentageSaved}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/80 border border-emerald-100/70 text-center">
        <div>
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Buy New</span>
          <span className="text-sm font-semibold text-slate-500 line-through">
            {formatCurrency(retailPrice)}
          </span>
        </div>
        <div className="border-x border-slate-200/60">
          <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Borrow</span>
          <span className="text-sm font-bold text-indigo-600">
            {borrowFee === 0 ? 'FREE' : formatCurrency(borrowFee)}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-emerald-600 block uppercase tracking-wider flex items-center justify-center gap-0.5">
            <TrendingDown className="w-3 h-3" /> You Save
          </span>
          <span className="text-base font-extrabold text-emerald-600">
            {formatCurrency(savings)}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mt-2 text-center italic">
        *Estimated retail MRP based on campus bookstore averages.
      </p>
    </div>
  );
};

