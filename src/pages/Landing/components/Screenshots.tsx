import { AlertTriangle, ShieldAlert, MonitorSmartphone, Zap, Radar } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";

const miniKpis = [
  { icon: AlertTriangle, label: "Total Threats", value: "128", tone: "text-severity-critical bg-severity-critical/10" },
  { icon: ShieldAlert, label: "Critical", value: "15", tone: "text-severity-high bg-severity-high/10" },
  { icon: MonitorSmartphone, label: "Assets", value: "320", tone: "text-brand-blue-light bg-brand-blue/10" },
  { icon: Zap, label: "Response Rate", value: "92%", tone: "text-status-success bg-status-success/10" },
];

export function Screenshots() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <SectionHeading
        eyebrow="See It In Action"
        title="A console built for 3am incidents, not just demos"
        subtitle="Every panel below is live in the product — not a mockup bolted on for the pitch deck."
      />

      <Reveal delay={0.15} className="mt-14">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border-strong shadow-2xl">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-severity-critical/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-severity-medium/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-status-success/60" />
            <div className="ml-3 flex-1 rounded-md bg-base/60 px-3 py-1 text-center text-[11px] text-text-muted">
              app.sentinelchain.io/dashboard
            </div>
          </div>
          {/* Recreated dashboard preview */}
          <div className="bg-console-grid p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-display text-sm font-bold text-text-primary">Security Overview</p>
                <p className="text-[11px] text-text-muted">Real-time posture across every monitored asset</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-status-success/25 bg-status-success/10 px-2.5 py-1 text-[10px] font-medium text-status-success">
                <Radar className="h-3 w-3" /> Live
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {miniKpis.map((k) => (
                <div key={k.label} className="panel p-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-md ${k.tone}`}>
                    <k.icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="mt-2 text-[10px] uppercase text-text-muted">{k.label}</p>
                  <p className="font-display text-lg font-bold text-text-primary">{k.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="panel h-32 sm:col-span-2 flex items-end gap-1.5 p-4">
                {[40, 65, 30, 80, 55, 90, 45, 70, 60, 95, 50, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-brand-blue to-brand-purple/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="panel flex h-32 items-center justify-center p-4">
                <div className="relative h-20 w-20 rounded-full border-8 border-brand-blue/20">
                  <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-severity-critical border-r-severity-high" style={{ transform: "rotate(45deg)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
