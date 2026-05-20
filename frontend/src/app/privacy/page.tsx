import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Himvigo Tours",
  description: "Learn how Himvigo protects your personal data and privacy.",
};

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-brand-blue pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300 font-inter">Last updated: April 2026</p>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 prose prose-slate prose-lg max-w-none prose-headings:font-outfit prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-blue hover:prose-a:text-slate-800">
          <h2>1. Introduction</h2>
          <p>At Himvigo Tours, your privacy is a top priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website or book our Himalayan tour packages.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect information you provide directly to us when filling out our booking forms, requesting custom itineraries, or contacting our support lines. This typically includes:</p>
          <ul>
            <li>Personal details (Name, Age)</li>
            <li>Contact information (Email, Phone number)</li>
            <li>Travel preferences and booking dates</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>The information we collect is strictly used to:</p>
          <ul>
            <li>Process your bookings and customize itineraries.</li>
            <li>Communicate with you regarding your trip details.</li>
            <li>Improve our services and digital offerings.</li>
          </ul>
          <p>We do not sell, trade, or rent your personal identification information to others.</p>

          <h2>4. Data Security</h2>
          <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.</p>

          <h2>5. Contacting Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            <strong>Phone:</strong> <a href="tel:+919805514018">+91 98055 14018</a><br />
            <strong>Email:</strong> himvigotours@gmail.com
          </p>
        </div>
      </section>
    </main>
  );
}
