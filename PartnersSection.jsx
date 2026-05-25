const partners = ["Starbucks", "Amazon", "Nike", "Apple", "Ford", "Target"];

export default function PartnersSection() {
  return (
    <div className="bg-gray-50 py-14 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold tracking-widest uppercase text-gray-400 mb-8">
          Trusted by world-class brands
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((name) => (
            <div key={name} className="opacity-40 hover:opacity-70 transition-opacity">
              <span className="text-lg font-black text-gray-700 tracking-wide">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}