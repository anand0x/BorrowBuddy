import React from 'react';
import { MapPin, Navigation, Compass, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { CampusLocation, Item } from '../../types';

interface CampusMapViewProps {
  items: Item[];
  selectedLocation: 'all' | CampusLocation;
  onSelectLocation: (loc: 'all' | CampusLocation) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  items,
  selectedLocation,
  onSelectLocation,
}) => {
  const spots: { name: CampusLocation; coords: { x: number; y: number }; description: string; walkingTime: string }[] = [
    { name: 'Central Library', coords: { x: 38, y: 35 }, description: 'Ground floor main study lobby', walkingTime: '2 min walk' },
    { name: 'Department Block', coords: { x: 65, y: 25 }, description: 'First floor departmental wing', walkingTime: '1 min walk' },
    { name: 'Canteen', coords: { x: 50, y: 60 }, description: 'Central student cafeteria courtyard', walkingTime: '3 min walk' },
    { name: 'Hostel Reception', coords: { x: 22, y: 72 }, description: 'Aryabhatta block visitor lounge', walkingTime: '4 min walk' },
    { name: 'Main Gate', coords: { x: 80, y: 78 }, description: 'Campus security visitor desk', walkingTime: '6 min walk' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Interactive Campus Landmark Map
            </h3>
            <p className="text-[11px] text-slate-500">
              Click a designated public handover spot to browse available nearby gear
            </p>
          </div>
        </div>

        {selectedLocation !== 'all' && (
          <button
            onClick={() => onSelectLocation('all')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto"
          >
            Show All Locations
          </button>
        )}
      </div>

      {/* Illustrated Campus Grid Map Canvas */}
      <div className="relative w-full aspect-16/9 sm:aspect-21/9 rounded-2xl bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200/70 border border-slate-200 overflow-hidden shadow-inner">
        {/* Soft grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        {/* Campus Pathways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 38% 35% L 65% 25% L 50% 60% Z" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
          <path d="M 38% 35% L 22% 72% L 50% 60% L 80% 78%" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
        </svg>

        {/* Spot Pins */}
        {spots.map(s => {
          const count = items.filter(i => i.pickupLocation === s.name).length;
          const isSelected = selectedLocation === s.name;

          return (
            <div
              key={s.name}
              style={{ left: `${s.coords.x}%`, top: `${s.coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              <button
                type="button"
                onClick={() => onSelectLocation(isSelected ? 'all' : s.name)}
                className={`flex flex-col items-center transition-transform duration-200 hover:scale-110 active:scale-95 ${
                  isSelected ? 'scale-110' : ''
                }`}
              >
                <div
                  className={`p-2 sm:p-2.5 rounded-2xl shadow-soft-lg flex items-center gap-1.5 font-bold text-xs transition border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-300'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                  <span className="hidden sm:inline whitespace-nowrap">{s.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isSelected ? 'bg-white text-indigo-700' : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </button>

              {/* Pin Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:block bg-slate-900 text-white text-[11px] p-2 rounded-xl shadow-soft-xl pointer-events-none whitespace-nowrap z-30">
                <div className="font-bold">{s.name}</div>
                <div className="text-slate-300">{s.description} • {s.walkingTime}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spot quick pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
        {spots.map(s => {
          const count = items.filter(i => i.pickupLocation === s.name).length;
          const isSelected = selectedLocation === s.name;

          return (
            <button
              key={s.name}
              type="button"
              onClick={() => onSelectLocation(isSelected ? 'all' : s.name)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate font-semibold">{s.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white font-bold text-slate-600 shadow-2xs">
                  {count}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">{s.walkingTime}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
