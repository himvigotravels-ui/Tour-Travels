"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    departure: "",
    destination: "",
    travelDate: "",
    passengers: "2 People",
    duration: "",
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

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
        className="bg-white rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
      >
        <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-outfit font-extrabold text-slate-900 mb-4">Message Sent!</h3>
        <p className="text-slate-600 font-medium leading-relaxed mb-8">
          Thank you for reaching out. We have received your inquiry and will get back to you shortly.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-forest-700 transition-all"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative z-10">
      <h2 className="text-3xl font-outfit font-bold text-slate-900 mb-2">Send an Inquiry</h2>
      <p className="text-slate-500 font-inter mb-10 text-base md:text-lg">Drop us a line to customize a package or book a 4x4 cab.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
            <input 
              type="text" 
              placeholder="Jane Doe" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Departure From</label>
            <input 
              type="text" 
              placeholder="Starting City (e.g. Chandigarh)" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
              value={formData.departure}
              onChange={(e) => setFormData({...formData, departure: e.target.value})}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Destination To</label>
            <input 
              type="text" 
              placeholder="Where to go (e.g. Spiti Valley)" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Travel Date</label>
            <input 
              type="date" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
              value={formData.travelDate}
              onChange={(e) => setFormData({...formData, travelDate: e.target.value})}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Passengers</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
              value={formData.passengers}
              onChange={(e) => setFormData({...formData, passengers: e.target.value})}
            >
              <option>1 Person</option>
              <option>2 People</option>
              <option>3 - 5 People</option>
              <option>5 - 10 People</option>
              <option>Large Group (10+)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Duration</label>
            <input 
              type="text" 
              placeholder="e.g. 5 Days" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Your Message</label>
          <textarea 
            rows={4} 
            placeholder="Tell us more about your requirements..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all font-medium text-slate-900 placeholder:font-normal placeholder-slate-400 resize-none"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 w-full md:w-auto inline-flex items-center justify-center bg-forest-900 hover:bg-amber-500 text-white hover:text-slate-900 font-bold px-10 py-4 rounded-xl transition-all shadow-xl hover:shadow-amber-500/40 hover:-translate-y-1 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : (
            <>
              Send Inquiry <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
