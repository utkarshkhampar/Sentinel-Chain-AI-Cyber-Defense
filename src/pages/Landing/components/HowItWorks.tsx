import { Radar, BrainCircuit, ShieldAlert, Link2, LineChart } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";

const steps = [
  { icon: Radar, title: "Ingest", description: "Telemetry streams in from endpoints, network appliances, and cloud workloads in real time." },
  { icon: BrainCircuit, title: "Analyze", description: "The AI ensemble scores every event and produces a plain-language explanation for the verdict." },
  { icon: ShieldAlert, title: "Respond", description: "Analysts triage explained alerts, escalate to incidents, and approve automated containment." },
  { icon: Link2, title: "Anchor", description: "Confirmed incidents and their evidence are hashed and anchored to the blockchain ledger." },
  { icon: LineChart, title: "Report", description: "Audit-ready reports reference verifiable evidence for compliance and legal review." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <SectionHeading
        eyebrow="Workflow"
        title="From raw telemetry to verified evidence"
        subtitle="Five stages, one continuous pipeline — no manual hand-offs between disconnected tools."
      />
      <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block" />
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1} className="relative flex flex-col items-center text-center">
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border-strong bg-surface-raised shadow-glow">
              <step.icon className="h-6 w-6 text-brand-blue-light" strokeWidth={1.75} />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple font-mono-data text-[11px] font-bold text-white">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-4 font-display text-sm font-bold text-text-primary">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{step.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
