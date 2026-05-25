import { useState } from "react";
import { FileText, Package, MapPin, Phone, ChevronRight, Info } from "lucide-react";

const autoPartsImg = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80";

const quickLinks = [
  { icon: FileText, label: "Get a quote" },
  { icon: Package, label: "Ship now" },
  { icon: MapPin, label: "Find FedEx locations" },
  { icon: Phone, label: "Contact support" },
];

export default function HeroSection() {
  const [tracking, setTracking] = useState("");

  return (
    <div>
      {/* Hero Image + Text */}
      <div className="relative">
        <img src={autoPartsImg} alt="Automotive parts" className="w-full h-56 object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent flex flex-col justify-center px-5">
          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-sm">
            Keep your automotive supply chain moving
          </h1>
          <p className="text-white/80 text-xs mt-2 max-w-xs leading-relaxed">
            From tires to transmissions, FedEx handles every part. Reach customers fast with flexible delivery options and logistics that can go with you.
          </p>
        </div>
      </div>

      {/* Gear Up to Ship */}
      <div className="bg-white px-5 pt-6 pb-2">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Gear up to ship</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quickLinks.map(({ icon: Icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-[#4D148C]/10 flex items-center justify-center group-hover:bg-[#4D148C]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#4D148C]" />
              </div>
              <span className="text-[10px] text-center text-gray-700 font-medium leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* Tracking */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="Tracking number"
            className="flex-1 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#4D148C] rounded-sm"
          />
          <button className="bg-[#FF6600] text-white text-sm font-bold px-5 py-2.5 hover:bg-orange-600 transition-colors rounded-sm">
            TRACK
          </button>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 p-3 rounded-sm text-xs text-blue-800">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
          <p>
            US Supreme Court Tariff Updates.{" "}
            <a href="#" className="underline font-semibold text-blue-700">See how this may affect you</a>
          </p>
        </div>
      </div>
    </div>
  );
}