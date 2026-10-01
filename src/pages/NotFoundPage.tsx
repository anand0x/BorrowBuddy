import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft-lg space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <span className="text-4xl font-black text-indigo-600">404</span>
        <h1 className="text-xl font-extrabold text-slate-800">Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The page or item you are looking for may have been moved, returned, or does not exist on this campus node.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Items</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
