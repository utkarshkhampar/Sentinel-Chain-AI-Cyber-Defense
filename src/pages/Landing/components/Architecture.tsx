import { Monitor, Network, Cpu, BrainCircuit, Database } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";

const layers = [
  {
    label: "Presentation Layer",
    icon: Monitor,
    items: ["Web Dashboard", "Mobile Console", "SOC Analyst UI"],
    tone: "from-brand-blue/20 to-brand-blue/5 border-brand-blue/30 text-brand-blue-light",
  },
  {
    label: "API Gateway / Edge",
    icon: Network,
    items: ["AuthN/AuthZ", "Rate Limiting", "Routing"],
    tone: "from-brand-purple/20 to-brand-purple/5 border-brand-purple/30 text-brand-purple-light",
  },
  {
    label: "Application Services",
    icon: Cpu,
    items: ["Incident Manager", "Asset Mgmt", "Kafka Event Bus"],
    tone: "from-brand-cyan/20 to-brand-cyan/5 border-brand-cyan/30 text-brand-cyan",
  },
  {
    label: "Intelligence Layer",
    icon: BrainCircuit,
    items: ["AI Detection Engine", "Explainable AI", "Graph Analytics"],
    tone: "from-severity-high/20 to-severity-high/5 border-severity-high/30 text-severity-high",
  },
  {
    label: "Data & Ledger Layer",
    icon: Database,
    items: ["PostgreSQL / Elasticsearch", "Neo4j / Redis", "Hyperledger Fabric"],
    tone: "from-status-success/20 to-status-success/5 border-status-success/30 text-status-success",
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="mx-auto max-w-5xl px-4 py-24 md:px-6">
      <SectionHeading
        eyebrow="System Architecture"
        title="A layered, event-driven microservice architecture"
        subtitle="Each layer scales independently, so detection workloads and transactional workloads never compete for the same resources."
      />
      <div className="mt-14 space-y-3">
        {layers.map((layer, i) => (
          <Reveal key={layer.label} delay={i * 0.08}>
            <div className={`flex flex-col items-start gap-4 rounded-2xl border bg-gradient-to-r p-5 sm:flex-row sm:items-center ${layer.tone}`}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-current/30 bg-surface-raised/40">
                <layer.icon className="h-5 w-5" />
              </div>
              <div className="min-w-[180px]">
                <p className="font-display text-sm font-bold text-text-primary">{layer.label}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <span key={item} className="rounded-lg border border-current/25 bg-surface-raised/60 px-2.5 py-1 text-xs font-medium text-text-secondary">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
