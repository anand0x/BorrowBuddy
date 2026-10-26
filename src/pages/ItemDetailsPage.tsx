import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Heart, 
  ShieldCheck, 
  ArrowLeft, 
  Share2, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { StatusBadge } from '../components/common/StatusBadge';
import { RatingStars } from '../components/common/RatingStars';
import { BorrowVsBuyCard } from '../components/common/BorrowVsBuyCard';
import { AvailabilityCalendar } from '../components/common/AvailabilityCalendar';
import { BorrowRequestModal } from '../components/common/BorrowRequestModal';
import { ReportModal } from '../components/common/ReportModal';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/cn';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist, showToast } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState('');
  const [selectedEnd, setSelectedEnd] = useState('');

  const item = StorageService.getItemById(id || '');

  useEffect(() => {
    if (id) {
      StorageService.incrementItemViews(id);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Item Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          This college item may have been deleted or does not exist.
        </p>
        <Link
          to="/explore"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-soft hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.ownerId;
  const isSaved = isInWishlist(item.id);
  const owner = StorageService.getUserById(item.ownerId);
  const ownerReviews = StorageService.getUserReviews(item.ownerId);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Borrow ${item.title} on BorrowBuddy!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({ type: 'info', message: 'Link copied to clipboard!' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Gallery & Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image */}
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-soft">
            <img
              src={item.images[activeImageIndex] || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <StatusBadge status={item.status} />
              {item.isUrgentSOS && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" /> SOS Fast Campus Pickup
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white transition shadow-xs"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(item.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition shadow-xs ${
                  isSaved
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
                }`}
                title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {item.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === idx ? 'border-indigo-600 shadow-soft' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description & Specs Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
                <span>{item.categoryName}</span>
                <span>•</span>
                <span>Condition: {item.condition}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {item.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Designated Campus Spot: <strong className="text-slate-700">{item.pickupLocation}</strong></span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1 text-xs">
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Category</span>
                <span className="font-bold text-slate-800 truncate block mt-0.5">{item.categoryName}</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Condition</span>
                <span className="font-bold text-slate-800 truncate block mt-0.5">{item.condition}</span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Deposit Escrow</span>
                <span className="font-bold text-emerald-700 truncate block mt-0.5">
                  {item.deposit > 0 ? `${formatCurrency(item.deposit)} (Refundable)` : 'None'}
                </span>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Campus Spot</span>
                <span className="font-bold text-slate-800 truncate block mt-0.5">{item.pickupLocation}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-sm text-slate-800 mb-2">Item Description</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Availability Calendar View */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  <span>Item Availability Schedule</span>
                </h3>
                <span className="text-xs text-emerald-600 font-semibold">
                  {item.status === 'Available' ? '🟢 Free to borrow now' : '🔴 Currently reserved'}
                </span>
              </div>
              <AvailabilityCalendar
                bookedRanges={item.bookedDateRanges}
                selectedStartDate={selectedStart}
                selectedEndDate={selectedEnd}
                onSelectRange={(s, e) => {
                  setSelectedStart(s);
                  setSelectedEnd(e);
                }}
              />
            </div>

            {/* Report listing */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Noticed misleading info?</span>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Item</span>
              </button>
            </div>
          </div>

          {/* Owner Profile & Reviews */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            <h3 className="font-bold text-base text-slate-900">About the Student Owner</h3>
            <div className="flex items-start gap-4">
              <img
                src={item.ownerAvatar}
                alt={item.ownerName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-slate-800">{item.ownerName}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    👤 BorrowBuddy Member
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{owner?.university || 'Campus Student'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars rating={item.ownerRating} size="sm" showValue />
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {owner?.itemsLent || 12} Items Lent
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs font-semibold text-emerald-600">
                    {owner?.onTimeReturnRate || 96}% On-Time
                  </span>
                </div>
              </div>
            </div>

            {owner?.bio && (
              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{owner.bio}"
              </p>
            )}

            {/* Recent Peer Reviews for owner */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">
                Recent Campus Reviews ({ownerReviews.length})
              </h4>
              {ownerReviews.length > 0 ? (
                <div className="space-y-3">
                  {ownerReviews.slice(0, 2).map(rev => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.reviewerAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-bold text-slate-800">{rev.reviewerName}</span>
                        </div>
                        <RatingStars rating={rev.rating} size="sm" />
                      </div>
                      <p className="text-slate-600 leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No reviews yet for this student.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Borrow Action Card & Savings */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Action Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft-lg space-y-6">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Borrowing Pricing</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  {item.borrowFee === 0 ? 'FREE' : formatCurrency(item.borrowFee)}
                </span>
                {item.borrowFee > 0 && <span className="text-xs text-slate-500">/ borrowing period</span>}
              </div>

              {item.deposit > 0 ? (
                <div className="mt-2.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{formatCurrency(item.deposit)} Refundable Security Deposit</span>
                  </div>
                  <p className="text-[11px] text-emerald-700/90 mt-1 leading-relaxed">
                    100% refundable. Held in campus escrow and returned automatically when you return the item in good condition.
                  </p>
                </div>
              ) : (
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero security deposit required by owner.</span>
                </div>
              )}
            </div>

            {/* Borrow vs Buy Calculation */}
            <BorrowVsBuyCard
              retailPrice={item.estimatedRetailPrice}
              borrowFee={item.borrowFee}
            />

            {/* Quick Action Button & Next Steps */}
            <div>
              {isOwner ? (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                  <p className="text-xs font-bold text-indigo-900">This is your listing</p>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    You can manage or edit this item from your My Listings page.
                  </p>
                  <Link
                    to="/my-listings"
                    className="mt-3 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-soft hover:bg-indigo-700 transition"
                  >
                    Go to My Listings
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(true)}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-sm transition shadow-soft-lg flex items-center justify-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Request to Borrow</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-500 font-medium">
                    No charges until {item.ownerName} accepts your dates
                  </p>
                </div>
              )}
            </div>

            {/* How Borrowing Works - Next Steps */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                How It Works Next
              </h4>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><strong>Pick your dates:</strong> Choose when you need it and send your request.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><strong>Owner accepts:</strong> Chat unlocks immediately to coordinate meetup.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><strong>Campus exchange:</strong> Meet at {item.pickupLocation} and verify item condition.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span><strong>Safe return:</strong> Hand back item and deposit is released back instantly.</span>
                </div>
              </div>
            </div>

            {/* Campus Trust Features */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified student campus community</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Public designated campus meetup points only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Request Modal */}
      <BorrowRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        item={item}
        onSuccess={() => {
          setIsRequestModalOpen(false);
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        itemId={item.id}
        itemTitle={item.title}
        reportedUserId={item.ownerId}
        reportedUserName={item.ownerName}
      />
    </div>
  );
};

