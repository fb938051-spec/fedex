import { useState } from "react";
import ShipNowModal from "./modals/ShipNowModal";
import GetQuoteModal from "./modals/GetQuoteModal";

const stairsImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/6b5a22c24_IMG-20260430-WA0180.jpg";

const options = [
  {
    tag: "WHEN TIME IS TIGHT",
    title: "Overnight",
    desc: "Important last-minute shipment? Tax deadline tomorrow? Take your package from early morning, mid-morning, or afternoon delivery the next calendar day.",
    link: "SHIP OVERNIGHT",
  },
  {
    tag: "WALLET-FRIENDLY SHIPPING",
    title: "FedEx One Rate",
    desc: "Get flat-rate 2-day shipping for packages up to 50 lbs. Simple, predictable pricing for your business needs.",
    link: "GET RATES",
  },
];

export default function DeliveryOptions() {
  const [modal, setModal] = useState(null);
  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-5 py-8">
        <h2 className="text-xl font-black text-gray-900 mb-6">Delivery options built for busy schedules</h2>
        <img src={stairsImg} alt="FedEx delivery on the go" className="w-full h-56 object-cover mb-6" />
        <div className="space-y-8">
          {options.map((o) => (
            <div key={o.title}>
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">{o.tag}</p>
              <h3 className="text-lg font-black text-gray-900 mb-2">{o.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{o.desc}</p>
              <button
                onClick={() => setModal(o.link === "GET RATES" ? "quote" : "ship")}
                className="text-sm font-bold tracking-wider hover:underline" style={{ color: "#4D148C" }}
              >
                {o.link}
              </button>
            </div>
          ))}
        </div>
      </div>
      {modal === "ship" && <ShipNowModal onClose={() => setModal(null)} />}
      {modal === "quote" && <GetQuoteModal onClose={() => setModal(null)} />}
    </div>
  );
}