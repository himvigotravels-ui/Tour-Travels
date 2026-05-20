import Link from "next/link";

export const metadata = {
  title: "Cancellation Policy | Himvigo Tours",
  description: "Learn about our tour and booking cancellation procedures.",
};

export default function CancellationPolicy() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-brand-blue pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-white mb-4">Cancellation Policy</h1>
          <p className="text-slate-300 font-inter">Last updated: April 2026</p>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 prose prose-slate prose-lg max-w-none prose-headings:font-outfit prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-blue hover:prose-a:text-slate-800">
          <h2>Standard Cancellation Outline</h2>
          <p>We understand that travel plans can change. Below is our standard cancellation and refund procedure for tours booked directly through Himvigo.</p>

          <h3>Cancellation Charges</h3>
          <ul>
            <li><strong>30 days or more before departure:</strong> 25% of total package cost will be deducted.</li>
            <li><strong>15 to 30 days before departure:</strong> 50% of total package cost will be deducted.</li>
            <li><strong>7 to 15 days before departure:</strong> 75% of total package cost will be deducted.</li>
            <li><strong>Less than 7 days / No-show:</strong> 100% of the package cost (No Refund).</li>
          </ul>

          <h2>Unforeseen Circumstances (Force Majeure)</h2>
          <p>In cases of road blocks, severe weather, landslides, or government-mandated travel restrictions, Himvigo will not process monetary refunds for halted trips. However, we will assist you with rescheduling or providing credit notes for future travel dates where applicable by third-party hotel partners.</p>

          <h2>Processing Refunds</h2>
          <p>Eligible refunds will be processed via the original method of payment within 7 to 14 business days from the receipt of an official cancellation request.</p>
          
          <h2>How to Request a Cancellation</h2>
          <p>To cancel or modify your booking, immediately notify your designated travel coordinator on our official line:</p>
          <p>
            <strong>Phone:</strong> <a href="tel:+919805514018">+91 98055 14018</a><br />
            <strong>Email:</strong> himvigotours@gmail.com
          </p>
        </div>
      </section>
    </main>
  );
}
