import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, BarChart2 } from "lucide-react";

const imgUrl = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80";

const perks = [
  { icon: DollarSign, title: "FedEx Rewards", desc: "Earn points on every shipment and redeem for discounts." },
  { icon: TrendingUp, title: "Volume Discounts", desc: "The more you ship, the more you save with our tiered pricing." },
  { icon: BarChart2, title: "Shipping Analytics", desc: "Understand your spend and optimize your logistics strategy." },
];

export default function BusinessSection() {
  return (
    <div className="bg-[#4D148C] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#FF6600] text-xs font-bold tracking-widest uppercase mb-3">Business Advantage</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              Turn shipping into a business advantage
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              From rewards programs to volume discounts and powerful analytics, FedEx helps businesses ship smarter and save more every single day.
            </p>
            <div className="space-y-5 mb-8">
              {perks.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#FF6600]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="bg-[#FF6600] hover:bg-orange-600 text-white rounded-none font-bold text-sm px-6 py-3 h-auto border-0">
              Open a Business Account
            </Button>
          </div>
          <div className="relative">
            <img src={imgUrl} alt="Business shipping" className="w-full h-80 object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}