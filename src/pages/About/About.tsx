import { Info, Target, Rocket, Users2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Team } from "@/pages/Landing/components/Testimonials";

export function About() {
  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="About Sentinel Chain" subtitle="Our mission, story, and the team behind the platform" icon={Info} />

      <div className="panel p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/12 text-brand-blue-light">
          <Target className="h-5 w-5" />
        </div>
        <h2 className="mt-3 font-display text-lg font-bold text-text-primary">Our Mission</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Sentinel Chain exists to close the gap between AI-driven threat detection and evidence that stands up to
          scrutiny. We believe SOC teams shouldn't have to choose between fast detection and defensible evidence
          \u2014 they should get both, in one platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="panel p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/12 text-brand-purple-light">
            <Rocket className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-display text-base font-bold text-text-primary">Our Story</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Sentinel Chain started as a hackathon project exploring whether blockchain's tamper-evidence guarantees
            could be paired with explainable AI to solve a real gap in SOC tooling. It has since grown into a full
            platform design spanning detection, response, and audit-ready evidence management.
          </p>
        </div>
        <div className="panel p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success/12 text-status-success">
            <Users2 className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-display text-base font-bold text-text-primary">Who We Serve</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Security operations teams at organizations that need both fast detection and audit-grade evidence
            \u2014 financial services, healthcare, critical infrastructure, and any regulated environment where
            "prove it happened" matters as much as "we caught it."
          </p>
        </div>
      </div>

      <Team />
    </div>
  );
}
