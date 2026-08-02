import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "for evaluation",
    description: "Explore the full console with sample data.",
    features: ["Up to 25 monitored assets", "Core AI detection models", "7-day evidence retention", "Community support"],
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per organization",
    description: "Full platform for production SOC teams.",
    features: [
      "Unlimited monitored assets",
      "Full AI ensemble + GNN + XAI",
      "Hyperledger Fabric evidence ledger",
      "SIEM/SOAR integrations",
      "24/7 dedicated support",
    ],
    highlighted: true,
  },
  {
    name: "Government / Regulated",
    price: "Contact Us",
    period: "custom deployment",
    description: "On-prem or air-gapped deployment with compliance tooling.",
    features: ["On-prem / air-gapped option", "SOC2, FedRAMP-track controls", "Dedicated consortium ledger", "Named security engineer"],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <SectionHeading eyebrow="Pricing" title="Straightforward plans for every stage" subtitle="This is a prototype pricing table for demo purposes — final packaging is defined at implementation." />
      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.1}>
            <div
              className={cn(
                "relative flex h-full flex-col rounded-2xl border p-7",
                tier.highlighted
                  ? "border-brand-blue/40 bg-gradient-to-b from-brand-blue/10 to-transparent shadow-glow"
                  : "panel"
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-3 py-1 text-[11px] font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-text-primary">{tier.name}</h3>
              <p className="mt-1 text-xs text-text-muted">{tier.description}</p>
              <div className="mt-5">
                <span className="font-display text-3xl font-bold text-text-primary">{tier.price}</span>
                <span className="ml-1.5 text-xs text-text-muted">{tier.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="mt-7">
                <Button className="w-full" variant={tier.highlighted ? "primary" : "secondary"}>
                  Get Started
                </Button>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
