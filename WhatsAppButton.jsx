import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function WhatsAppButton() {
  const [enabled, setEnabled] = useState(false);
  const [number, setNumber] = useState("");

  useEffect(() => {
    const load = async () => {
      const settings = await base44.entities.Settings.list();
      const wa = settings.find(s => s.key === "whatsapp_enabled");
      const num = settings.find(s => s.key === "whatsapp_number");
      setEnabled(wa?.value === "true");
      setNumber(num?.value || "");
    };
    load();
  }, []);

  if (!enabled || !number) return null;

  const clean = number.replace(/\D/g, "");
  const href = `https://wa.me/${clean}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-11 h-11 rounded-full shadow-lg hover:scale-110 transition-transform"
      style={{ backgroundColor: "#25D366" }}
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.832 6.5L4 29l7.752-1.797A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.5a9.44 9.44 0 01-4.8-1.305l-.344-.205-4.6 1.065 1.1-4.477-.225-.356A9.5 9.5 0 016.5 15c0-5.247 4.253-9.5 9.5-9.5S25.5 9.753 25.5 15 21.247 24.5 16 24.5zm5.2-6.965c-.285-.143-1.686-.832-1.948-.927-.261-.095-.452-.143-.642.143-.19.285-.736.927-.902 1.118-.166.19-.332.214-.617.071-.285-.143-1.204-.444-2.293-1.417-.847-.756-1.42-1.69-1.586-1.975-.166-.285-.018-.44.125-.582.128-.127.285-.332.428-.499.143-.166.19-.285.285-.475.095-.19.048-.357-.024-.499-.071-.143-.642-1.547-.879-2.118-.232-.556-.467-.48-.642-.489l-.547-.01c-.19 0-.499.071-.761.357-.261.285-1 .975-1 2.38s1.024 2.762 1.167 2.952c.143.19 2.015 3.077 4.883 4.314.683.295 1.215.471 1.63.603.685.217 1.31.187 1.804.113.55-.082 1.686-.689 1.924-1.355.238-.666.238-1.237.166-1.355-.07-.118-.261-.19-.547-.332z"/>
      </svg>
    </a>
  );
}