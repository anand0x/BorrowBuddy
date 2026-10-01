import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Smartphone, 
  Sparkles, 
  X, 
  ArrowRight,
  Camera,
  KeyRound
} from 'lucide-react';
import { BorrowRequest } from '../../types';
import { StorageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface QRHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BorrowRequest;
  actionType: 'pickup' | 'return';
  onSuccess?: () => void;
}

export const QRHandoverModal: React.FC<QRHandoverModalProps> = ({
  isOpen,
  onClose,
  request,
  actionType,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();

  // Generate deterministic 6-digit campus PIN for the demo
  const pinCode = actionType === 'pickup' 
    ? `BB-${request.id.slice(-4).toUpperCase() || '8492'}`
    : `RET-${request.id.slice(-4).toUpperCase() || '3914'}`;

  const [enteredPin, setEnteredPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isOwner = user?.id === request.ownerId;
  const isBorrower = user?.id === request.borrowerId;

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || enteredPin;
    if (code.replace(/\s+/g, '').toUpperCase() !== pinCode.replace(/\s+/g, '').toUpperCase()) {
      showToast({
        type: 'error',
        message: 'Invalid verification PIN. Please verify with the other student.'
      });
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}

      if (actionType === 'pickup') {
        // Transition request to Active
        const requests = StorageService.getRequests();
        const target = requests.find(r => r.id === request.id);
        if (target) {
          target.status = 'Active';
          localStorage.setItem('bb_requests', JSON.stringify(requests));
        }

        StorageService.addNotification({
          userId: request.borrowerId,
          type: 'pickup_reminder',
          title: 'Handover Confirmed! 🤝',
          message: `QR code verified at campus pickup spot. Have a great time using "${request.itemTitle}".`,
          link: '/my-borrowings'
        });

        StorageService.addNotification({
          userId: request.ownerId,
          type: 'pickup_reminder',
          title: 'Handover Confirmed! 📦',
          message: `${request.borrowerName} confirmed pickup of "${request.itemTitle}". Deposit locked safely in escrow.`,
          link: '/my-listings'
        });

        showToast({
          type: 'success',
          title: 'Campus Pickup Verified! 🤝',
          message: 'Item status updated to Active. Return reminder scheduled.'
        });
      } else {
        // Return verification
        StorageService.markAsReturned(request.id);
        showToast({
          type: 'success',
          title: 'Return Verified & Completed! ✅ +15 Points',
          message: 'Security deposit released. Please submit a peer review.'
        });
      }

      refreshAppData();
      if (onSuccess) onSuccess();
    }, 600);
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
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                {actionType === 'pickup' ? 'Handover QR Verification' : 'Return Handover QR'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {actionType === 'pickup' ? 'Verify in-person pickup on campus' : 'Verify safe item return'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="font-extrabold text-lg text-slate-900">
                {actionType === 'pickup' ? 'Pickup Successfully Verified! 🤝' : 'Return Verified! ✅'}
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
                {actionType === 'pickup' 
                  ? `Borrowing is now Active. Security deposit is safely held in peer escrow until return.`
                  : `Item return confirmed. Security deposit of ₹${request.deposit} has been refunded.`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-soft"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-5 text-center">
            {/* Simulated Dynamic QR Code */}
            <div className="p-5 rounded-3xl bg-slate-50 border-2 border-dashed border-indigo-200 inline-block shadow-2xs">
              <div className="relative w-44 h-44 bg-white p-3 rounded-2xl shadow-soft flex flex-col items-center justify-center mx-auto">
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#312E81" />
                  <rect x="11" y="11" width="16" height="16" rx="2" fill="white" />
                  <rect x="15" y="15" width="8" height="8" rx="1" fill="#4F46E5" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#312E81" />
                  <rect x="73" y="11" width="16" height="16" rx="2" fill="white" />
                  <rect x="77" y="15" width="8" height="8" rx="1" fill="#4F46E5" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#312E81" />
                  <rect x="11" y="73" width="16" height="16" rx="2" fill="white" />
                  <rect x="15" y="77" width="8" height="8" rx="1" fill="#4F46E5" />

                  {/* QR Pattern dots */}
                  <rect x="40" y="8" width="6" height="6" rx="1" fill="#4338CA" />
                  <rect x="52" y="14" width="6" height="6" rx="1" fill="#4338CA" />
                  <rect x="42" y="24" width="8" height="8" rx="1" fill="#312E81" />

                  <rect x="8" y="42" width="6" height="6" rx="1" fill="#4338CA" />
                  <rect x="20" y="48" width="8" height="6" rx="1" fill="#312E81" />
                  <rect x="36" y="40" width="28" height="20" rx="3" fill="#6366F1" />

                  <rect x="68" y="42" width="8" height="8" rx="1" fill="#312E81" />
                  <rect x="82" y="48" width="6" height="6" rx="1" fill="#4338CA" />

                  <rect x="42" y="68" width="8" height="8" rx="1" fill="#4338CA" />
                  <rect x="54" y="78" width="6" height="6" rx="1" fill="#312E81" />
                  <rect x="68" y="70" width="10" height="6" rx="1" fill="#4338CA" />
                  <rect x="84" y="82" width="8" height="8" rx="1" fill="#312E81" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-soft">
                    BB
                  </span>
                </div>
              </div>

              {/* Handshake PIN */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Campus Handshake PIN
                </span>
                <span className="font-mono font-extrabold text-xl text-indigo-700 tracking-widest">
                  {pinCode}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Show this QR code to <strong className="text-slate-700">{isOwner ? request.borrowerName : request.ownerName}</strong> at the designated campus meeting point.
            </p>

            {/* Quick Simulation Button for Demo Lab Presentation */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleVerify(pinCode)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-soft transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>
                  {isVerifying 
                    ? 'Verifying Campus Handshake...' 
                    : `Simulate Other Student Scanning QR (${actionType === 'pickup' ? 'Confirm Pickup' : 'Confirm Return'})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
