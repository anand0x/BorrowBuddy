import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  PlusCircle, 
  Eye, 
  Repeat, 
  Edit3, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { EditItemModal } from '../components/common/EditItemModal';
import { Item, ItemStatus } from '../types';
import { formatCurrency } from '../utils/cn';

export const MyListingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  if (!user) return null;

  const items = StorageService.getItems().filter(i => i.ownerId === user.id);
  const requests = StorageService.getRequests().filter(r => r.ownerId === user.id);

  const handleToggleStatus = (item: Item) => {
    const nextStatus: ItemStatus = item.status === 'Available' ? 'Unavailable' : 'Available';
    StorageService.updateItem(item.id, { status: nextStatus });
    showToast({
      type: 'info',
      title: 'Status Updated',
      message: `"${item.title}" is now ${nextStatus.toLowerCase()}.`
    });
    refreshAppData();
  };

  const handleDeleteItem = (itemId: string, itemTitle: string) => {
    if (window.confirm(`Are you sure you want to remove "${itemTitle}" from BorrowBuddy?`)) {
      StorageService.deleteItem(itemId);
      showToast({
        type: 'warning',
        title: 'Listing Removed',
        message: 'Your item listing has been deleted.'
      });
      refreshAppData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>My Listings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your listed college tools, availability schedule, and incoming borrow requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/requests"
            className="px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 font-bold text-xs transition"
          >
            Review Requests ({requests.filter(r => r.status === 'Pending').length})
          </Link>
          <Link
            to="/list-item"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Another Item</span>
          </Link>
        </div>
      </div>

      {/* Listings List */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(item => {
            const itemPendingRequests = requests.filter(r => r.itemId === item.id && r.status === 'Pending');
            const activeRequest = requests.find(r => r.itemId === item.id && r.status === 'Active');

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-20 h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.categoryName}
                      </span>
                    </div>

                    <Link to={`/item/${item.id}`} className="hover:text-indigo-600 transition">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Condition: <strong className="text-slate-700">{item.condition}</strong></span>
                      <span>•</span>
                      <span>Fee: <strong className="text-slate-700">{item.borrowFee === 0 ? 'FREE' : formatCurrency(item.borrowFee)}</strong></span>
                      <span>•</span>
                      <span>Deposit: <strong className="text-slate-700">{formatCurrency(item.deposit)}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.pickupLocation}</span>
                      </span>
                    </div>

                    {/* Active borrower indicator if currently borrowed */}
                    {activeRequest && (
                      <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded-xl border border-amber-200 inline-flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          Currently borrowed by <strong>{activeRequest.borrowerName}</strong> until {activeRequest.endDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {/* Views & Borrow Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1" title="Page views">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-700">{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Times borrowed">
                      <Repeat className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-slate-700">{item.borrowCount} lent</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {itemPendingRequests.length > 0 && (
                      <Link
                        to="/requests"
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs animate-pulse"
                      >
                        <span>{itemPendingRequests.length} Request(s)</span>
                      </Link>
                    )}

                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition ${
                        item.status === 'Available'
                          ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                      title={item.status === 'Available' ? 'Pause listing' : 'Activate listing'}
                    >
                      {item.status === 'Available' ? (
                        <>
                          <PauseCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Activate</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 transition cursor-pointer"
                      title="Edit item details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/item/${item.id}`}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state: Requirement #36 */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">You haven't listed an item yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Share an extra lab coat, engineering drafter, or textbook to earn BorrowBuddy points and help campus peers.
          </p>
          <Link
            to="/list-item"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
          >
            List Your First Item (+10 pts)
          </Link>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          item={editingItem}
        />
      )}
    </div>
  );
};

