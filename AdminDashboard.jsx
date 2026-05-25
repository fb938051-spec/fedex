import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Plus, Upload, Mail, Package, Truck, Clock, CheckCircle, XCircle, RefreshCw, Download, Settings } from "lucide-react";
import ShippingLabelModal from "../components/ShippingLabelModal";
import InvoiceModal from "../components/InvoiceModal";

// Generates a realistic FedEx-style reference number
// Format: PO-YYYYMMDD-XXXX (alphanumeric suffix)
function generateFedExReference() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `PO-${date}-${suffix}`;
}

// Generates a realistic FedEx-style tracking code
// Format: 96 (Ground prefix) + 18 random digits = 20 digits total
function generateFedExTrackingCode() {
  const prefix = "96";
  let digits = "";
  for (let i = 0; i < 18; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  // Insert spaces like real FedEx: XXXX XXXX XXXX XXXX XXXX
  const full = prefix + digits;
  return full.match(/.{1,4}/g).join(" ");
}

const emptyForm = {
  tracking_code: "", sender_name: "", sender_contact: "", sender_email: "", sender_address: "",
  receiver_name: "", receiver_contact: "", receiver_email: "", receiver_address: "",
  service_type: "", service_content: "", weight: "", quantity: "", shipment_mode: "",
  reference: "", shipping_date: "", expected_delivery: "", fee_type: "", clearance_fee: "",
  payment_status: "Pending", status: "In Transit", current_location: "", notes: "",
};

const fields = [
  { group: "Sender", fields: [
    { name: "sender_name", label: "Name" }, { name: "sender_contact", label: "Contact" },
    { name: "sender_email", label: "Email" }, { name: "sender_address", label: "Address" },
  ]},
  { group: "Receiver", fields: [
    { name: "receiver_name", label: "Name" }, { name: "receiver_contact", label: "Contact" },
    { name: "receiver_email", label: "Email" }, { name: "receiver_address", label: "Address" },
  ]},
  { group: "Shipment Info", fields: [
    { name: "tracking_code", label: "Tracking Code" },
    { name: "service_type", label: "Service Type", type: "select", options: [
      "FedEx First Overnight", "FedEx Priority Overnight", "FedEx Standard Overnight",
      "FedEx 2Day AM", "FedEx 2Day", "FedEx Express Saver",
      "FedEx Ground", "FedEx Home Delivery", "FedEx SmartPost",
      "FedEx International Priority", "FedEx International Economy",
      "FedEx International First", "FedEx International Ground",
      "FedEx Freight Priority", "FedEx Freight Economy", "FedEx Custom Critical",
    ]},
    { name: "service_content", label: "Service Content", type: "select", options: [
      "Documents", "Commercial Goods", "Electronics", "Clothing & Apparel",
      "Automotive Parts", "Medical Supplies", "Pharmaceuticals", "Food & Perishables",
      "Industrial Equipment", "Personal Effects", "Jewelry & Valuables",
      "Books & Publications", "Cosmetics & Beauty Products", "Furniture & Home Goods",
      "Toys & Games", "Sports Equipment", "Machinery & Tools", "Hazardous Materials",
      "Fragile / Glassware", "Computer & IT Equipment",
      "Car", "Motorcycle", "Bicycle", "Truck / Van", "Boat / Marine Vessel",
      "Aircraft Parts", "Heavy Equipment", "Vehicle Spare Parts",
      "Other",
    ]},
    { name: "weight", label: "Weight" },
    { name: "quantity", label: "Quantity", type: "select", options:
      Array.from({ length: 50 }, (_, i) => String(i + 1))
    },
    { name: "shipment_mode", label: "Shipment Mode", type: "select", options: [
      "Air Freight", "Sea Freight", "Road Freight", "Rail Freight",
      "Express Courier", "Standard Courier", "Same-Day Delivery",
      "Next-Day Delivery", "Multi-Modal", "Hand Carry",
    ]},
    { name: "reference", label: "Reference" },
    { name: "shipping_date", label: "Shipping Date" },
    { name: "expected_delivery", label: "Expected Delivery" },
    { name: "current_location", label: "Current Location" },
    { name: "clearance_fee", label: "Clearance Fee ($)" },
    { name: "notes", label: "Notes" },
  ]},
];

const FEE_TYPES = [
  "Shipment fee", "Delivery fee", "Handling fee", "Storage fee", "Holding fee",
  "Clearance fee", "Customs duty fee", "Import tax", "Warehouse fee", "Security fee",
  "Processing fee", "Release fee", "Documentation fee", "Service charge",
  "Late pickup fee", "Re-delivery fee", "Insurance fee", "Administrative fee",
  "Port handling fee", "Logistics fee", "Inspection fee", "Packaging fee",
  "Labeling fee", "Dispatch fee", "Freight charge", "Terminal handling fee",
  "Courier service fee", "Delivery confirmation fee", "Special handling fee",
  "Hazardous material fee", "Oversized package fee", "Remote area delivery fee",
  "Customs inspection fee", "Quarantine fee", "Duty processing fee",
  "Value-added tax (VAT)", "Brokerage fee", "Import processing fee",
  "Storage extension fee", "Parcel retention fee",
];

const STATUS_FILTERS = ["All", "In Transit", "On-Hold", "Delivered", "Cancelled"];

const statusBadge = (status) => {
  const map = {
    "In Transit": "bg-blue-100 text-blue-700",
    "On-Hold": "bg-orange-100 text-orange-700",
    "Delivered": "bg-green-100 text-green-700",
    "Cancelled": "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

export default function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [customServiceContent, setCustomServiceContent] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [viewShipment, setViewShipment] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [emailModal, setEmailModal] = useState(null);
  const [internalNote, setInternalNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [labelShipment, setLabelShipment] = useState(null);
  const [invoiceShipment, setInvoiceShipment] = useState(null);
  const [timelineEdit, setTimelineEdit] = useState(false);
  const [timelineForm, setTimelineForm] = useState({ status: "In Transit", location: "", comment: "", date: "", time: "" });
  const [shipmentTimeline, setShipmentTimeline] = useState([]);
  const [waEnabled, setWaEnabled] = useState(false);
  const [waNumber, setWaNumber] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminCodeConfirm, setAdminCodeConfirm] = useState("");
  const [adminCodeError, setAdminCodeError] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsIds, setSettingsIds] = useState({});

  const fetchShipments = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const data = await base44.entities.Shipment.list("-created_date");
      setShipments(data);
      setLastRefreshed(new Date());
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const list = await base44.entities.Settings.list();
      const ids = {};
      list.forEach(s => { ids[s.key] = s.id; });
      setSettingsIds(ids);
      setWaEnabled(list.find(s => s.key === "whatsapp_enabled")?.value === "true");
      setWaNumber(list.find(s => s.key === "whatsapp_number")?.value || "");
      setAdminCode(list.find(s => s.key === "admin_code")?.value || "");
    } catch {
      // settings load failure is non-critical
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const upsert = async (key, value) => {
      if (settingsIds[key]) {
        await base44.entities.Settings.update(settingsIds[key], { key, value });
      } else {
        const rec = await base44.entities.Settings.create({ key, value });
        setSettingsIds(prev => ({ ...prev, [key]: rec.id }));
      }
    };
    if (adminCode && adminCode !== adminCodeConfirm) {
      setAdminCodeError("Codes do not match");
      setSavingSettings(false);
      return;
    }
    setAdminCodeError("");
    await upsert("whatsapp_enabled", String(waEnabled));
    await upsert("whatsapp_number", waNumber);
    if (adminCode) await upsert("admin_code", adminCode);
    setSavingSettings(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleChange = (e) => {
    if (e.target.name === "service_content" && e.target.value !== "Other") {
      setCustomServiceContent("");
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitForm = form.service_content === "Other"
      ? { ...form, service_content: customServiceContent || "Other" }
      : form;
    setSaving(true);
    if (editId) {
      await base44.entities.Shipment.update(editId, submitForm);
    } else {
      await base44.entities.Shipment.create(submitForm);
    }
    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
    setCustomServiceContent("");
    fetchShipments();
  };

  const handleSaveNote = async () => {
    if (!viewShipment) return;
    setSavingNote(true);
    await base44.entities.Shipment.update(viewShipment.id, { internal_notes: internalNote });
    setSavingNote(false);
    setNoteSaved(true);
    setViewShipment(v => ({ ...v, internal_notes: internalNote }));
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleEdit = (s) => {
    setForm({ ...emptyForm, ...s });
    setEditId(s.id);
    setShowForm(true);
    setViewShipment(null);
  };

  const handleEditTimeline = (s) => {
    try {
      setShipmentTimeline(s.timeline ? JSON.parse(s.timeline) : []);
    } catch {
      setShipmentTimeline([]);
    }
    setTimelineEdit(s.id);
  };

  const addTimelineEvent = async () => {
    if (!timelineForm.status || !timelineForm.location || !timelineForm.date || !timelineForm.time) return;
    const newTimeline = [...shipmentTimeline, { ...timelineForm }];
    setShipmentTimeline(newTimeline);
    await base44.entities.Shipment.update(timelineEdit, { timeline: JSON.stringify(newTimeline) });
    setTimelineForm({ status: "In Transit", location: "", comment: "", date: "", time: "" });
    fetchShipments();
  };

  const removeTimelineEvent = async (idx) => {
    const newTimeline = shipmentTimeline.filter((_, i) => i !== idx);
    setShipmentTimeline(newTimeline);
    await base44.entities.Shipment.update(timelineEdit, { timeline: JSON.stringify(newTimeline) });
  };

  const closeTimelineEdit = () => {
    setTimelineEdit(false);
    setTimelineForm({ status: "In Transit", location: "", comment: "", date: "", time: "" });
    fetchShipments();
  };

  const handleDelete = async (id) => {
    await base44.entities.Shipment.delete(id);
    setDeleteConfirm(null);
    setViewShipment(null);
    fetchShipments();
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSendEmail = async () => {
    if (!emailModal?.to || !emailForm.subject || !emailForm.body) return;
    setEmailSending(true);
    await base44.integrations.Core.SendEmail({
      to: emailModal.to,
      subject: emailForm.subject,
      body: emailForm.body,
      from_name: "FedEx Admin",
    });
    setEmailSending(false);
    setEmailSent(true);
    setTimeout(() => {
      setEmailModal(null);
      setEmailForm({ subject: "", body: "" });
      setEmailSent(false);
    }, 1500);
  };

  const handleExportCSV = () => {
    const headers = ["Tracking Code","Sender","Sender Email","Receiver","Receiver Email","Status","Current Location","Shipping Date","Expected Delivery","Fee Type","Clearance Fee"];
    const rows = filtered.map(s => [
      s.tracking_code, s.sender_name, s.sender_email,
      s.receiver_name, s.receiver_email, s.status,
      s.current_location, s.shipping_date, s.expected_delivery,
      s.fee_type || "",
      s.clearance_fee ? `$${s.clearance_fee}` : "$0.00"
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "shipments.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === "In Transit").length,
    onHold: shipments.filter(s => s.status === "On-Hold").length,
    delivered: shipments.filter(s => s.status === "Delivered").length,
    cancelled: shipments.filter(s => s.status === "Cancelled").length,
  };

  const filtered = shipments.filter(s => {
    const matchFilter = activeFilter === "All" || s.status === activeFilter;
    const matchSearch =
      (s.tracking_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.sender_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.receiver_name || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black">
              <span style={{ color: "#4D148C" }}>Fed</span><span style={{ color: "#FF6600" }}>Ex</span>
            </span>
            <span className="text-gray-400 font-semibold text-sm">| Admin Panel</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={fetchShipments} className="flex items-center gap-1.5 px-3 py-2 rounded font-semibold text-sm text-gray-600 border border-gray-300 hover:bg-gray-50">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded font-semibold text-sm text-gray-600 border border-gray-300 hover:bg-gray-50">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button onClick={() => setShowSettings(true)} className="flex items-center gap-1.5 px-3 py-2 rounded font-semibold text-sm text-white border" style={{ backgroundColor: "#6B21A8", borderColor: "#6B21A8" }}>
              <Settings className="w-3.5 h-3.5" /> Settings
            </button>
            <button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyForm, tracking_code: generateFedExTrackingCode(), reference: generateFedExReference() }); setViewShipment(null); }} className="flex items-center gap-2 px-4 py-2 rounded font-bold text-sm text-white" style={{ backgroundColor: "#4D148C" }}>
              <Plus className="w-4 h-4" /> New Shipment
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">

        {/* KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Shipments", value: stats.total, icon: Package, color: "#4D148C", bg: "bg-purple-50" },
            { label: "In Transit", value: stats.inTransit, icon: Truck, color: "#1D4ED8", bg: "bg-blue-50" },
            { label: "On Hold", value: stats.onHold, icon: Clock, color: "#D97706", bg: "bg-orange-50" },
            { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "#16A34A", bg: "bg-green-50" },
            { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "#DC2626", bg: "bg-red-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-white shadow-sm px-4 py-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {fetchError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <span>⚠️ Failed to load shipments. Please check your connection.</span>
            <button onClick={fetchShipments} className="ml-auto px-3 py-1 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700">Retry</button>
          </div>
        )}
        {lastRefreshed && (
          <p className="text-xs text-gray-400 -mt-2">Last updated: {lastRefreshed.toLocaleTimeString()}</p>
        )}

        {/* Form */}
        {showForm && (
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-purple-200 flex items-center justify-between" style={{ backgroundColor: "#4D148C" }}>
              <h2 className="text-white font-bold text-base">{editId ? "Edit Shipment" : "Create New Shipment"}</h2>
              <button onClick={handleCancel} className="text-white text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: "#4D148C" }}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600">
                  {["In Transit","On-Hold","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {fields.map(({ group, fields: gFields }) => (
                <div key={group}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 border-b pb-1" style={{ color: "#4D148C", borderColor: "#e9d5ff" }}>{group}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {gFields.map(({ name, label, type, options }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                        {type === "select" ? (
                          <div>
                            <select name={name} value={form[name] || ""} onChange={handleChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600 bg-white">
                              <option value="">-- Select {label} --</option>
                              {options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            {name === "service_content" && form.service_content === "Other" && (
                              <input
                                type="text"
                                value={customServiceContent}
                                onChange={e => setCustomServiceContent(e.target.value)}
                                placeholder="Describe the content..."
                                className="w-full border border-purple-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600 mt-2"
                              />
                            )}
                          </div>
                        ) : (
                          <input name={name} value={form[name] || ""} onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" placeholder={label} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Fee Type */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2 border-b pb-1" style={{ color: "#4D148C", borderColor: "#e9d5ff" }}>Fee Information</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Fee Type</label>
                    <select name="fee_type" value={form.fee_type || ""} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600">
                      <option value="">-- Select Fee Type --</option>
                      {FEE_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Status</label>
                    <select name="payment_status" value={form.payment_status || "Pending"} onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600">
                      {["Pending", "Paid", "Partially Paid", "Overdue", "Waived"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2 border-b pb-1" style={{ color: "#4D148C", borderColor: "#e9d5ff" }}>Shipment Image</p>
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-400 transition-colors">
                  {form.image_url ? (
                    <img src={form.image_url} alt="Shipment" className="max-h-40 object-contain rounded" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Click to upload shipment image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const { file_url } = await base44.integrations.Core.UploadFile({ file });
                    setForm(f => ({ ...f, image_url: file_url }));
                  }} />
                </label>
                {form.image_url && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, image_url: "" }))}
                    className="mt-2 text-xs text-red-500 hover:underline">Remove image</button>
                )}
              </div>

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 text-sm font-bold rounded text-white disabled:opacity-60"
                  style={{ backgroundColor: "#4D148C" }}>
                  {saving ? "Saving..." : editId ? "Save Changes" : "Create Shipment"}
                </button>
                <button type="button" onClick={handleCancel}
                  className="flex-1 py-2.5 border border-gray-300 font-bold rounded text-sm text-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View Modal */}
        {viewShipment && !showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div className="rounded-lg border border-gray-200 w-full max-w-lg overflow-hidden bg-white shadow-xl">
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ backgroundColor: "#4D148C" }}>
                <div>
                  <h2 className="text-white font-bold">Shipment Details</h2>
                  <p className="text-purple-200 text-xs mt-0.5">{viewShipment.tracking_code}</p>
                </div>
                <button onClick={() => { setViewShipment(null); setNoteSaved(false); }} className="text-white font-bold text-xl">✕</button>
              </div>
              <div className="px-5 py-5 space-y-3 text-sm max-h-[65vh] overflow-y-auto">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-semibold">Status</span>
                  <span className={`ml-auto font-semibold text-xs px-3 py-1 rounded-full ${statusBadge(viewShipment.status)}`}>
                    {viewShipment.status}
                  </span>
                </div>
                {[
                  ["Tracking Code", viewShipment.tracking_code],
                  ["Sender", viewShipment.sender_name],
                  ["Sender Contact", viewShipment.sender_contact],
                  ["Sender Email", viewShipment.sender_email],
                  ["Sender Address", viewShipment.sender_address],
                  ["Receiver", viewShipment.receiver_name],
                  ["Receiver Contact", viewShipment.receiver_contact],
                  ["Receiver Email", viewShipment.receiver_email],
                  ["Receiver Address", viewShipment.receiver_address],
                  ["Service Type", viewShipment.service_type],
                  ["Service Content", viewShipment.service_content],
                  ["Weight", viewShipment.weight],
                  ["Quantity", viewShipment.quantity],
                  ["Shipment Mode", viewShipment.shipment_mode],
                  ["Reference", viewShipment.reference],
                  ["Shipping Date", viewShipment.shipping_date],
                  ["Expected Delivery", viewShipment.expected_delivery],
                  ["Current Location", viewShipment.current_location],
                  ["Fee Type", viewShipment.fee_type],
                  ["Clearance Fee", viewShipment.clearance_fee ? `$${viewShipment.clearance_fee}` : ""],
                  ["Notes", viewShipment.notes],
                ].map(([label, val]) => val ? (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 font-semibold">{label}</span>
                    <span className="text-right text-gray-900 font-medium max-w-[60%]">{val}</span>
                  </div>
                ) : null)}
                {viewShipment.image_url && (
                  <div className="pt-2">
                    <p className="text-gray-500 font-semibold mb-2">Shipment Image</p>
                    <img src={viewShipment.image_url} alt="Shipment" className="w-full rounded-lg border border-gray-200" />
                  </div>
                )}
                {/* Internal Notes */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4D148C" }}>🔒 Internal Notes</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Admin Only</span>
                  </div>
                  <textarea
                    value={internalNote}
                    onChange={e => setInternalNote(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600 resize-none bg-yellow-50"
                    placeholder="Add private notes for internal tracking (not visible to customers)..."
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={handleSaveNote} disabled={savingNote}
                      className="px-4 py-1.5 text-xs font-bold rounded text-white disabled:opacity-50"
                      style={{ backgroundColor: "#4D148C" }}
                    >{savingNote ? "Saving..." : "Save Note"}</button>
                    {noteSaved && <span className="text-green-600 text-xs font-semibold">✓ Saved</span>}
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 flex gap-2 border-t border-gray-100 flex-wrap">
                <button onClick={() => handleEdit(viewShipment)}
                  className="flex-1 py-2 text-sm font-bold rounded text-white" style={{ backgroundColor: "#4D148C" }}>Edit</button>
                <button onClick={() => handleEditTimeline(viewShipment)}
                  className="flex-1 py-2 text-sm font-bold rounded text-white bg-blue-600">Edit Timeline</button>
                {viewShipment.receiver_email && (
                  <button
                    onClick={() => {
                      setEmailModal({ to: viewShipment.receiver_email, name: viewShipment.receiver_name });
                      setEmailForm({ subject: `Update on your shipment ${viewShipment.tracking_code}`, body: "" });
                    }}
                    className="flex-1 py-2 text-sm font-bold rounded text-white flex items-center justify-center gap-1"
                    style={{ backgroundColor: "#FF6600" }}
                  ><Mail className="w-3.5 h-3.5" /> Email Receiver</button>
                )}
                {viewShipment.sender_email && (
                  <button
                    onClick={() => {
                      setEmailModal({ to: viewShipment.sender_email, name: viewShipment.sender_name });
                      setEmailForm({ subject: `Update on shipment ${viewShipment.tracking_code}`, body: "" });
                    }}
                    className="flex-1 py-2 text-sm font-bold rounded text-white flex items-center justify-center gap-1 bg-gray-500"
                  ><Mail className="w-3.5 h-3.5" /> Email Sender</button>
                )}
                <button onClick={() => setLabelShipment(viewShipment)}
                  className="flex-1 py-2 text-sm font-bold rounded text-white flex items-center justify-center gap-1 bg-indigo-600">
                  🏷️ Print Label</button>
                <button onClick={() => setInvoiceShipment(viewShipment)}
                  className="flex-1 py-2 text-sm font-bold rounded text-white flex items-center justify-center gap-1 bg-emerald-600">
                  📲 Invoice</button>
                <button onClick={() => setDeleteConfirm(viewShipment.id)}
                  className="flex-1 py-2 text-sm font-bold rounded text-white bg-red-500">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: "#4D148C" }}>
            <p className="text-purple-200 text-sm">Manage <span className="text-white font-semibold">All Shipments</span></p>
          </div>

          <div className="flex overflow-x-auto border-b border-gray-200 bg-white">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => { setActiveFilter(f); setPage(1); }}
                className={`flex-shrink-0 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  activeFilter === f ? "border-purple-700 text-purple-700" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                {f}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeFilter === f ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {f === "All" ? shipments.length : shipments.filter(s => s.status === f).length}
                </span>
              </button>
            ))}
          </div>

          <div className="px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border border-gray-300 text-gray-700 rounded px-2 py-1 text-sm focus:outline-none">
                {[5, 10, 25, 50].map(n => <option key={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Search:</span>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded pl-7 pr-3 py-1 text-sm focus:outline-none focus:border-purple-600 w-44"
                  placeholder="Search..." />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">#</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Tracking Code</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Sender</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Receiver</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Service</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Fee Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Clearance Fee</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">Loading shipments...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">No shipments found</td></tr>
                ) : paginated.map((s, idx) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-gray-800 font-mono font-semibold text-xs">{s.tracking_code}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: "#4D148C" }}>
                          {(s.sender_name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-800 font-semibold text-xs">{s.sender_name || "—"}</p>
                          {s.sender_email && <p className="text-gray-400 text-xs">{s.sender_email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 bg-orange-500">
                          {(s.receiver_name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-800 font-semibold text-xs">{s.receiver_name || "—"}</p>
                          {s.receiver_email && <p className="text-gray-400 text-xs">{s.receiver_email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{s.service_type || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{s.fee_type || "—"}</td>
                    <td className="px-4 py-3 text-gray-700 font-semibold text-xs">{s.clearance_fee ? `$${s.clearance_fee}` : "$0.00"}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-xs px-2 py-1 rounded-full ${statusBadge(s.status)}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setViewShipment(s); setInternalNote(s.internal_notes || ""); setNoteSaved(false); }}
                        className="px-3 py-1.5 rounded text-xs font-bold border-2 transition-colors"
                        style={{ borderColor: "#4D148C", color: "#4D148C" }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#4D148C"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#4D148C"; }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 bg-gray-50">
            <p className="text-gray-500 text-sm">
              Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <PagBtn label="«" onClick={() => setPage(1)} disabled={page === 1} />
              <PagBtn label="‹" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const n = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return <PagBtn key={n} label={String(n)} onClick={() => setPage(n)} active={page === n} />;
              })}
              {totalPages > 5 && page < totalPages - 2 && <span className="text-gray-400 px-1">…</span>}
              {totalPages > 5 && <PagBtn label={String(totalPages)} onClick={() => setPage(totalPages)} active={page === totalPages} />}
              <PagBtn label="›" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
              <PagBtn label="»" onClick={() => setPage(totalPages)} disabled={page === totalPages} />
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-4">
          <div className="rounded-lg border border-gray-200 w-full max-w-md bg-white shadow-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "#4D148C" }}>
              <div>
                <h2 className="text-white font-bold">Send Email</h2>
                <p className="text-purple-200 text-xs mt-0.5">To: {emailModal.name} ({emailModal.to})</p>
              </div>
              <button onClick={() => { setEmailModal(null); setEmailForm({ subject: "", body: "" }); }} className="text-white font-bold text-xl">✕</button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <input value={emailForm.subject} onChange={e => setEmailForm(f => ({ ...f, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600" placeholder="Email subject" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                <textarea value={emailForm.body} onChange={e => setEmailForm(f => ({ ...f, body: e.target.value }))}
                  rows={6} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600 resize-none"
                  placeholder="Write your message here..." />
              </div>
              {emailSent && <p className="text-green-600 text-sm font-semibold text-center">✓ Email sent successfully!</p>}
              <div className="flex gap-3">
                <button onClick={handleSendEmail} disabled={emailSending || !emailForm.subject || !emailForm.body}
                  className="flex-1 py-2 text-sm font-bold rounded text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: "#4D148C" }}>
                  <Mail className="w-4 h-4" />{emailSending ? "Sending..." : "Send Email"}
                </button>
                <button onClick={() => { setEmailModal(null); setEmailForm({ subject: "", body: "" }); }}
                  className="flex-1 py-2 border border-gray-300 font-bold rounded text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="rounded-lg border border-gray-200 w-full max-w-md bg-white shadow-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "#4D148C" }}>
              <h2 className="text-white font-bold">App Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-white font-bold text-xl">✕</button>
            </div>
            <div className="px-5 py-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#25D366" }}>
                    <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.752-1.797A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.5a9.44 9.44 0 01-4.8-1.305l-.344-.205-4.6 1.065 1.1-4.477-.225-.356A9.5 9.5 0 016.5 15c0-5.247 4.253-9.5 9.5-9.5S25.5 9.753 25.5 15 21.247 24.5 16 24.5zm5.2-6.965c-.285-.143-1.686-.832-1.948-.927-.261-.095-.452-.143-.642.143-.19.285-.736.927-.902 1.118-.166.19-.332.214-.617.071-.285-.143-1.204-.444-2.293-1.417-.847-.756-1.42-1.69-1.586-1.975-.166-.285-.018-.44.125-.582.128-.127.285-.332.428-.499.143-.166.19-.285.285-.475.095-.19.048-.357-.024-.499-.071-.143-.642-1.547-.879-2.118-.232-.556-.467-.48-.642-.489l-.547-.01c-.19 0-.499.071-.761.357-.261.285-1 .975-1 2.38s1.024 2.762 1.167 2.952c.143.19 2.015 3.077 4.883 4.314.683.295 1.215.471 1.63.603.685.217 1.31.187 1.804.113.55-.082 1.686-.689 1.924-1.355.238-.666.238-1.237.166-1.355-.07-.118-.261-.19-.547-.332z"/>
                    </svg>
                  </div>
                  <p className="font-bold text-gray-800">WhatsApp Button</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 mb-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Show WhatsApp Button</p>
                    <p className="text-xs text-gray-500 mt-0.5">Displays a floating chat button on customer pages</p>
                  </div>
                  <button onClick={() => setWaEnabled(v => !v)}
                    className="relative w-12 h-6 rounded-full transition-colors focus:outline-none"
                    style={{ backgroundColor: waEnabled ? "#25D366" : "#D1D5DB" }}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${waEnabled ? "translate-x-6" : ""}`} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp Number</label>
                  <input value={waNumber} onChange={e => setWaNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                    placeholder="e.g. +2348012345678" />
                  <p className="text-xs text-gray-400 mt-1">Include country code (e.g. +1 for USA, +234 for Nigeria)</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-bold text-gray-800">Admin Access Code</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">New Admin Code</label>
                    <input type="password" value={adminCode}
                      onChange={e => { setAdminCode(e.target.value); setAdminCodeError(""); }}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                      placeholder="Enter new admin code" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Admin Code</label>
                    <input type="password" value={adminCodeConfirm}
                      onChange={e => { setAdminCodeConfirm(e.target.value); setAdminCodeError(""); }}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                      placeholder="Re-enter admin code" />
                  </div>
                  {adminCodeError && <p className="text-red-500 text-xs font-semibold">{adminCodeError}</p>}
                  <p className="text-xs text-gray-400">Leave blank to keep the current code unchanged.</p>
                </div>
              </div>

              {settingsSaved && <p className="text-green-600 text-sm font-semibold text-center">✓ Settings saved!</p>}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button onClick={saveSettings} disabled={savingSettings}
                  className="flex-1 py-2.5 text-sm font-bold rounded text-white disabled:opacity-50"
                  style={{ backgroundColor: "#4D148C" }}>{savingSettings ? "Saving..." : "Save Settings"}</button>
                <button onClick={() => setShowSettings(false)}
                  className="flex-1 py-2.5 border border-gray-300 font-bold rounded text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {timelineEdit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="rounded-lg border border-gray-200 w-full max-w-md bg-white shadow-xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ backgroundColor: "#4D148C" }}>
              <h2 className="text-white font-bold">Edit Shipment Timeline</h2>
              <button onClick={closeTimelineEdit} className="text-white font-bold text-xl">✕</button>
            </div>
            <div className="px-5 py-5 overflow-y-auto flex-1 space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Timeline Events</p>
                {shipmentTimeline.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {shipmentTimeline.map((evt, idx) => {
                      const statusColor = evt.status === "Delivered" ? "#22c55e" : evt.status === "On-Hold" ? "#f97316" : evt.status === "In Transit" ? "#3b82f6" : "#ef4444";
                      return (
                        <div key={idx} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-start">
                          <div className="text-xs flex-1">
                            <p className="font-semibold" style={{ color: statusColor }}>{evt.status}</p>
                            <p className="text-gray-600">{evt.location}</p>
                            <p className="text-gray-500">{evt.date} {evt.time}</p>
                            {evt.comment && <p className="text-gray-600 italic mt-1">{evt.comment}</p>}
                          </div>
                          <button onClick={() => removeTimelineEvent(idx)} className="text-red-500 font-bold text-sm ml-2">×</button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-4">No events yet</p>
                )}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs font-bold text-gray-700 mb-3">Add Event</p>
                <div className="space-y-2">
                  <select value={timelineForm.status} onChange={e => setTimelineForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
                    {["In Transit", "On-Hold", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <input type="text" placeholder="Location" value={timelineForm.location}
                    onChange={e => setTimelineForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none" />
                  <input type="text" placeholder="Comment" value={timelineForm.comment}
                    onChange={e => setTimelineForm(f => ({ ...f, comment: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none" />
                  <input type="date" value={timelineForm.date}
                    onChange={e => setTimelineForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none" />
                  <input type="time" value={timelineForm.time}
                    onChange={e => setTimelineForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none" />
                  <button onClick={addTimelineEvent}
                    className="w-full py-2 text-xs font-bold rounded text-white" style={{ backgroundColor: "#4D148C" }}>
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {labelShipment && (
        <ShippingLabelModal shipment={labelShipment} onClose={() => setLabelShipment(null)} />
      )}

      {invoiceShipment && (
        <InvoiceModal shipment={invoiceShipment} onClose={() => setInvoiceShipment(null)} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="rounded-lg border border-gray-200 p-6 max-w-sm w-full bg-white shadow-xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Shipment?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 bg-red-500 text-white font-bold rounded text-sm">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-300 font-bold rounded text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PagBtn({ label, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-8 h-8 rounded text-sm font-semibold transition-colors
        ${active ? "text-white" : "text-gray-500 hover:text-gray-800"}
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
      style={active ? { backgroundColor: "#4D148C" } : {}}
    >
      {label}
    </button>
  );
}