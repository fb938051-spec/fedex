import Navbar from "../components/Navbar";
import PageFooter from "../components/PageFooter";
import { ChevronRight } from "lucide-react";

const teamImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/f7ea9f330_IMG-20260430-WA02411.jpg";
const rajImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/e118e006e_IMG-20260430-WA02401.jpg";
const exec1Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/bf437ce9d_IMG-20260430-WA0242.jpg";
const exec2Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/1f64dc607_IMG-20260430-WA0243.jpg";
const exec3Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/86b8523bd_IMG-20260430-WA0244.jpg";
const exec4Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/9ee085314_IMG-20260430-WA0245.jpg";
const exec5Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/0c4c736d7_IMG-20260430-WA02451.jpg";
const exec6Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/c268abdbd_IMG-20260430-WA0246.jpg";
const exec7Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/cef445242_IMG-20260430-WA0247.jpg";
const exec8Img = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/a104f01a5_IMG-20260430-WA0248.jpg";

const stats = [
  { label: "Total revenue", value: "$87.2B" },
  { label: "Total team members", value: "+500K" },
  { label: "Average daily shipments", value: "+16M" },
  { label: "Retirement vehicles", value: "+2.9M" },
  { label: "Airports served", value: "650" },
  { label: "Vehicles", value: "180K" },
  { label: "Countries/territories served", value: "220+" },
  { label: "Package value loaded", value: "+$894" },
];

function GradientAvatar({ src, alt }) {
  return (
    <div className="w-24 h-24 rounded-full flex-shrink-0" style={{
      background: "linear-gradient(135deg, #7B2FBE, #FF6B35)",
      padding: "3px",
    }}>
      <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
    </div>
  );
}

function ExecutiveCard({ img, name, title, hq, desc, cta }) {
  return (
    <div className="py-6 border-b border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <GradientAvatar src={img} alt={name} />
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
      </div>
      {hq && <p className="text-xs text-gray-500 mb-2">Headquarters: {hq}</p>}
      {desc && <p className="text-sm text-gray-600 leading-relaxed mb-3">{desc}</p>}
      {cta && (
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          {cta} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <div className="px-5 py-8 text-white" style={{ backgroundColor: "#4D148C" }}>
        <h1 className="text-2xl font-black leading-tight">Company structure and facts</h1>
      </div>

      {/* Breadcrumb */}
      <div className="px-5 py-3 text-xs text-gray-500 border-b border-gray-100">Home</div>

      {/* Intro */}
      <div className="px-5 py-8 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-2">FedEx – Flexibility, Efficiency, Intelligence</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          FedEx connects customers and communities worldwide with a broad portfolio of transportation, e-commerce, and business services. An experienced and talented team of more than 500,000 employees and independent service providers work around the world to meet the needs of our customers and communities.
        </p>
        <img src={teamImg} alt="FedEx team members" className="w-full h-56 object-cover mb-6" />
        <h3 className="text-base font-black text-gray-900 mb-2">Discover the impact of our dedicated team</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Find out what the FedEx flag brings globally when FedEx has found ways to connect people, businesses, and communities.
        </p>
        <button
          className="w-full py-3 text-sm font-bold text-white tracking-wide"
          style={{ backgroundColor: "#4D148C" }}
        >
          EXPLORE FEDEX CAREERS
        </button>
      </div>

      {/* FedEx Corporation — Raj */}
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4">FedEx Corporation</h2>
        <ExecutiveCard
          img={rajImg}
          name="Raj Subramaniam"
          title="President and CEO"
          hq="Memphis, TN"
          desc="FedEx Corporation is the umbrella organization from which much of our shipping is planned."
        />

        {/* Stats */}
        <div className="mt-4 space-y-0">
          {stats.map((s) => (
            <div key={s.label} className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">{s.label}</span>
              <span className="text-sm font-bold text-gray-900">{s.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 italic">*Average daily wages information for in FY23</p>
      </div>

      {/* FedEx Corporation — John */}
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4">FedEx Corporation</h2>
        <ExecutiveCard
          img={exec1Img}
          name="John T. Smith"
          title="COO and President, Canada"
          hq="Mississauga, Ontario, Canada; Collierville, Tennessee; Dallas-Fort Worth, Texas; Oklahoma City, Oklahoma"
          desc="FedEx delivers more than 13 million packages per day. The company has about 680 aircraft and more than 180,000 vehicles offering full business and consumer package delivery services."
        />
      </div>

      {/* FedEx Office */}
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4">FedEx Office</h2>
        <ExecutiveCard
          img={exec2Img}
          name="Brian Philips"
          title="Executive Vice President and Chief Customers Officer"
          hq="Plano, TX"
          desc="FedEx Office provides document solutions and professional printing, signs, supplies, and shipping. Our team of printing professionals helps businesses of all sizes with their document and marketing needs."
          cta="LEARN MORE ABOUT FEDEX OFFICE"
        />
      </div>

      {/* FedEx Logistics */}
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4">FedEx Logistics</h2>
        <ExecutiveCard
          img={exec3Img}
          name="Udo Lange"
          title="President, FedEx Logistics"
          hq="Collierville, TN"
          desc="FedEx Logistics provides supply chain management services including freight forwarding, integrated logistics, customs brokerage, and trade advisory services across the globe."
          cta="LEARN MORE ABOUT FEDEX LOGISTICS"
        />
      </div>

      {/* FedEx Supply Chain */}
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4">FedEx Supply Chain</h2>
        <ExecutiveCard
          img={exec4Img}
          name="Richard W. Smith"
          title="Regional President Americas and President, FedEx Canada"
          hq="Pittsburgh, PA"
          desc="FedEx Supply Chain offers warehousing, fulfillment, transportation management, reverse logistics, and fleet services to optimize supply chains for companies across industries."
          cta="LEARN MORE ABOUT FEDEX SUPPLY CHAIN"
        />
      </div>

      {/* FedEx Dataworks */}
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4">FedEx Dataworks</h2>
        <ExecutiveCard
          img={exec8Img}
          name="Sriram Krishnasamy"
          title="President, FedEx Dataworks"
          hq="Memphis, TN"
          desc="FedEx Dataworks harnesses the power of data and digital applications to optimize network operations and deliver smarter, more personalized experiences for customers and team members alike."
          cta="LEARN MORE ABOUT FEDEX DATAWORKS"
        />
      </div>

      {/* More executives */}
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-4">More Leadership</h2>
        <ExecutiveCard
          img={exec5Img}
          name="Mark Allen"
          title="EVP, General Counsel and Secretary"
          hq="Memphis, TN"
          desc="Oversees all legal matters, governance, and regulatory compliance for FedEx Corporation globally."
        />
        <ExecutiveCard
          img={exec6Img}
          name="Brie Carere"
          title="EVP, Chief Customer Officer"
          hq="Memphis, TN"
          desc="Leads the customer experience strategy and global marketing for FedEx Corporation."
        />
        <ExecutiveCard
          img={exec7Img}
          name="Mike Lenz"
          title="EVP and CFO"
          hq="Memphis, TN"
          desc="Oversees the financial operations, investor relations, and fiscal strategy for FedEx Corporation."
        />
      </div>

      <PageFooter />
    </div>
  );
}