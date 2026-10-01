import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  User, 
  Clock, 
  ShieldCheck,
  Sparkles,
  ArrowRight,
  QrCode
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { RatingStars } from '../components/common/RatingStars';
import { QRHandoverModal } from '../components/common/QRHandoverModal';
import { BorrowRequest } from '../types';
import { formatCurrency, formatDate } from '../utils/cn';
import confetti from 'canvas-confetti';

export const BorrowRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'Pending' | 'Accepted' | 'Rejected'>('all');
  const [selectedQRReq, setSelectedQRReq] = useState<BorrowRequest | null>(null);

  if (!user) return null;

  const allRequests = StorageService.getRequests();
  // Requests on items owned by current user
  const incomingRequests = allRequests.filter(r => r.ownerId === user.id);

  const filteredRequests = incomingRequests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleAccept = (req: BorrowRequest) => {
    try {
      StorageService.acceptBorrowRequest(req.id);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}

      showToast({
        type: 'success',
        title: 'Request Accepted! 🎉 +20 Points',
        message: `You approved ${req.borrowerName}'s request for "${req.itemTitle}". Chat is now open!`
      });

      refreshAppData();
    } catch (err: any) {
      showToast({
        type: 'error',
        message: err?.message || 'Failed to accept request.'
      });
    }
  };

  const handleReject = (req: BorrowRequest) => {
    try {
      StorageService.rejectBorrowRequest(req.id);
      showToast({
        type: 'info',
        title: 'Request Declined',
        message: `You declined the request from ${req.borrowerName}.`
      });
      refreshAppData();
    } catch {
      showToast({ type: 'error', message: 'Failed to decline request.' });
    }
  };

  const handleOpenChat = (req: BorrowRequest) => {
    const conv = StorageService.getOrCreateConversation(req.itemId, req.borrowerId, req.ownerId);
    navigate(`/messages?conv=${conv.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-indigo-600" />
            <span>Borrow Requests</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and approve student requests to borrow your college tools and textbooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'Pending', 'Accepted', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'all' ? 'All Requests' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const isPending = req.status === 'Pending';

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Borrower & Item Overview */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={req.itemImage}
                    alt={req.itemTitle}
                    className="w-20 h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs text-slate-400">Request #{req.id}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      "{req.itemTitle}"
                    </h3>

                    {/* Borrower info box */}
                    <div className="mt-2.5 flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 max-w-lg">
                      <img
                        src={req.borrowerAvatar}
                        alt={req.borrowerName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                      />
                      <div className="min-w-0 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{req.borrowerName}</span>
                          <span className="text-slate-400">•</span>
                          <RatingStars rating={req.borrowerRating} size="sm" showValue />
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          {req.borrowerHistoryCount} previous campus transactions
                        </p>
                      </div>
                    </div>

                    {/* Dates & duration */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{formatDate(req.startDate)} → {formatDate(req.endDate)}</span>
                      </span>
                      <span>•</span>
                      <span>Duration: <strong>{req.durationDays} day(s)</strong></span>
                      <span>•</span>
                      <span>Total: <strong className="text-emerald-700">{formatCurrency(req.totalAmount)}</strong> ({formatCurrency(req.deposit)} deposit)</span>
                    </div>

                    {/* Message from borrower */}
                    {req.message && (
                      <p className="mt-2.5 text-xs text-slate-600 italic bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60 max-w-lg">
                        "{req.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Owner Decision Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleReject(req)}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-bold text-xs transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs transition shadow-soft flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Request (+20 pts)</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedQRReq(req)}
                        className="px-3.5 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1.5 transition"
                        title="Verify pickup or return via QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Handover QR</span>
                      </button>
                      <button
                        onClick={() => handleOpenChat(req)}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs transition shadow-soft flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No requests in this view</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            When students ask to borrow your calculators or drawing kits, their requests will appear here for review.
          </p>
          <Link
            to="/my-listings"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
          >
            Check My Listings
          </Link>
        </div>
      )}

      {/* QR Handover Modal */}
      {selectedQRReq && (
        <QRHandoverModal
          isOpen={Boolean(selectedQRReq)}
          onClose={() => setSelectedQRReq(null)}
          request={selectedQRReq}
          actionType={selectedQRReq.status === 'Active' ? 'return' : 'pickup'}
          onSuccess={() => {
            setSelectedQRReq(null);
            refreshAppData();
          }}
        />
      )}
    </div>
  );
};

