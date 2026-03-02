import { LandingNav } from "@/components/layout/landing-nav";
import { Hero } from "@/components/features/landing/hero";
import { FeaturesStrip } from "@/components/features/landing/features-strip";
import { AboutSection } from "@/components/features/landing/about-section";
import { ModulesGrid } from "@/components/features/landing/modules-grid";
import { PricingSection } from "@/components/features/landing/pricing-section";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <Hero />
      <FeaturesStrip />
      <AboutSection />
      <ModulesGrid />
      <PricingSection />
      <Footer />
    </>
  );
}
