import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Leaf, 
  PiggyBank, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PlusCircle, 
  Repeat,
  HeartHandshake,
  TrendingUp,
  Layers
} from 'lucide-react';
import { ItemCard } from '../components/common/ItemCard';
import { CATEGORIES, IMPACT_METRICS } from '../data/mockData';
import { StorageService } from '../services/storageService';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/cn';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchQuery, setSelectedCategory } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [nearbyTab, setNearbyTab] = useState<'popular' | 'recent'>('popular');

  const items = StorageService.getItems();
  const popularItems = items.slice(0, 4);
  const recentItems = [...items].reverse().slice(0, 4);
  const sosItems = items.filter(i => i.isUrgentSOS).slice(0, 3);
  const circles = StorageService.getCircles();

  const displayedNearbyItems = nearbyTab === 'popular' ? popularItems : recentItems;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate(`/explore?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    navigate(`/explore?cat=${catId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-slate-50/60 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60">
        {/* Soft background decor blurs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
          <div className="absolute -top-20 left-10 w-72 h-72 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Campus Peer-to-Peer Borrowing Network</span>
            <span className="text-indigo-400">•</span>
            <span className="text-emerald-700 font-bold">100% Student Verified Spots</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Why buy when you can{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              borrow?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Borrow college essentials from students around you — use them when you need them, then return them.
            Calculators, mini-drafters, lab coats, and books are just a 2-minute campus walk away.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white p-2 rounded-2xl border-2 border-indigo-100 shadow-soft-lg hover:border-indigo-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="What do you need to borrow?"
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm hover:bg-indigo-700 transition shadow-soft shrink-0"
              >
                Find Something
              </button>
            </form>

            {/* Quick search keywords */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Popular:</span>
              {['Casio FX-991CW', 'Lab Coat', 'Mini Drafter', 'C++ Book', 'Soldering Iron'].map(kw => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    setSearchInput(kw);
                    setSearchQuery(kw);
                    navigate(`/explore?q=${encodeURIComponent(kw)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition text-[11px]"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition shadow-soft-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore All Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/list-item"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-700 font-bold text-sm border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition shadow-soft hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>List Your Item (+10 pts)</span>
            </Link>
          </div>

          {/* Trust stats pill strip */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-slate-800">1,284+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Items Borrowed</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">₹2.4L+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Student Savings</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-teal-600">856 kg</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Waste Avoided</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600">96%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">On-time Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CATEGORIES */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Browse Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find exactly what you need for this semester's courses & practicals
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-soft transition-all text-center group"
            >
              <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {cat.itemCount} items
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* AVAILABLE NEAR YOU (PRIORITIZED PEER LISTINGS RIGHT AFTER CATEGORIES) */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Available Near You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified peer listings ready for campus pickup at Central Library, Canteen & Department blocks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setNearbyTab('popular')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  nearbyTab === 'popular'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Popular on Campus
              </button>
              <button
                type="button"
                onClick={() => setNearbyTab('recent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  nearbyTab === 'recent'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Recently Listed
              </button>
            </div>

            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedNearbyItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* BORROWBUDDY SOS (EMERGENCY / URGENT BORROWING) */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white shadow-soft-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>BorrowBuddy SOS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Need something urgently for tomorrow's lab?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-amber-100 leading-relaxed">
                Forgot your lab coat or mini drafter before your external viva? BorrowBuddy SOS instantly connects you with nearby items available within 200m on campus.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/explore?filter=sos"
                className="px-6 py-3 rounded-2xl bg-white text-amber-900 font-extrabold text-xs sm:text-sm hover:bg-amber-50 transition shadow-soft flex items-center gap-2"
              >
                <span>Find It Fast</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/need-something"
                className="px-5 py-3 rounded-2xl bg-black/20 text-white font-bold text-xs sm:text-sm hover:bg-black/30 border border-white/30 transition"
              >
                Ask Community
              </Link>
            </div>
          </div>

          {/* SOS Quick preview items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/20">
            {sosItems.map(item => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs transition text-white"
              >
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover bg-white/20 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs truncate">{item.title}</div>
                  <div className="text-[11px] text-amber-100 flex items-center gap-1.5 mt-0.5">
                    <span>📍 {item.pickupLocation}</span>
                    <span>•</span>
                    <span className="font-bold text-white">⭐ {item.ownerRating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW BORROWBUDDY WORKS (CONDENSED 4-STEP CAMPUS FLOW) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <Repeat className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus Sharing Cycle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How BorrowBuddy Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simple 4-step circular student economy designed to eliminate redundant spending
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: '1. Find Near You',
              desc: 'Search calculators, drafters, or books available from peers in your campus block.',
              icon: Search,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
            },
            {
              step: '2',
              title: '2. Request & Book',
              desc: 'Select borrowing dates on the live availability calendar and message the owner.',
              icon: Clock,
              color: 'text-brand-600 bg-brand-50 border-brand-200'
            },
            {
              step: '3',
              title: '3. Campus Handover',
              desc: 'Meet safely at predefined campus spots like the Central Library or Canteen.',
              icon: MapPin,
              color: 'text-teal-600 bg-teal-50 border-teal-200'
            },
            {
              step: '4',
              title: '4. Return & Earn Points',
              desc: 'Return the item on time, rate your peer, and build your campus reputation rank.',
              icon: CheckCircle2,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
            }
          ].map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="flex flex-col p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft relative group hover:shadow-soft-lg hover:border-indigo-300 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-3 shadow-2xs ${s.color}`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 mb-1">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BUDDY CIRCLES HIGHLIGHT */}
      <section className="py-10 bg-indigo-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10 my-6 shadow-soft-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800 text-indigo-200 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Buddy Circles</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Borrow Within Your Campus Groups
              </h3>
              <p className="text-xs text-indigo-200/90 mt-1 max-w-xl">
                Browse tools and books shared specifically inside your hostel wing, engineering branch, or study club.
              </p>
            </div>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
            >
              Explore Circles
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {circles.map(circle => (
              <div
                key={circle.id}
                className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 hover:border-indigo-500/80 transition group"
              >
                <div className="text-2xl mb-1.5">{circle.icon}</div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {circle.name}
                </h4>
                <p className="text-xs text-indigo-200/80 mt-1 line-clamp-2">
                  {circle.description}
                </p>
                <div className="mt-3 pt-2.5 border-t border-indigo-900/80 flex items-center justify-between text-xs text-indigo-300">
                  <span>{circle.membersCount} members</span>
                  <span className="font-semibold text-emerald-400">{circle.itemCount} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BORROWBUDDY IMPACT METRICS DASHBOARD */}
      <section className="py-14 bg-gradient-to-b from-white to-indigo-50/40 border-t border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
              <Leaf className="w-3.5 h-3.5 text-teal-600" />
              <span>Campus Sustainability & Savings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              BorrowBuddy Impact Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              "Every borrow is one less unnecessary purchase." Estimated metrics from campus sharing activity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Repeat className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900">{IMPACT_METRICS.itemsBorrowed.toLocaleString()}</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Items Borrowed & Reused</div>
              <p className="text-[11px] text-slate-400 mt-1">Calculators, drafters, books and electronics</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-emerald-600">₹2.42 Lakhs</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Estimated Student Savings</div>
              <p className="text-[11px] text-slate-400 mt-1">Money retained in students' pockets</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-teal-600">{IMPACT_METRICS.wasteAvoidedKg} kg</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Material Waste Avoided</div>
              <p className="text-[11px] text-slate-400 mt-1">Plastics, electronic e-waste & paper saved</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900">{IMPACT_METRICS.studentsHelped}</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Students Supported</div>
              <p className="text-[11px] text-slate-400 mt-1">Across 4 university academic departments</p>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-6 italic">
            *Simulation & Estimated Figures: {IMPACT_METRICS.disclaimer}
          </p>
        </div>
      </section>

      {/* CAN'T FIND WHAT YOU NEED BANNER */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft-xl">
          <div className="max-w-xl">
            <h3 className="text-2xl font-extrabold tracking-tight">
              Can't find the exact item you're looking for?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Post a "Need Something?" request on our campus community board. Other students with idle tools will reach out and offer them directly to you.
            </p>
          </div>
          <Link
            to="/need-something"
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-500 transition shadow-soft shrink-0"
          >
            Post a Community Request
          </Link>
        </div>
      </section>
    </div>
  );
};

