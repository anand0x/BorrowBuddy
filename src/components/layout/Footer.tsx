import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Shield, RefreshCw, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-20 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-soft">
                <Package className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                BorrowBuddy
              </span>
            </Link>

            <p className="text-sm font-semibold text-indigo-400">
              "Why buy when you can borrow?"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Borrow college essentials from students around you — use them when you need them, then return them.
              Built for campus sustainability, peer trust, and real student savings.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 font-mono text-[11px] text-emerald-400">
                Borrow it. Use it. Return it.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Explore Campus
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-indigo-400 transition">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=sos" className="hover:text-amber-400 transition text-amber-300 flex items-center gap-1">
                  <span>⚡ BorrowBuddy SOS</span>
                </Link>
              </li>
              <li>
                <Link to="/need-something" className="hover:text-indigo-400 transition">
                  Need Something? (Ask)
                </Link>
              </li>
              <li>
                <Link to="/list-item" className="hover:text-indigo-400 transition">
                  List Your Items
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-indigo-400 transition">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Community & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/safety" className="hover:text-indigo-400 transition flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Campus Safety Rules</span>
                </Link>
              </li>
              <li>
                <Link to="/safety#disputes" className="hover:text-indigo-400 transition">
                  Dispute & Damage Resolution
                </Link>
              </li>
              <li>
                <Link to="/safety#locations" className="hover:text-indigo-400 transition">
                  Designated Pickup Spots
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition">
                  Gamification & Points
                </Link>
              </li>
            </ul>
          </div>

          {/* Design Thinking Project Note */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <span>Design Thinking Lab</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Core Problem:</strong> Students need calculators, lab coats, and tools for short durations but end up buying them at high cost. BorrowBuddy solves this via trusted peer access.
            </p>
            <div className="pt-1 text-[10px] text-slate-400">
              University Project Prototype
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 BorrowBuddy. Created for Design Thinking & Innovation Lab.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/safety" className="hover:text-slate-400 transition">Safety Guidelines</Link>
            <Link to="/safety#terms" className="hover:text-slate-400 transition">Community Pledge</Link>
            <span className="text-slate-600">•</span>
            <span>Non-commercial campus prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

