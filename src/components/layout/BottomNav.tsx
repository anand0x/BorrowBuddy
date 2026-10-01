import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, MessageSquare, User as UserIcon, X, PlusCircle, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { unreadMessagesCount } = useApp();
  const { isAuthenticated } = useAuth();
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Bottom Action Sheet Modal for "+" button */}
      {plusMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-4 lg:hidden animate-in fade-in"
          onClick={() => setPlusMenuOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-soft-xl border border-slate-200 animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">Campus Sharing Action</h3>
              <button 
                onClick={() => setPlusMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link
                to="/list-item"
                onClick={() => setPlusMenuOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition group text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">List an Item</span>
                <span className="text-[11px] text-indigo-950/70 mt-0.5">Lend to students</span>
              </Link>

              <Link
                to="/need-something"
                onClick={() => setPlusMenuOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50/80 hover:bg-amber-100 text-amber-800 border border-amber-200/60 transition group text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">Need Something?</span>
                <span className="text-[11px] text-amber-950/70 mt-0.5">Ask community</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-soft">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            isActive('/') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          to="/explore"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            isActive('/explore') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </Link>

        {/* Floating Plus Button */}
        <button
          onClick={() => setPlusMenuOpen(true)}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-brand-500 text-white flex items-center justify-center shadow-soft-lg hover:scale-105 transition-transform active:scale-95"
          aria-label="Add listing or post request"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <Link
          to="/messages"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition relative ${
            isActive('/messages') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Messages</span>
        </Link>

        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            isActive('/profile') || isActive('/login') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">{isAuthenticated ? "Profile" : "Login"}</span>
        </Link>
      </div>
    </>
  );
};

