import { SectionHeading, Reveal } from "./Reveal";

const stack = [
  { group: "Frontend", items: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"] },
  { group: "Backend (Planned)", items: ["Node.js / Go", "PostgreSQL", "Elasticsearch", "Neo4j", "Redis"] },
  { group: "AI Engine", items: ["XGBoost", "Isolation Forest", "LSTM", "Graph Neural Nets", "SHAP / LIME"] },
  { group: "Blockchain", items: ["Hyperledger Fabric", "Chaincode", "Raft Ordering", "Private Data Collections"] },
  { group: "Infrastructure", items: ["Kubernetes", "Docker", "Kafka", "Prometheus", "Grafana"] },
];

export function TechStack() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <SectionHeading eyebrow="Technology" title="Built on a modern, production-grade stack" />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stack.map((s, i) => (
          <Reveal key={s.group} delay={i * 0.07}>
            <div className="panel h-full p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-brand-blue-light">{s.group}</p>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="h-1 w-1 rounded-full bg-text-muted" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
