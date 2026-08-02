import { BrainCircuit, Link2, Radar, Network, ShieldCheck, FileBarChart } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";

const features = [
  {
    icon: BrainCircuit,
    title: "Explainable AI Detection",
    description: "A multi-model ensemble (RF, XGBoost, Isolation Forest, LSTM, GNN) scores every event and explains its reasoning via SHAP/LIME.",
    tone: "blue",
  },
  {
    icon: Link2,
    title: "Blockchain Evidence Ledger",
    description: "Every confirmed incident is hash-anchored to a permissioned Hyperledger Fabric ledger for a tamper-evident chain of custody.",
    tone: "purple",
  },
  {
    icon: Radar,
    title: "Real-Time Threat Monitoring",
    description: "Live telemetry from endpoints, network, and cloud sources scored continuously — not on a batch schedule.",
    tone: "cyan",
  },
  {
    icon: Network,
    title: "Digital Twin & Graph Analytics",
    description: "Visualize asset relationships and blast radius instantly when a host is flagged, powered by graph-native queries.",
    tone: "success",
  },
  {
    icon: ShieldCheck,
    title: "Zero Trust Internals",
    description: "mTLS everywhere, least-privilege RBAC, and continuous verification — the platform holds itself to the same standard it enforces.",
    tone: "critical",
  },
  {
    icon: FileBarChart,
    title: "Audit-Ready Reporting",
    description: "One-click compliance and incident reports referencing verifiable, ledger-anchored evidence records.",
    tone: "warning",
  },
];

const toneMap: Record<string, string> = {
  blue: "bg-brand-blue/12 text-brand-blue-light border-brand-blue/25",
  purple: "bg-brand-purple/12 text-brand-purple-light border-brand-purple/25",
  cyan: "bg-brand-cyan/12 text-brand-cyan border-brand-cyan/25",
  success: "bg-status-success/12 text-status-success border-status-success/25",
  critical: "bg-severity-critical/12 text-severity-critical border-severity-critical/25",
  warning: "bg-severity-high/12 text-severity-high border-severity-high/25",
};

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <SectionHeading
        eyebrow="Platform Capabilities"
        title="Everything a modern SOC needs, in one console"
        subtitle="Sentinel Chain replaces a patchwork of disconnected tools with a single, coherent detection-to-evidence pipeline."
      />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <div className="panel panel-hover h-full p-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${toneMap[f.tone]}`}>
                <f.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
