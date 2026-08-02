import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Radar, Search, Download, LayoutGrid, TableIcon, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Feedback";
import { mockThreats } from "@/mocks/threats";
import type { Severity } from "@/types";
import { cn } from "@/utils/cn";
import { ThreatDetailModal } from "./ThreatDetailModal";
import { toast } from "sonner";

const severities: (Severity | "all")[] = ["all", "critical", "high", "medium", "low"];

export function LiveThreats() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [view, setView] = useState<"table" | "cards">("cards");
  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockThreats.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.sourceIp.includes(search) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === "all" || t.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [search, severityFilter]);

  const selectedThreat = mockThreats.find((t) => t.id === selectedThreatId) ?? null;

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Live Threats"
        subtitle={`Monitoring ${mockThreats.length} active threat signals in real time`}
        icon={Radar}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.success("Export started", { description: "Your CSV export will download shortly." })}
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by threat, IP, or ID..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {severities.map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={cn(
                "shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                severityFilter === sev
                  ? "border-brand-blue/40 bg-brand-blue/15 text-brand-blue-light"
                  : "border-border text-text-muted hover:text-text-secondary"
              )}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          <button
            onClick={() => setView("cards")}
            className={cn("flex h-7 w-7 items-center justify-center rounded-md", view === "cards" ? "bg-white/10 text-text-primary" : "text-text-muted")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("table")}
            className={cn("flex h-7 w-7 items-center justify-center rounded-md", view === "table" ? "bg-white/10 text-text-primary" : "text-text-muted")}
          >
            <TableIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState icon={Radar} title="No threats match your filters" description="Try adjusting your search or severity filter." />
        </div>
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((threat, i) => (
            <motion.button
              key={threat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedThreatId(threat.id)}
              className="panel panel-hover group relative overflow-hidden p-4 text-left"
            >
              <span
                className={cn(
                  "absolute left-0 top-0 h-full w-1",
                  threat.severity === "critical" && "bg-severity-critical",
                  threat.severity === "high" && "bg-severity-high",
                  threat.severity === "medium" && "bg-severity-medium",
                  threat.severity === "low" && "bg-severity-low"
                )}
              />
              <div className="flex items-start justify-between gap-2 pl-2">
                <SeverityBadge severity={threat.severity} />
                <span className="font-mono-data text-[10px] text-text-muted">{threat.id}</span>
              </div>
              <p className="mt-3 pl-2 font-display text-sm font-bold text-text-primary group-hover:text-brand-blue-light">
                {threat.title}
              </p>
              <div className="mt-3 space-y-1.5 pl-2 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span className="text-text-muted">Source IP</span>
                  <span className="font-mono-data">{threat.sourceIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Target</span>
                  <span>{threat.targetAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Country</span>
                  <span>{threat.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">AI Confidence</span>
                  <span className="font-semibold text-brand-blue-light">{threat.aiConfidence}%</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pl-2">
                <StatusBadge status={threat.status} />
                <span className="text-[10px] text-text-muted">{new Date(threat.detectedAt).toLocaleTimeString()}</span>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Threat</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Source IP</th>
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Detected</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((threat) => (
                <tr
                  key={threat.id}
                  onClick={() => setSelectedThreatId(threat.id)}
                  className="cursor-pointer border-b border-border/50 text-xs last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 font-mono-data text-brand-blue-light">{threat.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">{threat.title}</td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={threat.severity} />
                  </td>
                  <td className="px-4 py-3 font-mono-data text-text-secondary">{threat.sourceIp}</td>
                  <td className="px-4 py-3 text-text-secondary">{threat.targetAsset}</td>
                  <td className="px-4 py-3 text-text-secondary">{threat.country}</td>
                  <td className="px-4 py-3 font-semibold text-brand-blue-light">{threat.aiConfidence}%</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={threat.status} />
                  </td>
                  <td className="px-4 py-3 text-text-muted">{new Date(threat.detectedAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ThreatDetailModal threat={selectedThreat} onClose={() => setSelectedThreatId(null)} />
    </div>
  );
}
