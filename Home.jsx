import WhatsAppButton from "../components/WhatsAppButton";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import QuickActions from "../components/QuickActions";
import TrackingBar from "../components/TrackingBar";
import AlertBanner from "../components/AlertBanner";
import ShipmentStats from "../components/ShipmentStats";
import WhyFedEx from "../components/WhyFedEx";
import DeliveryOptions from "../components/DeliveryOptions";
import AppDownload from "../components/AppDownload";
import BusinessAdvantage from "../components/BusinessAdvantage";
import PostPurchase from "../components/PostPurchase";
import RewardsSection from "../components/RewardsSection";
import PageFooter from "../components/PageFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Arial', sans-serif" }}>
      <Navbar />
      <HeroBanner />
      <QuickActions />
      <TrackingBar />
      <AlertBanner />
      <ShipmentStats />
      <WhyFedEx />
      <DeliveryOptions />
      <AppDownload />
      <BusinessAdvantage />
      <PostPurchase />
      <RewardsSection />
      <PageFooter />
      <WhatsAppButton />
    </div>
  );
}