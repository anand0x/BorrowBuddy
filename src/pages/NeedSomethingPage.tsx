import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  HandHeart, 
  MessageSquare,
  AlertCircle,
  X
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CampusLocation, NeedRequest } from '../types';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { RatingStars } from '../components/common/RatingStars';
import confetti from 'canvas-confetti';

export const NeedSomethingPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();

  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [requiredDate, setRequiredDate] = useState('Tomorrow, 9:00 AM');
  const [duration, setDuration] = useState('2 days');
  const [pickupLocation, setPickupLocation] = useState<CampusLocation>('Central Library');
  const [description, setDescription] = useState('');

  // Offer modal state
  const [offeringNeed, setOfferingNeed] = useState<NeedRequest | null>(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  const needRequests = StorageService.getNeedRequests();

  const handlePostNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({ type: 'error', message: 'Please log in to post a request.' });
      return;
    }

    if (!title.trim() || !description.trim()) {
      showToast({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    const cat = CATEGORIES.find(c => c.id === categoryId);

    StorageService.addNeedRequest({
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.avatarUrl,
      userRating: user.rating,
      university: user.university,
      title: title.trim(),
      categoryId,
      categoryName: cat?.name || 'General',
      requiredDate,
      duration,
      pickupLocation,
      description: description.trim(),
    });

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}

    showToast({
      type: 'success',
      title: 'Community Request Posted! 📢',
      message: 'Students across campus will be notified and can offer you their item.'
    });

    setTitle('');
    setDescription('');
    setIsPostFormOpen(false);
    refreshAppData();
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({ type: 'error', message: 'Please log in to offer an item.' });
      return;
    }

    if (!offeringNeed) return;

    if (!offerMessage.trim()) {
      showToast({ type: 'error', message: 'Please enter a brief note about what you can lend.' });
      return;
    }

    setIsSubmittingOffer(true);
    try {
      StorageService.offerItemToNeed(offeringNeed.id, user, offerMessage.trim());

      showToast({
        type: 'success',
        title: 'Offer Sent to Student! 🤝',
        message: `${offeringNeed.userName} has been notified of your offer.`
      });

      setOfferingNeed(null);
      setOfferMessage('');
      refreshAppData();
    } catch {
      showToast({ type: 'error', message: 'Failed to send offer.' });
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-brand-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-soft-xl mb-10 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700/60 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-500/40">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
            <span>Campus Community Board</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Can't find what you need? Ask the community.
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Post an urgent or upcoming college item request. Classmates and seniors with idle tools will see your ask and offer to lend it.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsPostFormOpen(!isPostFormOpen)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-xs sm:text-sm hover:bg-indigo-50 transition shadow-soft"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>{isPostFormOpen ? 'Close Post Form' : 'Post a New Request'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post a Request Form Accordion */}
      {isPostFormOpen && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-lg mb-10 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">What item do you need?</h2>
              <p className="text-xs text-slate-500">Other students will see this and can offer to lend.</p>
            </div>
            <button
              onClick={() => setIsPostFormOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePostNeed} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Name / Tool Needed <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Engineering Drawing Compass Set, Lab Coat Size M..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required When?</label>
                <input
                  type="text"
                  required
                  value={requiredDate}
                  onChange={e => setRequiredDate(e.target.value)}
                  placeholder="e.g. Tomorrow morning 9 AM"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Borrow Duration</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g. 2 days, 1 week..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Pickup Spot</label>
                <select
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Central Library">Central Library</option>
                  <option value="Canteen">Campus Canteen</option>
                  <option value="Main Gate">Main Gate</option>
                  <option value="Department Block">Department Block</option>
                  <option value="Hostel Reception">Hostel Reception</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Details / Subject Note <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mention which practical or submission you need this for, and any condition requirements..."
                className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPostFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-soft"
              >
                Publish Community Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Community Requests Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Active Community Asks ({needRequests.length})
          </h2>
          <span className="text-xs text-slate-500">Help a classmate by offering your unused gear</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {needRequests.map(req => {
            const isMyRequest = user?.id === req.userId;
            return (
              <div
                key={req.id}
                className="flex flex-col bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition space-y-4"
              >
                {/* Requester Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={req.userAvatar}
                      alt={req.userName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">{req.userName}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <RatingStars rating={req.userRating} size="sm" />
                        <span>•</span>
                        <span className="text-indigo-600 font-semibold">{req.categoryName}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {req.status}
                  </span>
                </div>

                {/* Need Title & Details */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    Need: {req.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    "{req.description}"
                  </p>
                </div>

                {/* Meta details */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Required:</span>
                    <span className="font-semibold text-slate-800">{req.requiredDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-semibold text-slate-800">{req.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-indigo-600">{req.pickupLocation}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {req.offersCount} offer(s) received
                  </span>

                  {isMyRequest ? (
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
                      Your Request
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOfferingNeed(req)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
                    >
                      <HandHeart className="w-3.5 h-3.5" />
                      <span>Offer My Item</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offer My Item Modal */}
      {offeringNeed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-800">Offer to Lend Item</h3>
                <p className="text-xs text-slate-500">
                  Responding to <span className="font-semibold text-slate-700">{offeringNeed.userName}</span>
                </p>
              </div>
              <button
                onClick={() => setOfferingNeed(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 my-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs">
              <span className="font-bold text-indigo-950 block">Requested: {offeringNeed.title}</span>
              <span className="text-indigo-800">Needed at: {offeringNeed.pickupLocation}</span>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Your Message to {offeringNeed.userName}
                </label>
                <textarea
                  rows={3}
                  required
                  value={offerMessage}
                  onChange={e => setOfferMessage(e.target.value)}
                  placeholder="e.g. I have a clean drafter / calculator available in hostel. Can meet you tomorrow at the Central Library!"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOfferingNeed(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className="px-4 py-2 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  {isSubmittingOffer ? 'Sending...' : 'Send Lending Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
