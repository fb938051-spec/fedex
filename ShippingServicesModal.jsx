import { useState } from "react";
import { X, Package, DollarSign, Clock, Truck, Globe, Box, RotateCcw, ChevronRight, CheckCircle, Calendar } from "lucide-react";
import ShipNowModal from "./ShipNowModal";

const TABS = [
  { key: "create", label: "Create a Shipment", icon: Package },
  { key: "rates", label: "Rates & Delivery Times", icon: DollarSign },
  { key: "pickup", label: "Schedule a Pickup", icon: Calendar },
  { key: "supplies", label: "Packing Supplies", icon: Box },
  { key: "international", label: "International Guide", icon: Globe },
  { key: "freight", label: "Freight", icon: Truck },
  { key: "return", label: "Manage a Return", icon: RotateCcw },
];

const rateTable = [
  { service: "FedEx First Overnight®", delivery: "Next business day by 8:00 AM", starts: "$89.50", weight: "Up to 150 lbs" },
  { service: "FedEx Priority Overnight®", delivery: "Next business day by 10:30 AM", starts: "$64.20", weight: "Up to 150 lbs" },
  { service: "FedEx Standard Overnight®", delivery: "Next business day by 3:00 PM", starts: "$47.80", weight: "Up to 150 lbs" },
  { service: "FedEx 2Day® AM", delivery: "2 business days by 10:30 AM", starts: "$36.10", weight: "Up to 150 lbs" },
  { service: "FedEx 2Day®", delivery: "2 business days by 4:30 PM", starts: "$29.50", weight: "Up to 150 lbs" },
  { service: "FedEx Express Saver®", delivery: "3 business days by 4:30 PM", starts: "$22.75", weight: "Up to 150 lbs" },
  { service: "FedEx Ground®", delivery: "1–5 business days", starts: "$10.35", weight: "Up to 150 lbs" },
  { service: "FedEx Home Delivery®", delivery: "1–5 business days (incl. Sat/Sun)", starts: "$11.80", weight: "Up to 150 lbs" },
  { service: "FedEx International Priority®", delivery: "1–3 business days", starts: "$125.00", weight: "Up to 150 lbs" },
  { service: "FedEx International Economy®", delivery: "2–5 business days", starts: "$89.00", weight: "Up to 150 lbs" },
];

const supplies = [
  { name: "FedEx Envelope", desc: "For documents up to 8.5\" x 11\"", price: "Free with shipment", img: "📄" },
  { name: "FedEx Small Box", desc: "Interior: 10.875\" x 1.5\" x 12.375\"", price: "Free with shipment", img: "📦" },
  { name: "FedEx Medium Box", desc: "Interior: 11.5\" x 2.375\" x 13.25\"", price: "Free with shipment", img: "📦" },
  { name: "FedEx Large Box", desc: "Interior: 12.375\" x 3\" x 17.5\"", price: "Free with shipment", img: "📦" },
  { name: "FedEx Extra Large Box", desc: "Interior: 11.875\" x 10.75\" x 11\"", price: "Free with shipment", img: "📦" },
  { name: "FedEx Tube", desc: "Interior: 6\" x 6\" x 38\"", price: "Free with shipment", img: "🎁" },
  { name: "Bubble Wrap (6 ft roll)", desc: "Premium protective cushioning", price: "$8.99", img: "🫧" },
  { name: "Packing Tape (2-pack)", desc: "Heavy-duty, 2\" x 55 yards each", price: "$6.49", img: "🎀" },
  { name: "Packing Peanuts (1 cu ft)", desc: "Anti-static foam peanuts", price: "$9.99", img: "✨" },
];

const freightTypes = [
  { name: "FedEx Freight Priority", desc: "Delivers freight faster — up to a day sooner to more locations than our economy LTL service.", transit: "1–3 days", min_weight: "151 lbs" },
  { name: "FedEx Freight Economy", desc: "Reliable, cost-effective LTL shipping across the contiguous U.S., Alaska, Hawaii, and Puerto Rico.", transit: "2–5 days", min_weight: "151 lbs" },
  { name: "FedEx Custom Critical", desc: "Time-sensitive, high-value, or hazardous freight requiring specialized handling.", transit: "Direct, 24/7", min_weight: "Any" },
  { name: "FedEx International Freight", desc: "International air freight with priority and economy options for shipments over 150 lbs.", transit: "1–5 days", min_weight: "150+ lbs" },
];

const internationalTips = [
  { title: "Customs Documentation", body: "Every international shipment requires a commercial invoice, packing list, and possibly a certificate of origin. FedEx Global Trade Manager can help generate these automatically." },
  { title: "Prohibited and Restricted Items", body: "Items like currency, firearms, certain foods, and counterfeit goods are prohibited. Restrictions vary by country — always verify before shipping." },
  { title: "Duties and Taxes", body: "Import duties and taxes are charged by the destination country. You can choose to have the receiver pay (DDU) or pre-pay on their behalf (DDP)." },
  { title: "Packaging Requirements", body: "Use sturdy packaging rated for your shipment weight. Double-box fragile items. International shipments face more handling, so pack tightly with adequate cushioning." },
  { title: "Clearance and Delays", body: "Customs clearance times vary by country. Allow extra time for high-risk or restricted destinations. FedEx Trade Networks provides brokerage services to accelerate clearance." },
  { title: "Tracking Your International Shipment", body: "Use your FedEx tracking number on fedex.com or the mobile app. International tracking is updated at each scan point worldwide." },
];

export default function ShippingServicesModal({ onClose, initialTab }) {
  const [tab, setTab] = useState(initialTab || "create");
  const [showShipNow, setShowShipNow] = useState(false);
  const [pickupForm, setPickupForm] = useState({ date: "", time: "", address: "", packages: "1", instructions: "" });
  const [pickupSubmitted, setPickupSubmitted] = useState(false);
  const [returnForm, setReturnForm] = useState({ tracking: "", reason: "", name: "", email: "" });
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handlePickup = (e) => {
    e.preventDefault();
    setPickupSubmitted(true);
  };

  const handleReturn = (e) => {
    e.preventDefault();
    setReturnSubmitted(true);
  };

  if (showShipNow) {
    return <ShipNowModal onClose={() => setShowShipNow(false)} />;
  }

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600";

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-2 sm:px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#4D148C" }}>
          <div>
            <h2 className="text-white font-black text-lg">Shipping Services</h2>
            <p className="text-purple-200 text-xs mt-0.5">Everything you need to ship with FedEx</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-gray-200 flex-shrink-0 bg-gray-50">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 transition-colors ${
                tab === key ? "border-purple-700 text-purple-700 bg-white" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 py-5">

          {/* CREATE A SHIPMENT */}
          {tab === "create" && (
            <div className="space-y-4">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5 text-center">
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: "#4D148C" }} />
                <h3 className="font-black text-xl text-gray-900 mb-2">Ready to Ship?</h3>
                <p className="text-sm text-gray-600 mb-4">Create a new shipment in minutes. We'll generate a tracking number and all the details you need.</p>
                <button onClick={() => setShowShipNow(true)}
                  className="px-8 py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#FF6600" }}>
                  Start Creating Shipment →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Easy to Use", body: "Fill in sender and receiver details in 3 simple steps." },
                  { title: "Instant Tracking", body: "Get a tracking number immediately upon creation." },
                  { title: "Multiple Services", body: "Choose from Ground, Express, or International." },
                ].map(c => (
                  <div key={c.title} className="border border-gray-200 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 mb-2" style={{ color: "#4D148C" }} />
                    <p className="font-bold text-sm text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RATES & DELIVERY TIMES */}
          {tab === "rates" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Estimated starting rates from a single package. Final rates depend on weight, dimensions, and surcharges.</p>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#4D148C" }}>
                      <th className="text-left px-4 py-3 text-white font-bold text-xs">Service</th>
                      <th className="text-left px-4 py-3 text-white font-bold text-xs">Delivery</th>
                      <th className="text-left px-4 py-3 text-white font-bold text-xs">Starts At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateTable.map((r, i) => (
                      <tr key={r.service} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-4 py-3 font-semibold text-gray-800 text-xs">{r.service}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{r.delivery}</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: "#FF6600" }}>{r.starts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400">* Rates shown are estimates and exclude fuel surcharges, residential fees, and other applicable charges. Visit fedex.com for a precise quote.</p>
            </div>
          )}

          {/* SCHEDULE & MANAGE PICKUPS */}
          {tab === "pickup" && (
            pickupSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
                <h3 className="font-black text-xl text-gray-900">Pickup Scheduled!</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left text-sm space-y-2">
                  <p><span className="font-bold text-gray-700">Date:</span> {pickupForm.date}</p>
                  <p><span className="font-bold text-gray-700">Time Window:</span> {pickupForm.time}</p>
                  <p><span className="font-bold text-gray-700">Address:</span> {pickupForm.address}</p>
                  <p><span className="font-bold text-gray-700">Packages:</span> {pickupForm.packages}</p>
                </div>
                <p className="text-xs text-gray-400">A confirmation will be sent to your registered email address. A FedEx driver will arrive within your selected window.</p>
                <button onClick={() => { setPickupSubmitted(false); setPickupForm({ date: "", time: "", address: "", packages: "1", instructions: "" }); }}
                  className="px-6 py-2.5 border-2 font-bold rounded text-sm" style={{ borderColor: "#4D148C", color: "#4D148C" }}>
                  Schedule Another Pickup
                </button>
              </div>
            ) : (
              <form onSubmit={handlePickup} className="space-y-4">
                <p className="text-sm text-gray-600">Schedule a FedEx driver to pick up your pre-labeled packages directly from your location.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Pickup Date</label>
                    <input required type="date" value={pickupForm.date} onChange={e => setPickupForm(f => ({ ...f, date: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Time Window</label>
                    <select required value={pickupForm.time} onChange={e => setPickupForm(f => ({ ...f, time: e.target.value }))} className={inputCls}>
                      <option value="">Select window...</option>
                      {["8:00 AM – 10:00 AM", "10:00 AM – 12:00 PM", "12:00 PM – 2:00 PM", "2:00 PM – 4:00 PM", "4:00 PM – 6:00 PM"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pickup Address</label>
                  <input required value={pickupForm.address} onChange={e => setPickupForm(f => ({ ...f, address: e.target.value }))} className={inputCls} placeholder="Street address, City, State, ZIP" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Number of Packages</label>
                  <input required type="number" min="1" max="100" value={pickupForm.packages} onChange={e => setPickupForm(f => ({ ...f, packages: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Special Instructions (optional)</label>
                  <textarea value={pickupForm.instructions} onChange={e => setPickupForm(f => ({ ...f, instructions: e.target.value }))} rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none" placeholder="e.g. Ring doorbell, leave with reception..." />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  <strong>Note:</strong> Pickup must be scheduled before 2:00 PM for same-day processing. Packages must be pre-labeled with a valid FedEx tracking number.
                </div>
                <button type="submit" className="w-full py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#4D148C" }}>
                  Schedule Pickup
                </button>
              </form>
            )
          )}

          {/* PACKING & SHIPPING SUPPLIES */}
          {tab === "supplies" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">FedEx-branded packaging is free when used with FedEx Express shipments. Third-party supplies are available for purchase.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {supplies.map(s => (
                  <div key={s.name} className="border border-gray-200 rounded-lg p-4 flex items-start gap-3 hover:border-purple-300 transition-colors">
                    <span className="text-2xl">{s.img}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      <p className="text-xs font-bold mt-1.5" style={{ color: s.price === "Free with shipment" ? "#16A34A" : "#FF6600" }}>{s.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-center">
                <p className="font-bold text-gray-800 mb-1">Order Free Supplies</p>
                <p className="text-xs text-gray-500">FedEx Express packaging is available free of charge at any FedEx location or can be ordered online for delivery to your business.</p>
              </div>
            </div>
          )}

          {/* INTERNATIONAL SHIPPING GUIDE */}
          {tab === "international" && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                <Globe className="w-8 h-8 flex-shrink-0 mt-0.5" style={{ color: "#4D148C" }} />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Ship to Over 220 Countries</p>
                  <p className="text-xs text-gray-600 mt-1">FedEx offers international shipping services with reliable transit times, customs clearance support, and real-time tracking.</p>
                </div>
              </div>
              <div className="space-y-3">
                {internationalTips.map(tip => (
                  <div key={tip.title} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#FF6600" }} />
                      <p className="font-bold text-sm text-gray-800">{tip.title}</p>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed pl-6">{tip.body}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-purple-200 rounded-lg p-4 text-center">
                  <p className="font-black text-2xl" style={{ color: "#4D148C" }}>220+</p>
                  <p className="text-xs text-gray-500 mt-1">Countries served</p>
                </div>
                <div className="border-2 border-orange-200 rounded-lg p-4 text-center">
                  <p className="font-black text-2xl" style={{ color: "#FF6600" }}>1–5</p>
                  <p className="text-xs text-gray-500 mt-1">Business day delivery</p>
                </div>
              </div>
            </div>
          )}

          {/* FREIGHT */}
          {tab === "freight" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">FedEx Freight services handle heavy, palletized, or oversized shipments over 150 lbs (68 kg) with LTL and full-truckload options.</p>
              <div className="space-y-3">
                {freightTypes.map(f => (
                  <div key={f.name} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{f.name}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold" style={{ color: "#4D148C" }}>{f.transit}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Min: {f.min_weight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-xs text-gray-600">
                <p className="font-bold text-gray-800 text-sm">Getting a Freight Quote</p>
                <p>For freight shipments, additional details like freight class, pallet dimensions, and pickup/delivery locations are required. Contact FedEx Freight directly at <strong>1-866-393-4585</strong> or use the Get a Quote tool for a custom freight estimate.</p>
              </div>
              <button onClick={() => setTab("rates")}
                className="w-full py-3 border-2 font-bold rounded text-sm" style={{ borderColor: "#4D148C", color: "#4D148C" }}>
                View All Rates →
              </button>
            </div>
          )}

          {/* MANAGE A RETURN */}
          {tab === "return" && (
            returnSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
                <h3 className="font-black text-xl text-gray-900">Return Initiated!</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left text-sm space-y-2">
                  <p><span className="font-bold text-gray-700">Original Tracking:</span> {returnForm.tracking}</p>
                  <p><span className="font-bold text-gray-700">Return Reason:</span> {returnForm.reason}</p>
                  <p><span className="font-bold text-gray-700">Return Label:</span> Will be emailed to {returnForm.email}</p>
                </div>
                <p className="text-xs text-gray-400">Print the return label and attach it to your package. Drop it off at any FedEx location or schedule a pickup.</p>
                <button onClick={() => { setReturnSubmitted(false); setReturnForm({ tracking: "", reason: "", name: "", email: "" }); }}
                  className="px-6 py-2.5 border-2 font-bold rounded text-sm" style={{ borderColor: "#4D148C", color: "#4D148C" }}>
                  Start Another Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleReturn} className="space-y-4">
                <p className="text-sm text-gray-600">Start a return shipment. We'll generate a return label and send it to your email.</p>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Original Tracking Number</label>
                  <input required value={returnForm.tracking} onChange={e => setReturnForm(f => ({ ...f, tracking: e.target.value }))} className={inputCls} placeholder="e.g. ABCD11223340" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                    <input required value={returnForm.name} onChange={e => setReturnForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                    <input required type="email" value={returnForm.email} onChange={e => setReturnForm(f => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Reason for Return</label>
                  <select required value={returnForm.reason} onChange={e => setReturnForm(f => ({ ...f, reason: e.target.value }))} className={inputCls}>
                    <option value="">Select a reason...</option>
                    {["Wrong item received", "Item damaged in transit", "Item not as described", "Changed my mind", "Defective product", "Duplicate order", "Other"].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  <strong>How it works:</strong> Once submitted, you'll receive a prepaid FedEx return label by email. Package your item securely, attach the label, and drop it off at any FedEx location.
                </div>
                <button type="submit" className="w-full py-3 text-white font-bold rounded text-sm" style={{ backgroundColor: "#4D148C" }}>
                  Generate Return Label
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}