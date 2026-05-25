import { useState, useEffect } from "react";
import { Globe, Package, Truck, Users, Plane, Building2 } from "lucide-react";

const PACKAGES_PER_DAY = 16_000_000;
const PACKAGES_PER_SECOND = PACKAGES_PER_DAY / 86400;

function getLivePackageCount() {
  const now = new Date();
  const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  return Math.floor(secondsToday * PACKAGES_PER_SECOND);
}

function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  return n.toLocaleString();
}

export default function ShipmentStats() {
  const [liveCount, setLiveCount] = useState(getLivePackageCount());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(getLivePackageCount());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { label: "Countries Served", value: "220+", sub: "Worldwide coverage", icon: Globe, color: "#4D148C", bg: "bg-purple-50" },
    { label: "Packages Today", value: formatCount(liveCount), sub: "Live count • updates every sec", icon: Package, color: "#FF6600", bg: "bg-orange-50", live: true },
    { label: "Team Members", value: "500K+", sub: "Global workforce", icon: Users, color: "#1D4ED8", bg: "bg-blue-50" },
    { label: "Aircraft Fleet", value: "680+", sub: "Cargo planes", icon: Plane, color: "#0891B2", bg: "bg-cyan-50" },
    { label: "Vehicle Fleet", value: "200K+", sub: "Delivery vehicles", icon: Truck, color: "#16A34A", bg: "bg-green-50" },
    { label: "Global Facilities", value: "5,000+", sub: "Drop-off locations", icon: Building2, color: "#D97706", bg: "bg-yellow-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Globe className="w-6 h-6" style={{ color: "#4D148C" }} />
        <h2 className="text-2xl font-bold text-gray-900">FedEx Operations Overview</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5 ml-9">Trusted by millions — delivering the world's most important shipments.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statItems.map(({ label, value, sub, icon: Icon, color, bg, live }) => (
          <div key={label} className={`rounded-xl border shadow-sm p-5 flex items-center gap-4 ${bg} ${live ? "border-orange-300 ring-1 ring-orange-200" : "border-gray-200"}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 flex-shrink-0" style={{ borderColor: color }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-2xl font-black text-gray-900 tabular-nums">{value}</p>
                {live && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />}
              </div>
              <p className="text-xs font-bold text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}