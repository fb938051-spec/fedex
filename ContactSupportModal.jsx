import { useState } from "react";
import { X, Headphones, MessageSquare, Phone, Mail, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const faqs = [
  { q: "How do I track my shipment?", a: "Enter your tracking number in the tracking bar on the homepage. You can also use the FedEx mobile app for real-time updates." },
  { q: "What should I do if my package is delayed?", a: "Delays can happen due to weather or customs. Check your tracking status for updates. If the delay exceeds 2 business days, contact us with your tracking number." },
  { q: "Can I change the delivery address?", a: "Yes, you can redirect a package using FedEx Delivery Manager. Log in to your account or contact us before the package is out for delivery." },
  { q: "How do I file a claim for a damaged package?", a: "File a claim within 60 days of delivery at fedex.com/claims. You'll need your tracking number, photos of the damage, and the original receipt." },
  { q: "What items are prohibited for shipping?", a: "Prohibited items include hazardous materials, explosives, live animals (without special authorization), and currency. See our full list at fedex.com/prohibited." },
];

export default function ContactSupportModal({ onClose }) {
  const [tab, setTab] = useState("message");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", tracking: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: "support@fedex.com",
      from_name: form.name || "FedEx Customer",
      subject: `[Customer Support] ${form.subject}`,
      body: `From: ${form.name} (${form.email})\nTracking #: ${form.tracking || "N/A"}\n\n${form.message}`,
    });
    setSending(false);
    setSent(true);
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600";

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#4D148C" }}>
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold text-lg">Contact Support</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {[["message", "Send Message"], ["call", "Call Us"], ["faq", "FAQs"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 py-3 text-xs font-bold transition-colors ${tab === id ? "border-b-2 text-purple-700 border-purple-700" : "text-gray-500"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {tab === "message" && (
            sent ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
                <h3 className="font-black text-xl text-gray-900">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Our support team will respond within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "", tracking: "" }); }}
                  className="px-6 py-2.5 text-white font-bold rounded text-sm" style={{ backgroundColor: "#4D148C" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                    <input required name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tracking Number (optional)</label>
                  <input name="tracking" value={form.tracking} onChange={handleChange} className={inputCls} placeholder="e.g. ABCD11223340" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required className={inputCls}>
                    <option value="">Select a topic...</option>
                    {["Shipment Tracking Issue", "Damaged Package", "Delivery Problem", "Billing & Invoice", "Change Delivery Address", "File a Claim", "General Inquiry"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                  <textarea required name="message" value={form.message} onChange={handleChange} rows={5} className={`${inputCls} resize-none`}
                    placeholder="Describe your issue in detail..." />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3 text-white font-bold rounded text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ backgroundColor: "#FF6600" }}>
                  <Mail className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )
          )}

          {tab === "call" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Our customer support team is ready to help you. Choose the best way to reach us:</p>
              {[
                { label: "Customer Support (US)", number: "1-800-463-3339", hours: "Mon–Fri: 7AM–9PM | Sat–Sun: 9AM–6PM EST", desc: "For tracking, shipping, and general inquiries" },
                { label: "Technical Support", number: "1-877-339-2774", hours: "Mon–Fri: 8AM–8PM EST", desc: "For FedEx.com and technology issues" },
                { label: "International Shipping", number: "1-800-247-4747", hours: "Mon–Fri: 8AM–6PM EST", desc: "For international shipment assistance" },
                { label: "Freight Services", number: "1-866-393-4585", hours: "Mon–Fri: 7AM–9PM EST", desc: "For LTL and freight shipments" },
              ].map(item => (
                <div key={item.label} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F0E8FA" }}>
                      <Phone className="w-4 h-4" style={{ color: "#4D148C" }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                      <a href={`tel:${item.number.replace(/[^0-9]/g, "")}`} className="text-lg font-black" style={{ color: "#FF6600" }}>{item.number}</a>
                      <p className="text-xs text-gray-500 mt-1">{item.hours}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <MessageSquare className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-800">Live Chat Available</p>
                <p className="text-xs text-blue-600 mt-1">Chat with an agent on fedex.com/chat during business hours</p>
              </div>
            </div>
          )}

          {tab === "faq" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">Common questions and answers to help you quickly.</p>
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-semibold text-gray-800 pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 bg-gray-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-4">
                <p className="text-xs text-gray-500 text-center">Can't find your answer? <button onClick={() => setTab("message")} className="font-bold underline" style={{ color: "#4D148C" }}>Send us a message</button></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}