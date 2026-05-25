import { useState } from "react";
import ShipNowModal from "./modals/ShipNowModal";

const trackingImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/4a028aedb_IMG-20260430-WA0184.jpg";
const packagingImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/8b757b384_IMG-20260430-WA0185.jpg";

const cards = [
  {
    tag: "OWN THE POST-PURCHASE EXPERIENCE",
    img: trackingImg,
    desc: "Keep your customers informed and connected through personalized branded tracking that represents your business at every touchpoint.",
    link: "EXPLORE YOUR FORM",
  },
  {
    tag: "SHIP MORE, SAVE MORE",
    img: packagingImg,
    desc: "Using FedEx and shipping regularly? Loyalty pays off. Get free packaging, flat-rate 2-day shipping, and exclusive volume savings with FedEx One Rate.",
    link: "GET FREE PACKAGING",
  },
];

export default function BusinessAdvantage() {
  const [showShip, setShowShip] = useState(false);
  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-5 py-8">
        <h2 className="text-xl font-black text-gray-900 mb-8">Turn shipping into a business advantage</h2>
        <div className="space-y-10">
          {cards.map((c) => (
            <div key={c.tag}>
              <img src={c.img} alt={c.tag} className="w-full h-56 object-cover mb-4" />
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#4D148C" }}>{c.tag}</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{c.desc}</p>
              <button onClick={() => setShowShip(true)} className="text-xs font-bold tracking-widest hover:underline" style={{ color: "#4D148C" }}>
                {c.link}
              </button>
            </div>
          ))}
        </div>
      </div>
      {showShip && <ShipNowModal onClose={() => setShowShip(false)} />}
    </div>
  );
}