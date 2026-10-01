import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Users, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const { resetDemoData, isSoundEnabled, toggleSound } = useApp();

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-brand-800 to-indigo-950 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-indigo-700/50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-indigo-200">Prototype Demo Mode:</span>
        <span className="hidden sm:inline text-indigo-100">
          Peer-to-peer student borrowing simulation.
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {user ? (
          <div className="flex items-center gap-2 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-700/60">
            <span className="text-indigo-300">Signed in as:</span>
            <span className="font-medium text-white truncate max-w-[130px]">{user.fullName}</span>
            <span className="text-indigo-400">({user.rank})</span>
          </div>
        ) : (
          <span className="text-indigo-200">Not signed in</span>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => switchDemoUser(0)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
              user?.id === 'user-1'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-950/50 hover:bg-indigo-800 text-indigo-200'
            }`}
            title="Switch to Demo User 1 (Rahul Sharma)"
          >
            Rahul (Owner)
          </button>
          <button
            onClick={() => switchDemoUser(1)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
              user?.id === 'user-2'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-950/50 hover:bg-indigo-800 text-indigo-200'
            }`}
            title="Switch to Demo User 2 (Priya Verma)"
          >
            Priya (Borrower)
          </button>
        </div>

        <button
          onClick={toggleSound}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-indigo-200 hover:text-white hover:bg-indigo-800 transition cursor-pointer"
          title={isSoundEnabled ? 'Audio Effects On (Click to mute)' : 'Audio Effects Muted (Click to enable)'}
        >
          {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          <span className="hidden lg:inline">{isSoundEnabled ? 'Sound On' : 'Muted'}</span>
        </button>

        <button
          onClick={resetDemoData}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-indigo-200 hover:text-white hover:bg-indigo-800 transition cursor-pointer"
          title="Reset sample items, chats and requests to initial state"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden md:inline">Reset Demo</span>
        </button>
      </div>
    </div>
  );
};

