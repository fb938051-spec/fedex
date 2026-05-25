import { User, Menu, Search } from "lucide-react";

export default function NavBar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-3xl font-black tracking-tight leading-none">
            <span className="text-[#4D148C]">Fed</span><span className="text-[#FF6600]">Ex</span>
          </span>
        </div>
        {/* Right icons */}
        <div className="flex items-center gap-4 text-gray-600">
          <Search className="w-5 h-5 cursor-pointer hover:text-[#4D148C]" />
          <User className="w-5 h-5 cursor-pointer hover:text-[#4D148C]" />
          <Menu className="w-5 h-5 cursor-pointer hover:text-[#4D148C]" />
        </div>
      </div>
    </header>
  );
}