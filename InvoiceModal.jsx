import { useRef } from "react";
import { X, Printer } from "lucide-react";

export default function InvoiceModal({ shipment, onClose }) {
  const invoiceRef = useRef(null);

  const invoiceNumber = `INV-${shipment.tracking_code?.replace(/\s/g, "").slice(-8) || "00000000"}`;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const dueDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const amount = shipment.clearance_fee ? Number(shipment.clearance_fee) : 0;
  const tax = +(amount * 0.0).toFixed(2);
  const total = +(amount + tax).toFixed(2);

  const handlePrint = () => {
    const content = invoiceRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=1100");
    win.document.write(`
      <html>
        <head>
          <title>FedEx Invoice – ${invoiceNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
            body { background: white; padding: 40px; color: #1a1a1a; }
            .invoice { max-width: 700px; margin: 0 auto; }
          </style>
        </head>
        <body><div class="invoice">${content}</div></body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const s = shipment;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ backgroundColor: "#4D148C" }}>
          <h2 className="text-white font-bold">Invoice Preview</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>

        {/* Invoice preview */}
        <div className="overflow-y-auto flex-1 p-4 bg-gray-100">
          <div ref={invoiceRef} className="bg-white p-8 mx-auto shadow-sm" style={{ maxWidth: "640px", fontFamily: "Arial, sans-serif" }}>

            {/* Top header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-3xl font-black leading-none">
                  <span style={{ color: "#4D148C" }}>Fed</span><span style={{ color: "#FF6600" }}>Ex</span>
                </span>
                <p className="text-xs text-gray-500 mt-1">1261 S Seward Meridian, Missouri, USA</p>
                <p className="text-xs text-gray-500">support@fedex.com | +1(333) 222-5555</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-800 uppercase tracking-widest">Invoice</p>
                <p className="text-sm font-bold text-gray-600 mt-1">{invoiceNumber}</p>
                <p className="text-xs text-gray-400 mt-1">Date: {today}</p>
                <p className="text-xs text-gray-400">Due: {dueDate}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-1 rounded mb-6" style={{ background: "linear-gradient(to right, #4D148C, #FF6600)" }} />

            {/* Bill To / Ship To */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
                <p className="font-bold text-gray-900">{s.receiver_name || "—"}</p>
                {s.receiver_email && <p className="text-xs text-gray-500">{s.receiver_email}</p>}
                {s.receiver_contact && <p className="text-xs text-gray-500">{s.receiver_contact}</p>}
                <p className="text-xs text-gray-600 mt-1">{s.receiver_address || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Shipped By</p>
                <p className="font-bold text-gray-900">{s.sender_name || "—"}</p>
                {s.sender_email && <p className="text-xs text-gray-500">{s.sender_email}</p>}
                {s.sender_contact && <p className="text-xs text-gray-500">{s.sender_contact}</p>}
                <p className="text-xs text-gray-600 mt-1">{s.sender_address || "—"}</p>
              </div>
            </div>

            {/* Shipment Info */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs">
              {[
                ["Tracking Code", s.tracking_code],
                ["Reference", s.reference],
                ["Service Type", s.service_type],
                ["Shipment Mode", s.shipment_mode],
                ["Ship Date", s.shipping_date],
                ["Est. Delivery", s.expected_delivery],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-gray-400 font-bold uppercase tracking-wide">{label}</p>
                  <p className="font-semibold text-gray-800">{val || "—"}</p>
                </div>
              ))}
            </div>

            {/* Line items table */}
            <table className="w-full text-sm mb-6 border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#4D148C" }}>
                  <th className="text-left text-white text-xs font-bold px-3 py-2 rounded-tl">Description</th>
                  <th className="text-center text-white text-xs font-bold px-3 py-2">Qty</th>
                  <th className="text-right text-white text-xs font-bold px-3 py-2 rounded-tr">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-3 py-3 text-gray-800">
                    <p className="font-semibold">{s.fee_type || "Shipment Fee"}</p>
                    {s.service_content && <p className="text-xs text-gray-500">{s.service_content}</p>}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-600">{s.quantity || 1}</td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-800">
                    ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-56 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-black text-base">
                  <span>Total Due</span>
                  <span style={{ color: "#4D148C" }}>${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Payment status */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-gray-500 font-semibold">Payment Status:</span>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                shipment.payment_status === "Paid" ? "text-green-700 border-green-400 bg-green-50" :
                shipment.payment_status === "Overdue" ? "text-red-700 border-red-400 bg-red-50" :
                "text-orange-600 border-orange-400 bg-orange-50"
              }`}>{s.payment_status || "Pending"}</span>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
              <p>Thank you for choosing <strong style={{ color: "#4D148C" }}>FedEx</strong>. Please include the invoice number with your payment.</p>
              <p className="mt-1">© {new Date().getFullYear()} FedEx. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={handlePrint}
            className="flex-1 py-2.5 text-sm font-bold rounded text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "#4D148C" }}>
            <Printer className="w-4 h-4" /> Print / Save PDF
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