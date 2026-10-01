import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { StorageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  reviewerId: string;
  revieweeId: string;
  revieweeName: string;
  itemId: string;
  itemTitle: string;
  role: 'borrower' | 'lender';
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  requestId,
  reviewerId,
  revieweeId,
  revieweeName,
  itemId,
  itemTitle,
  role,
  onReviewSubmitted,
}) => {
  const { showToast, refreshAppData } = useApp();
  const [overallRating, setOverallRating] = useState(5);
  const [conditionRating, setConditionRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [timelyRating, setTimelyRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast({
        type: 'error',
        message: 'Please write a brief comment about your experience.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const avg = parseFloat(((conditionRating + commRating + timelyRating) / 3).toFixed(1));

      StorageService.submitReview({
        requestId,
        reviewerId,
        revieweeId,
        itemId,
        itemTitle,
        rating: avg,
        categories: {
          condition: conditionRating,
          communication: commRating,
          timelyReturn: timelyRating
        },
        comment: comment.trim(),
        role
      });

      // Gamification confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {
        // ignore confetti errors
      }

      showToast({
        type: 'success',
        title: 'Review Submitted! ⭐ +5 Points',
        message: `Thank you! Your feedback helps build trust in our campus community.`
      });

      refreshAppData();
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      showToast({
        type: 'error',
        message: 'Failed to submit review. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-soft-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5">
              Rate Your Experience
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              For "{itemTitle}" with <span className="font-semibold text-slate-700">{revieweeName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Detailed Criteria */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Item Condition & Care
              </span>
              <RatingStars
                rating={conditionRating}
                interactive
                onRatingChange={setConditionRating}
                showValue
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Communication & Punctuality
              </span>
              <RatingStars
                rating={commRating}
                interactive
                onRatingChange={setCommRating}
                showValue
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Timely Return / Handover
              </span>
              <RatingStars
                rating={timelyRating}
                interactive
                onRatingChange={setTimelyRating}
                showValue
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Review & Feedback
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Was the item clean and functional? Did the student arrive on time at the campus pickup point? Share your honest review..."
              className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Submitting a review earns you <strong>+5 BorrowBuddy Points</strong>!</span>
          </div>

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
              className="px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-soft disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Submit Rating & Earn Points'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
