import { useState } from "react";
import ShipNowModal from "./modals/ShipNowModal";

const employeeImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/c3faccd8c_IMG-20260430-WA0179.jpg";

const reasons = [
  {
    title: "Innovative solutions for reliability & speed",
    desc: "Whether it's across states or worldwide, we prioritize the secure and swift arrival of your shipments.",
  },
  {
    title: "Premium shipping at professional rates",
    desc: "When you need flawless delivery and careful handling, trust FedEx to get your items where they need to go on time.",
  },
  {
    title: "We ship everywhere*",
    desc: "From major cities to remote locations, your goods can reach worldwide.",
    note: "*FedEx doesn't directly ship everywhere but delivers to far more destinations. Visit fedex.com for details.",
  },
];

export default function WhyFedEx() {
  const [showShip, setShowShip] = useState(false);
  return (
    <div className="bg-white">
      <img src={employeeImg} alt="FedEx employee" className="w-full h-80 object-cover object-top" />
      <div className="max-w-5xl mx-auto px-5 py-8">
        <h2 className="text-xl font-black text-gray-900 mb-6">Why ship with FedEx?</h2>
        <div className="space-y-6">
          {reasons.map((r) => (
            <div key={r.title}>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{r.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{r.desc}</p>
              {r.note && <p className="text-xs text-gray-400 mt-1 leading-relaxed italic">{r.note}</p>}
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowShip(true)}
          className="mt-8 w-full py-3 text-sm font-bold text-white tracking-wide"
          style={{ backgroundColor: "#FF6600" }}
        >
          START SHIPPING NOW
        </button>
      {showShip && <ShipNowModal onClose={() => setShowShip(false)} />}
      </div>
    </div>
  );
}