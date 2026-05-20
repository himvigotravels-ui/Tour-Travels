"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Clock, Compass, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export const SearchFilter = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("packages");
  const [destination, setDestination] = useState("");
  
  // Custom dropdown states
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [duration, setDuration] = useState("");
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [category, setCategory] = useState("");

  const durationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) setIsDurationOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) setIsCategoryOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (activeTab === "cab") {
      router.push("/cab");
      return;
    }
    
    if (activeTab === "custom") {
      router.push("/contact");
      return;
    }

    const params = new URLSearchParams();
    if (destination) params.append("dest", destination);
    if (duration) params.append("dur", duration);
    if (category) params.append("cat", category);
    
    router.push(`/packages?${params.toString()}`);
  };

  const durations = [
    { label: "Any duration", value: "" },
    { label: "3 to 5 Days", value: "3-5" },
    { label: "6 to 8 Days", value: "6-8" },
    { label: "Over 9 Days", value: "9+" },
  ];

  const categories = [
    { label: "All Categories", value: "" },
    { label: "Family Trip", value: "family" },
    { label: "Adventure", value: "adventure" },
    { label: "Honeymoon", value: "honeymoon" },
    { label: "Spiritual", value: "spiritual" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto drop-shadow-2xl">
      {/* Tabs */}
      <div className="flex items-center gap-1 md:gap-2 ml-4 w-full overflow-x-auto pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button 
          onClick={() => setActiveTab("packages")}
          className={`${activeTab === "packages" ? "bg-white text-brand-blue font-extrabold shadow-sm" : "bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 border-b-0 text-slate-500 font-bold"} px-6 py-3 rounded-t-xl text-xs md:text-sm tracking-wide transition-all whitespace-nowrap shrink-0`}
        >
          Tour Packages
        </button>
        <button 
          onClick={() => setActiveTab("cab")}
          className={`${activeTab === "cab" ? "bg-white text-brand-blue font-extrabold shadow-sm" : "bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 border-b-0 text-slate-500 font-bold"} px-6 py-3 rounded-t-xl text-xs md:text-sm tracking-wide transition-all whitespace-nowrap shrink-0`}
        >
          Cab Services
        </button>
        <button 
          onClick={() => setActiveTab("custom")}
          className={`${activeTab === "custom" ? "bg-white text-brand-blue font-extrabold shadow-sm" : "bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 border-b-0 text-slate-500 font-bold"} px-6 py-3 rounded-t-xl text-xs md:text-sm tracking-wide transition-all whitespace-nowrap shrink-0`}
        >
          Custom Trips
        </button>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-3xl p-2 md:p-4 shadow-2xl flex flex-col lg:flex-row items-center gap-1 md:gap-2 w-full relative z-20 divide-y lg:divide-y-0 divide-slate-100">
        
        {/* Destination Input */}
        <div className="flex-1 w-full hover:bg-slate-50 rounded-2xl px-4 py-2.5 md:px-5 md:py-3 lg:border-r lg:border-slate-100 transition-colors cursor-text group relative">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 group-hover:text-brand-blue transition-colors flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-slate-400 group-hover:text-brand-blue transition-colors"/> Destination
          </label>
          <div className="flex items-center">
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?" 
              className="bg-transparent border-none outline-none w-full text-slate-900 font-bold text-base md:text-lg placeholder-slate-400 truncate"
            />
          </div>
        </div>

        <div className="w-full lg:w-px h-px lg:h-12 bg-slate-200 hidden lg:block"></div>

        {/* Custom Duration Dropdown */}
        <div 
          ref={durationRef}
          onClick={() => setIsDurationOpen(!isDurationOpen)}
          className="flex-1 w-full hover:bg-slate-50 rounded-2xl px-4 py-2.5 md:px-5 md:py-3 lg:border-r lg:border-slate-100 transition-colors cursor-pointer group relative"
        >
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 group-hover:text-brand-blue transition-colors flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-slate-400 group-hover:text-brand-blue transition-colors"/> Duration
          </label>
          <div className="flex items-center justify-between">
            <span className={`font-bold text-base md:text-lg truncate ${duration ? "text-slate-900" : "text-slate-400"}`}>
              {duration ? durations.find(d => d.value === duration)?.label : "Any duration"}
            </span>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isDurationOpen ? "rotate-180 text-brand-blue" : ""}`} />
          </div>
          
          {/* Dropdown Menu */}
          {isDurationOpen && (
            <div className="absolute top-[110%] left-0 w-full min-w-[200px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="py-2">
                {durations.map((item) => (
                  <div 
                    key={item.value}
                    onClick={() => setDuration(item.value)}
                    className={`px-5 py-3 hover:bg-slate-50 cursor-pointer font-bold transition-colors ${duration === item.value ? 'text-brand-blue bg-slate-50' : 'text-slate-600'}`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-px h-px lg:h-12 bg-slate-200 hidden lg:block"></div>

        {/* Custom Category Dropdown */}
        <div 
          ref={categoryRef}
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex-1 w-full hover:bg-slate-50 rounded-2xl px-4 py-2.5 md:px-5 md:py-3 transition-colors cursor-pointer group relative"
        >
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 group-hover:text-brand-blue transition-colors flex items-center">
            <Compass className="w-4 h-4 mr-1.5 text-slate-400 group-hover:text-brand-blue transition-colors"/> Category
          </label>
          <div className="flex items-center justify-between">
            <span className={`font-bold text-base md:text-lg truncate ${category ? "text-slate-900" : "text-slate-400"}`}>
              {category ? categories.find(c => c.value === category)?.label : "All Categories"}
            </span>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isCategoryOpen ? "rotate-180 text-brand-blue" : ""}`} />
          </div>

          {/* Dropdown Menu */}
          {isCategoryOpen && (
            <div className="absolute top-[110%] left-0 w-full min-w-[200px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="py-2">
                {categories.map((item) => (
                  <div 
                    key={item.value}
                    onClick={() => setCategory(item.value)}
                    className={`px-5 py-3 hover:bg-slate-50 cursor-pointer font-bold transition-colors ${category === item.value ? 'text-brand-orange bg-slate-50' : 'text-slate-700'}`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="w-full lg:w-auto mt-1 lg:mt-0 bg-brand-orange hover:bg-brand-orange/90 text-white font-extrabold px-8 py-4 md:py-6 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-brand-orange/40 hover:-translate-y-1"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6 lg:mr-2" />
          <span className="lg:hidden text-base md:text-lg ml-2">Search Packages</span>
        </button>
      </div>
    </div>
  );
};
