import { Button } from "@/components/ui/button";
import { Clock, MapPin, Bell, Smartphone } from "lucide-react";

const imgUrl = "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&q=80";

const features = [
  { icon: Clock, title: "Time-definite options", desc: "Choose from overnight, 2-day, or ground delivery windows." },
  { icon: MapPin, title: "Precise tracking", desc: "Know exactly where your shipment is at every step." },
  { icon: Bell, title: "Proactive notifications", desc: "Get SMS and email alerts before, during, and after delivery." },
  { icon: Smartphone, title: "FedEx Delivery Manager", desc: "Redirect, reschedule, or hold packages on demand." },
];

export default function DeliverySection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 md:order-1">
          <img src={imgUrl} alt="Delivery person" className="w-full h-96 object-cover" />
          <div className="absolute top-4 right-4 bg-[#4D148C] text-white p-4 w-44 shadow-xl">
            <p className="text-xl font-black">Same Day</p>
            <p className="text-xs font-medium leading-tight mt-1">Available in select metro areas nationwide</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <p className="text-[#FF6600] text-xs font-bold tracking-widest uppercase mb-3">Flexible Delivery</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            Delivery options built for busy schedules
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            We know production lines cannot wait. Our flexible delivery options keep your team in control, with real-time visibility and the power to adapt on the fly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-9 h-9 bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#4D148C]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="bg-[#FF6600] hover:bg-orange-600 text-white rounded-none font-bold text-sm px-6 py-3 h-auto border-0">
            Manage My Deliveries
          </Button>
        </div>
      </div>
    </div>
  );
}