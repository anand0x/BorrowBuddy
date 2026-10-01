import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const { showToast } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already dismissed in this session
    const isDismissed = sessionStorage.getItem('bb_pwa_banner_dismissed');
    if (isDismissed) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show simulated subtle prompt after 4 seconds on mobile/tablets if not yet installed
    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches && !isDismissed) {
        setIsVisible(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showToast({
          type: 'success',
          title: 'BorrowBuddy Installed! 📱',
          message: 'Access BorrowBuddy directly from your home screen anytime.'
        });
      }
      setDeferredPrompt(null);
      setIsVisible(false);
    } else {
      // In desktop or browsers without prompt event
      showToast({
        type: 'info',
        title: 'Install to Campus Device 📲',
        message: 'Tap your browser menu (⋮ or Share) and select "Add to Home Screen" or "Install App".'
      });
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('bb_pwa_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-indigo-100 shadow-soft-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-600 text-white flex items-center justify-center shrink-0 shadow-soft">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
              Install BorrowBuddy
            </h4>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
              Campus App
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            Fast, offline access to borrowing QR passes and student listings without typing URLs.
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 font-semibold text-xs transition cursor-pointer"
            >
              Not now
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg transition"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
