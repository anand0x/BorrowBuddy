import React, { useState } from 'react';
import { Camera, CheckCircle2, ShieldCheck, X, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ConditionInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemImage: string;
}

export const ConditionInspectionModal: React.FC<ConditionInspectionModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  itemImage,
}) => {
  const { showToast } = useApp();
  const [notes, setNotes] = useState('LCD display bright, all calculator keys responsive, zero casing cracks. Battery intact.');
  const [photoCount, setPhotoCount] = useState(2);
  const [isLogged, setIsLogged] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogged(true);
    showToast({
      type: 'success',
      title: 'Handover Condition Logged 📸',
      message: 'Timestamped photos and inspection notes recorded. Both parties are protected.'
    });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Item Condition Inspection Log
              </h3>
              <p className="text-[11px] text-slate-500">
                Pre-handover photo evidence prevents deposit disputes
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <img src={itemImage} alt="" className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200" />
            <div>
              <h4 className="font-bold text-slate-800">{itemTitle}</h4>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Condition Verified at Central Library Handover
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Inspection Checklist & Handover Observations
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <span className="block font-bold text-slate-700 mb-2">
              Captured Evidence Photos ({photoCount})
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={itemImage} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  FRONT
                </span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  DISPLAY
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPhotoCount(c => c + 1)}
                className="aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold">+ Add Angle</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-[11px] text-indigo-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Condition logs are signed with student IDs and stored securely. In case of accidental damage, peer moderators review these photos to ensure fair deposit adjustments.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-soft"
            >
              {isLogged ? 'Evidence Saved ✅' : 'Save Condition Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
