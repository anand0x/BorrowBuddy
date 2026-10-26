import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Users, RotateCcw, Volume2, VolumeX, Check, ArrowRight } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { user, isDemoUser, isSupabaseUser, switchDemoUser } = useAuth();
  const { resetDemoData, isSoundEnabled, toggleSound } = useApp();

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-brand-800 to-indigo-950 text-white text-[11px] px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-1.5 border-b border-indigo-700/50 shadow-2xs">
      {/* Mode Indicator */}
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        {isSupabaseUser ? (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-emerald-300">Supabase Cloud Session:</span>
            <span className="hidden sm:inline text-indigo-100">
              Live database & authenticated student account.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-indigo-200">Prototype Demo Mode:</span>
            <span className="hidden sm:inline text-indigo-100">
              Peer-to-peer student borrowing simulation.
            </span>
          </div>
        )}
      </div>

      {/* Identity & Role Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {user ? (
          <div className="flex items-center gap-1.5 bg-indigo-950/70 px-2.5 py-1 rounded-full border border-indigo-700/60 shadow-xs">
            <span className="text-indigo-300">
              {isDemoUser ? 'Active Persona:' : 'Signed in as:'}
            </span>
            <span className="font-bold text-white truncate max-w-[130px]">{user.fullName}</span>
            <span className="text-indigo-300 font-medium">
              ({isDemoUser ? (user.id === 'user-1' ? 'Owner' : 'Borrower') : user.rank})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-indigo-950/70 px-2.5 py-1 rounded-full border border-indigo-700/60">
            <span className="text-amber-300 font-medium">Not signed in</span>
          </div>
        )}

        {/* Demo Switcher Controls - Only rendered appropriately */}
        {isDemoUser ? (
          <div className="flex items-center gap-1 bg-indigo-950/60 p-0.5 rounded-lg border border-indigo-800/60">
            <span className="text-[10px] text-indigo-300 font-semibold px-1.5 hidden md:inline-flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" /> Switch Role:
            </span>
            {user?.id === 'user-1' ? (
              <>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3" /> Rahul (Owner)
                </span>
                <button
                  type="button"
                  onClick={() => switchDemoUser(1)}
                  className="px-2 py-0.5 rounded text-[11px] font-medium text-indigo-200 hover:text-white hover:bg-indigo-800/80 transition flex items-center gap-1 cursor-pointer"
                  title="Switch to Demo User 2 (Priya Verma - Borrower role)"
                >
                  <span>Switch to Priya (Borrower)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => switchDemoUser(0)}
                  className="px-2 py-0.5 rounded text-[11px] font-medium text-indigo-200 hover:text-white hover:bg-indigo-800/80 transition flex items-center gap-1 cursor-pointer"
                  title="Switch to Demo User 1 (Rahul Sharma - Owner role)"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  <span>Switch to Rahul (Owner)</span>
                </button>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3" /> Priya (Borrower)
                </span>
              </>
            )}
          </div>
        ) : isSupabaseUser ? (
          <button
            type="button"
            onClick={() => switchDemoUser(0)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-950/60 hover:bg-indigo-800 text-indigo-200 hover:text-white border border-indigo-700/60 transition cursor-pointer flex items-center gap-1"
            title="Switch to Demo Simulation Mode"
          >
            <Users className="w-3 h-3 text-indigo-400" />
            <span>Switch to Demo Persona</span>
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => switchDemoUser(0)}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition cursor-pointer"
              title="Quickly test with preloaded Demo account (Rahul Sharma)"
            >
              Demo as Rahul
            </button>
            <button
              type="button"
              onClick={() => switchDemoUser(1)}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-indigo-950/60 hover:bg-indigo-800 text-indigo-200 transition cursor-pointer"
              title="Quickly test with preloaded Demo account (Priya Verma)"
            >
              Demo as Priya
            </button>
          </div>
        )}

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-indigo-200 hover:text-white hover:bg-indigo-800 transition cursor-pointer"
          title={isSoundEnabled ? 'Audio Effects On (Click to mute)' : 'Audio Effects Muted (Click to enable)'}
        >
          {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          <span className="hidden lg:inline">{isSoundEnabled ? 'Sound On' : 'Muted'}</span>
        </button>

        {/* Reset Demo Data */}
        <button
          type="button"
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
