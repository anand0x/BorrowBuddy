import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Building, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface IDVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IDVerificationModal: React.FC<IDVerificationModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { showToast, refreshAppData } = useApp();

  const [rollNo, setRollNo] = useState('2023-CS-1048');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [batch, setBatch] = useState('2023 – 2027');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);

      // Upgrade user profile badge
      updateProfile({
        isUniversityVerified: true
      });

      try {
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      } catch {}

      showToast({
        type: 'success',
        title: '🎓 University Verified!',
        message: 'Your official student credentials have been confirmed. Badge unlocked on profile and listings!'
      });

      refreshAppData();
    }, 1000);
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
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                University ID Verification
              </h3>
              <p className="text-[11px] text-slate-500">
                Unlock the official 🎓 University Verified badge
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {verifiedSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-slate-900 flex items-center justify-center gap-1.5">
                <span>🎓 University Verified!</span>
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
                Congratulations, <strong className="text-slate-800">{user.fullName}</strong>! Your campus enrollment is confirmed. Your listings now show the verified student badge.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-soft"
            >
              Back to Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4 mt-4 text-xs">
            {/* Student ID Card Simulation preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-950 text-white shadow-soft relative overflow-hidden border border-indigo-700">
              <div className="flex items-center justify-between border-b border-indigo-800/80 pb-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  {user.university}
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/30">
                  STUDENT ID PASS
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-400/40 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{user.fullName}</div>
                  <div className="text-[10px] text-indigo-300 font-mono mt-0.5">ROLL: {rollNo}</div>
                  <div className="text-[10px] text-indigo-300/80 truncate">{department}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Roll / Registration No.</label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department / Branch</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch / Graduation</label>
                <input
                  type="text"
                  required
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Campus / College Email (Optional)</label>
              <input
                type="email"
                value={collegeEmail}
                onChange={e => setCollegeEmail(e.target.value)}
                placeholder="e.g. rahul.sharma@college.edu.in"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                College email verification is optional. ID roll number is sufficient for verification.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Verified students receive priority placement in search results and gain increased trust among borrowers and lenders.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-soft transition disabled:opacity-50"
              >
                {isVerifying ? 'Confirming Enrollment...' : 'Confirm & Unlock Badge 🎓'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
