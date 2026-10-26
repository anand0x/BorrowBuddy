import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Lock, 
  FileText,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ReportModal } from '../components/common/ReportModal';

export const SafetyPage: React.FC = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-brand-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-soft-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700/60 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Campus Trust & Safety Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Safe, Transparent Peer Borrowing
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-indigo-200 leading-relaxed">
            BorrowBuddy is built by students, for students. Learn how our predefined campus pickup spots, refundable deposits, and verified reputation system protect every interaction.
          </p>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition shadow-soft"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>File a Campus Dispute or Report</span>
          </button>
        </div>
      </div>

      {/* 5 Core Safety Pillars */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            The BorrowBuddy Safety Code
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Essential campus rules every student agrees to when lending and borrowing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">1. Public Campus Handover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always meet at high-visibility campus landmarks like the Central Library, Canteen, or Department Block. Never meet in private off-campus rooms.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">2. Inspect Before You Accept</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take 30 seconds at the handover point to turn on the calculator, test the drafter scale, or check book condition before confirming.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">3. Honor Return Deadlines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Return on time! Another student may have a morning lab exam relying on that exact tool. Late returns impact your campus trust score.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">4. Mutual Respect & Care</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Treat borrowed tools better than your own. Keep lab coats clean and avoid ink markings on textbooks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">5. Rapid Dispute Resolution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an item is damaged or a user fails to arrive, report it immediately to lock the refundable deposit for moderation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">6. Privacy by Design</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never publish your phone number or hostel room number publicly. Communications occur safely inside BorrowBuddy campus chat.
            </p>
          </div>
        </div>
      </div>

      {/* ESCROW & DEPOSIT PROTECTION EXPLAINED */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Financial Safety & Protection
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
              How Security Deposits & Escrow Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Deposits prevent loss and ensure items are returned in good working condition.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Refundable Guarantee
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">1</span>
            <h4 className="font-bold text-slate-800 text-sm">Protected in Escrow</h4>
            <p className="leading-relaxed">
              When a borrower pays a security deposit, funds are never sent directly to the lender. They are locked securely in campus escrow until safe handover return.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">2</span>
            <h4 className="font-bold text-slate-800 text-sm">Condition Inspection</h4>
            <p className="leading-relaxed">
              Borrowers and owners inspect the equipment during handover and return. If the item is returned on time without new damage, deposit release is triggered.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">3</span>
            <h4 className="font-bold text-slate-800 text-sm">Instant Deposit Release</h4>
            <p className="leading-relaxed">
              Once marked returned, 100% of the deposit returns to the borrower immediately. If a dispute is filed, funds remain frozen until student moderator review.
            </p>
          </div>
        </div>
      </div>

      {/* DESIGNATED PICKUP LOCATIONS DIRECTORY */}
      <div id="locations" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-soft-xl">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
          Campus Designated Handover Spots
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xl">
          Pre-approved open public areas equipped with seating, security, and CCTV coverage for student peace of mind:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4" /> Central Library Entrance
            </h4>
            <p className="text-slate-300">Ground floor reading hall lobby near the circulation counter.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4" /> Campus Student Canteen
            </h4>
            <p className="text-slate-300">Central open seating courtyard between 1:00 PM and 5:00 PM.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4" /> Department Block Corridor
            </h4>
            <p className="text-slate-300">First floor central notice board zone outside departmental staff rooms.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4" /> Main Gate Security Post
            </h4>
            <p className="text-slate-300">Campus visitor waiting bay with active security personnel present.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4" /> Hostel Reception Lounge
            </h4>
            <p className="text-slate-300">Common visitor lounge at main hostel block entrance.</p>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

