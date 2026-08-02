import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";
import { cn } from "@/utils/cn";

const faqs = [
  {
    q: "Is Sentinel Chain a replacement for our existing SIEM?",
    a: "Not necessarily. Sentinel Chain is designed to integrate with existing SIEM/SOAR tooling via API/webhook rather than requiring a rip-and-replace migration, though it can also operate as a standalone platform.",
  },
  {
    q: "What blockchain does the evidence ledger use?",
    a: "Hyperledger Fabric, a permissioned consortium ledger. This is not a public blockchain — participants are known, accountable organizational functions such as Security, Legal, and Audit.",
  },
  {
    q: "How does the AI avoid becoming a black box?",
    a: "Every alert above the configured risk threshold ships with a SHAP/LIME-derived explanation identifying which features drove the score, not just a confidence number.",
  },
  {
    q: "Can this be deployed on-premises?",
    a: "Yes. The reference architecture targets any conformant Kubernetes distribution, cloud or on-prem, so air-gapped and regulated deployments are supported.",
  },
  {
    q: "Is this frontend connected to a real backend right now?",
    a: "This build is a frontend-only prototype using realistic mock data. It's structured so real API calls (e.g. via React Query) can be dropped in without restructuring the UI.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
      <div className="mt-12 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal key={faq.q} delay={i * 0.05}>
              <div className="panel overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-text-primary">{faq.q}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform duration-200", isOpen && "rotate-180")} />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-text-secondary">{faq.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
