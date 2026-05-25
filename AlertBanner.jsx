import { Info } from "lucide-react";

export default function AlertBanner() {
  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-700 leading-relaxed">
          <span className="font-semibold">US Supreme Court Tariff Updates.</span>{" "}
          <a href="#" className="text-blue-600 underline font-medium">See how this may affect you</a>
        </p>
      </div>
    </div>
  );
}