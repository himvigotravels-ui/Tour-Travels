"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration-asc", label: "Duration: Shortest First" }
];

export const SortDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get("sort") || "recommended";
  const selectedOption = sortOptions.find(o => o.value === currentSort) || sortOptions[0];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: typeof sortOptions[0]) => {
    setIsOpen(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", option.value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => window.dispatchEvent(new Event('open-mobile-filters'))}
        className="lg:hidden shrink-0 flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl w-[42px] h-[42px] shadow-sm outline-none focus:ring-2 focus:ring-forest-500/20"
        aria-label="Open Filters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>

      <div className="relative w-full sm:w-[220px]" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-slate-200 hover:border-slate-300 transition-colors text-sm rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm outline-none focus:ring-2 focus:ring-forest-500/20"
        >
          <span className="font-medium text-slate-700 truncate mr-2">{selectedOption.label}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-forest-600" : ""}`} />
        </button>

        {/* Animated Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 lg:-left-auto lg:right-0 w-full sm:w-[220px] bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-slate-50 ${selectedOption.value === option.value ? 'bg-forest-50/50 text-forest-700 font-bold' : 'text-slate-600 font-medium'}`}
                >
                  {option.label}
                  {selectedOption.value === option.value && <Check className="w-4 h-4 text-forest-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
