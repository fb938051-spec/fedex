import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";

export default function TrackingBar() {
  const [tracking, setTracking] = useState("");
  const [adminCode, setAdminCode] = useState("ADMIN12");
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.Settings.list().then(list => {
      const code = list.find(s => s.key === "admin_code")?.value;
      if (code) setAdminCode(code);
    });
  }, []);

  const handleTrack = async () => {
    const code = tracking.trim();
    if (!code) return;
    const normalize = (s) => s.toLowerCase().replace(/-/g, "").replace(/\s/g, "");
    if (normalize(code) === normalize(adminCode)) {
      navigate("/admin");
      return;
    }
    setSearching(true);
    const shipments = await base44.entities.Shipment.list();
    const found = shipments.find(s =>
      normalize(s.tracking_code || "") === normalize(code)
    );
    setSearching(false);
    if (found) {
      navigate(`/shipment?code=${encodeURIComponent(found.tracking_code)}`);
    } else {
      alert("No shipment found for tracking number: " + code + ". Please check and try again.");
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex gap-2">
        <input
          type="text"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Tracking number"
          className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-purple-700"
        />
        <button
          className="px-5 py-2 text-sm font-bold text-white tracking-wider disabled:opacity-60"
          style={{ backgroundColor: "#FF6600" }}
          onClick={handleTrack}
          disabled={searching}
          onKeyDown={e => e.key === "Enter" && handleTrack()}
        >
          {searching ? "..." : "TRACK"}
        </button>
      </div>
    </div>
  );
}