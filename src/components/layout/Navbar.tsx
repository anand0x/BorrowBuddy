import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Bell, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Zap, 
  HelpCircle, 
  Sparkles,
  Award,
  Layers,
  ShoppingBag,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AIAssistantModal } from '../common/AIAssistantModal';
import { CourseKitsModal } from '../common/CourseKitsModal';
import { AskSeniorsModal } from '../common/AskSeniorsModal';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isDemoUser, isSupabaseUser } = useAuth();
  const { unreadNotificationsCount, unreadMessagesCount, wishlist } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campusHubOpen, setCampusHubOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isKitsOpen, setIsKitsOpen] = useState(false);
  const [isSeniorsOpen, setIsSeniorsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Close dropdowns on route changes
  React.useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setCampusHubOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Slogan */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-700 bg-clip-text text-transparent">
                  BorrowBuddy
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-block">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block -mt-0.5 font-medium">
                Why buy when you can borrow?
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links - Simplified & Clean Hierarchy */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <Link
              to="/explore"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isActive('/explore')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Explore Items
            </Link>
            <Link
              to="/need-something"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isActive('/need-something')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Need Something?
            </Link>

            {/* Campus Hub Secondary Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCampusHubOpen(!campusHubOpen)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  campusHubOpen || isActive('/safety')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
                aria-expanded={campusHubOpen}
                aria-haspopup="true"
              >
                <span>Campus Hub</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${campusHubOpen ? 'rotate-180' : ''}`} />
              </button>

              {campusHubOpen && (
                <div
                  className="absolute left-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200/90 shadow-soft-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setCampusHubOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsKitsOpen(true)}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition"
                  >
                    <Package className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <div className="font-bold">Semester Kits</div>
                      <div className="text-[10px] text-slate-400">Course & practical bundles</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSeniorsOpen(true)}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold">Ask Seniors</div>
                      <div className="text-[10px] text-slate-400">Equipment advice & forum</div>
                    </div>
                  </button>

                  <Link
                    to="/explore?filter=sos"
                    className="px-4 py-2.5 text-xs text-amber-800 hover:bg-amber-50/80 flex items-center gap-2.5 transition"
                  >
                    <Zap className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold">⚡ Emergency SOS Mode</div>
                      <div className="text-[10px] text-slate-500">Fast 200m campus pickup</div>
                    </div>
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <Link
                    to="/safety"
                    className="px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-bold">Campus Safety Code</div>
                      <div className="text-[10px] text-slate-400">Predefined spots & trust code</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={() => setIsAIOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-200/80 text-indigo-700 hover:text-indigo-900 font-bold text-xs transition shadow-2xs hover:scale-102"
              title="Ask Campus Syllabus & Gear AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ask AI</span>
            </button>

            {/* List an Item CTA */}
            <Link
              to="/list-item"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-xs transition shadow-soft hover:shadow-soft-lg active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List an Item</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Wishlist Icon */}
                <Link
                  to="/wishlist"
                  className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition relative"
                  aria-label="Wishlist"
                  title="Saved Items"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Messages Icon */}
                <Link
                  to="/messages"
                  className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition relative"
                  aria-label="Messages"
                  title="Conversations"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>

                {/* Notifications Icon */}
                <Link
                  to="/notifications"
                  className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition relative"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-indigo-300 transition bg-slate-50 hover:bg-white cursor-pointer"
                  >
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {user?.fullName ? user.fullName.split(' ')[0] : 'Buddy'}
                      </div>
                      <div className="text-[10px] text-indigo-600 font-semibold flex items-center gap-0.5">
                        <Award className="w-2.5 h-2.5" /> {user?.points ?? 0} pts
                      </div>
                    </div>
                    <img
                      src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=student`}
                      alt={user?.fullName || 'User'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.fullName}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                            👤 {user?.rank}
                          </span>
                          {isDemoUser && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                              Demo Persona
                            </span>
                          )}
                          {isSupabaseUser && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                              Supabase
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/my-borrowings"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <ShoppingBag className="w-4 h-4 text-slate-400" />
                          <span>My Borrowings</span>
                        </Link>
                        <Link
                          to="/my-listings"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span>My Listings</span>
                        </Link>
                        <Link
                          to="/requests"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span>Borrow Requests</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <Link
                          to="/settings"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                        >
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-soft"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer: Campus Resources & Quick Tools (Complementing BottomNav) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-2.5 shadow-soft-lg animate-in slide-in-from-top-2 duration-150">
          <div className="px-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Campus Services & Tools
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAIOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-200 text-indigo-900 font-bold text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask BuddyAI Syllabus Assistant</span>
            </div>
            <span className="text-[10px] font-extrabold text-teal-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
              AI Match
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsKitsOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition"
          >
            <Package className="w-4 h-4 text-indigo-500" />
            <span>Semester Kits (Course Equipment Bundles)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSeniorsOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Ask Seniors (Gear & Syllabus Advice Forum)</span>
          </button>

          <Link
            to="/explore?filter=sos"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-800 hover:bg-amber-50/80 flex items-center gap-2.5 transition"
          >
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>⚡ Emergency SOS Mode (200m Pickup)</span>
          </Link>

          <Link
            to="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Campus Safety Code & Handover Spots</span>
          </Link>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-600 hover:text-indigo-600 font-medium py-1"
            >
              Settings & Audio
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-rose-600 hover:text-rose-700 font-semibold py-1"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}

      {/* BuddyAI Campus Assistant Modal */}
      <AIAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Semester Equipment Kits Modal */}
      <CourseKitsModal isOpen={isKitsOpen} onClose={() => setIsKitsOpen(false)} />

      {/* Ask Seniors Mentorship Modal */}
      <AskSeniorsModal isOpen={isSeniorsOpen} onClose={() => setIsSeniorsOpen(false)} />
    </header>
  );
};

