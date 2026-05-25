import { Globe, Clock, Package, Truck } from "lucide-react";

const stats = [
  { icon: Globe, value: "220+", label: "Countries & Territories Served" },
  { icon: Clock, value: "24/7", label: "Customer Support Available" },
  { icon: Package, value: "15M+", label: "Shipments Per Day" },
  { icon: Truck, value: "700+", label: "Aircraft in Fleet" },
];

export default function StatsSection() {
  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                <Icon className="w-5 h-5 text-[#4D148C]" />
              </div>
              <p className="text-2xl font-black text-[#4D148C]">{value}</p>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}