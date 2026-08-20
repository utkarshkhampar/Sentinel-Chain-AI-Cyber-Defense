import { TrendingDown, Clock, ScrollText, Users2 } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";

const benefits = [
  { icon: TrendingDown, stat: "-62%", label: "Fewer false-positive escalations", tone: "text-status-success" },
  { icon: Clock, stat: "4.2m", label: "Average time to detect a threat", tone: "text-brand-blue-light" },
  { icon: ScrollText, stat: "100%", label: "Evidence records independently verifiable", tone: "text-brand-purple-light" },
  { icon: Users2, stat: "3.5x", label: "More incidents closed per analyst", tone: "text-brand-cyan" },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <SectionHeading eyebrow="Impact" title="What SOC teams gain on day one" center={false} />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <Reveal key={b.label} delay={i * 0.08}>
            <div className="panel h-full p-6">
              <b.icon className={`h-6 w-6 ${b.tone}`} strokeWidth={1.75} />
              <p className={`mt-4 font-display text-3xl font-bold ${b.tone}`}>{b.stat}</p>
              <p className="mt-1.5 text-sm text-text-secondary">{b.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
