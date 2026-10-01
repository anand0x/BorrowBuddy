import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/common/ItemCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useApp();

  const allItems = StorageService.getItems();
  const savedItems = allItems.filter(i => wishlist.includes(i.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-current" />
          <span>My Saved Wishlist ({savedItems.length})</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Keep track of college gear you may need for upcoming mid-terms, labs, and project presentations.
        </p>
      </div>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {savedItems.map(item => (
            <div key={item.id} className="relative group">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State: Requirement #36 */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Save items you may need later. We'll automatically notify you whenever their availability status changes.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
          >
            <span>Explore Campus Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

