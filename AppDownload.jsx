import { useState } from "react";
import ShipNowModal from "./modals/ShipNowModal";

const phoneImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/adcdf4996_IMG-20260430-WA0181.jpg";

export default function AppDownload() {
  const [showShip, setShowShip] = useState(false);
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-5 py-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">DOWNLOAD THE APP</p>
        <h2 className="text-xl font-black text-gray-900 mb-3">
          FedEx delivers to every US ZIP code every weekday, while most GPS services do not.
        </h2>
        <img src={phoneImg} alt="FedEx mobile app" className="w-full h-64 object-cover object-top mb-6" />
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Track shipments in real time, manage deliveries on the go, and receive smart delivery notifications — all from the palm of your hand.
        </p>
        <button
          onClick={() => setShowShip(true)}
          className="w-full py-3 text-sm font-bold text-white tracking-wide"
          style={{ backgroundColor: "#4D148C" }}
        >
          START SHIPPING NOW
        </button>
      {showShip && <ShipNowModal onClose={() => setShowShip(false)} />}
      </div>
    </div>
  );
}