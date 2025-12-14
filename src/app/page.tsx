import Image from "next/image";
import Hero from "@/components/landing/Hero";
import ServiceSlider from "@/components/landing/ServiceSlider";
import StaffSection from "@/components/landing/StaffSection";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <ServiceSlider />
      <Testimonials />
      <StaffSection />
      <Contact />
    </div>
  );
}
