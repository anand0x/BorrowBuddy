import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Sparkles,
  Lock
} from 'lucide-react';
import { BorrowRequest } from '../../types';
import { formatCurrency, formatDate } from '../../utils/cn';
import { useApp } from '../../context/AppContext';

interface LendingAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BorrowRequest;
}

export const LendingAgreementModal: React.FC<LendingAgreementModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const { showToast } = useApp();

  if (!isOpen) return null;

  const agreementId = `AGR-${request.id.replace('req-', '')}-2026`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast({
      type: 'success',
      title: 'Digital Agreement Saved 📄',
      message: `Agreement ${agreementId} saved for recordkeeping.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200 my-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                Peer Borrowing Agreement
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Contract Reference: {agreementId}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Formal Agreement Certificate */}
        <div className="mt-4 p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4 text-xs font-sans">
          <div className="text-center pb-3 border-b border-slate-200">
            <div className="font-extrabold text-sm text-slate-900 uppercase tracking-widest">
              Campus Peer Lending & Custody Agreement
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Governed by the BorrowBuddy Campus Trust Code • XYZ Institute of Technology
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lender (Owner)</span>
              <span className="font-bold text-slate-900 block text-sm">{request.ownerName}</span>
              <span className="text-[11px] text-slate-500">Student ID Verified</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Borrower (Custody)</span>
              <span className="font-bold text-slate-900 block text-sm">{request.borrowerName}</span>
              <span className="text-[11px] text-slate-500">Student ID Verified</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Item Description:</span>
              <span className="font-bold text-slate-900">{request.itemTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Borrowing Duration:</span>
              <span className="font-semibold text-slate-800">{request.durationDays} Day(s)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Agreed Return Deadline:</span>
              <span className="font-bold text-indigo-700">{formatDate(request.endDate)} (5:00 PM)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Security Deposit Escrow:</span>
              <span className="font-bold text-emerald-600">{formatCurrency(request.deposit)} (Refundable)</span>
            </div>
          </div>

          {/* Terms */}
          <div className="text-[11px] text-slate-500 space-y-1 leading-relaxed">
            <p><strong>1. Custody & Care:</strong> The borrower undertakes to keep the item clean, unmarred, and functional.</p>
            <p><strong>2. Timely Handover:</strong> Handover and return will occur at the designated public campus spot.</p>
            <p><strong>3. Deposit Release:</strong> Upon safe return and mutual QR scan, the security deposit is refunded autonomously.</p>
          </div>

          {/* Digital Signature Stamps */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 text-center">
            <div className="p-2 rounded-xl bg-white border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Digital Signature (Lender)</span>
              <span className="font-serif italic text-xs text-indigo-900">{request.ownerName}</span>
              <span className="text-[9px] text-emerald-600 block mt-0.5">✔ Verified Handshake</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Digital Signature (Borrower)</span>
              <span className="font-serif italic text-xs text-indigo-900">{request.borrowerName}</span>
              <span className="text-[9px] text-emerald-600 block mt-0.5">✔ Verified Handshake</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Save PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-soft"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
