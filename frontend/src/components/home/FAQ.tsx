"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiAddLine, RiSubtractLine, RiWhatsappLine } from "react-icons/ri";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is the best time to visit Himachal Pradesh?",
    answer: "The best time depends on your preference. For lush greenery and pleasant weather, March to June is ideal. For snow lovers, December to February is best. If you're visiting Spiti Valley, June to September is the most accessible window.",
  },
  {
    question: "Do I need any special permits for Spiti Valley or Rohtang Pass?",
    answer: "Yes, Rohtang Pass requires a daily permit which we can help arrange. For Spiti Valley, foreign nationals need an Inner Line Permit (ILP), while Indian nationals do not. We handle all permit documentation for our guests.",
  },
  {
    question: "Are your tour packages customizable?",
    answer: "Absolutely! Every itinerary on our website is a starting point. We specialize in 100% customized trips tailored to your budget, interests, and duration. Just talk to our travel experts.",
  },
  {
    question: "What kind of vehicles do you use for mountain travel?",
    answer: "We maintain a fleet of modern, well-serviced vehicles including Toyota Innova, Tempo Travellers (9-26 seats), and 4x4 SUVs for rugged terrains like Spiti. All our drivers are experienced in high-altitude mountain driving.",
  },
  {
    question: "Is it safe to travel to Himachal during the monsoon season?",
    answer: "While Himachal is beautiful in the rain, heavy monsoons (July-August) can sometimes lead to road closures. We monitor weather patterns daily and always prioritize guest safety, suggesting alternative routes or dates if necessary.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Header Area */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-blue">
                Help Center
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-brand-blue mb-6 leading-tight">
              Himachal Trip — <br />
              <span className="text-brand-orange">Frequently Asked Questions</span>
            </h2>
            <p className="text-slate-500 text-lg font-inter mb-10 max-w-md leading-relaxed">
              Everything you want to know before planning your Himachal Trip. Can&apos;t find your answer? Just WhatsApp us.
            </p>
            
            <a
              href="https://wa.me/917018318824"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 font-outfit text-lg shadow-lg shadow-green-200 hover:-translate-y-1"
            >
              <RiWhatsappLine className="w-6 h-6" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Accordion Area */}
          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`group rounded-3xl transition-all duration-500 border ${
                    isOpen ? 'bg-slate-50 border-brand-orange/30 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                  >
                    <span className={`text-lg md:text-xl font-bold font-outfit transition-colors duration-300 ${
                      isOpen ? 'text-brand-orange' : 'text-slate-900 group-hover:text-brand-blue'
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                      isOpen ? 'bg-brand-orange text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'
                    }`}>
                      {isOpen ? <RiSubtractLine /> : <RiAddLine />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-8">
                          <p className="text-slate-600 font-inter leading-relaxed text-base md:text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
