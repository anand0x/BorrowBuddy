import React from 'react';
import { Building, CheckCircle2, MapPin, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface CampusSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusSelectorModal: React.FC<CampusSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const { showToast, refreshAppData } = useApp();

  if (!isOpen || !user) return null;

  const campuses = [
    {
      name: 'XYZ Institute of Technology',
      location: 'Central Campus',
      studentsCount: 3840,
      activeItems: 64,
      isCurrent: user.university === 'XYZ Institute of Technology',
    },
    {
      name: 'National Institute of Design',
      location: 'North Studio Campus',
      studentsCount: 1920,
      activeItems: 42,
      isCurrent: user.university === 'National Institute of Design',
    },
    {
      name: 'City Engineering College',
      location: 'West Campus Wing',
      studentsCount: 4200,
      activeItems: 78,
      isCurrent: user.university === 'City Engineering College',
    },
    {
      name: 'Delhi Technological Hub',
      location: 'South Tech Sector',
      studentsCount: 5100,
      activeItems: 95,
      isCurrent: user.university === 'Delhi Technological Hub',
    },
  ];

  const handleSelectCampus = (name: string) => {
    updateProfile({ university: name });
    showToast({
      type: 'info',
      title: 'Campus Switched 🏫',
      message: `Active university set to ${name}. Listings updated for your campus node.`
    });
    refreshAppData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                Switch Campus Node
              </h3>
              <p className="text-[11px] text-slate-500">
                Borrow essentials from your specific university network
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {campuses.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleSelectCampus(c.name)}
              className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                c.isCurrent
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/70 hover:border-indigo-300'
              }`}
            >
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  {c.name}
                  {c.isCurrent && (
                    <span className="px-2 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                      CURRENT
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{c.location}</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-600">{c.activeItems} items</span>
                </div>
              </div>

              <div className="shrink-0">
                {c.isCurrent ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
