import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Item, ItemCondition, CampusLocation, ItemStatus } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { StorageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item }) => {
  const { showToast, refreshAppData } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Excellent');
  const [borrowFee, setBorrowFee] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [pickupLocation, setPickupLocation] = useState<CampusLocation>('Central Library');
  const [status, setStatus] = useState<ItemStatus>('Available');
  const [isUrgentSOS, setIsUrgentSOS] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setCategoryId(item.categoryId);
      setCondition(item.condition);
      setBorrowFee(item.borrowFee);
      setDeposit(item.deposit);
      setPickupLocation(item.pickupLocation);
      setStatus(item.status);
      setIsUrgentSOS(Boolean(item.isUrgentSOS));
      setError(null);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description.');
      return;
    }

    const cat = CATEGORIES.find(c => c.id === categoryId);

    StorageService.updateItem(item.id, {
      title: title.trim(),
      description: description.trim(),
      categoryId,
      categoryName: cat?.name || item.categoryName,
      condition,
      borrowFee: Number(borrowFee) || 0,
      deposit: Number(deposit) || 0,
      pickupLocation,
      status,
      isUrgentSOS
    });

    showToast({
      type: 'success',
      title: 'Item Updated ✏️',
      message: `"${title}" has been updated successfully.`
    });

    refreshAppData();
    onClose();
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
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                Edit Listing
              </h3>
              <p className="text-xs text-slate-500">Update item details, deposit, and campus pickup spot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ItemCondition)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white"
              >
                <option value="Excellent">Excellent (Like New)</option>
                <option value="Good">Good (Working Great)</option>
                <option value="Used">Used (Minor Signs of Wear)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Borrow Fee (₹)</label>
              <input
                type="number"
                min={0}
                value={borrowFee}
                onChange={e => setBorrowFee(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-400">Set 0 for free peer lending</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                min={0}
                value={deposit}
                onChange={e => setDeposit(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-400">Refunded to borrower upon safe return</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus Pickup Spot</label>
              <select
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value as CampusLocation)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white"
              >
                <option value="Central Library">Central Library</option>
                <option value="Canteen">Canteen</option>
                <option value="Department Block">Department Block</option>
                <option value="Main Gate">Main Gate</option>
                <option value="Hostel Reception">Hostel Reception</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Availability Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ItemStatus)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white"
              >
                <option value="Available">🟢 Available</option>
                <option value="Borrowed">🔴 Currently Borrowed</option>
                <option value="Unavailable">⚫ Paused / Unavailable</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 cursor-pointer">
            <input
              type="checkbox"
              checked={isUrgentSOS}
              onChange={e => setIsUrgentSOS(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded"
            />
            <span className="text-xs text-amber-900 font-semibold">
              ⚡ Mark as BorrowBuddy SOS item (High priority for emergency morning lab vivas)
            </span>
          </label>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-soft transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
