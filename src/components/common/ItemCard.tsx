import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Item } from '../../types';
import { StatusBadge } from './StatusBadge';
import { RatingStars } from './RatingStars';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/cn';

interface ItemCardProps {
  item: Item;
  featured?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, featured = false }) => {
  const { isInWishlist, toggleWishlist } = useApp();
  const isSaved = isInWishlist(item.id);

  const savings = Math.max(0, item.estimatedRetailPrice - item.borrowFee);

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-indigo-300 transition-all duration-300 overflow-hidden ${
        featured ? 'ring-2 ring-indigo-500/20' : ''
      }`}
    >
      {/* Top Image & Wishlist Button */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <StatusBadge status={item.status} size="sm" />
          {item.isUrgentSOS && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-xs text-white px-2 py-0.5 text-xs font-semibold shadow-xs">
              <Zap className="w-3 h-3 fill-current" /> SOS Fast
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(item.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-xs ${
            isSaved
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500 hover:scale-105'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Condition tag */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[11px] font-medium bg-slate-900/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
            Condition: {item.condition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Location */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {item.categoryName}
          </span>
          <span className="flex items-center gap-1 text-slate-500 truncate max-w-[130px]">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{item.pickupLocation}</span>
          </span>
        </div>

        {/* Title */}
        <Link to={`/item/${item.id}`} className="group-hover:text-indigo-600 transition-colors">
          <h3 className="font-semibold text-slate-800 text-sm md:text-base line-clamp-2 leading-snug mb-2">
            {item.title}
          </h3>
        </Link>

        {/* Owner Info & Rating */}
        <div className="flex items-center justify-between py-2 border-y border-slate-100 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <img
              src={item.ownerAvatar}
              alt={item.ownerName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="text-slate-600 font-medium truncate max-w-[110px]">
              {item.ownerName}
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <RatingStars rating={item.ownerRating} size="sm" />
            <span className="text-slate-700 text-xs ml-0.5">{item.ownerRating}</span>
          </div>
        </div>

        {/* Pricing & Savings */}
        <div className="mt-auto pt-1 flex items-end justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Borrow Fee</div>
            <div className="text-base font-bold text-slate-900">
              {item.borrowFee === 0 ? (
                <span className="text-emerald-600">FREE</span>
              ) : (
                formatCurrency(item.borrowFee)
              )}
            </div>
            {item.deposit > 0 && (
              <div className="text-[10px] text-slate-500">
                Deposit: {formatCurrency(item.deposit)} (Refundable)
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded block">
              Saves ~{formatCurrency(savings)}
            </span>
            <Link
              to={`/item/${item.id}`}
              className="mt-1.5 inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

