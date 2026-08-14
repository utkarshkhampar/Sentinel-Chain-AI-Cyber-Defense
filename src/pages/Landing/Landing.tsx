import { LandingNavbar } from "./components/LandingNavbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Architecture } from "./components/Architecture";
import { HowItWorks } from "./components/HowItWorks";
import { TechStack } from "./components/TechStack";
import { Screenshots } from "./components/Screenshots";
import { Comparison } from "./components/Comparison";
import { Benefits } from "./components/Benefits";
import { Pricing } from "./components/Pricing";
import { Testimonials, Team } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { ContactCTA, LandingFooter } from "./components/ContactFooter";

export function Landing() {
  return (
    <div className="min-h-screen w-full bg-base">
      <LandingNavbar />
      <Hero />
      <Features />
      <Architecture />
      <HowItWorks />
      <TechStack />
      <Screenshots />
      <Comparison />
      <Benefits />
      <Pricing />
      <Testimonials />
      <Team />
      <FAQ />
      <ContactCTA />
      <LandingFooter />
    </div>
  );
}
