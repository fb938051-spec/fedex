import { useState } from "react";
import { X, FileText, ArrowRight, Package } from "lucide-react";

const serviceRates = {
  "FedEx First Overnight": { base: 85, perKg: 12 },
  "FedEx Priority Overnight": { base: 60, perKg: 9 },
  "FedEx Standard Overnight": { base: 45, perKg: 7 },
  "FedEx 2Day": { base: 30, perKg: 5 },
  "FedEx Express Saver": { base: 22, perKg: 3.5 },
  "FedEx Ground": { base: 12, perKg: 1.5 },
  "FedEx International Priority": { base: 120, perKg: 18 },
  "FedEx International Economy": { base: 80, perKg: 12 },
};

function getDeliveryEst(service) {
  const map = {
    "FedEx First Overnight": "Next business day by 8:00 AM",
    "FedEx Priority Overnight": "Next business day by 10:30 AM",
    "FedEx Standard Overnight": "Next business day by 3:00 PM",
    "FedEx 2Day": "2 business days by 4:30 PM",
    "FedEx Express Saver": "3 business days by 4:30 PM",
    "FedEx Ground": "1-5 business days",
    "FedEx International Priority": "1-3 business days",
    "FedEx International Economy": "2-5 business days",
  };
  return map[service] || "Varies";
}

export default function GetQuoteModal({ onClose }) {
  const [form, setForm] = useState({
    origin: "", destination: "", weight: "", length: "", width: "", height: "",
    service: "FedEx Ground", packageType: "Your Packaging",
  });
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleGetQuote = async (e) => {
    e.preventDefault();
    setLoading(true);
    const weight = parseFloat(form.weight) || 1;
    const dimWeight = (parseFloat(form.length) || 10) * (parseFloat(form.width) || 10) * (parseFloat(form.height) || 10) / 139;
    const billableWeight = Math.max(weight, dimWeight);
    const rate = serviceRates[form.service];
    const subtotal = rate.base + billableWeight * rate.perKg;
    const fuel = subtotal * 0.175;
    const residential = form.service.includes("Ground") ? 4.95 : 0;
    const total = subtotal + fuel + residential;
    await new Promise(r => setTimeout(r, 1000));
    setQuote({
      service: form.service,
      billableWeight: billableWeight.toFixed(2),
      subtotal: subtotal.toFixed(2),
      fuel: fuel.toFixed(2),
      residential,
      total: total.toFixed(2),
      estDelivery: getDeliveryEst(form.service),
    });
    setLoading(false);
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600";

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#4D148C" }}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold text-lg">Get a Quote</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {!quote ? (
            <form onSubmit={handleGetQuote} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">From (City, State/Country)</label>
                  <input required name="origin" value={form.origin} onChange={handleChange} className={inputCls} placeholder="e.g. New York, NY" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">To (City, State/Country)</label>
                  <input required name="destination" value={form.destination} onChange={handleChange} className={inputCls} placeholder="e.g. Los Angeles, CA" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Service Type</label>
                <select name="service" value={form.service} onChange={handleChange} className={inputCls}>
                  {Object.keys(serviceRates).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Package Type</label>
                <select name="packageType" value={form.packageType} onChange={handleChange} className={inputCls}>
                  {["Your Packaging", "FedEx Envelope", "FedEx Small Box", "FedEx Medium Box", "FedEx Large Box", "FedEx Tube"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Weight and Dimensions</p>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Weight (kg)</label>
                    <input required name="weight" value={form.weight} onChange={handleChange} type="number" step="0.1" min="0.1"
                      className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none" placeholder="kg" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Length (cm)</label>
                    <input name="length" value={form.length} onChange={handleChange} type="number" min="1"
                      className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none" placeholder="cm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Width (cm)</label>
                    <input name="width" value={form.width} onChange={handleChange} type="number" min="1"
                      className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none" placeholder="cm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Height (cm)</label>
                    <input name="height" value={form.height} onChange={handleChange} type="number" min="1"
                      className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none" placeholder="cm" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 text-white font-bold rounded text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: "#FF6600" }}>
                {loading ? "Calculating..." : <><ArrowRight className="w-4 h-4" /> Get Quote</>}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg p-4 border-2 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5" style={{ color: "#4D148C" }} />
                  <p className="font-bold text-gray-800">{quote.service}</p>
                </div>
                <p className="text-xs text-gray-500 mb-3">Estimated Delivery: <span className="font-semibold text-gray-800">{quote.estDelivery}</span></p>
                <div className="space-y-2 text-sm border-t border-purple-200 pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Billable Weight</span><span>{quote.billableWeight} kg</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Base Rate</span><span>${quote.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Fuel Surcharge (17.5%)</span><span>${quote.fuel}</span>
                  </div>
                  {quote.residential > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Residential Delivery</span><span>${quote.residential.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-purple-200 pt-2">
                    <span style={{ color: "#4D148C" }}>Estimated Total</span>
                    <span style={{ color: "#FF6600" }}>${quote.total}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400">* Rates are estimates. Actual charges may vary based on declared value, special handling, and other surcharges.</p>
              <button onClick={() => setQuote(null)}
                className="w-full py-2.5 border-2 font-bold rounded text-sm"
                style={{ borderColor: "#4D148C", color: "#4D148C" }}>
                Get Another Quote
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}