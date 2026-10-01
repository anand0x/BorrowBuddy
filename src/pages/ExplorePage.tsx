import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Zap, 
  MapPin, 
  HelpCircle, 
  Sparkles,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { ItemCard } from '../components/common/ItemCard';
import { CampusMapView } from '../components/common/CampusMapView';
import { StorageService } from '../services/storageService';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { CampusLocation, ItemCondition } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || searchQuery || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('cat') || selectedCategory || 'all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'Available' | 'Borrowed'>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | ItemCondition>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | CampusLocation>('all');
  const [costFilter, setCostFilter] = useState<'all' | 'free' | 'low-deposit'>('all');
  const [sosOnly, setSosOnly] = useState(searchParams.get('filter') === 'sos');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'rating'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Sync with searchParams
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchTerm(q);
    const cat = searchParams.get('cat');
    if (cat !== null) setCategoryFilter(cat);
    const filter = searchParams.get('filter');
    if (filter === 'sos') setSosOnly(true);
  }, [searchParams]);

  const items = StorageService.getItems();

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(term);
        const matchDesc = item.description.toLowerCase().includes(term);
        const matchCat = item.categoryName.toLowerCase().includes(term);
        const matchOwner = item.ownerName.toLowerCase().includes(term);
        if (!matchTitle && !matchDesc && !matchCat && !matchOwner) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) {
        return false;
      }

      // Availability filter
      if (availabilityFilter !== 'all' && item.status !== availabilityFilter) {
        return false;
      }

      // Condition filter
      if (conditionFilter !== 'all' && item.condition !== conditionFilter) {
        return false;
      }

      // Location filter
      if (locationFilter !== 'all' && item.pickupLocation !== locationFilter) {
        return false;
      }

      // Cost filter
      if (costFilter === 'free' && item.borrowFee > 0) return false;
      if (costFilter === 'low-deposit' && item.deposit > 100) return false;

      // SOS Urgent
      if (sosOnly && !item.isUrgentSOS) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.borrowCount + b.views * 0.1) - (a.borrowCount + a.views * 0.1);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'price-low') return (a.borrowFee + a.deposit) - (b.borrowFee + b.deposit);
      if (sortBy === 'rating') return b.ownerRating - a.ownerRating;
      return 0;
    });
  }, [items, searchTerm, categoryFilter, availabilityFilter, conditionFilter, locationFilter, costFilter, sosOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setAvailabilityFilter('all');
    setConditionFilter('all');
    setLocationFilter('all');
    setCostFilter('all');
    setSosOnly(false);
    setSortBy('popular');
    setSearchParams({});
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = 
    searchTerm || 
    categoryFilter !== 'all' || 
    availabilityFilter !== 'all' || 
    conditionFilter !== 'all' || 
    locationFilter !== 'all' || 
    costFilter !== 'all' || 
    sosOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Explore Campus Items
              {sosOnly && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold flex items-center gap-1 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" /> SOS Mode
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find textbooks, lab tools, scientific calculators, and gear available for immediate borrowing.
            </p>
          </div>

          {/* Quick SOS Urgent Switch */}
          <button
            onClick={() => setSosOnly(!sosOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-xs ${
              sosOnly
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Zap className={`w-4 h-4 ${sosOnly ? 'fill-current' : 'text-amber-500'}`} />
            <span>{sosOnly ? 'Showing SOS Items (Active)' : 'Filter SOS Urgent Items'}</span>
          </button>
        </div>

        {/* Search Bar + Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search calculators, books, lab coats, drafters, Arduino..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-soft"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchQuery('');
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="appearance-none pl-9 pr-8 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-soft cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Recently Listed</option>
                <option value="price-low">Lowest Fee / Deposit</option>
                <option value="rating">Top Owner Rating</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Campus Map View Toggle */}
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={`px-3.5 py-3 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition shadow-soft ${
                showMap
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle interactive campus landmark map"
            >
              <span>🗺️</span>
              <span className="hidden sm:inline">{showMap ? 'Hide Map' : 'Campus Map'}</span>
            </button>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-700 flex items-center gap-2 shadow-soft hover:bg-slate-50"
            >
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setCategoryFilter('all');
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
              categoryFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryFilter(cat.id);
                setSelectedCategory(cat.id);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Interactive Campus Map View */}
        {showMap && (
          <div className="mt-5 animate-in fade-in slide-in-from-top-3 duration-200">
            <CampusMapView
              items={items}
              selectedLocation={locationFilter}
              onSelectLocation={setLocationFilter}
            />
          </div>
        )}
      </div>

      {/* Main Content: Sidebar Filters + Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside
          className={`lg:block bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-6 ${
            isMobileFilterOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-800">Filter By</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Availability</label>
            <div className="space-y-1.5 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={availabilityFilter === 'all'}
                  onChange={() => setAvailabilityFilter('all')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>All Statuses</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={availabilityFilter === 'Available'}
                  onChange={() => setAvailabilityFilter('Available')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available Now
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={availabilityFilter === 'Borrowed'}
                  onChange={() => setAvailabilityFilter('Borrowed')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Currently Borrowed
                </span>
              </label>
            </div>
          </div>

          {/* Campus Pickup Spot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Campus Pickup Location</label>
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value as any)}
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Any Campus Location</option>
              <option value="Central Library">Central Library</option>
              <option value="Canteen">Canteen</option>
              <option value="Main Gate">Main Gate</option>
              <option value="Department Block">Department Block</option>
              <option value="Hostel Reception">Hostel Reception</option>
            </select>
          </div>

          {/* Item Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Item Condition</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['all', 'Excellent', 'Good', 'Used'] as const).map(cond => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setConditionFilter(cond)}
                  className={`py-1.5 rounded-lg font-medium transition text-[11px] ${
                    conditionFilter === cond
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cond === 'all' ? 'All' : cond}
                </button>
              ))}
            </div>
          </div>

          {/* Cost / Deposit Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Borrow Fee / Deposit</label>
            <div className="space-y-1.5 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cost"
                  checked={costFilter === 'all'}
                  onChange={() => setCostFilter('all')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Any Fee</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cost"
                  checked={costFilter === 'free'}
                  onChange={() => setCostFilter('free')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-emerald-700">100% Free Borrowing (₹0 fee)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cost"
                  checked={costFilter === 'low-deposit'}
                  onChange={() => setCostFilter('low-deposit')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Low Deposit (≤ ₹100)</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Items Grid & Zero State */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-800">{filteredItems.length}</strong> items available on campus
            </span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            /* ZERO STATE: As mandated in Requirement #30 */
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-1">
                Couldn't find what you need?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                No students have listed "{searchTerm || 'items matching your filters'}" yet. Don't worry! Ask the community and someone will offer theirs.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/need-something"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tell the community what you need</span>
                </Link>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

