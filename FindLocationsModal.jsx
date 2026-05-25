import { useState } from "react";
import { X, MapPin, Search, Clock, Phone, Navigation } from "lucide-react";

const mockLocations = [
  { id: 1, name: "FedEx Ship Center", address: "123 Main St", city: "Downtown", distance: "0.3 mi", phone: "+1 (800) 463-3339", hours: "Mon–Fri: 8AM–8PM | Sat: 9AM–5PM | Sun: Closed", services: ["Drop Off", "Pick Up", "Packaging"], lat: 40.7128, lng: -74.0060 },
  { id: 2, name: "FedEx Office Print & Ship Center", address: "456 Commerce Blvd", city: "Midtown", distance: "0.8 mi", phone: "+1 (800) 463-3339", hours: "Mon–Fri: 7AM–10PM | Sat–Sun: 8AM–9PM", services: ["Drop Off", "Printing", "Packaging", "Self-Service"], lat: 40.7549, lng: -73.9840 },
  { id: 3, name: "FedEx Authorized ShipCenter", address: "789 Oak Avenue", city: "Uptown", distance: "1.2 mi", phone: "+1 (212) 555-0134", hours: "Mon–Sat: 9AM–7PM | Sun: 10AM–5PM", services: ["Drop Off", "Pick Up"], lat: 40.7831, lng: -73.9712 },
  { id: 4, name: "FedEx Drop Box", address: "101 Business Park Dr", city: "Business District", distance: "1.5 mi", phone: "N/A", hours: "24/7 Access", services: ["Drop Off Only"], lat: 40.7282, lng: -73.7949 },
  { id: 5, name: "FedEx Ship Center", address: "222 Harbor View Rd", city: "Waterfront", distance: "2.1 mi", phone: "+1 (800) 463-3339", hours: "Mon–Fri: 8AM–7PM | Sat: 9AM–4PM | Sun: Closed", services: ["Drop Off", "Pick Up", "Packaging", "Freight"], lat: 40.6892, lng: -74.0445 },
];

export default function FindLocationsModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setSearched(true);
  };

  const filtered = mockLocations.filter(l =>
    filter === "All" || l.services.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: "#4D148C" }}>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold text-lg">Find FedEx Locations</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>

        <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-600"
                placeholder="Enter city, zip code or address"
              />
            </div>
            <button type="submit" className="px-4 py-2 text-white font-bold rounded text-sm" style={{ backgroundColor: "#FF6600" }}>
              Search
            </button>
          </form>

          {searched && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {["All", "Drop Off", "Pick Up", "Printing", "Freight"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    filter === f ? "text-white border-purple-700" : "text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                  style={filter === f ? { backgroundColor: "#4D148C" } : {}}>
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {!searched ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <MapPin className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-semibold">Find locations near you</p>
              <p className="text-gray-400 text-sm mt-1">Enter your city, zip code, or address above to see nearby FedEx locations</p>
            </div>
          ) : selected ? (
            <div className="px-5 py-5 space-y-4">
              <button onClick={() => setSelected(null)} className="text-sm font-semibold flex items-center gap-1" style={{ color: "#4D148C" }}>
                ← Back to results
              </button>
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <p className="font-black text-gray-900 text-base">{selected.name}</p>
                <p className="text-sm text-gray-600 mt-1">{selected.address}, {selected.city}</p>
                <p className="text-xs font-semibold mt-2" style={{ color: "#FF6600" }}>{selected.distance} away</p>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">Hours</p>
                    {selected.hours.split("|").map((h, i) => (
                      <p key={i} className="text-xs text-gray-600">{h.trim()}</p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-600">{selected.phone}</p>
                </div>
                <div className="flex gap-3 items-start">
                  <Navigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">Available Services</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.services.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 font-semibold" style={{ color: "#4D148C" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(selected.address + " " + selected.city)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full py-3 text-white font-bold rounded text-sm flex items-center justify-center gap-2 mt-2"
                style={{ backgroundColor: "#4D148C" }}>
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <p className="px-4 py-3 text-xs text-gray-500">{filtered.length} locations found near "<span className="font-semibold">{query}</span>"</p>
              {filtered.map(loc => (
                <button key={loc.id} onClick={() => setSelected(loc)}
                  className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#F0E8FA" }}>
                        <MapPin className="w-4 h-4" style={{ color: "#4D148C" }} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{loc.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{loc.address}, {loc.city}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {loc.services.map(s => (
                            <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold" style={{ color: "#FF6600" }}>{loc.distance}</span>
                      <p className="text-xs text-gray-400 mt-1">Open</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}