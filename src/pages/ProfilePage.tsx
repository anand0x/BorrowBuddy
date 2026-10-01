import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Award, 
  CheckCircle2, 
  Star, 
  Layers, 
  ShoppingBag, 
  Sparkles, 
  Edit3, 
  MapPin, 
  ShieldCheck, 
  TrendingUp,
  Info,
  GraduationCap,
  Leaf,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { RatingStars } from '../components/common/RatingStars';
import { ItemCard } from '../components/common/ItemCard';
import { IDVerificationModal } from '../components/common/IDVerificationModal';
import { SustainabilityCertificateModal } from '../components/common/SustainabilityCertificateModal';
import { CampusSelectorModal } from '../components/common/CampusSelectorModal';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'items' | 'reviews' | 'trust'>('items');
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);

  if (!user) return null;

  const items = StorageService.getItems().filter(i => i.ownerId === user.id);
  const reviews = StorageService.getUserReviews(user.id);

  // Gamification Next Rank Progress
  let nextRank = 'Campus Legend';
  let targetPoints = 500;
  if (user.points < 150) {
    nextRank = 'Helpful Buddy';
    targetPoints = 150;
  } else if (user.points < 350) {
    nextRank = 'Super Buddy';
    targetPoints = 350;
  } else if (user.points < 500) {
    nextRank = 'Campus Legend';
    targetPoints = 500;
  }

  const progressPercent = Math.min(100, Math.round((user.points / targetPoints) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-soft"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user.fullName}
                </h1>
                {/* Profile Badge: As per requirement #2 */}
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80 flex items-center gap-1 shadow-2xs">
                  <span>👤</span>
                  <span>BorrowBuddy Member</span>
                </span>

                {user.isUniversityVerified ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 flex items-center gap-1 shadow-2xs">
                    <span>🎓</span>
                    <span>University Verified</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsIdModalOpen(true)}
                    className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200/80 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                    title="Verify Student Roll No & Campus ID to earn the University Verified badge"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Verify Student ID</span>
                  </button>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCampusModalOpen(true)}
                  className="text-xs sm:text-sm text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition group cursor-pointer"
                  title="Click to switch your active university/campus network"
                >
                  <Building className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                  <span className="font-semibold underline decoration-slate-300 group-hover:decoration-indigo-500">{user.university}</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200/60 ml-0.5">Switch</span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
                  <RatingStars rating={user.rating} size="sm" />
                  <span className="text-slate-800 ml-1">{user.rating} ({reviews.length} reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-semibold">{user.itemsLent} Items Lent</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-semibold">{user.itemsBorrowed} Items Borrowed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setIsCertModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 font-bold text-xs transition shadow-2xs cursor-pointer"
              title="View and download your official Campus Sustainability & Sharing Certificate"
            >
              <Leaf className="w-4 h-4 text-teal-600" />
              <span>Green Certificate</span>
            </button>

            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 font-bold text-xs transition shadow-2xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {user.bio && (
          <p className="mt-6 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            "{user.bio}"
          </p>
        )}
      </div>

      {/* GAMIFICATION & BORROWBUDDY SCORE CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Score & Rank */}
        <div className="bg-gradient-to-br from-indigo-900 via-brand-800 to-indigo-950 rounded-3xl p-6 text-white shadow-soft-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Community Reputation
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-700/60 border border-indigo-500/40 text-[11px] font-bold text-indigo-200">
                Level: {user.rank}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{user.points}</span>
              <span className="text-indigo-200 text-sm font-semibold">BorrowBuddy Points</span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1">
              Earn points for on-time returns, peer lending, and helpful ratings.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-800/80">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1.5 font-medium">
              <span>Next Rank: {nextRank}</span>
              <span>{user.points} / {targetPoints} pts</span>
            </div>
            <div className="w-full h-2.5 bg-indigo-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Gamification Points Rule Reference */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>How to Earn Points</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>List a college item</span>
              <span className="font-bold text-emerald-600">+10 pts</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>Successful lending</span>
              <span className="font-bold text-emerald-600">+20 pts</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>On-time return</span>
              <span className="font-bold text-emerald-600">+15 pts</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>Write helpful review</span>
              <span className="font-bold text-emerald-600">+5 pts</span>
            </li>
          </ul>
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Activity</span>
          </h3>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div 
              onClick={() => !user.isUniversityVerified && setIsIdModalOpen(true)}
              className={`flex items-center justify-between p-2 rounded-xl border transition ${
                user.isUniversityVerified 
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200/60' 
                  : 'bg-amber-50 text-amber-900 border-amber-200/60 cursor-pointer hover:bg-amber-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className={`w-4 h-4 ${user.isUniversityVerified ? 'text-emerald-600' : 'text-amber-600'} shrink-0`} />
                <span className="font-semibold">{user.isUniversityVerified ? 'Official Student ID Verified' : 'Standard Account'}</span>
              </div>
              {!user.isUniversityVerified && (
                <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Verify</span>
              )}
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{user.successfulReturns} successful transactions</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{user.onTimeReturnRate}% on-time return rate</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200/60">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Active campus community member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: My Items vs Reviews */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'items'
                ? 'bg-indigo-600 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Listed Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'reviews'
                ? 'bg-indigo-600 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Peer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'items' && (
          <div>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-soft">
                <p className="text-sm text-slate-500 mb-4">You have not listed any items yet.</p>
                <Link
                  to="/list-item"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-soft"
                >
                  List an Item Now
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map(rev => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.reviewerAvatar}
                        alt={rev.reviewerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-800">{rev.reviewerName}</span>
                        <span className="text-[11px] text-slate-400 block">
                          Role: {rev.role} • {rev.createdAt}
                        </span>
                      </div>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" showValue />
                  </div>
                  <p className="text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-soft">
                <p className="text-sm text-slate-500">No reviews received yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student ID Verification Modal */}
      <IDVerificationModal
        isOpen={isIdModalOpen}
        onClose={() => setIsIdModalOpen(false)}
      />

      {/* Sustainability Certificate Modal */}
      <SustainabilityCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        user={user}
      />

      {/* Multi-Campus Network Selector Modal */}
      <CampusSelectorModal
        isOpen={isCampusModalOpen}
        onClose={() => setIsCampusModalOpen(false)}
      />
    </div>
  );
};

