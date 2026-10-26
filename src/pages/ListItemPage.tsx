import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  MapPin, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CampusLocation, ItemCondition, ItemStatus } from '../types';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SupabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import confetti from 'canvas-confetti';

export const ListItemPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Excellent');
  const [borrowFee, setBorrowFee] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(100);
  const [retailPrice, setRetailPrice] = useState<number>(950);
  const [pickupLocation, setPickupLocation] = useState<CampusLocation>('Central Library');
  const [isUrgentSOS, setIsUrgentSOS] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
  ]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdItemId, setCreatedItemId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Suggested preset images for quick demo
  const samplePresets = [
    { label: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lab Coat', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80' },
    { label: 'Engineering Drafter', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
    { label: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Soldering Kit', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80' },
    { label: 'Charger', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      let publicUrl: string | null = null;
      if (isSupabaseConfigured) {
        publicUrl = await SupabaseService.uploadItemImage(file, user?.id || 'demo-user');
      }

      if (publicUrl) {
        setImages(prev => [...prev, publicUrl as string]);
        showToast({ type: 'success', message: 'Photo uploaded to Supabase Storage! 📸' });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string]);
            showToast({ type: 'success', message: 'Photo attached.' });
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err?.message || 'Failed to upload photo.' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to list an item.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter an item name.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a brief description.');
      return;
    }

    if (images.length === 0) {
      setError('Please provide at least one photo or image URL.');
      return;
    }

    setError(null);

    const category = CATEGORIES.find(c => c.id === categoryId);

    const newItem = StorageService.addItem({
      ownerId: user.id,
      ownerName: user.fullName,
      ownerAvatar: user.avatarUrl,
      ownerRating: user.rating,
      title: title.trim(),
      categoryId,
      categoryName: category?.name || 'General',
      description: description.trim(),
      condition,
      status: 'Available',
      borrowFee: Number(borrowFee) || 0,
      deposit: Number(deposit) || 0,
      estimatedRetailPrice: Number(retailPrice) || 800,
      pickupLocation,
      images,
      isUrgentSOS,
      circleId: 'circle-1'
    });

    setCreatedItemId(newItem.id);
    setIsSubmitted(true);
    refreshAppData();

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    showToast({
      type: 'success',
      title: 'Item Listed Successfully 🎉',
      message: 'You earned +10 BorrowBuddy points! Your item is now discoverable on campus.'
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft-xl space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Item Listed Successfully 🎉
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your item is now visible to other BorrowBuddy campus members. You earned{' '}
              <strong className="text-indigo-600">+10 BorrowBuddy Points</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to={`/item/${createdItemId}`}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft flex items-center gap-1.5"
            >
              <span>View Your Listing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/my-listings"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              Manage My Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Peer Sharing Economy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          List an Item for Lending
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Have an idle calculator, drafter, or textbook? Help another student while earning points and reputation.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GROUP 1: Item Basics */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-800">Basic Information</h2>
              <p className="text-[11px] text-slate-500">Tell students what you are lending and its physical condition.</p>
            </div>
          </div>

          {/* Item Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Item Name / Model <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Casio FX-991CW ClassWiz Scientific Calculator"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tip: Include brand and model name so students searching for exact exam-allowed tools find it quickly.
            </span>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Physical Condition <span className="text-rose-500">*</span>
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as any)}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                <option value="Excellent">Excellent (Like new, zero scratches, fully functional)</option>
                <option value="Good">Good (Minor cosmetic wear, fully working)</option>
                <option value="Used">Used (Visible wear, functional)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description & Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mention semester subjects it's useful for, included accessories (covers, cables), and any care instructions..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>
        </div>

        {/* GROUP 2: Pricing & Refundable Escrow */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-800">Pricing & Refundable Deposit</h2>
              <p className="text-[11px] text-slate-500">Keep borrowing affordable for peers while protecting your item value.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Borrow Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={borrowFee}
                onChange={e => setBorrowFee(Number(e.target.value))}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                {borrowFee === 0 ? '🟢 Set as 100% Free peer loan' : 'Paid for borrowing duration'}
              </span>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                min="0"
                value={deposit}
                onChange={e => setDeposit(Number(e.target.value))}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-emerald-600 font-semibold mt-1.5 block">
                🛡️ 100% Refundable to borrower
              </span>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Store Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={retailPrice}
                onChange={e => setRetailPrice(Number(e.target.value))}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                Original retail market price
              </span>
            </div>
          </div>

          {/* Live savings preview pill */}
          {retailPrice > borrowFee && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Borrower Savings Impact:
              </span>
              <span className="font-bold">
                Students save ~₹{Math.max(0, retailPrice - borrowFee)} vs buying new! 💸
              </span>
            </div>
          )}
        </div>

        {/* GROUP 3: Campus Handover & Safety */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-800">Pickup Spot & Urgency</h2>
              <p className="text-[11px] text-slate-500">Coordinate safe handovers at verified campus landmarks.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Designated Campus Pickup Spot <span className="text-rose-500">*</span>
            </label>
            <select
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value as any)}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="Central Library">Central Library (Ground Floor)</option>
              <option value="Canteen">Campus Canteen</option>
              <option value="Main Gate">Main Gate Security Entrance</option>
              <option value="Department Block">Department Block Corridor</option>
              <option value="Hostel Reception">Hostel Reception Lounge</option>
            </select>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Public meetup spots protect student privacy. You never share private room numbers or off-campus addresses.</span>
            </div>
          </div>

          {/* SOS Urgent Option */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <input
              type="checkbox"
              id="sos-check"
              checked={isUrgentSOS}
              onChange={e => setIsUrgentSOS(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer mt-0.5"
            />
            <label htmlFor="sos-check" className="text-xs text-amber-900 cursor-pointer flex-1">
              <span className="font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Mark as BorrowBuddy Emergency SOS Item
              </span>
              <span className="text-[11px] text-amber-700/90 block mt-0.5">
                Check this if classmates frequently need this item on short notice (e.g. lab coats before practicals, calculators before exams).
              </span>
            </label>
          </div>
        </div>

        {/* GROUP 4: Photos & Previews */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">4</span>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-800">Photos & Media</h2>
              <p className="text-[11px] text-slate-500">Provide clear photos so borrowers know what to expect.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Upload Photos or Paste URLs <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 cursor-pointer transition shrink-0">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>{isUploadingImage ? 'Uploading...' : 'Upload from Device'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={isUploadingImage}
                  onChange={handleFileUpload} 
                />
              </label>
              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="flex-1 text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Demo Presets */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Quick Demo Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImages([preset.url]);
                      showToast({ type: 'info', message: `Selected ${preset.label} image.` });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] text-slate-600 transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Images Preview Strip */}
            <div className="flex items-center gap-3 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group">
                  <img src={img} alt="Listing preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white text-[10px] hover:bg-rose-600 transition"
                    title="Remove photo"
                  >
                    ✕
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-[9px] text-white font-medium">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex items-center justify-between gap-3">
          <Link
            to="/explore"
            className="px-5 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm transition shadow-soft-lg active:scale-98 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Listing (+10 Buddy Points)</span>
          </button>
        </div>
      </form>
    </div>
  );
};

