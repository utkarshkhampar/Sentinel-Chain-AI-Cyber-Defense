import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from "@/components/ui/Card";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { mockIncidents } from "@/mocks/incidents";
import { formatRelativeTime } from "@/utils/format";

export function RecentIncidentsTable() {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Recent Incidents"
        icon={<ShieldAlert className="h-4 w-4" />}
        action={<button onClick={() => navigate("/incidents")} className="text-xs font-medium text-brand-blue-light hover:underline">View All</button>}
      />
      <div className="scroll-thin overflow-x-auto px-2 pb-4">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-text-muted">
              <th className="px-3 py-1.5 font-medium">Incident ID</th>
              <th className="px-3 py-1.5 font-medium">Title</th>
              <th className="px-3 py-1.5 font-medium">Severity</th>
              <th className="px-3 py-1.5 font-medium">Status</th>
              <th className="px-3 py-1.5 font-medium">Assigned To</th>
              <th className="px-3 py-1.5 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {mockIncidents.slice(0, 5).map((incident) => (
              <tr key={incident.id} onClick={() => navigate(`/incidents/${incident.id}`)} className="group cursor-pointer text-xs hover:bg-white/[0.03]">
                <td className="whitespace-nowrap rounded-l-lg px-3 py-2.5 font-mono-data text-brand-blue-light">
                  {incident.id}
                </td>
                <td className="max-w-[220px] truncate px-3 py-2.5 font-medium text-text-primary">
                  {incident.title}
                </td>
                <td className="px-3 py-2.5">
                  <SeverityBadge severity={incident.severity} />
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={incident.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-text-secondary">{incident.assignedTo}</td>
                <td className="whitespace-nowrap rounded-r-lg px-3 py-2.5 text-text-muted">
                  {formatRelativeTime(incident.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
