"use client";

import { RiWhatsappLine } from "react-icons/ri";

export const WhatsAppWidget = ({ phoneNumber }: { phoneNumber?: string }) => {
  const whatsappNumber = (phoneNumber || "919805514018").replace(/[^0-9]/g, '');
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 pointer-events-none group-hover:hidden"></div>
      <RiWhatsappLine className="w-8 h-8 md:w-10 md:h-10" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100 hidden md:block">
        Need help? Chat with us!
      </div>
    </a>
  );
};
