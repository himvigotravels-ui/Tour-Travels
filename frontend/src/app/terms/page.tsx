import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Himvigo Tours",
  description: "Terms and conditions for booking tours and cabs with Himvigo.",
};

export default function TermsConditions() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-brand-blue pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-300 font-inter">Last updated: April 2026</p>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 prose prose-slate prose-lg max-w-none prose-headings:font-outfit prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-blue hover:prose-a:text-slate-800">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing our website and utilizing our booking services, you accept and agree to be bound by the terms and provisions of this agreement.</p>

          <h2>2. Booking & Payment</h2>
          <p>To secure a tour booking, an initial advance payment is required as specified by our travel coordinators. The remaining balance must be cleared prior to or on the commencement of the tour.</p>
          <ul>
            <li>Pricing is subject to change based on hotel/transport availability until the advance is paid.</li>
            <li>All quotes provided are highly subjective to seasonal conditions in the Himalayas.</li>
          </ul>

          <h2>3. Itinerary Alterations</h2>
          <p>Himvigo reserves the right to alter or modify itineraries in case of unforeseen circumstances such as natural disasters, road blockages, heavy snowfall, or political unrest. In such cases, we will strive to provide the best possible alternative without compromising the quality of your trip.</p>

          <h2>4. Travel Insurance</h2>
          <p>We strongly recommend securing comprehensive travel insurance before your journey. Himvigo is not liable for costs arising from unforeseen medical emergencies or travel disruptions.</p>

          <h2>5. Contact Information</h2>
          <p>Direct all inquiries related to these terms to our administrative desk:</p>
          <p>
            <strong>Phone:</strong> <a href="tel:+919805514018">+91 98055 14018</a><br />
            <strong>Email:</strong> himvigotours@gmail.com
          </p>
        </div>
      </section>
    </main>
  );
}
