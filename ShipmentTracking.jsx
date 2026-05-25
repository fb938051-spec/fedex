import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";
import PageFooter from "../components/PageFooter";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { base44 } from "@/api/base44Client";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const stampImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/1935c19c8_stamp1.png";
const paymentImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/8d5d11bb4_payment1.png";
const packageImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/726ff03b6_default.jpg";

function BarcodeDisplay({ code }) {
  return (
    <div className="text-center my-3">
      <svg viewBox="0 0 300 60" className="w-64 mx-auto" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 80 }).map((_, i) => (
          <rect key={i} x={i * 3.5 + 10} y={0} width={i % 3 === 0 ? 2.5 : 1.5} height={50} fill="black" />
        ))}
      </svg>
      <p className="text-xs font-mono tracking-widest mt-1">{code}</p>
    </div>
  );
}

export default function ShipmentTracking() {
  const [mapCoords, setMapCoords] = useState([51.505, -0.09]);
  const [locationLabel, setLocationLabel] = useState("");
  const [loadingMap, setLoadingMap] = useState(true);
  const [shipment, setShipment] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || "";
    const normalizedCode = code.toUpperCase().replace(/-/g, "").replace(/\s/g, "");

    const fetchAndGeocode = async () => {
      const shipments = await base44.entities.Shipment.list();
      const found = shipments.find(s =>
        (s.tracking_code || "").toUpperCase().replace(/-/g, "").replace(/\s/g, "") === normalizedCode
      );
      if (!found) { setNotFound(true); setLoadingMap(false); return; }
      setShipment(found);
      if (found.timeline) {
        try {
          setTimeline(JSON.parse(found.timeline));
        } catch {
          setTimeline([]);
        }
      }
      const location = found.current_location || "London, United Kingdom";
      setLocationLabel(location);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data && data[0]) {
        setMapCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
      setLoadingMap(false);
    };

    fetchAndGeocode();
  }, []);

  if (notFound) return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 py-16 text-center">
        <p className="text-4xl mb-4">📦</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Shipment Not Found</h2>
        <p className="text-gray-500 text-sm">No shipment found for this tracking number. Please check and try again.</p>
      </div>
    </div>
  );

  if (!shipment) return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 py-16 text-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 text-sm mt-4">Loading shipment details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-3 py-6">
        {/* Action Buttons */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded"
            style={{ backgroundColor: "#4D148C" }}
          >
            🖨️ Print Receipt
          </button>
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded bg-red-500">
            ✕ Close
          </button>
        </div>

        <div className="bg-white rounded shadow-sm overflow-hidden">
          {/* Header */}
          <div className="text-center py-6 border-b border-gray-200 px-5">
            <span className="text-3xl font-black">
              <span style={{ color: "#4D148C" }}>Fed</span><span style={{ color: "#FF6600" }}>Ex</span>
            </span>
            <p className="text-xs text-gray-500 mt-1">1261 S Seward Meridian, Missouri, USA</p>
            <p className="text-xs text-gray-500">📞 +1(333) 222-5555 &nbsp;|&nbsp; ✉️ support@fedex.com</p>
            <p className="text-sm font-bold text-gray-800 mt-3">Tracking Code</p>
            <BarcodeDisplay code={shipment.tracking_code} />
          </div>

          {/* Sender / Receiver */}
          <div className="grid grid-cols-2 gap-4 px-4 py-6 border-b border-gray-200 bg-slate-50">
            <div className="border-3 border-purple-400 rounded-xl p-5 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-sm font-black text-purple-700 mb-4 pb-2 border-b-2 border-purple-300 uppercase tracking-wide">📦 Sender</p>
              <div className="space-y-3 text-sm text-gray-800">
                <div><span className="font-bold text-gray-900">Name:</span> <span className="text-gray-600">{shipment.sender_name || "—"}</span></div>
                <div><span className="font-bold text-gray-900">Contact:</span> <span className="text-gray-600">{shipment.sender_contact || "—"}</span></div>
                <div><span className="font-bold text-gray-900 block">Email:</span> <span className="text-gray-600 text-xs break-words word-break">{shipment.sender_email || "—"}</span></div>
                <div><span className="font-bold text-gray-900">Address:</span> <span className="text-gray-600 text-xs block mt-1">{shipment.sender_address || "—"}</span></div>
              </div>
            </div>
            <div className="border-3 border-orange-400 rounded-xl p-5 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-sm font-black text-orange-700 mb-4 pb-2 border-b-2 border-orange-300 uppercase tracking-wide">🎯 Receiver</p>
              <div className="space-y-3 text-sm text-gray-800">
                <div><span className="font-bold text-gray-900">Name:</span> <span className="text-gray-600">{shipment.receiver_name || "—"}</span></div>
                <div><span className="font-bold text-gray-900">Contact:</span> <span className="text-gray-600">{shipment.receiver_contact || "—"}</span></div>
                <div><span className="font-bold text-gray-900 block">Email:</span> <span className="text-gray-600 text-xs break-words word-break">{shipment.receiver_email || "—"}</span></div>
                <div><span className="font-bold text-gray-900">Address:</span> <span className="text-gray-600 text-xs block mt-1">{shipment.receiver_address || "—"}</span></div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="px-4 py-5 border-b border-gray-200">
            <h3 className="text-sm font-bold text-blue-600 border-b border-blue-200 pb-2 mb-3">Shipment Details</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-gray-700">
              <div><span className="font-semibold">Service Type:</span><br />{shipment.service_type || "—"}</div>
              <div><span className="font-semibold">From:</span><br />{shipment.sender_address || "—"}</div>
              <div><span className="font-semibold">Service Content:</span><br />{shipment.service_content || "—"}</div>
              <div><span className="font-semibold">To:</span><br />{shipment.receiver_address || "—"}</div>
              <div><span className="font-semibold">Weight:</span><br />{shipment.weight || "—"}</div>
              <div><span className="font-semibold">Shipment Mode:</span><br />{shipment.shipment_mode || "—"}</div>
              <div><span className="font-semibold">Quantity:</span><br />{shipment.quantity || "—"}</div>
              <div><span className="font-semibold">Reference:</span><br />{shipment.reference || "—"}</div>
              <div><span className="font-semibold">Shipping Date:</span><br />{shipment.shipping_date || "—"}</div>
              <div><span className="font-semibold">Expected Delivery:</span><br />{shipment.expected_delivery || "—"}</div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="px-4 py-5 border-b border-gray-200">
            <h3 className="text-sm font-bold text-blue-600 border-b border-blue-200 pb-2 mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{shipment.fee_type || "Customer Clearance Fee"}:</span>
                <span>{shipment.clearance_fee ? `$${Number(shipment.clearance_fee).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                <span>Total Amount:</span>
                <span>{shipment.clearance_fee ? `$${Number(shipment.clearance_fee).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status:</span>
                {(() => {
                  const ps = shipment.payment_status || "Pending";
                  const map = {
                    "Paid": { color: "text-green-700", border: "border-green-500", icon: "✅" },
                    "Pending": { color: "text-orange-600", border: "border-orange-400", icon: "⏳" },
                    "Partially Paid": { color: "text-blue-600", border: "border-blue-400", icon: "🔵" },
                    "Overdue": { color: "text-red-600", border: "border-red-400", icon: "🔴" },
                    "Waived": { color: "text-gray-500", border: "border-gray-400", icon: "⚪" },
                  };
                  const style = map[ps] || map["Pending"];
                  return (
                    <span className={`flex items-center gap-1 ${style.color} border ${style.border} rounded-full px-3 py-0.5 text-xs font-bold`}>
                      {style.icon} {ps.toUpperCase()}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Package Image */}
          <div className="px-4 py-5 border-b border-gray-200 text-center">
            <h3 className="text-sm font-bold text-gray-700 mb-3">📦 Package Image</h3>
            <img src={shipment.image_url || packageImg} alt="Package" className="w-full max-w-xs mx-auto rounded" />
          </div>

          {/* Live Map */}
          <div className="px-4 py-5 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3">🗺️ Live Shipment Tracking Map</h3>
            <div className="h-48 rounded overflow-hidden border border-gray-200">
              {loadingMap ? (
                <div className="h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">Loading map...</div>
              ) : (
                <MapContainer key={mapCoords.join(",")} center={mapCoords} zoom={10} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                  <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                  <Marker position={mapCoords}>
                    <Popup>{locationLabel}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="px-4 py-5 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-1">⏱️ Shipment Timeline</h3>
            <p className="text-xs text-gray-500 mb-3">All shipment travel activity is displayed below</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="text-left pb-2 pr-2">Status</th>
                    <th className="text-left pb-2 pr-2">Location</th>
                    <th className="text-left pb-2 pr-2">Comment</th>
                    <th className="text-left pb-2">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.length > 0 ? (
                    timeline.map((t, i) => {
                      const statusColor = t.status === "Delivered" ? "#22c55e" : t.status === "On-Hold" ? "#f97316" : t.status === "In Transit" ? "#3b82f6" : "#ef4444";
                      const bg = t.status === "Delivered" ? "#f0fdf4" : t.status === "On-Hold" ? "#fff7ed" : t.status === "In Transit" ? "#eff6ff" : "#fef2f2";
                      return (
                        <tr key={i} style={{ backgroundColor: bg }} className="border-b border-gray-100">
                          <td className="py-2 pr-2 font-semibold" style={{ color: statusColor }}>{t.status}</td>
                          <td className="py-2 pr-2 text-gray-700">{t.location}</td>
                          <td className="py-2 pr-2 text-gray-700">{t.comment}</td>
                          <td className="py-2 text-gray-500">{t.date} {t.time}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={4} className="py-4 text-center text-gray-400">No timeline events yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment methods + Stamp */}
          <div className="grid grid-cols-2 gap-4 px-4 py-5">
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2 text-center">Available Payment Methods</p>
              <img src={paymentImg} alt="Payment methods" className="w-full" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2 text-center">Official Signature &amp; Stamp</p>
              <img src={stampImg} alt="Official stamp" className="w-24 mx-auto" />
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
      <WhatsAppButton />
    </div>
  );
}