import { useState } from "react";
import { ChevronDown, ChevronUp, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const sections = [
  {
    title: "OUR COMPANY",
    links: ["About FedEx", "Our Portfolio", "Careers", "Transportation Operating Specifications", "Newsroom", "Contact Us"],
  },
  {
    title: "MORE FROM FEDEX",
    links: ["FedEx Blog", "FedEx Compatible", "FedEx Developer Portal", "FedEx Freight"],
  },
];

export default function SiteFooter() {
  const [open, setOpen] = useState(null);

  return (
    <footer className="bg-gray-900 text-white">
      {/* Accordion sections */}
      <div className="divide-y divide-gray-800">
        {sections.map((s, i) => (
          <div key={s.title}>
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-xs font-bold tracking-widest uppercase text-gray-300"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {s.title}
              {open === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open === i && (
              <div className="px-5 pb-4 space-y-3">
                {s.links.map((link) => (
                  <a key={link} href="#" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Language */}
      <div className="px-5 py-4 border-t border-gray-800">
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Language</p>
        <select className="bg-gray-800 text-xs text-white border border-gray-700 rounded px-3 py-2 w-40 focus:outline-none">
          <option>English</option>
          <option>Español</option>
          <option>Français</option>
        </select>
      </div>

      {/* Social */}
      <div className="px-5 py-4 border-t border-gray-800 flex gap-4">
        {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
          <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="px-5 py-4 border-t border-gray-800 text-[10px] text-gray-500 space-y-1">
        <p>© FedEx 2026</p>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Use</a>
          <a href="#" className="hover:text-gray-300">Cookie Settings</a>
          <a href="#" className="hover:text-gray-300">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}