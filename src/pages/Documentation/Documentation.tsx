import { useState } from "react";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/utils/cn";

const docSections = [
  {
    title: "Getting Started",
    pages: [
      { id: "intro", label: "Introduction" },
      { id: "quickstart", label: "Quickstart Guide" },
      { id: "concepts", label: "Core Concepts" },
    ],
  },
  {
    title: "Platform",
    pages: [
      { id: "detection", label: "Threat Detection Engine" },
      { id: "incidents", label: "Incident Management" },
      { id: "blockchain", label: "Blockchain Evidence" },
    ],
  },
  {
    title: "Developers",
    pages: [
      { id: "api", label: "REST API Reference" },
      { id: "webhooks", label: "Webhooks" },
      { id: "sdks", label: "SDKs & Client Libraries" },
    ],
  },
];

const content: Record<string, { title: string; body: string }> = {
  intro: {
    title: "Introduction",
    body: "Sentinel Chain is an AI-powered autonomous cyber defense platform that unifies real-time threat detection, incident management, and blockchain-anchored evidence assurance in a single console. This documentation covers the concepts, workflows, and APIs you'll use to operate the platform day to day.",
  },
  quickstart: {
    title: "Quickstart Guide",
    body: "1. Sign in to your console. 2. Connect your first telemetry source under Integrations. 3. Review incoming alerts on the Live Threats page. 4. Escalate a confirmed threat to an Incident. 5. Once resolved, evidence is automatically anchored to the blockchain ledger.",
  },
  concepts: {
    title: "Core Concepts",
    body: "Key concepts include Threats (raw AI-scored events), Incidents (escalated, tracked investigations), Evidence Records (hash-anchored artefacts tied to an incident), and Assets (anything being monitored \u2014 servers, laptops, cloud resources, and more).",
  },
  detection: {
    title: "Threat Detection Engine",
    body: "The detection engine combines classical ML, deep learning, and graph-based models to score incoming telemetry. Every alert above the configured threshold includes an explainability breakdown so analysts understand exactly why it was flagged.",
  },
  incidents: {
    title: "Incident Management",
    body: "Incidents move through a defined lifecycle: Open \u2192 Investigating \u2192 Monitoring/Contained \u2192 Closed. Each transition is logged, and evidence anchoring is triggered automatically once an incident is confirmed.",
  },
  blockchain: {
    title: "Blockchain Evidence",
    body: "Confirmed incidents are hashed and anchored to a permissioned Hyperledger Fabric ledger. Anyone with Auditor access can independently verify that a stored evidence record has not been tampered with.",
  },
  api: {
    title: "REST API Reference",
    body: "The API is organized around REST principles with predictable resource-oriented URLs and standard HTTP verbs. All requests require a Bearer token obtained via the Authentication endpoint. See the API Keys page to generate credentials.",
  },
  webhooks: {
    title: "Webhooks",
    body: "Configure a webhook endpoint under Settings \u2192 API to receive real-time push notifications for incident creation, status changes, and evidence anchoring events.",
  },
  sdks: {
    title: "SDKs & Client Libraries",
    body: "Official client libraries are planned for Node.js and Python. In the meantime, the REST API can be called directly from any HTTP client.",
  },
};

export function Documentation() {
  const [active, setActive] = useState("intro");
  const page = content[active];

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Documentation" subtitle="Guides and API reference for the Sentinel Chain platform" icon={BookOpen} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
        <nav className="panel h-fit p-3">
          {docSections.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">{section.title}</p>
              <ul className="space-y-0.5">
                {section.pages.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActive(p.id)}
                      className={cn(
                        "w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                        active === p.id ? "bg-brand-blue/12 text-brand-blue-light" : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                      )}
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="panel p-6">
          <h2 className="font-display text-xl font-bold text-text-primary">{page.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">{page.body}</p>
        </div>
      </div>
    </div>
  );
}
