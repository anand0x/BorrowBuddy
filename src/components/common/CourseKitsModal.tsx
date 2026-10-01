import React, { useState } from 'react';
import { 
  Package, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  Wrench, 
  GraduationCap,
  PiggyBank
} from 'lucide-react';
import { formatCurrency } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface CourseKit {
  id: string;
  name: string;
  department: string;
  semester: string;
  icon: string;
  deposit: number;
  estimatedBuyPrice: number;
  description: string;
  items: string[];
}

const COURSE_KITS: CourseKit[] = [
  {
    id: 'kit-eng-drawing',
    name: '1st Year Engineering Drawing Kit',
    department: 'Mechanical / Civil / Common',
    semester: 'Semester 1 & 2',
    icon: '📐',
    deposit: 150,
    estimatedBuyPrice: 3200,
    description: 'Essential drafting kit for ME101/CE101 graphics labs. Approved by college engineering drawing faculty.',
    items: [
      'Mini Drafter with 360° scale lock',
      'Engineering Compass Set with divider & extensions',
      'Set Squares (45° and 60° acrylic)',
      'T-Scale 60cm & Sheet Protection Tube'
    ]
  },
  {
    id: 'kit-cs-electronics',
    name: 'Hardware & IoT Microcontroller Kit',
    department: 'Computer Science & Electronics',
    semester: 'Semester 3 & 4',
    icon: '💻',
    deposit: 300,
    estimatedBuyPrice: 4800,
    description: 'Complete hands-on hardware kit for microprocessors, embedded systems, and sensor prototyping courses.',
    items: [
      'Arduino Uno R3 Microcontroller Board with USB cable',
      'Breadboard 830-point with 65 jumper wire kit',
      'Digital Multimeter with continuity buzzer probe',
      'Ultrasonic distance sensor & Servo motor SG90'
    ]
  },
  {
    id: 'kit-chemistry-bio',
    name: 'College Science Laboratory Safety Kit',
    department: 'Chemistry, Biotech & Sciences',
    semester: 'Semester 1 to 4',
    icon: '🥼',
    deposit: 100,
    estimatedBuyPrice: 1950,
    description: 'Sanitized, pure cotton lab attire and eye protection meeting all departmental safety inspection rules.',
    items: [
      '100% Pure White Cotton Lab Coat (Sanitized)',
      'Anti-fog Chemical Splash Safety Goggles (Polycarbonate)',
      'Latex & Neoprene Heat-resistant Glove Pair',
      'Dissection & Spatula Stainless Steel Tool Pouch'
    ]
  },
  {
    id: 'kit-exam-math',
    name: 'Semester Mathematics & Exam Crunch Bundle',
    department: 'All Engineering & Tech Streams',
    semester: 'Mid-Terms & End-Terms',
    icon: '🧮',
    deposit: 100,
    estimatedBuyPrice: 3100,
    description: 'Pre-loaded university-approved scientific calculation and standard text reference bundle.',
    items: [
      'Casio FX-991CW ClassWiz Scientific Calculator',
      'Higher Engineering Mathematics by Dr. B.S. Grewal (Reference)',
      'Engineering Formula Quick-Reference Stiff Clipboard'
    ]
  }
];

interface CourseKitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseKitsModal: React.FC<CourseKitsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [requestedKitId, setRequestedKitId] = useState<string | null>(null);

  if (!isOpen) return null;

  const departments = ['all', 'Common', 'Mechanical', 'Computer Science', 'Chemistry'];

  const filteredKits = selectedDept === 'all' 
    ? COURSE_KITS 
    : COURSE_KITS.filter(k => k.department.toLowerCase().includes(selectedDept.toLowerCase()) || k.department.includes('Common') || k.department.includes('All'));

  const handleRequestBundle = (kit: CourseKit) => {
    if (!user) {
      showToast({ type: 'error', message: 'Please log in to request a semester kit bundle.' });
      return;
    }

    setRequestedKitId(kit.id);
    setTimeout(() => {
      setRequestedKitId(null);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {}

      showToast({
        type: 'success',
        title: 'Bundle Request Broadcasted! 🎒',
        message: `Your request for the "${kit.name}" has been shared with student lenders holding matching items in your campus block!`
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200 my-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Campus Curriculum Resource Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Course & Semester Equipment Kits
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Borrow entire course toolkits packaged together rather than tracking down items one by one.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept === 'all' ? 'All Semester Kits' : dept}
            </button>
          ))}
        </div>

        {/* Kits Grid */}
        <div className="overflow-y-auto space-y-4 pr-1">
          {filteredKits.map(kit => {
            const savings = kit.estimatedBuyPrice - kit.deposit;
            return (
              <div 
                key={kit.id}
                className="bg-slate-50/70 hover:bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-soft-lg transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-white shadow-2xs border border-slate-200/60 shrink-0">
                      {kit.icon}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                          {kit.name}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          {kit.semester}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {kit.department}
                      </p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {kit.description}
                      </p>
                    </div>
                  </div>

                  {/* Financial Comparison Badge */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs shrink-0 sm:text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Refundable Deposit</div>
                    <div className="text-lg font-black text-indigo-600">{formatCurrency(kit.deposit)}</div>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5 sm:justify-end">
                      <PiggyBank className="w-3.5 h-3.5" />
                      <span>Save {formatCurrency(savings)} vs buying</span>
                    </div>
                  </div>
                </div>

                {/* Items in bundle list */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/70">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Included in this bundle ({kit.items.length} tools):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {kit.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free borrow • Security deposit refunded on return</span>
                  </span>

                  <button
                    onClick={() => handleRequestBundle(kit)}
                    disabled={requestedKitId === kit.id}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-soft flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <span>{requestedKitId === kit.id ? 'Broadcasting...' : 'Request Entire Kit'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
