"use client";

import { useState } from "react";
import { Send, CheckCircle2, CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormErrors {
  name?: string;
  phone?: string;
  departure?: string;
  destination?: string;
  travelDate?: string;
  duration?: string;
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    departure: "",
    destination: "",
    travelDate: undefined as Date | undefined,
    passengers: "2 People",
    duration: "",
    message: ""
  });

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    
    if (!formData.departure.trim()) newErrors.departure = "Departure city is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.travelDate) newErrors.travelDate = "Please select a travel date";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          travelDate: formData.travelDate ? format(formData.travelDate, "yyyy-MM-dd") : ""
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
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
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-outfit font-extrabold text-slate-900 mb-4">Message Sent!</h3>
        <p className="text-slate-600 font-medium leading-relaxed mb-8 max-w-md mx-auto">
          Thank you for reaching out. We have received your inquiry and our travel experts will get back to you within 2 hours.
        </p>
        <Button 
          onClick={() => {
            setSuccess(false);
            setFormData({
              name: "",
              phone: "",
              departure: "",
              destination: "",
              travelDate: undefined,
              passengers: "2 People",
              duration: "",
              message: ""
            });
          }}
          className="px-10 py-6 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="relative z-10">
      <h2 className="text-3xl font-outfit font-bold text-slate-900 mb-2">Send an Inquiry</h2>
      <p className="text-slate-500 font-inter mb-10 text-base md:text-lg">Drop us a line to customize a package or book a 4x4 cab.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100 overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
            <input 
              type="text" 
              placeholder="Jane Doe" 
              className={cn(
                "w-full bg-slate-50 border rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400",
                errors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-brand-blue"
              )}
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) setErrors({...errors, name: undefined});
              }}
            />
            {errors.name && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.name}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 XXXXX XXXXX" 
              className={cn(
                "w-full bg-slate-50 border rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400",
                errors.phone ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-brand-blue"
              )}
              value={formData.phone}
              onChange={(e) => {
                setFormData({...formData, phone: e.target.value});
                if (errors.phone) setErrors({...errors, phone: undefined});
              }}
            />
            {errors.phone && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.phone}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Departure From</label>
            <input 
              type="text" 
              placeholder="Starting City (e.g. Chandigarh)" 
              className={cn(
                "w-full bg-slate-50 border rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400",
                errors.departure ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-brand-blue"
              )}
              value={formData.departure}
              onChange={(e) => {
                setFormData({...formData, departure: e.target.value});
                if (errors.departure) setErrors({...errors, departure: undefined});
              }}
            />
            {errors.departure && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.departure}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Destination To</label>
            <input 
              type="text" 
              placeholder="Where to go (e.g. Spiti Valley)" 
              className={cn(
                "w-full bg-slate-50 border rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400",
                errors.destination ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-brand-blue"
              )}
              value={formData.destination}
              onChange={(e) => {
                setFormData({...formData, destination: e.target.value});
                if (errors.destination) setErrors({...errors, destination: undefined});
              }}
            />
            {errors.destination && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.destination}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Travel Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between bg-slate-50 border rounded-2xl px-5 py-4 transition-all font-medium text-left",
                    !formData.travelDate && "text-slate-400",
                    errors.travelDate ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-brand-blue"
                  )}
                >
                  {formData.travelDate ? format(formData.travelDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="h-4 w-4 text-slate-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-none" align="start">
                <Calendar
                  mode="single"
                  selected={formData.travelDate}
                  onSelect={(date) => {
                    setFormData({ ...formData, travelDate: date });
                    if (errors.travelDate) setErrors({...errors, travelDate: undefined});
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.travelDate && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.travelDate}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Passengers</label>
            <Select 
              value={formData.passengers} 
              onValueChange={(val) => setFormData({...formData, passengers: val})}
            >
              <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-2xl px-5 py-7 font-medium text-slate-900 h-auto">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl">
                <SelectItem value="1 Person">1 Person</SelectItem>
                <SelectItem value="2 People">2 People</SelectItem>
                <SelectItem value="3 - 5 People">3 - 5 People</SelectItem>
                <SelectItem value="5 - 10 People">5 - 10 People</SelectItem>
                <SelectItem value="Large Group (10+)">Large Group (10+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Duration</label>
            <input 
              type="text" 
              placeholder="e.g. 5 Days" 
              className={cn(
                "w-full bg-slate-50 border rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400",
                errors.duration ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-brand-blue"
              )}
              value={formData.duration}
              onChange={(e) => {
                setFormData({...formData, duration: e.target.value});
                if (errors.duration) setErrors({...errors, duration: undefined});
              }}
            />
            {errors.duration && <span className="text-[11px] font-bold text-red-500 ml-1">{errors.duration}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Your Message</label>
          <textarea 
            rows={4} 
            placeholder="Tell us more about your requirements (optional)..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all font-medium text-slate-900 placeholder:font-normal placeholder-slate-400 resize-none"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 w-full md:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-brand-orange text-white hover:text-slate-900 font-bold px-12 py-5 rounded-2xl transition-all shadow-xl hover:shadow-brand-orange/40 hover:-translate-y-1 group disabled:opacity-70 disabled:cursor-not-allowed font-outfit text-lg"
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

