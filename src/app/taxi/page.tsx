import { Car, ShieldCheck, MapPin, Clock, Star, Phone, CheckCircle2, Navigation } from "lucide-react";
import { BottomCTA } from "@/components/ui/BottomCTA";
import Link from "next/link";

export const metadata = {
  title: "Premium Taxi Services Himachal | Chandigarh to Manali, Shimla, Spiti",
  description: "Book reliable, safe, and premium taxi services across Himachal Pradesh. Specializing in long-distance mountain travel with expert local drivers.",
};

const vehicles = [
  {
    name: "Premium SUV",
    model: "Toyota Innova Crysta",
    capacity: "6-7 Pasengers",
    ideal: "Family trips, Long expeditions",
    features: ["Dual AC", "Premium Seating", "Ample Luggage space", "Expert Mountain Driver"],
    img: "/taxi-hero.png"
  },
  {
    name: "Luxury Sedan",
    model: "Maruti Suzuki Dzire / Toyota Etios",
    capacity: "4 Passengers",
    ideal: "Couples, Small groups",
    features: ["AC", "Bluetooth Music", "Clean Interiors", "On-time Pickup"],
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Force Traveler",
    model: "12 / 17 Seater",
    capacity: "Up to 17 Passengers",
    ideal: "Corporate groups, Large families",
    features: ["High Roof", "Reclining Seats", "Music System", "Dedicated Support"],
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
  }
];

const routes = [
  { from: "Chandigarh", to: "Manali", price: "Starts from ₹4,500", time: "8-9 Hours" },
  { from: "Chandigarh", to: "Shimla", price: "Starts from ₹3,000", time: "3-4 Hours" },
  { from: "Manali", to: "Spiti Valley", price: "Inquire for Quote", time: "Expedition" },
  { from: "Delhi", to: "Manali", price: "Starts from ₹11,000", time: "12-14 Hours" },
];

export default function TaxiPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-forest-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/taxi-hero.png" 
            alt="Premium Taxi Service Himachal" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-white"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Car className="w-4 h-4 text-amber-400" /> Reliable Mountain Travel
          </div>
          <h1 className="text-4xl md:text-7xl font-outfit font-extrabold text-white mb-6 drop-shadow-xl">
            Premium <span className="text-amber-400">Taxi</span> Services
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium">
            Professional mountain drivers, government-verified fleet, and transparent pricing for your Himalayan journey.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 flex items-center justify-center text-forest-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Verified Drivers</h3>
                <p className="text-xs text-slate-500">Police verified & licensed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">24/7 Availability</h3>
                <p className="text-xs text-slate-500">Always on standby for you</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Real-time GPS</h3>
                <p className="text-xs text-slate-500">Track your journey always</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Fixed Pricing</h3>
                <p className="text-xs text-slate-500">No hidden surge costs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900">Our Premium Fleet</h2>
            <div className="h-1.5 w-24 bg-forest-600 mt-6 rounded-full mx-auto" />
            <p className="text-slate-500 mt-6 text-lg max-w-2xl mx-auto font-inter">Choose from our maintained vehicles specifically selected for mountain terrain safety and comfort.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((v, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="h-64 overflow-hidden relative">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-forest-700 shadow-sm">
                    {v.capacity}
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{v.model}</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">{v.name}</h3>
                  <ul className="space-y-3 mb-8">
                    {v.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-forest-600 mr-2 shrink-0" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="block text-center py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-forest-600 transition-colors">
                    Inquire Price
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 leading-tight">Popular Transfer Routes</h2>
              <div className="h-1.5 w-24 bg-amber-500 mt-6 rounded-full" />
              <p className="text-slate-600 mt-8 text-lg font-inter leading-relaxed">
                We provide point-to-point transfers from major airports and railway stations. Pricing includes fuel, driver allowance, and basic tolls.
              </p>
              
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-4 p-6 rounded-3xl bg-forest-50 border border-forest-100">
                  <Phone className="w-8 h-8 text-forest-600" />
                  <div>
                    <h4 className="font-bold text-slate-900">Direct Booking Hub</h4>
                    <p className="text-sm text-slate-600">Call us for spot availability: <span className="font-bold">+91 98765 43210</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner">
              <div className="space-y-4">
                {routes.map((route, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-forest-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-forest-600" />
                        <div className="w-0.5 h-6 bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Route</div>
                        <div className="font-bold text-slate-900">{route.from} to {route.to}</div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                      <div className="text-forest-700 font-extrabold">{route.price}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {route.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-6 font-medium italic">
                * Prices are indicative and may vary based on vehicle selection and season.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BottomCTA />
    </main>
  );
}
