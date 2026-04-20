"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ShieldCheck, Mail, User, Phone, MapPin, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

interface BookingFormProps {
  price?: number;
}

export function BookingForm({ price }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    adults: "2",
    children: "0",
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    dropDate: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit inquiry");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sticky top-24 bg-white p-10 rounded-[2.5rem] shadow-xl border border-forest-100 text-center flex flex-col items-center justify-center min-h-[500px]"
      >
        <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-outfit font-extrabold text-slate-900 mb-4">Inquiry Received!</h3>
        <p className="text-slate-600 font-medium leading-relaxed mb-8">
          Thank you for reaching out. Our Himalayan travel expert will contact you within the next 24 hours to craft your perfect itinerary.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-forest-700 transition-all"
        >
          Send Another Inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="sticky top-24 bg-white p-6 lg:p-7 rounded-3xl shadow-xl border border-slate-200 shadow-slate-200/50 flex flex-col"
    >
      {price ? (
        <div className="flex justify-between items-start mb-5 pb-5 border-b border-slate-100">
          <div>
            <span className="text-slate-500 font-medium text-xs block mb-1">Starting from</span>
            <span className="text-3xl font-outfit font-extrabold text-slate-900">₹{price.toLocaleString()}</span>
            <span className="text-slate-500 font-inter text-xs block mt-1">per person (approx)</span>
          </div>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Limited Offer
          </div>
        </div>
      ) : (
        <div className="mb-5 pb-5 border-b border-slate-100 text-center">
          <h3 className="text-2xl font-outfit font-extrabold text-slate-900">Book Your Trip</h3>
          <p className="text-slate-500 text-xs mt-1">Get a free customized itinerary</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>}
        
        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="John Doe" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
        </div>

        <div>
           <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email</label>
           <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="email" placeholder="john@example.com" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
           </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone Number</label>
          <div className="relative">
             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="tel" placeholder="+91 70183 18824" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Adults</label>
            <input type="number" min="1" placeholder="2" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" value={formData.adults} onChange={(e) => setFormData({...formData, adults: e.target.value})} required />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Kids</label>
            <input type="number" min="0" placeholder="0" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" value={formData.children} onChange={(e) => setFormData({...formData, children: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Pickup Location</label>
          <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="e.g. Delhi / Chandigarh" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" value={formData.pickupLocation} onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})} required />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Drop Location</label>
          <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="e.g. Manali / Shimla" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm" value={formData.dropLocation} onChange={(e) => setFormData({...formData, dropLocation: e.target.value})} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 truncate">Pickup Date</label>
            <div className="relative">
              <input type="date" className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-[11px] sm:text-xs" value={formData.pickupDate} onChange={(e) => setFormData({...formData, pickupDate: e.target.value})} required />
              <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 truncate">Drop Date</label>
            <div className="relative">
              <input type="date" className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-[11px] sm:text-xs" value={formData.dropDate} onChange={(e) => setFormData({...formData, dropDate: e.target.value})} required />
              <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Message</label>
          <textarea rows={3} placeholder="Tell us about your trip requirements..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all text-slate-700 text-sm resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 mt-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : (
            <>
              Request Free Quote <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs">
        <ShieldCheck className="w-4 h-4 text-forest-600" />
        Your information is secure and private
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-slate-500 text-xs text-center">Need help? Call us at </span>
        <a href="tel:+917018318824" className="text-forest-700 text-xs font-bold hover:underline">+91 70183 18824</a>
      </div>
    </motion.div>
  );
}
