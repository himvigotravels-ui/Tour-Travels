"use client";

import { useState, useEffect } from "react";
import { Filter, Search, MapPin, Clock, X } from "lucide-react";

export const PackageFilters = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener('open-mobile-filters', handleToggle);
    return () => window.removeEventListener('open-mobile-filters', handleToggle);
  }, []);

  return (
    <div className="w-full lg:w-1/4">
      {/* Background Overlay (Mobile) */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className={`fixed bottom-0 left-0 right-0 z-50 lg:static lg:z-auto h-[85vh] lg:h-auto w-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
        <div className="bg-white p-6 xl:p-8 rounded-t-3xl lg:rounded-3xl border border-slate-200 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)] lg:shadow-sm lg:shadow-slate-200/50 lg:sticky lg:top-28 h-full overflow-y-auto flex flex-col">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-shrink-0">
            <h2 className="font-outfit font-bold text-xl text-slate-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-forest-600" /> Filters
            </h2>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-forest-600 hover:text-forest-700 cursor-pointer transition-colors">Clear All</span>
              {/* Mobile Close Button */}
              <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {/* Search */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-900 mb-3">Search Packages</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Spiti Valley" 
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Destination Filter */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-slate-500" /> Destinations
              </label>
              <div className="space-y-4 lg:space-y-3">
                {['Spiti Valley', 'Manali', 'Lahaul', 'Kasol', 'Kinnaur'].map(dest => (
                  <label key={dest} className="flex items-center group cursor-pointer w-full">
                    <input type="checkbox" className="w-5 h-5 lg:w-4 lg:h-4 rounded border-slate-300 text-forest-600 focus:ring-forest-600" />
                    <span className="ml-3 text-base lg:text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex-1">{dest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-500" /> Duration
              </label>
              <div className="space-y-4 lg:space-y-3">
                {['1-3 Days', '4-6 Days', '7+ Days'].map(dur => (
                  <label key={dur} className="flex items-center group cursor-pointer w-full">
                    <input type="radio" name="duration" className="w-5 h-5 lg:w-4 lg:h-4 text-forest-600 border-slate-300 focus:ring-forest-600" />
                    <span className="ml-3 text-base lg:text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex-1">{dur}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex-shrink-0 mt-auto">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-colors shadow-md lg:shadow-none"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
