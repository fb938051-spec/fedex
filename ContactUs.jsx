import { useState } from "react";
import { ChevronRight, Info, Package, RotateCcw, FileText, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import PageFooter from "../components/PageFooter";

const businessImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/2108209d3_IMG-20260430-WA0202.jpg";
const packShipImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/95d0755ca_IMG-20260430-WA0203.jpg";
const mobileAppImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/952aa83e8_IMG-20260430-WA0205.jpg";
const smsImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/01429e0d3_IMG-20260430-WA0206.jpg";
const appStoreImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/d5c13eb17_IMG-20260430-WA0207.jpg";
const googlePlayImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/ad1b2245e_IMG-20260430-WA0208.jpg";

const faqs = [
  { icon: Package, label: "FAQs for businesses" },
  { icon: Info, label: "FedEx account" },
  { icon: FileText, label: "File a claim/complaint" },
  { icon: Package, label: "Receiving a package" },
  { icon: RotateCcw, label: "Returning a package" },
  { icon: Package, label: "Sending a package" },
  { icon: Info, label: "Something else" },
];

export default function ContactUs() {
  const [question, setQuestion] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [tab, setTab] = useState("receiving");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Purple Header */}
      <div className="px-5 py-6 text-white" style={{ backgroundColor: "#4D148C" }}>
        <h1 className="text-2xl font-black">Customer support</h1>
      </div>

      {/* Ask FedEx AI */}
      <div className="mx-4 mt-4 border border-gray-300 rounded-sm bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#4D148C" }}>AI</div>
            <span className="text-sm font-bold text-gray-800">Questions? Ask FedEx</span>
          </div>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-500 italic">
            <span className="font-semibold not-italic text-gray-700">FedEx:</span> Hello, I'm the FedEx Virtual Assistant. I'm here to help you with your questions regarding FedEx® services.
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">ASK A QUESTION</p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none resize-none"
            placeholder="Type your question..."
          />
          <button
            className="mt-2 w-full py-3 text-sm font-bold text-white tracking-widest"
            style={{ backgroundColor: "#FF6600" }}
          >
            SUBMIT
          </button>
        </div>
      </div>

      {/* Get help with deliveries */}
      <div className="px-5 py-6 border-t border-gray-200 mt-4">
        <h2 className="text-lg font-black text-gray-900 mb-1">Get help with your deliveries</h2>
        <p className="text-xs text-gray-500 mb-4">Skip the call to customer service by using these self-service tools and resources.</p>

        {/* Tabs */}
        <div className="flex mb-4">
          <button
            onClick={() => setTab("receiving")}
            className="flex-1 py-2 text-sm font-bold transition-colors"
            style={{
              backgroundColor: tab === "receiving" ? "#4D148C" : "white",
              color: tab === "receiving" ? "white" : "#4D148C",
              border: "1px solid #4D148C",
            }}
          >
            Receiving
          </button>
          <button
            onClick={() => setTab("sending")}
            className="flex-1 py-2 text-sm font-bold transition-colors"
            style={{
              backgroundColor: tab === "sending" ? "#4D148C" : "white",
              color: tab === "sending" ? "white" : "#4D148C",
              border: "1px solid #4D148C",
              borderLeft: "none",
            }}
          >
            Sending
          </button>
        </div>

        {tab === "receiving" && (
          <div className="space-y-3">
            {["I received a damaged item", "Make a return", "File a claim"].map((item) => (
              <div key={item} className="flex items-center gap-3 py-2 border-b border-gray-100">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "sending" && (
          <div className="space-y-3">
            {["Create a shipment", "Schedule a pickup", "Print shipping label"].map((item) => (
              <div key={item} className="flex items-center gap-3 py-2 border-b border-gray-100">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        )}

        <button className="mt-4 text-sm font-bold tracking-wider flex items-center gap-1" style={{ color: "#0077C8" }}>
          SEE ALL TRACKING SERVICES <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Support ticket */}
      <div className="px-5 py-6 border-t border-gray-200 bg-gray-50">
        <h2 className="text-lg font-black text-gray-900 mb-1">Check up on your support ticket</h2>
        <p className="text-xs text-gray-500 mb-4">Enter your case or tracking number</p>
        <div className="relative mb-3">
          <input
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none pr-10"
            placeholder=""
          />
          <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
        <button
          className="w-full py-3 text-sm font-bold text-white tracking-widest"
          style={{ backgroundColor: "#FF6600" }}
        >
          CHECK NOW
        </button>
      </div>

      {/* FAQ */}
      <div className="px-5 py-6 border-t border-gray-200">
        <h2 className="text-lg font-black text-gray-900 mb-4">Answers to frequently asked questions</h2>
        <div className="space-y-0">
          {faqs.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              className="flex items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-800">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* More self-service tools */}
      <div className="px-5 py-6 border-t border-gray-200">
        <h2 className="text-lg font-black text-gray-900 mb-6">More self-service tools and resources</h2>

        {/* General business support */}
        <div className="mb-8">
          <img src={businessImg} alt="Business support" className="w-full h-48 object-cover mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">Get general business support</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Whether you're a startup or an established business, our Small Business Center can help with shipping solutions.
          </p>
          <button className="text-xs font-bold tracking-widest" style={{ color: "#0077C8" }}>
            GET SMALL BUSINESS SUPPORT
          </button>
        </div>

        {/* Pack and ship */}
        <div className="mb-8">
          <img src={packShipImg} alt="Pack and ship" className="w-full h-48 object-cover mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">Pack and ship like a pro</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Use our how-to form to learn how to pack your shipments properly. From international shipping to sending supplies.
          </p>
          <button className="text-xs font-bold tracking-widest" style={{ color: "#0077C8" }}>
            GET SHIPPING TIPS
          </button>
        </div>

        {/* Connect via mobile */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-2">Connect with us via mobile for quick answers</h3>
          <img src={mobileAppImg} alt="FedEx mobile app tracking" className="w-full h-52 object-cover mb-4" />
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            When the FedEx app is all you need, get instant access to tracking, delivery management, and customer support — right from your phone.
          </p>

          {/* SMS */}
          <img src={smsImg} alt="FedEx SMS support" className="w-full h-44 object-cover mb-3" />
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            Text <span className="font-bold">29372</span> to chat with us via SMS. Message and data rates may apply.
          </p>
          <button className="text-xs font-bold tracking-widest mb-6" style={{ color: "#0077C8" }}>
            SIGN UP FOR FEDEX TEXT ALERTS / SIGN UP FOR PACKAGE
          </button>

          {/* Download app */}
          <h3 className="text-base font-bold text-gray-900 mb-2">Download the FedEx® app</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Find the answers you need from us at your fingertips on all types of shipments and services.
          </p>
          <div className="flex flex-col gap-3">
            <img src={appStoreImg} alt="Download on the App Store" className="h-12 object-contain object-left" />
            <img src={googlePlayImg} alt="Android App on Google Play" className="h-12 object-contain object-left" />
          </div>
        </div>
      </div>

      <PageFooter />
    </div>
  );
}