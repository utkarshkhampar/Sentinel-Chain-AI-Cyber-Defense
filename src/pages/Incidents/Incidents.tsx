import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Search, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Feedback";
import { mockIncidents } from "@/mocks/incidents";
import { formatRelativeTime } from "@/utils/format";
import type { IncidentStatus } from "@/types";
import { cn } from "@/utils/cn";

const statusFilters: (IncidentStatus | "all")[] = ["all", "open", "investigating", "monitoring", "contained", "closed"];

export function Incidents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<IncidentStatus | "all">("all");

  const filtered = useMemo(() => {
    return mockIncidents.filter((inc) => {
      const matchesSearch =
        search === "" || inc.title.toLowerCase().includes(search.toLowerCase()) || inc.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || inc.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Incidents"
        subtitle={`${mockIncidents.length} total incidents \u00b7 ${mockIncidents.filter((i) => i.status !== "closed").length} active`}
        icon={ShieldAlert}
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> New Incident
          </Button>
        }
      />

      <div className="panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incidents by title or ID..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                status === s ? "border-brand-blue/40 bg-brand-blue/15 text-brand-blue-light" : "border-border text-text-muted hover:text-text-secondary"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState icon={ShieldAlert} title="No incidents found" description="Try a different search term or status filter." />
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Incident</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Assigned To</th>
                <th className="px-4 py-3 font-medium">Assets</th>
                <th className="px-4 py-3 font-medium">Blockchain</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                  className="cursor-pointer border-b border-border/50 text-xs last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <p className="font-mono-data text-brand-blue-light">{inc.id}</p>
                    <p className="mt-0.5 max-w-[240px] truncate font-medium text-text-primary">{inc.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={inc.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{inc.assignedTo}</td>
                  <td className="px-4 py-3 text-text-secondary">{inc.affectedAssets.join(", ")}</td>
                  <td className="px-4 py-3">
                    {inc.blockchainVerified ? (
                      <span className="text-status-success">\u2713 Verified</span>
                    ) : (
                      <span className="text-text-muted">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{formatRelativeTime(inc.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
