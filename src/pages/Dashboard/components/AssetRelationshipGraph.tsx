import { Network, Laptop, Server, Cloud, ShieldHalf, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

const nodes = [
  { id: "laptop", label: "Laptop-1", icon: Laptop, x: 18, y: 20, tone: "text-brand-purple-light border-brand-purple/40 bg-brand-purple/10" },
  { id: "db", label: "DB Server", icon: Database, x: 18, y: 78, tone: "text-brand-blue-light border-brand-blue/40 bg-brand-blue/10" },
  { id: "server", label: "Server", icon: Server, x: 50, y: 50, tone: "text-status-success border-status-success/40 bg-status-success/10" },
  { id: "cloud", label: "Cloud", icon: Cloud, x: 82, y: 22, tone: "text-brand-cyan border-brand-cyan/40 bg-brand-cyan/10" },
  { id: "firewall", label: "Firewall", icon: ShieldHalf, x: 82, y: 78, tone: "text-severity-critical border-severity-critical/40 bg-severity-critical/10" },
];

const edges: [string, string][] = [
  ["laptop", "server"],
  ["db", "server"],
  ["server", "cloud"],
  ["server", "firewall"],
];

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

export function AssetRelationshipGraph() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader
        title="Asset Relationship Graph"
        icon={<Network className="h-4 w-4" />}
        action={<button onClick={() => navigate("/assets")} className="text-xs font-medium text-brand-blue-light hover:underline">View Full Graph</button>}
      />
      <CardBody>
        <div className="relative h-52 w-full">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {edges.map(([a, b], i) => {
              const na = getNode(a);
              const nb = getNode(b);
              return (
                <line
                  key={i}
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke="rgba(148,163,184,0.35)"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                />
              );
            })}
          </svg>
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border shadow-card",
                    node.tone
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span className="whitespace-nowrap text-[10px] font-medium text-text-secondary">{node.label}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-center text-[11px] text-text-muted">
          Laptop-1 shows anomalous connections to 3 unrelated assets in the last hour
        </p>
      </CardBody>
    </Card>
  );
}
