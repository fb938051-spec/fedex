import { useState } from "react";
import { X, Package, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

function generateTrackingCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function ShipNowModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    sender_name: "", sender_contact: "", sender_email: "", sender_address: "",
    receiver_name: "", receiver_contact: "", receiver_email: "", receiver_address: "",
    service_type: "FedEx Ground", service_content: "", weight: "", quantity: "1",
    shipment_mode: "Ground", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const tracking_code = generateTrackingCode();
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + (form.service_type.includes("Overnight") ? 1 : form.service_type.includes("2Day") ? 2 : form.service_type.includes("Ground") ? 5 : 3));

    await base44.entities.Shipment.create({
      ...form,
      tracking_code,
      status: "In Transit",
      shipping_date: today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      expected_delivery: delivery.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      approved: true,
    });
    setResult(tracking_code);
    setSubmitting(false);
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600";

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#4D148C" }}>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold text-lg">Ship Now</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>

        {!result ? (
          <>
            {/* Step tabs */}
            <div className="flex border-b border-gray-200 flex-shrink-0">
              {[1, 2, 3].map(s => (
                <button key={s} onClick={() => s < step && setStep(s)}
                  className={`flex-1 py-3 text-xs font-bold transition-colors ${step === s ? "border-b-2 text-purple-700 border-purple-700" : step > s ? "text-green-600" : "text-gray-400"}`}>
                  {s === 1 ? "① Sender" : s === 2 ? "② Receiver" : "③ Package"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-5">
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-3">Sender Information</p>
                  {[["sender_name","Full Name"],["sender_contact","Phone Number"],["sender_email","Email"],["sender_address","Full Address"]].map(([n,l]) => (
                    <div key={n}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label>
                      <input required name={n} value={form[n]} onChange={handleChange} className={inputCls} placeholder={l} />
                    </div>
                  ))}
                  <button type="button" onClick={() => setStep(2)}
                    className="w-full py-3 text-white font-bold rounded text-sm mt-2" style={{ backgroundColor: "#FF6600" }}>
                    Next: Receiver Details →
                  </button>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-3">Receiver Information</p>
                  {[["receiver_name","Full Name"],["receiver_contact","Phone Number"],["receiver_email","Email"],["receiver_address","Full Address"]].map(([n,l]) => (
                    <div key={n}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{l}</label>
                      <input required name={n} value={form[n]} onChange={handleChange} className={inputCls} placeholder={l} />
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 font-bold rounded text-sm text-gray-600">← Back</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#FF6600" }}>Next: Package →</button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-700 mb-3">Package Details</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Service Type</label>
                    <select name="service_type" value={form.service_type} onChange={handleChange} className={inputCls}>
                      {["FedEx Ground","FedEx Express Saver","FedEx 2Day","FedEx Standard Overnight","FedEx Priority Overnight","FedEx First Overnight","FedEx International Priority","FedEx International Economy"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Content Description</label>
                      <input required name="service_content" value={form.service_content} onChange={handleChange} className={inputCls} placeholder="e.g. Electronics" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Weight (kg)</label>
                      <input required name="weight" value={form.weight} onChange={handleChange} type="number" step="0.1" min="0.1" className={inputCls} placeholder="kg" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
                      <input required name="quantity" value={form.quantity} onChange={handleChange} type="number" min="1" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Shipment Mode</label>
                      <select name="shipment_mode" value={form.shipment_mode} onChange={handleChange} className={inputCls}>
                        {["Ground","Air Freight","Sea Freight","Ship Freight"].map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Special Instructions (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none" placeholder="Fragile, keep upright, etc." />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 font-bold rounded text-sm text-gray-600">← Back</button>
                    <button type="submit" disabled={submitting} className="flex-1 py-3 text-white font-bold rounded text-sm disabled:opacity-60" style={{ backgroundColor: "#4D148C" }}>
                      {submitting ? "Creating..." : "Create Shipment"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="px-5 py-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="font-black text-xl text-gray-900">Shipment Created!</h3>
            <p className="text-gray-500 text-sm">Your shipment has been successfully registered.</p>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
              <p className="font-black text-2xl tracking-widest" style={{ color: "#4D148C" }}>{result}</p>
            </div>
            <p className="text-xs text-gray-400">Save this tracking number to track your shipment's progress.</p>
            <button onClick={onClose} className="w-full py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#FF6600" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}