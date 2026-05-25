import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  "OUR COMPANY": ["About FedEx", "Careers", "Newsroom", "Investor Relations", "Corporate Responsibility"],
  "MORE RESOURCES": ["FedEx Developer Portal", "FedEx Dataworks", "FedEx Blog", "Contact Us"],
};

export default function PageFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Nav sections */}
        {Object.entries(footerLinks).map(([section, items]) => (
          <div key={section} className="mb-6">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">{section}</p>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  {item === "Contact Us" ? (
                    <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{item}</Link>
                  ) : (
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{item}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Language */}
        <div className="border-t border-gray-200 pt-5 mb-5">
          <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">LANGUAGE</p>
          <select className="border border-gray-300 px-3 py-2 text-sm text-gray-700 w-full">
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
          </select>
        </div>

        {/* Social */}
        <div className="border-t border-gray-200 pt-5 mb-5">
          <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">FOLLOW US</p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* FedEx logo + copyright */}
        <div className="border-t border-gray-200 pt-5 text-center">
          <div className="mb-3">
            <span className="text-2xl font-black">
              <span style={{ color: "#4D148C" }}>Fed</span><span style={{ color: "#FF6600" }}>Ex</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-3">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Cookie Settings</a>
          </div>
          <p className="text-xs text-gray-400">© 2026 FedEx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}