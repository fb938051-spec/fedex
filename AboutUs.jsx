import Navbar from "../components/Navbar";
import PageFooter from "../components/PageFooter";
import { ChevronRight } from "lucide-react";

const deliveryGuyImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/49664f3de_IMG-20260430-WA0217.jpg";
const teamPlaneImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/52af07813_IMG-20260430-WA0216.jpg";
const teamImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/fda75bc9a_IMG-20260430-WA0218.jpg";
const ceoImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/6bb6a8350_IMG-20260430-WA0219.jpg";
const analyticsIcon = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/e23adc0b3_IMG-20260430-WA0220.jpg";
const caresImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/421c130cd_IMG-20260430-WA0221.jpg";
const globeIcon = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/351c90a50_IMG-20260430-WA0222.jpg";
const impactReportImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/8eb6c4abb_IMG-20260430-WA0223.jpg";
const lightbulbIcon = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/3eedef63f_IMG-20260430-WA0224.jpg";
const newsIcon = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/202de763e_IMG-20260430-WA0225.jpg";
const evImg = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/a81410d1a_IMG-20260430-WA0226.jpg";
const highFiveIcon = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/0e3bc223e_IMG-20260430-WA0227.jpg";
const dollarIcon = "https://media.base44.com/images/public/69f3481364a28fb472a4ed42/1f42b0f24_IMG-20260430-WA0228.jpg";

const values = [
  { icon: analyticsIcon, title: "Efficiency", desc: "We use data-driven insights to optimize every aspect of the supply chain and improve delivery outcomes." },
  { icon: lightbulbIcon, title: "Innovation", desc: "Cutting-edge technology and forward-thinking solutions drive everything we do at FedEx." },
  { icon: globeIcon, title: "Intelligence", desc: "Global connectivity and smart logistics networks make us the world's most trusted shipping partner." },
];

const commitments = [
  { icon: highFiveIcon, title: "Our people", desc: "FedEx team members are our greatest asset — diverse, talented, and dedicated to delivering excellence every day." },
  { icon: dollarIcon, title: "Fiscal responsibility", desc: "We operate with transparency and accountability to deliver value for our customers, team members, and shareholders." },
  { icon: caresImg, title: "FedEx Cares", desc: "Our global giving program empowers communities and creates opportunities for people around the world." },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <div className="px-5 py-10 text-white" style={{ backgroundColor: "#4D148C" }}>
        <h1 className="text-3xl font-black leading-tight mb-3">Making supply chains smarter for everyone</h1>
        <p className="text-sm text-purple-200">Learn more about us</p>
      </div>

      {/* Breadcrumb */}
      <div className="px-5 py-3 text-xs text-gray-500 border-b border-gray-100">Home</div>

      {/* Our world evolves around you */}
      <div className="px-5 py-8 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-4">Our world evolves around you</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          We are 500,000+ people. Today about 18 million deliveries are made, connecting millions more for you. Driven by a spirit of curiosity and a digital-enabled, network-centric way of thinking and working, and with a deep commitment to make your experience better.
        </p>
        <img src={deliveryGuyImg} alt="FedEx delivery team member" className="w-full h-56 object-cover mb-4" />
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          <span className="font-bold text-gray-900">Different by design</span> — When the world needs a partner they can count on, they trust FedEx. We keep the global supply chain moving and connect people and possibilities around the world.
        </p>
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          VIEW THE FEDEX PROFILE <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Sit down with the FedEx team */}
      <div className="px-5 py-8 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-4">Sit down with some of the FedEx team</h2>
        <img src={teamPlaneImg} alt="FedEx team inside cargo plane" className="w-full h-52 object-cover mb-4" />
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          From drivers to pilots, the faces of thousands of people team members work to move the world. Together, we are more than 500,000 team members dedicated to getting it right on time.
        </p>
        <p className="text-sm font-bold text-gray-800 mb-3">
          For Doug Carpenter, his three daughters, and Nissan Mulan, FedEx and family go hand in hand.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          And sometimes it turns out knowing exactly what the company offers — the culture and commitment to building a relationship that goes both ways — is part of being part of a company that continuously evolves to meet the evolving needs of its people.
        </p>
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          CONNECT WITH MORE STORIES FROM OUR PEOPLE <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Lead by example */}
      <div className="px-5 py-8 border-b border-gray-100">
        <img src={teamImg} alt="FedEx team" className="w-full h-56 object-cover mb-4" />
        <h2 className="text-xl font-black text-gray-900 mb-2">Learn how everyone leads by example</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Named on January 1, 2024, Raj Subramaniam — then FedEx CEO — displays a focused, people-first leadership style.
        </p>
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          VIEW THIS PAGE <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Meet the leaders */}
      <div className="px-5 py-8 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-black text-gray-900 mb-5">Meet the FedEx leaders who are shaping what's next</h2>
        <div className="flex items-start gap-4 mb-5">
          <img src={ceoImg} alt="Frederick W. Smith" className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-900">Frederick W. Smith</p>
            <p className="text-xs text-gray-500">Founder, Executive Chairman</p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              In 1971, Fred Smith founded Federal Express with the idea of an overnight delivery service. He grew FedEx into one of the world's most admired companies.
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The FedEx management team is made up of proven industry leaders, entrepreneurs, and innovators committed to delivering value for our customers, team members, and investors.
        </p>
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          LEARN MORE ABOUT OUR LEADERSHIP <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Values */}
      <div className="px-5 py-8 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-2">Living our values for smarter, safer solutions</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Our values define how we serve every customer, every shipment, every day.
        </p>
        <div className="space-y-6">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4 items-start">
              <img src={v.icon} alt={v.title} className="w-12 h-12 object-contain flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Impact */}
      <div className="px-5 py-8 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-4">Scaling back from every corner with intelligence</h2>
        <img src={impactReportImg} alt="Global Economic Impact Report" className="w-full h-48 object-cover mb-4" />
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Every year the FedEx effect grows. Our Global Economic Impact Report highlights how FedEx connects the world economy — supporting millions of jobs, businesses, and communities.
        </p>
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          SEE REPORT <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* EV Innovation */}
      <div className="px-5 py-8 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-black text-gray-900 mb-4">Inspiring delivery innovations</h2>
        <img src={evImg} alt="FedEx Electric Vehicle" className="w-full h-48 object-cover mb-4" />
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          FedEx is committed to achieving carbon-neutral operations globally by 2040 through electrifying our pickup and delivery fleet, transitioning to sustainable fuels, and investing in carbon sequestration initiatives.
        </p>
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          SEE MORE INNOVATIONS <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Stay in the loop */}
      <div className="px-5 py-8 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-6">Stay in the loop with the latest at FedEx</h2>
        <div className="space-y-6 mb-8">
          {commitments.map((c) => (
            <div key={c.title} className="flex gap-4 items-start">
              <img src={c.icon} alt={c.title} className="w-12 h-12 object-contain flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <button className="w-full py-3 text-sm font-bold text-white tracking-wide" style={{ backgroundColor: "#4D148C" }}>
            OUR COMMITMENT
          </button>
          <button className="w-full py-3 text-sm font-bold tracking-wide border-2" style={{ color: "#4D148C", borderColor: "#4D148C" }}>
            START A CAREER
          </button>
          <button className="w-full py-3 text-sm font-bold tracking-wide border-2" style={{ color: "#4D148C", borderColor: "#4D148C" }}>
            FIND YOUR CAREER
          </button>
        </div>
      </div>

      {/* Newsroom */}
      <div className="px-5 py-8 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <img src={newsIcon} alt="News" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-black text-gray-900">FedEx Newsroom</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Stay up to date with the latest FedEx news, press releases, investor information, and corporate announcements.
        </p>
        <button className="text-xs font-bold tracking-widest flex items-center gap-1" style={{ color: "#0077C8" }}>
          VISIT THE NEWSROOM <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <PageFooter />
    </div>
  );
}