import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Star, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ReviewModal } from '../components/common/ReviewModal';
import { BorrowRequest } from '../types';
import { formatCurrency, formatDate } from '../utils/cn';

export const MyBorrowingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'returned' | 'all'>('active');
  const [reviewRequest, setReviewRequest] = useState<BorrowRequest | null>(null);

  if (!user) return null;

  const allRequests = StorageService.getRequests();
  const myBorrowings = allRequests.filter(r => r.borrowerId === user.id);

  const activeItems = myBorrowings.filter(r => r.status === 'Active' || r.status === 'Accepted');
  const upcomingItems = myBorrowings.filter(r => r.status === 'Upcoming' || r.status === 'Pending');
  const returnedItems = myBorrowings.filter(r => r.status === 'Returned');
  const overdueItems = myBorrowings.filter(r => r.status === 'Overdue');

  const getDisplayedList = () => {
    switch (activeTab) {
      case 'active': return [...overdueItems, ...activeItems];
      case 'upcoming': return upcomingItems;
      case 'returned': return returnedItems;
      default: return myBorrowings;
    }
  };

  const displayedList = getDisplayedList();

  const handleMarkReturned = (req: BorrowRequest) => {
    try {
      StorageService.markAsReturned(req.id);
      showToast({
        type: 'success',
        title: 'Returned Successfully! ✅',
        message: `"${req.itemTitle}" has been marked as returned. +15 points earned!`
      });
      refreshAppData();
      // Prompt review modal immediately!
      setReviewRequest(req);
    } catch {
      showToast({ type: 'error', message: 'Failed to update return status.' });
    }
  };

  const handleOpenChat = (req: BorrowRequest) => {
    const conv = StorageService.getOrCreateConversation(req.itemId, req.borrowerId, req.ownerId);
    navigate(`/messages?conv=${conv.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-indigo-600" />
            <span>My Borrowings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active borrowings, return deadlines, and security deposits.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft self-start sm:self-auto"
        >
          <span>Find More Items</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'active'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Active Borrowings ({activeItems.length + overdueItems.length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'upcoming'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Upcoming & Pending ({upcomingItems.length})
        </button>
        <button
          onClick={() => setActiveTab('returned')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'returned'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Past Returned ({returnedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          All ({myBorrowings.length})
        </button>
      </div>

      {/* List */}
      {displayedList.length > 0 ? (
        <div className="space-y-4">
          {displayedList.map(req => {
            const isDueSoon = req.status === 'Active';
            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Item Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={req.itemImage || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80'}
                    alt={req.itemTitle}
                    className="w-20 h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs text-slate-400">ID: {req.id}</span>
                    </div>

                    <Link to={`/item/${req.itemId}`} className="hover:text-indigo-600 transition">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                        {req.itemTitle}
                      </h3>
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Owner: <strong className="text-slate-700">{req.ownerName}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Due: {formatDate(req.endDate)}</span>
                      </span>
                      <span>•</span>
                      <span>{req.durationDays} day(s)</span>
                    </div>

                    {req.deposit > 0 && (
                      <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Security deposit: {formatCurrency(req.deposit)} (Refundable upon return)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 md:self-center">
                  <button
                    onClick={() => handleOpenChat(req)}
                    className="px-3.5 py-2 rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Owner</span>
                  </button>

                  {/* Mark as Returned CTA if Active or Overdue */}
                  {(req.status === 'Active' || req.status === 'Accepted' || req.status === 'Overdue') && (
                    <button
                      onClick={() => handleMarkReturned(req)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-soft flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Returned (+15 pts)</span>
                    </button>
                  )}

                  {/* Rate if returned & not yet rated */}
                  {req.status === 'Returned' && !req.borrowerRated && (
                    <button
                      onClick={() => setReviewRequest(req)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-soft flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Rate Experience (+5 pts)</span>
                    </button>
                  )}

                  <Link
                    to={`/item/${req.itemId}`}
                    className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                  >
                    View Item
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State: Requirement #36 */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">You haven't borrowed anything yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Need a scientific calculator for your mid-terms or a lab coat for chemistry? Browse what students near you are lending.
          </p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
          >
            Explore Items
          </Link>
        </div>
      )}

      {/* Review Modal */}
      {reviewRequest && (
        <ReviewModal
          isOpen={Boolean(reviewRequest)}
          onClose={() => setReviewRequest(null)}
          requestId={reviewRequest.id}
          reviewerId={user.id}
          revieweeId={reviewRequest.ownerId}
          revieweeName={reviewRequest.ownerName}
          itemId={reviewRequest.itemId}
          itemTitle={reviewRequest.itemTitle}
          role="borrower"
          onReviewSubmitted={() => {
            setReviewRequest(null);
            refreshAppData();
          }}
        />
      )}
    </div>
  );
};
