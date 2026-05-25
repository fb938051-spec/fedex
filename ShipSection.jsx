import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const imgUrl = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=80";

const points = [
  "Door-to-door delivery for automotive parts & components",
  "Temperature-controlled options for sensitive materials",
  "Real-time tracking and proactive notifications",
  "Customs brokerage for international shipments",
];

export default function ShipSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[#FF6600] text-xs font-bold tracking-widest uppercase mb-3">We Ship What Matters</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            Innovative solutions for complex supply chains
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            We understand the pressure to keep production lines running. Our automotive solutions are engineered to deliver speed, reliability, and end-to-end visibility across your entire supply chain.
          </p>
          <ul className="space-y-3 mb-8">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-[#FF6600] mt-0.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <Button className="bg-[#4D148C] hover:bg-purple-900 text-white rounded-none font-bold text-sm px-6 py-3 h-auto border-0">
            Explore Solutions
          </Button>
        </div>
        <div className="relative">
          <img src={imgUrl} alt="Supply chain worker" className="w-full h-80 object-cover" />
          <div className="absolute -bottom-4 -left-4 bg-[#FF6600] text-white p-4 w-40">
            <p className="text-2xl font-black">99.6%</p>
            <p className="text-xs font-medium leading-tight">On-time delivery rate globally</p>
          </div>
        </div>
      </div>
    </div>
  );
}