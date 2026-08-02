import { Check, Minus } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";

const rows = [
  { capability: "ML/behavioural detection", siem: false, edr: "partial", sentinel: true },
  { capability: "Explainable AI verdicts", siem: false, edr: false, sentinel: true },
  { capability: "Cross-asset graph analysis", siem: false, edr: "partial", sentinel: true },
  { capability: "Automated response", siem: false, edr: "partial", sentinel: true },
  { capability: "Tamper-evident evidence ledger", siem: false, edr: false, sentinel: true },
  { capability: "Unified single console", siem: "partial", edr: "partial", sentinel: true },
];

function Cell({ value }: { value: boolean | "partial" }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-status-success" />;
  if (value === "partial") return <Minus className="mx-auto h-4 w-4 text-severity-medium" />;
  return <Minus className="mx-auto h-4 w-4 text-text-muted/40" />;
}

export function Comparison() {
  return (
    <section id="comparison" className="mx-auto max-w-4xl px-4 py-24 md:px-6">
      <SectionHeading eyebrow="Why Sentinel Chain" title="How it stacks up against traditional tooling" />
      <Reveal delay={0.15} className="mt-14">
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-5 py-4 font-medium">Capability</th>
                <th className="px-5 py-4 text-center font-medium">Traditional SIEM</th>
                <th className="px-5 py-4 text-center font-medium">EDR / XDR</th>
                <th className="px-5 py-4 text-center font-medium text-brand-blue-light">Sentinel Chain</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.capability} className={i % 2 === 1 ? "bg-white/[0.02]" : ""}>
                  <td className="px-5 py-3.5 font-medium text-text-primary">{row.capability}</td>
                  <td className="px-5 py-3.5">
                    <Cell value={row.siem as any} />
                  </td>
                  <td className="px-5 py-3.5">
                    <Cell value={row.edr as any} />
                  </td>
                  <td className="bg-brand-blue/5 px-5 py-3.5">
                    <Cell value={row.sentinel as any} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
