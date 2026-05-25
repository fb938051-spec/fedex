import { useState } from "react";
import { X, Package, Clock, Calendar, Box, Globe, Truck, RotateCcw, ArrowRight, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import ShipNowModal from "./ShipNowModal";

const VIEWS = {
  "Create a Shipment": "create",
  "Shipping Rates & Delivery Times": "rates",
  "Schedule & Manage Pickups": "pickups",
  "Packing & Shipping Supplies": "packing",
  "International Shipping Guide": "international",
  "Freight": "freight",
  "Manage a Return": "return",
  "ALL SHIPPING SERVICES": "all",
};

const ratesData = [
  { service: "FedEx First Overnight®", time: "Next business day by 8:00 AM", from: "$94.70", weight: "Up to 150 lbs", best: "Fastest" },
  { service: "FedEx Priority Overnight®", time: "Next business day by 10:30 AM", from: "$67.20", weight: "Up to 150 lbs", best: "Most Popular" },
  { service: "FedEx Standard Overnight®", time: "Next business day by 3:00 PM", from: "$49.85", weight: "Up to 150 lbs", best: "Best Value Overnight" },
  { service: "FedEx 2Day® A.M.", time: "2 business days by 10:30 AM", from: "$35.10", weight: "Up to 150 lbs", best: null },
  { service: "FedEx 2Day®", time: "2 business days by 4:30 PM", from: "$28.60", weight: "Up to 150 lbs", best: null },
  { service: "FedEx Express Saver®", time: "3 business days by 4:30 PM", from: "$22.45", weight: "Up to 150 lbs", best: null },
  { service: "FedEx Ground®", time: "1–5 business days", from: "$11.80", weight: "Up to 150 lbs", best: "Most Economical" },
  { service: "FedEx Home Delivery®", time: "1–7 business days", from: "$10.95", weight: "Up to 150 lbs", best: "Residential" },
  { service: "FedEx International Priority®", time: "1–3 business days", from: "$134.00", weight: "Up to 150 lbs", best: "Fastest International" },
  { service: "FedEx International Economy®", time: "2–5 business days", from: "$89.50", weight: "Up to 150 lbs", best: null },
];

const packingSupplies = [
  { name: "FedEx Small Box", dims: "8.75\" × 2.625\" × 11.25\"", price: "$3.49", desc: "Perfect for books, electronics, and small items", icon: "📦" },
  { name: "FedEx Medium Box", dims: "11.5\" × 2.375\" × 13.25\"", price: "$4.99", desc: "Great for clothing, shoes, and moderate items", icon: "📦" },
  { name: "FedEx Large Box", dims: "12.375\" × 3\" × 17.5\"", price: "$5.99", desc: "Ideal for bulkier items and multiple products", icon: "📦" },
  { name: "FedEx Extra Large Box", dims: "11.875\" × 10.75\" × 11\"", price: "$7.49", desc: "For large, heavy items", icon: "📦" },
  { name: "FedEx Envelope", dims: "9.5\" × 12.5\"", price: "$1.49", desc: "Documents, contracts, and flat items", icon: "📄" },
  { name: "FedEx Padded Pak", dims: "11.75\" × 14.75\"", price: "$2.99", desc: "Soft-sided protection for flexible items", icon: "🛡️" },
  { name: "FedEx Tube", dims: "6\" × 6\" × 38\"", price: "$4.49", desc: "Posters, blueprints, and rolled documents", icon: "📜" },
  { name: "Bubble Wrap Roll (10ft)", dims: "12\" wide", price: "$8.99", desc: "Extra cushioning for fragile items", icon: "🫧" },
];

const freightServices = [
  { name: "FedEx Freight Priority", time: "1–3 business days", desc: "Time-definite LTL freight with money-back guarantee", feature: "Up to 20,000 lbs" },
  { name: "FedEx Freight Economy", time: "3–7 business days", desc: "Cost-effective LTL freight for less time-sensitive shipments", feature: "Up to 20,000 lbs" },
  { name: "FedEx Custom Critical", time: "Same-day to 3 days", desc: "Specialized transport for high-value and time-critical freight", feature: "No size/weight limit" },
  { name: "FedEx Trade Networks", time: "Varies", desc: "Global freight forwarding and customs brokerage services", feature: "Full truckload available" },
];

const internationalZones = [
  { region: "Canada & Mexico", time: "1–3 days", customs: "Required", docs: ["Commercial Invoice", "Customs Declaration"] },
  { region: "Europe", time: "2–5 days", customs: "Required", docs: ["Commercial Invoice", "EUR.1 Certificate", "Packing List"] },
  { region: "Asia Pacific", time: "3–7 days", customs: "Required", docs: ["Commercial Invoice", "Packing List", "Certificate of Origin"] },
  { region: "Latin America", time: "2–6 days", customs: "Required", docs: ["Commercial Invoice", "Customs Declaration", "Packing List"] },
  { region: "Middle East & Africa", time: "3–7 days", customs: "Required", docs: ["Commercial Invoice", "Certificate of Origin", "Packing List"] },
];

const allServices = [
  { icon: Package, label: "Create a Shipment", desc: "Start a new shipment with full tracking", key: "Create a Shipment" },
  { icon: Clock, label: "Shipping Rates", desc: "Compare service speeds and pricing", key: "Shipping Rates & Delivery Times" },
  { icon: Calendar, label: "Schedule Pickup", desc: "Arrange a convenient pickup time", key: "Schedule & Manage Pickups" },
  { icon: Box, label: "Packing Supplies", desc: "Order boxes, envelopes, and materials", key: "Packing & Shipping Supplies" },
  { icon: Globe, label: "International Guide", desc: "Navigate customs and global shipping", key: "International Shipping Guide" },
  { icon: Truck, label: "Freight Services", desc: "Heavy and oversized shipment options", key: "Freight" },
  { icon: RotateCcw, label: "Manage a Return", desc: "Create a prepaid return label", key: "Manage a Return" },
];

function RatesView() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Compare FedEx shipping options to find the right balance of speed and cost.</p>
      <div className="space-y-2">
        {ratesData.map(r => (
          <div key={r.service} className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900 text-sm">{r.service}</p>
                  {r.best && <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: "#FF6600" }}>{r.best}</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{r.time}</p>
                <p className="text-xs text-gray-400">{r.weight}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">Starting from</p>
                <p className="font-black text-lg" style={{ color: "#4D148C" }}>{r.from}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">* Rates shown are base rates before surcharges. Actual rates depend on package dimensions, weight, and destination.</p>
    </div>
  );
}

function PickupsView() {
  const [form, setForm] = useState({ date: "", timeFrom: "09:00", timeTo: "17:00", address: "", instructions: "", packages: "1" });
  const [submitted, setSubmitted] = useState(false);
  const [confirmNum] = useState("PU" + Math.floor(Math.random() * 9000000 + 1000000));

  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return (
    <div className="text-center py-8 space-y-4">
      <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
      <h3 className="font-black text-xl text-gray-900">Pickup Scheduled!</h3>
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Confirmation Number</p>
        <p className="font-black text-2xl tracking-widest" style={{ color: "#4D148C" }}>{confirmNum}</p>
        <p className="text-xs text-gray-500 mt-2">Pickup Date: <span className="font-semibold text-gray-800">{form.date}</span></p>
        <p className="text-xs text-gray-500">Time Window: <span className="font-semibold text-gray-800">{form.timeFrom} – {form.timeTo}</span></p>
      </div>
      <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 font-bold rounded text-sm text-white" style={{ backgroundColor: "#4D148C" }}>Schedule Another</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">Schedule a FedEx courier to pick up your packages directly from your address.</p>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Pickup Date</label>
        <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          min={new Date().toISOString().split("T")[0]}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Ready By (Time)</label>
          <input type="time" value={form.timeFrom} onChange={e => setForm(f => ({ ...f, timeFrom: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Latest Pickup Time</label>
          <input type="time" value={form.timeTo} onChange={e => setForm(f => ({ ...f, timeTo: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Pickup Address</label>
        <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
          placeholder="Full address including city, state, zip" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Number of Packages</label>
        <input type="number" min="1" max="99" value={form.packages} onChange={e => setForm(f => ({ ...f, packages: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Special Instructions (optional)</label>
        <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={2}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none"
          placeholder="e.g. Ring bell, packages at front desk..." />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
        <strong>Note:</strong> Pickup requests submitted before 2:00 PM local time may be scheduled for the same day. A $4.00 pickup fee may apply for residential addresses.
      </div>
      <button type="submit" className="w-full py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#4D148C" }}>
        Schedule Pickup
      </button>
    </form>
  );
}

function PackingView() {
  const [cart, setCart] = useState({});
  const [ordered, setOrdered] = useState(false);

  const toggle = (name) => setCart(c => ({ ...c, [name]: c[name] ? 0 : 1 }));
  const qty = (name, delta) => setCart(c => ({ ...c, [name]: Math.max(0, (c[name] || 0) + delta) }));
  const total = packingSupplies.reduce((sum, s) => sum + (cart[s.name] || 0) * parseFloat(s.price.replace("$", "")), 0);
  const itemCount = Object.values(cart).reduce((s, v) => s + v, 0);

  if (ordered) return (
    <div className="text-center py-8 space-y-4">
      <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
      <h3 className="font-black text-xl text-gray-900">Order Placed!</h3>
      <p className="text-gray-500 text-sm">Your packing supplies will arrive within 2 business days.</p>
      <p className="text-xs text-gray-400">Free delivery on orders over $20</p>
      <button onClick={() => { setOrdered(false); setCart({}); }} className="px-6 py-2.5 font-bold rounded text-sm text-white" style={{ backgroundColor: "#4D148C" }}>Shop Again</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Order official FedEx packaging materials delivered to your door.</p>
      <div className="space-y-2">
        {packingSupplies.map(s => (
          <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{s.name}</p>
              <p className="text-xs text-gray-500">{s.dims}</p>
              <p className="text-xs text-gray-400 truncate">{s.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <p className="font-black text-sm" style={{ color: "#FF6600" }}>{s.price}</p>
              {cart[s.name] > 0 ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => qty(s.name, -1)} className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center">-</button>
                  <span className="text-xs font-bold w-4 text-center">{cart[s.name]}</span>
                  <button onClick={() => qty(s.name, 1)} className="w-5 h-5 rounded-full text-white font-bold text-xs flex items-center justify-center" style={{ backgroundColor: "#4D148C" }}>+</button>
                </div>
              ) : (
                <button onClick={() => toggle(s.name)} className="text-xs font-bold px-2 py-1 rounded" style={{ color: "#4D148C" }}>+ Add</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {itemCount > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">{itemCount} item(s)</span>
            <span className="font-black text-lg" style={{ color: "#4D148C" }}>${total.toFixed(2)}</span>
          </div>
          <button onClick={() => setOrdered(true)} className="w-full py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#FF6600" }}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

function InternationalView() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Ship internationally with confidence. Below is your region-by-region guide for customs, documentation, and delivery timelines.</p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
        <strong>Important:</strong> All international shipments require a Commercial Invoice. Incorrect or missing documents can cause delays or package seizure.
      </div>

      <div className="space-y-2">
        {internationalZones.map((z, i) => (
          <div key={z.region} className="border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" style={{ color: "#4D148C" }} />
                <span className="font-bold text-gray-800 text-sm">{z.region}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{z.time}</span>
                {open === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
            {open === i && (
              <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-600 mt-3 mb-2">Required Documents:</p>
                <ul className="space-y-1">
                  {z.docs.map(d => (
                    <li key={d} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{d}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-3 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">Customs: {z.customs}</span>
                  <span className="bg-purple-100 px-2 py-1 rounded font-semibold" style={{ color: "#4D148C" }}>Transit: {z.time}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <p className="font-bold text-gray-800 text-sm">Prohibited Items (International)</p>
        <div className="flex flex-wrap gap-1">
          {["Currency", "Explosives", "Live Animals", "Hazardous Materials", "Counterfeit Goods", "Perishables (unapproved)", "Firearms"].map(item => (
            <span key={item} className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FreightView() {
  const [form, setForm] = useState({ weight: "", freight_class: "70", origin: "", destination: "", service: "FedEx Freight Priority" });
  const [quote, setQuote] = useState(null);

  const handleQuote = e => {
    e.preventDefault();
    const w = parseFloat(form.weight) || 500;
    const base = form.service === "FedEx Freight Priority" ? 0.18 : 0.12;
    const total = w * base * (1 + Math.random() * 0.3);
    setQuote({ total: total.toFixed(2), service: form.service, weight: w });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">FedEx Freight services handle LTL and full truckload shipments for heavy or oversized cargo.</p>
      <div className="grid grid-cols-1 gap-3 mb-2">
        {freightServices.map(s => (
          <div key={s.name} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold" style={{ color: "#FF6600" }}>{s.time}</p>
                <p className="text-xs text-gray-400">{s.feature}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="font-bold text-gray-800 text-sm mb-3">Get Freight Quote</p>
        {!quote ? (
          <form onSubmit={handleQuote} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Origin City</label>
                <input required value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" placeholder="City, State" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Destination City</label>
                <input required value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" placeholder="City, State" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Weight (lbs)</label>
                <input required type="number" min="1" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" placeholder="lbs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Freight Class</label>
                <select value={form.freight_class} onChange={e => setForm(f => ({ ...f, freight_class: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
                  {["50","55","60","65","70","77.5","85","92.5","100","110","125","150","175","200","250","300","400","500"].map(c => <option key={c}>Class {c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Service</label>
              <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
                {freightServices.map(s => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#FF6600" }}>Get Freight Quote</button>
          </form>
        ) : (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center space-y-2">
            <p className="text-sm font-semibold text-gray-600">{quote.service}</p>
            <p className="text-xs text-gray-500">{quote.weight} lbs</p>
            <p className="font-black text-3xl" style={{ color: "#4D148C" }}>${quote.total}</p>
            <p className="text-xs text-gray-400">Estimated freight charge (before accessorial fees)</p>
            <button onClick={() => setQuote(null)} className="text-xs font-bold underline" style={{ color: "#4D148C" }}>Recalculate</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReturnView() {
  const [form, setForm] = useState({ name: "", email: "", tracking: "", reason: "", address: "" });
  const [done, setDone] = useState(false);
  const [returnCode] = useState("RTN" + Math.floor(Math.random() * 9000000 + 1000000));

  const handleSubmit = e => { e.preventDefault(); setDone(true); };

  if (done) return (
    <div className="text-center py-8 space-y-4">
      <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
      <h3 className="font-black text-xl text-gray-900">Return Label Created!</h3>
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Return Authorization Number</p>
        <p className="font-black text-2xl tracking-widest" style={{ color: "#4D148C" }}>{returnCode}</p>
        <p className="text-xs text-gray-500 mt-2">A prepaid return label has been sent to <span className="font-semibold">{form.email}</span></p>
      </div>
      <div className="text-left bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
        <p className="font-bold text-gray-800 mb-2">Next Steps:</p>
        <p>1. Print the return label from your email</p>
        <p>2. Securely pack your items</p>
        <p>3. Attach label and drop off at any FedEx location</p>
        <p>4. Keep your tracking number for status updates</p>
      </div>
      <button onClick={() => setDone(false)} className="px-6 py-2.5 font-bold rounded text-sm text-white" style={{ backgroundColor: "#4D148C" }}>Create Another Return</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">Generate a prepaid return label to send items back easily.</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Your Full Name</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" placeholder="Full name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email for Label</label>
          <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" placeholder="your@email.com" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Original Tracking Number (if available)</label>
        <input value={form.tracking} onChange={e => setForm(f => ({ ...f, tracking: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" placeholder="e.g. ABCD11223340" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Return From Address</label>
        <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" placeholder="Full pickup address" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Reason for Return</label>
        <select required value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600">
          <option value="">Select a reason...</option>
          {["Item arrived damaged", "Wrong item received", "Item not as described", "Changed my mind", "Defective product", "Duplicate order", "Other"].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <button type="submit" className="w-full py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#4D148C" }}>
        Generate Return Label
      </button>
    </form>
  );
}

function AllServicesView({ onNavigate }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Everything you need to ship, track, and manage your packages.</p>
      <div className="grid grid-cols-1 gap-2">
        {allServices.map(({ icon: Icon, label, desc, key }) => (
          <button key={key} onClick={() => onNavigate(key)}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left w-full group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F0E8FA" }}>
              <Icon className="w-5 h-5" style={{ color: "#4D148C" }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

const VIEW_TITLES = {
  create: "Create a Shipment",
  rates: "Shipping Rates & Delivery Times",
  pickups: "Schedule & Manage Pickups",
  packing: "Packing & Shipping Supplies",
  international: "International Shipping Guide",
  freight: "Freight Services",
  return: "Manage a Return",
  all: "All Shipping Services",
};

export default function ShippingModal({ initialView = "all", onClose }) {
  const [view, setView] = useState(initialView);
  const [showShipNow, setShowShipNow] = useState(false);

  if (showShipNow) return <ShipNowModal onClose={onClose} />;

  const handleNavigate = (label) => {
    const key = VIEWS[label];
    if (key === "create") { setShowShipNow(true); return; }
    if (key) setView(key);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#4D148C" }}>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold text-lg">{VIEW_TITLES[view]}</h2>
          </div>
          <div className="flex items-center gap-3">
            {view !== "all" && (
              <button onClick={() => setView("all")} className="text-purple-200 text-xs font-semibold hover:text-white">← Back</button>
            )}
            <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {view === "all" && <AllServicesView onNavigate={handleNavigate} />}
          {view === "rates" && <RatesView />}
          {view === "pickups" && <PickupsView />}
          {view === "packing" && <PackingView />}
          {view === "international" && <InternationalView />}
          {view === "freight" && <FreightView />}
          {view === "return" && <ReturnView />}
        </div>
      </div>
    </div>
  );
}