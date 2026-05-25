import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Search, X, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import ShippingServicesModal from "./modals/ShippingServicesModal";

const menuSections = [
  {
    label: "Shipping",
    items: [
      "Create a Shipment",
      "Shipping Rates & Delivery Times",
      "Schedule & Manage Pickups",
      "Packing & Shipping Supplies",
      "International Shipping Guide",
      "Freight",
      "Manage a Return",
    ],
    cta: "ALL SHIPPING SERVICES",
  },
  {
    label: "Tracking",
    tracking: true,
    items: ["Advanced Shipment Tracking", "Manage Your Delivery"],
    cta: "ALL TRACKING SERVICES",
  },
  {
    label: "Design & Print",
    items: ["Explore Print, Products & Design", "Browse Services"],
    cta: "VISIT NEW MARKETPLACE",
  },
  {
    label: "Locations",
    items: ["Drop Off a Package"],
    cta: "FIND A LOCATION",
  },
  {
    label: "Support",
    items: ["Small Business Center", "FedEx Service Guide", "Account Management Tools", "Frequently Asked Questions", "File a Claim", "Billing & Invoicing"],
    cta: "CUSTOMER SUPPORT",
  },
];

const shippingTabMap = {
  "Create a Shipment": "create",
  "Shipping Rates & Delivery Times": "rates",
  "Schedule & Manage Pickups": "pickup",
  "Packing & Shipping Supplies": "supplies",
  "International Shipping Guide": "international",
  "Freight": "freight",
  "Manage a Return": "return",
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [adminCode, setAdminCode] = useState("ADMIN12");
  const [shippingModal, setShippingModal] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.Settings.list().then(list => {
      const code = list.find(s => s.key === "admin_code")?.value;
      if (code) setAdminCode(code);
    });
  }, []);

  const handleTrackSearch = async () => {
    const code = searchInput.trim();
    if (!code) return;
    const normalize = (s) => s.toLowerCase().replace(/-/g, "").replace(/\s/g, "");
    if (normalize(code) === normalize(adminCode)) {
      setSearchOpen(false);
      setSearchInput("");
      navigate("/admin");
      return;
    }
    const shipments = await base44.entities.Shipment.list();
    const found = shipments.find(s => normalize(s.tracking_code || "") === normalize(code));
    if (found) {
      setSearchOpen(false);
      setSearchInput("");
      navigate(`/shipment?code=${encodeURIComponent(found.tracking_code)}`);
    } else {
      alert("No shipment found for: " + code);
    }
  };

  const handleTrack = async () => {
    const code = trackingId.trim();
    if (!code) return;
    const normalize = (s) => s.toLowerCase().replace(/-/g, "").replace(/\s/g, "");
    if (normalize(code) === normalize(adminCode)) {
      setMenuOpen(false);
      navigate("/admin");
      return;
    }
    const shipments = await base44.entities.Shipment.list();
    const found = shipments.find(s => normalize(s.tracking_code || "") === normalize(code));
    if (found) {
      setMenuOpen(false);
      navigate(`/shipment?code=${encodeURIComponent(found.tracking_code)}`);
    } else {
      alert("No shipment found for: " + code);
    }
  };

  const toggleSection = (label) => {
    setOpenSection(openSection === label ? null : label);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-3xl font-black tracking-tight leading-none">
            <span style={{ color: "#4D148C" }}>Fed</span><span style={{ color: "#FF6600" }}>Ex</span>
            <span className="text-[#FF6600] text-sm font-black">.</span>
          </span>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => setSearchOpen(true)} />
            <button onClick={() => setMenuOpen(true)} className="flex flex-col gap-1 cursor-pointer p-1">
              <span className="block w-5 h-0.5 bg-gray-700"></span>
              <span className="block w-5 h-0.5 bg-gray-700"></span>
              <span className="block w-5 h-0.5 bg-gray-700"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="relative z-50 w-full max-w-md ml-auto bg-gray-50 h-full overflow-y-auto flex flex-col">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10" style={{ backgroundColor: "#4D148C" }}>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-3xl font-black tracking-tight leading-none">
                  <span className="text-white">Fed</span><span style={{ color: "#FF6600" }}>Ex</span>
                  <span style={{ color: "#FF6600" }} className="text-sm font-black">.</span>
                </span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setMenuOpen(false)}>
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              <div className="flex border-t border-purple-400">
                <input
                  type="text"
                  placeholder="Search or Tracking Numbers"
                  className="flex-1 bg-transparent text-white placeholder-purple-200 px-4 py-3 text-sm focus:outline-none italic"
                />
                <button className="px-4 border-l border-purple-400">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="flex-1">
              {menuSections.map((section) => {
                const isOpen = openSection === section.label;
                return (
                  <div key={section.label}>
                    <button
                      onClick={() => toggleSection(section.label)}
                      className={`w-full flex items-center justify-between px-5 py-4 text-left border-b border-gray-200 transition-colors ${
                        isOpen ? "text-white font-semibold underline" : "text-gray-800 font-medium"
                      }`}
                      style={isOpen ? { backgroundColor: "#4D148C" } : { backgroundColor: "white" }}
                    >
                      <span className="text-base">{section.label}</span>
                      {isOpen ? (
                        <ChevronUp className={`w-4 h-4 ${isOpen ? "text-white" : "text-gray-500"}`} />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="bg-white">
                        {section.tracking && (
                          <div className="px-5 py-4 border-b border-gray-200">
                            <p className="text-sm font-bold text-gray-900 mb-2">Tracking ID</p>
                            <input
                              type="text"
                              value={trackingId}
                              onChange={(e) => setTrackingId(e.target.value)}
                              placeholder="Tracking ID"
                              className="w-full border border-gray-400 px-3 py-2 text-sm italic text-gray-500 focus:outline-none mb-3"
                            />
                            <button
                              className="w-full py-3 text-white font-bold text-sm tracking-widest flex items-center justify-center gap-2"
                              onClick={handleTrack}
                            >
                              TRACK <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {section.items.map((item) =>
                          shippingTabMap[item] ? (
                            <button
                              key={item}
                              onClick={() => { setShippingModal(shippingTabMap[item]); setMenuOpen(false); }}
                              className="block w-full text-left px-5 py-4 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              {item}
                            </button>
                          ) : (
                            <a
                              key={item}
                              href="#"
                              className="block px-5 py-4 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              {item}
                            </a>
                          )
                        )}

                        {section.cta && (
                          <button
                            onClick={() => {
                              if (section.label === "Shipping") {
                                setShippingModal("create");
                                setMenuOpen(false);
                              }
                            }}
                            className="block w-full text-left px-5 py-4 text-sm font-bold border-b border-gray-200 hover:opacity-80 transition-colors"
                            style={{ color: "#0077C8" }}
                          >
                            {section.cta}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {shippingModal && (
        <ShippingServicesModal initialTab={shippingModal} onClose={() => setShippingModal(null)} />
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-black/20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Search Shipment</h2>
              <button onClick={() => { setSearchOpen(false); setSearchInput(""); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm mb-4 focus:outline-none focus:border-purple-600"
              onKeyDown={(e) => e.key === "Enter" && handleTrackSearch()}
            />
            <button
              onClick={handleTrackSearch}
              className="w-full py-2.5 text-sm font-bold text-white rounded-lg tracking-wide"
              style={{ backgroundColor: "#4D148C" }}
            >
              SEARCH
            </button>
          </div>
        </div>
      )}
    </>
  );
}