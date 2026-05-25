import { useState } from "react";
import { FileText, Package, MapPin, Headphones } from "lucide-react";
import GetQuoteModal from "./modals/GetQuoteModal";
import ShipNowModal from "./modals/ShipNowModal";
import FindLocationsModal from "./modals/FindLocationsModal";
import ContactSupportModal from "./modals/ContactSupportModal";

const actions = [
  { icon: FileText, label: "Get a quote", key: "quote" },
  { icon: Package, label: "Ship now", key: "ship" },
  { icon: MapPin, label: "Find FedEx locations", key: "locations" },
  { icon: Headphones, label: "Contact support", key: "support" },
];

export default function QuickActions() {
  const [modal, setModal] = useState(null);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest py-3">Gear up to ship</p>
        <div className="grid grid-cols-4 gap-2 pb-4">
          {actions.map(({ icon: Icon, label, key }) => (
            <button key={key} onClick={() => setModal(key)} className="flex flex-col items-center gap-2 group">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:opacity-80"
                style={{ backgroundColor: "#F0E8FA" }}
              >
                <Icon className="w-6 h-6" style={{ color: "#4D148C" }} />
              </div>
              <span className="text-xs text-gray-700 text-center leading-tight font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {modal === "quote" && <GetQuoteModal onClose={() => setModal(null)} />}
      {modal === "ship" && <ShipNowModal onClose={() => setModal(null)} />}
      {modal === "locations" && <FindLocationsModal onClose={() => setModal(null)} />}
      {modal === "support" && <ContactSupportModal onClose={() => setModal(null)} />}
    </div>
  );
}