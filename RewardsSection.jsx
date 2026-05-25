import { useState } from "react";
import ShipNowModal from "./modals/ShipNowModal";

const coupleImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/d5d30bfed_IMG-20260430-WA0183.jpg";
const giftCardsImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/375a98b5c_IMG-20260430-WA0186.jpg";

export default function RewardsSection() {
  const [showShip, setShowShip] = useState(false);
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Ship a Return / Rewards lifestyle */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#4D148C" }}>SHIP A RETURN, IMPACT</p>
          <img src={coupleImg} alt="FedEx rewards lifestyle" className="w-full h-52 object-cover mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            At FedEx, rewards are a gift from us to you. Earn FedEx points with every shipment and redeem them for gift cards at your favorite retailers.
          </p>
          <button onClick={() => setShowShip(true)} className="text-xs font-bold tracking-widest hover:underline" style={{ color: "#4D148C" }}>
            OPEN FREE ACCOUNT
          </button>
        </div>

        {/* Partner gift cards */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#4D148C" }}>SHIP WITH OUR RETAIL PARTNERS</p>
          <img src={giftCardsImg} alt="FedEx reward partner gift cards" className="w-full h-48 object-cover mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Redeem your FedEx Rewards points for gift cards from top brands like Target, Lowe's, and Starbucks.
          </p>
        </div>

        {/* Terms */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-xs font-bold text-gray-700 mb-2">Terms and surcharge changes</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Learn more about{" "}
            <a href="#" className="underline" style={{ color: "#4D148C" }}>FedEx service terms and conditions</a>.
            {" "}Check{" "}
            <a href="#" className="underline" style={{ color: "#4D148C" }}>latest surcharges</a>
            {" "}for current rate information. Also visit our{" "}
            <a href="#" className="underline" style={{ color: "#4D148C" }}>FedEx Tariff and Terms</a>.
          </p>
        </div>
      </div>
      {showShip && <ShipNowModal onClose={() => setShowShip(false)} />}
    </div>
  );
}