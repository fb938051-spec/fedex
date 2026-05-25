import { useRef } from "react";
import { X, Printer } from "lucide-react";

function Barcode({ code }) {
  return (
    <div className="text-center my-2">
      <svg viewBox="0 0 300 60" className="w-full max-w-xs mx-auto" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 80 }).map((_, i) => (
          <rect key={i} x={i * 3.5 + 10} y={0} width={i % 3 === 0 ? 2.5 : 1.5} height={50} fill="black" />
        ))}
      </svg>
      <p className="text-xs font-mono tracking-widest mt-1">{code}</p>
    </div>
  );
}

export default function ShippingLabelModal({ shipment, onClose }) {
  const labelRef = useRef(null);

  const handlePrint = () => {
    const content = labelRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(`
      <html>
        <head>
          <title>FedEx Shipping Label – ${shipment.tracking_code}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
            body { background: white; padding: 20px; }
            .label { border: 2px solid #000; width: 4in; min-height: 6in; padding: 12px; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
            .fedex { font-size: 28px; font-weight: 900; }
            .fedex .fed { color: #4D148C; } .fedex .ex { color: #FF6600; }
            .service-badge { background: #4D148C; color: white; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; }
            .section { margin-bottom: 10px; }
            .section-title { font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 4px; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
            .address-block { font-size: 12px; line-height: 1.6; }
            .name { font-size: 14px; font-weight: bold; }
            .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .field-label { font-size: 9px; color: #666; font-weight: bold; text-transform: uppercase; }
            .field-value { font-size: 11px; font-weight: 600; }
            .barcode-area { border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 8px 0; text-align: center; }
            .barcode-area svg { width: 240px; }
            .tracking-num { font-size: 22px; font-weight: 900; letter-spacing: 2px; text-align: center; margin-top: 4px; }
            .footer { font-size: 8px; color: #999; text-align: center; margin-top: 8px; }
            .status-badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 10px; font-weight: bold; }
          </style>
        </head>
        <body><div class="label">${content}</div></body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const s = shipment;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ backgroundColor: "#4D148C" }}>
          <h2 className="text-white font-bold">Shipping Label Preview</h2>
          <button onClick={onClose} className="text-white font-bold text-xl"><X className="w-5 h-5" /></button>
        </div>

        {/* Label preview */}
        <div className="overflow-y-auto flex-1 p-4 bg-gray-100">
          <div ref={labelRef} className="border-2 border-black bg-white p-4 mx-auto" style={{ width: "100%", maxWidth: "384px", fontFamily: "Arial, sans-serif" }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <span className="text-2xl font-black leading-none">
                <span style={{ color: "#4D148C" }} className="fed">Fed</span><span style={{ color: "#FF6600" }} className="ex">Ex</span>
              </span>
              <span className="service-badge text-xs font-bold px-3 py-1 rounded text-white" style={{ backgroundColor: "#4D148C" }}>
                {s.service_type || "EXPRESS"}
              </span>
            </div>

            {/* From */}
            <div className="section mb-3">
              <p className="section-title text-xs font-bold uppercase text-gray-500 tracking-widest border-b border-gray-200 pb-1 mb-1">From</p>
              <div className="address-block text-sm">
                <p className="name font-bold text-gray-900">{s.sender_name || "—"}</p>
                {s.sender_contact && <p className="text-gray-600 text-xs">{s.sender_contact}</p>}
                <p className="text-gray-700 text-xs mt-0.5">{s.sender_address || "—"}</p>
              </div>
            </div>

            {/* To */}
            <div className="section mb-3 bg-gray-50 p-2 rounded border border-gray-300">
              <p className="section-title text-xs font-bold uppercase text-gray-500 tracking-widest border-b border-gray-200 pb-1 mb-1">Ship To</p>
              <div className="address-block text-sm">
                <p className="name font-bold text-gray-900 text-base">{s.receiver_name || "—"}</p>
                {s.receiver_contact && <p className="text-gray-600 text-xs">{s.receiver_contact}</p>}
                <p className="text-gray-700 text-xs mt-0.5">{s.receiver_address || "—"}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              {[
                ["Service", s.service_type],
                ["Mode", s.shipment_mode],
                ["Weight", s.weight],
                ["Qty", s.quantity],
                ["Content", s.service_content],
                ["Ship Date", s.shipping_date],
                ["Est. Delivery", s.expected_delivery],
                ["Reference", s.reference],
              ].map(([label, val]) => val ? (
                <div key={label}>
                  <p className="field-label text-gray-400 font-bold uppercase text-xs">{label}</p>
                  <p className="field-value font-semibold text-gray-800 text-xs">{val}</p>
                </div>
              ) : null)}
            </div>

            {/* Barcode */}
            <div className="barcode-area border-t-2 border-b-2 border-black py-2">
              <svg viewBox="0 0 300 60" style={{ width: "240px", display: "block", margin: "0 auto" }} xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 80 }).map((_, i) => (
                  <rect key={i} x={i * 3.5 + 10} y={0} width={i % 3 === 0 ? 2.5 : 1.5} height={50} fill="black" />
                ))}
              </svg>
              <p className="tracking-num text-center font-black text-lg tracking-widest mt-1">{s.tracking_code}</p>
            </div>

            {/* Status + footer */}
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                s.status === "Delivered" ? "bg-green-100 text-green-700" :
                s.status === "On-Hold" ? "bg-orange-100 text-orange-700" :
                s.status === "In Transit" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
              }`}>{s.status}</span>
              <p className="text-xs text-gray-400">fedex.com | +1(333) 222-5555</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={handlePrint}
            className="flex-1 py-2.5 text-sm font-bold rounded text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "#4D148C" }}>
            <Printer className="w-4 h-4" /> Print Label
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 font-bold rounded text-sm text-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}