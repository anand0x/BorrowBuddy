import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-200 bg-emerald-50 text-emerald-900';
        let iconColor = 'text-emerald-500';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-200 bg-rose-50 text-rose-900';
          iconColor = 'text-rose-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-200 bg-amber-50 text-amber-900';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-indigo-200 bg-indigo-50 text-indigo-900';
          iconColor = 'text-indigo-500';
        }

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-soft-lg animate-in slide-in-from-right duration-200 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
              <div className="text-xs opacity-90 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition p-1"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

