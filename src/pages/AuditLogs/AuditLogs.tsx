import { useState } from "react";
import { History, Search, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { auditLogs } from "@/mocks/organization";

export function AuditLogs() {
  const [search, setSearch] = useState("");

  const filtered = auditLogs.filter(
    (log) =>
      search === "" ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-8">
      <PageHeader title="Audit Logs" subtitle="Immutable record of every state-changing action on the platform" icon={History} />

      <div className="panel p-3">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, action, or target..."
            className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">IP Address</th>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-border/50 text-xs last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-text-primary">{log.actor}</td>
                <td className="px-4 py-3 text-text-secondary">{log.action}</td>
                <td className="px-4 py-3 font-mono-data text-text-secondary">{log.target}</td>
                <td className="px-4 py-3 font-mono-data text-text-muted">{log.ip}</td>
                <td className="px-4 py-3 text-text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {log.result === "success" ? (
                    <span className="flex items-center gap-1 text-status-success"><CheckCircle2 className="h-3.5 w-3.5" /> Success</span>
                  ) : (
                    <span className="flex items-center gap-1 text-severity-critical"><XCircle className="h-3.5 w-3.5" /> Failed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
