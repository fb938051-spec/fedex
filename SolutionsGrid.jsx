import { ArrowRight } from "lucide-react";

const solutions = [
  {
    title: "FedEx Freight",
    desc: "Less-than-truckload and full truckload services for large automotive parts, machinery, and assembly components.",
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    tag: "Ground Freight",
  },
  {
    title: "FedEx International Priority",
    desc: "Time-definite delivery to 220+ countries with door-to-door customs clearance for global supply chains.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    tag: "Air Express",
  },
  {
    title: "Supply Chain Solutions",
    desc: "End-to-end logistics management including warehousing, fulfillment, and reverse logistics.",
    img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
    tag: "3PL & Warehousing",
  },
];

export default function SolutionsGrid() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-[#FF6600] text-xs font-bold tracking-widest uppercase mb-2">Our Services</p>
          <h2 className="text-3xl font-black text-gray-900">Built for every supply chain need</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <div key={s.title} className="bg-white group overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="overflow-hidden h-48">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-[#FF6600] tracking-widest uppercase">{s.tag}</span>
                <h3 className="text-lg font-black text-gray-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                <button className="flex items-center gap-2 text-[#4D148C] font-bold text-sm hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}