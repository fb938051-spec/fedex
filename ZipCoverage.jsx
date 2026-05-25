import { ChevronRight } from "lucide-react";

const coupleImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/4590a0a96_IMG-20260430-WA0183.jpg";

export default function ZipCoverage() {
  return (
    <div className="bg-white py-8 px-5">
      <div className="overflow-hidden shadow-sm">
        <img src={coupleImg} alt="Happy customers" className="w-full h-52 object-cover" />
        <div className="p-5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#FF6600] mb-1">We ship everywhere</p>
          <h2 className="text-lg font-black text-gray-900 mb-2">
            FedEx delivers to every US ZIP code daily, while most GPS services do not.
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Still not convinced? Take your pick from early morning, mid-morning, or afternoon delivery the next day. We deliver even where others cannot.
          </p>
          <a href="#" className="flex items-center gap-1 text-[#4D148C] font-bold text-xs hover:underline">
            SEE HOW CUSTOMERS CHOOSE FEDEX <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}