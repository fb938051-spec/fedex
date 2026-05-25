const autoPartsImg = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: "#f5f5f5" }}>
      <div
        className="min-h-[260px] bg-cover bg-center relative"
        style={{ backgroundImage: `url('${autoPartsImg}')` }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.96) 50%, rgba(255,255,255,0.3) 100%)" }} />
        <div className="relative z-10 px-5 py-8 max-w-5xl mx-auto">
          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-3" style={{ maxWidth: 280 }}>
            Keep your automotive supply chain moving
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed" style={{ maxWidth: 300 }}>
            From transmissions to tires, FedEx handles every part. Reach customers fast with flexible delivery options and logistics that can be with you.
          </p>
        </div>
      </div>
    </div>
  );
}